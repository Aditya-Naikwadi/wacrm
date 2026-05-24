'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MessageTemplate } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowLeft, Send, Loader2, Users, Save, Clock, Calendar } from 'lucide-react';

interface AudienceConfig {
  type: string;
  tagIds?: string[];
  csvContacts?: { phone: string; name?: string }[];
}

interface Step4Props {
  name: string;
  onNameChange: (name: string) => void;
  template: MessageTemplate;
  audience: AudienceConfig;
  onSend: () => void;
  onSaveDraft?: () => void;
  onBack: () => void;
  isProcessing: boolean;
  progress: number;
  scheduledAt: string | null;
  onScheduledAtChange: (val: string | null) => void;
}

export function Step4ScheduleSend({
  name,
  onNameChange,
  template,
  audience,
  onSend,
  onSaveDraft,
  onBack,
  isProcessing,
  progress,
  scheduledAt,
  onScheduledAtChange,
}: Step4Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [estimatedReach, setEstimatedReach] = useState<number>(0);
  const [loadingReach, setLoadingReach] = useState(true);
  const [scheduleLater, setScheduleLater] = useState(!!scheduledAt);

  useEffect(() => {
    async function calculateReach() {
      setLoadingReach(true);
      try {
        const supabase = createClient();

        if (audience.type === 'all') {
          const { count } = await supabase
            .from('contacts')
            .select('*', { count: 'exact', head: true });
          setEstimatedReach(count ?? 0);
        } else if (audience.type === 'tags' && audience.tagIds && audience.tagIds.length > 0) {
          const { data: contactTags } = await supabase
            .from('contact_tags')
            .select('contact_id')
            .in('tag_id', audience.tagIds);

          const uniqueIds = new Set((contactTags ?? []).map((ct) => ct.contact_id));
          setEstimatedReach(uniqueIds.size);
        } else if (audience.type === 'csv' && audience.csvContacts) {
          setEstimatedReach(audience.csvContacts.length);
        } else {
          setEstimatedReach(0);
        }
      } finally {
        setLoadingReach(false);
      }
    }

    calculateReach();
  }, [audience]);

  const handleToggleSchedule = (val: boolean) => {
    setScheduleLater(val);
    if (!val) {
      onScheduledAtChange(null);
    } else {
      const date = new Date(Date.now() + 60 * 60 * 1000);
      date.setSeconds(0, 0);
      const tzOffset = date.getTimezoneOffset() * 60000;
      const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
      onScheduledAtChange(localISOTime);
    }
  };

  const audienceLabel =
    audience.type === 'all'
      ? 'All Contacts'
      : audience.type === 'tags'
        ? `Tags (${audience.tagIds?.length ?? 0} selected)`
        : audience.type === 'csv'
          ? 'CSV Upload'
          : 'Custom';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Review & Send</h2>
        <p className="mt-1 text-sm text-slate-400">
          Name your broadcast, review the details, and send.
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-white">Broadcast Name</label>
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g. Summer Sale Announcement"
          className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-white font-semibold">Delivery Schedule</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleToggleSchedule(false)}
            className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
              !scheduleLater
                ? 'border-primary bg-primary/10 text-white shadow-lg shadow-primary/10'
                : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-300'
            }`}
          >
            <Send className="mt-0.5 h-4 w-4" />
            <div>
              <p className="text-sm font-semibold">Send Immediately</p>
              <p className="mt-0.5 text-xs text-slate-400/80">Deliver as soon as possible</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleToggleSchedule(true)}
            className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
              scheduleLater
                ? 'border-primary bg-primary/10 text-white shadow-lg shadow-primary/10'
                : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-300'
            }`}
          >
            <Clock className="mt-0.5 h-4 w-4" />
            <div>
              <p className="text-sm font-semibold">Schedule for Later</p>
              <p className="mt-0.5 text-xs text-slate-400/80">Deliver at a specific date & time</p>
            </div>
          </button>
        </div>

        {scheduleLater && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300 rounded-xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="datetime-local"
                  value={scheduledAt ?? ''}
                  onChange={(e) => onScheduledAtChange(e.target.value || null)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800/80 text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder-slate-500"
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Select your desired delivery date and time (local timezone).
            </p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
        <p className="text-sm font-medium text-white">Summary</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-slate-400">Template</p>
            <p className="text-white">{template.name}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Audience</p>
            <p className="text-white">{audienceLabel}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Estimated Reach</p>
            <div className="flex items-center gap-1.5">
              {loadingReach ? (
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
              ) : (
                <>
                  <Users className="h-3.5 w-3.5 text-primary" />
                  <p className="font-medium text-white">{estimatedReach.toLocaleString()}</p>
                </>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400">Language</p>
            <p className="text-white">{template.language ?? 'en_US'}</p>
          </div>
        </div>
      </div>

      {isProcessing && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <p className="text-sm font-medium text-white">
                {scheduleLater ? 'Scheduling broadcast...' : 'Sending broadcast...'}
              </p>
            </div>
            <span className="text-xs font-medium text-primary">{progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800">
            <div
              className="h-1.5 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isProcessing}
          className="border-slate-700 text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          {onSaveDraft && (
            <Button
              variant="outline"
              onClick={onSaveDraft}
              disabled={!name.trim() || isProcessing}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Save as Draft
            </Button>
          )}

          <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
            <DialogTrigger
              render={
                <Button
                  disabled={!name.trim() || isProcessing || (scheduleLater && !scheduledAt)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                />
              }
            >
              {scheduleLater ? <Clock className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              {scheduleLater ? 'Schedule Broadcast' : 'Send Broadcast'}
            </DialogTrigger>
            <DialogContent className="border-slate-700 bg-slate-900 sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {scheduleLater ? 'Confirm Scheduled Broadcast' : 'Confirm Broadcast'}
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  You are about to {scheduleLater ? 'schedule' : 'send'} this broadcast to{' '}
                  <span className="font-medium text-white">{estimatedReach.toLocaleString()}</span>{' '}
                  contacts using the{' '}
                  <span className="font-medium text-white">{template.name}</span> template
                  {scheduleLater && scheduledAt ? (
                    <>
                      {' '}for{' '}
                      <span className="font-medium text-white">
                        {new Date(scheduledAt).toLocaleString()}
                      </span>
                    </>
                  ) : (
                    '.'
                  )}
                  {!scheduleLater && ' This action cannot be undone.'}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowConfirm(false)}
                  className="border-slate-700 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowConfirm(false);
                    onSend();
                  }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {scheduleLater ? <Clock className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                  {scheduleLater ? 'Confirm & Schedule' : 'Confirm & Send'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
