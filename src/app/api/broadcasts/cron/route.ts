import { NextResponse } from 'next/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/automations/admin-client'
import { sendTemplateMessage } from '@/lib/whatsapp/meta-api'
import { decrypt } from '@/lib/whatsapp/encryption'
import { Contact, Broadcast } from '@/types'
import {
  sanitizePhoneForMeta,
  isValidE164,
  phoneVariants,
  isRecipientNotAllowedError,
} from '@/lib/whatsapp/phone-utils'

const SEND_BATCH_SIZE = 10;
const SEND_BATCH_DELAY_MS = 1000;

interface BroadcastVariable {
  type: string;
  value: string;
}

interface RecipientWithContact {
  id: string;
  contact?: Contact | null;
  status: string;
  sent_at?: string;
  whatsapp_message_id?: string;
  error_message?: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function resolveVariables(
  variables: Record<string, BroadcastVariable>,
  contact: Contact,
  customValues?: Map<string, string>,
): string[] {
  const keys = Object.keys(variables).sort((a, b) => {
    const an = Number(a);
    const bn = Number(b);
    if (Number.isFinite(an) && Number.isFinite(bn)) return an - bn;
    return a.localeCompare(b);
  });

  return keys.map((key) => {
    const v = variables[key];
    if (v.type === 'static') return v.value;

    if (v.type === 'field') {
      const fieldMap: Record<string, string | undefined> = {
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        company: contact.company,
      };
      return fieldMap[v.value] ?? '';
    }

    return customValues?.get(v.value) ?? '';
  });
}

async function fetchCustomValueIndex(
  admin: SupabaseClient,
  contactIds: string[]
): Promise<Map<string, Map<string, string>>> {
  const index = new Map<string, Map<string, string>>();
  if (contactIds.length === 0) return index;

  const PAGE = 500;
  for (let i = 0; i < contactIds.length; i += PAGE) {
    const slice = contactIds.slice(i, i + PAGE);
    const { data } = await admin
      .from('contact_custom_values')
      .select('contact_id, custom_field_id, value')
      .in('contact_id', slice);

    for (const row of data ?? []) {
      const bucket = index.get(row.contact_id) ?? new Map<string, string>();
      bucket.set(row.custom_field_id, row.value ?? '');
      index.set(row.contact_id, bucket);
    }
  }
  return index;
}

async function processBroadcast(admin: SupabaseClient, broadcast: Broadcast) {
  const { data: config, error: configError } = await admin
    .from('whatsapp_config')
    .select('*')
    .eq('user_id', broadcast.user_id)
    .single()

  if (configError || !config) {
    throw new Error('WhatsApp not configured for user')
  }

  const accessToken = decrypt(config.access_token)

  const { data: recipients, error: recsError } = await admin
    .from('broadcast_recipients')
    .select('*, contact:contacts(*)')
    .eq('broadcast_id', broadcast.id)

  if (recsError || !recipients || recipients.length === 0) {
    throw new Error(`Failed to fetch recipients: ${recsError?.message || 'No recipients'}`)
  }

  const typedRecipients = recipients as RecipientWithContact[]

  const contactIds = typedRecipients
    .map((r) => r.contact?.id)
    .filter((id: string | undefined): id is string => Boolean(id))
  const customValueIndex = await fetchCustomValueIndex(admin, contactIds)

  let failedCount = 0
  const totalRecipients = typedRecipients.length

  for (let i = 0; i < typedRecipients.length; i += SEND_BATCH_SIZE) {
    const batch = typedRecipients.slice(i, i + SEND_BATCH_SIZE)

    for (const recipient of batch) {
      if (!recipient.contact?.phone) {
        failedCount++
        await admin
          .from('broadcast_recipients')
          .update({
            status: 'failed',
            error_message: 'No phone number on contact',
          })
          .eq('id', recipient.id)
        continue
      }

      const sanitized = sanitizePhoneForMeta(recipient.contact.phone)
      if (!isValidE164(sanitized)) {
        failedCount++
        await admin
          .from('broadcasts_recipients')
          .update({
            status: 'failed',
            error_message: 'Invalid phone number format',
          })
          .eq('id', recipient.id)
        continue
      }

      const params = resolveVariables(
        (broadcast.template_variables as Record<string, BroadcastVariable>) || {},
        recipient.contact,
        customValueIndex.get(recipient.contact.id)
      )

      const variants = phoneVariants(sanitized)
      let sentMessageId: string | null = null
      let lastError: string | null = null

      for (const variant of variants) {
        try {
          const result = await sendTemplateMessage({
            phoneNumberId: config.phone_number_id,
            accessToken,
            to: variant,
            templateName: broadcast.template_name,
            language: broadcast.template_language || 'en_US',
            params,
          })
          sentMessageId = result.messageId
          lastError = null
          break
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          if (!isRecipientNotAllowedError(errorMessage)) {
            lastError = errorMessage
            break
          }
          lastError = errorMessage
        }
      }

      if (sentMessageId) {
        await admin
          .from('broadcast_recipients')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            whatsapp_message_id: sentMessageId,
            error_message: null,
          })
          .eq('id', recipient.id)
      } else {
        failedCount++
        await admin
          .from('broadcast_recipients')
          .update({
            status: 'failed',
            error_message: lastError || 'Unknown error',
          })
          .eq('id', recipient.id)
      }
    }

    if (i + SEND_BATCH_SIZE < typedRecipients.length) {
      await sleep(SEND_BATCH_DELAY_MS)
    }
  }

  const finalStatus = failedCount === totalRecipients ? 'failed' : 'sent'
  await admin
    .from('broadcasts')
    .update({ status: finalStatus })
    .eq('id', broadcast.id)
}

export async function GET(request: Request) {
  try {
    const expected = process.env.AUTOMATION_CRON_SECRET
    if (!expected) {
      return NextResponse.json({ error: 'cron not configured' }, { status: 503 })
    }
    const supplied = request.headers.get('x-cron-secret')
    if (supplied !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = supabaseAdmin()
    const { data: due, error } = await admin
      .from('broadcasts')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(10)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!due || due.length === 0) return NextResponse.json({ processed: 0 })

    let processed = 0
    for (const row of due) {
      const { data: claim } = await admin
        .from('broadcasts')
        .update({ status: 'sending' })
        .eq('id', row.id)
        .eq('status', 'scheduled')
        .select('id')
        .maybeSingle()

      if (!claim) continue

      try {
        await processBroadcast(admin, row as Broadcast)
        processed++
      } catch (err) {
        console.error(`[cron] failed to process broadcast ${row.id}:`, err)
        await admin
          .from('broadcasts')
          .update({ status: 'failed' })
          .eq('id', row.id)
      }
    }

    return NextResponse.json({ processed })
  } catch (error) {
    console.error('[cron] global error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
