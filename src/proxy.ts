import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const isConfigured = 
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'https://placeholder.supabase.co' && 
    supabaseAnonKey !== 'placeholder'

  if (!isConfigured) {
    // Return a beautiful, high-fidelity setup instructions page
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Setup Required — Nexstack CRM</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-color: #030712;
      --card-bg: rgba(17, 24, 39, 0.7);
      --border-color: rgba(255, 255, 255, 0.08);
      --text-primary: #f9fafb;
      --text-secondary: #9ca3af;
      --accent-color: #3b82f6;
      --accent-glow: rgba(59, 130, 246, 0.15);
      --success-color: #10b981;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: var(--bg-color);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      overflow-x: hidden;
      position: relative;
    }

    /* Beautiful ambient glow background */
    body::before {
      content: '';
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(99, 102, 241, 0.05) 50%, transparent 100%);
      top: -100px;
      left: -100px;
      z-index: 0;
      pointer-events: none;
    }

    body::after {
      content: '';
      position: absolute;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(147, 51, 234, 0.08) 0%, rgba(59, 130, 246, 0.02) 50%, transparent 100%);
      bottom: -150px;
      right: -150px;
      z-index: 0;
      pointer-events: none;
    }

    .container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 560px;
    }

    .card {
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--border-color);
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      text-align: center;
      transition: transform 0.3s ease, border-color 0.3s ease;
    }

    .card:hover {
      border-color: rgba(59, 130, 246, 0.3);
    }

    .logo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%);
      border: 1px solid rgba(59, 130, 246, 0.3);
      color: #60a5fa;
      font-size: 32px;
      margin-bottom: 24px;
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15);
    }

    h1 {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 12px;
      background: linear-gradient(to right, #ffffff 40%, #93c5fd 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    p {
      color: var(--text-secondary);
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 32px;
    }

    .env-group {
      text-align: left;
      background: rgba(3, 7, 18, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 32px;
    }

    .env-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #60a5fa;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .env-title::after {
      content: '';
      flex: 1;
      height: 1px;
      background: rgba(255, 255, 255, 0.05);
    }

    .env-variable {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 13px;
      padding: 10px 12px;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.03);
      color: #e2e8f0;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .env-variable:last-child {
      margin-bottom: 0;
    }

    .env-status {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 9999px;
      background: rgba(239, 68, 68, 0.1);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .btn-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 14px 24px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 15px;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
      width: 100%;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(37, 99, 235, 0.25);
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.35);
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: var(--text-primary);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .footer {
      margin-top: 24px;
      font-size: 12px;
      color: var(--text-secondary);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">⚡</div>
      <h1>Setup Required</h1>
      <p>Nexstack CRM needs connection credentials to access your Supabase database. Please define the following environment variables in your deployment dashboard or in a local <code>.env.local</code> file.</p>
      
      <div class="env-group">
        <div class="env-title">Missing Environment Variables</div>
        <div class="env-variable">
          <span>NEXT_PUBLIC_SUPABASE_URL</span>
          <span class="env-status">Missing</span>
        </div>
        <div class="env-variable">
          <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
          <span class="env-status">Missing</span>
        </div>
      </div>

      <div class="btn-container">
        <button onclick="window.location.reload()" class="btn btn-primary">
          Check Connection & Reload
        </button>
        <a href="https://github.com/ArnasDon/wacrm#readme" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
          Read Deployment Guide
        </a>
      </div>
    </div>
    <div style="text-align: center;" class="footer">
      Powered by Nexstack CRM
    </div>
  </div>
</body>
</html>`,
      {
        status: 503,
        headers: { 'Content-Type': 'text/html' },
      }
    )
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Auth pages - redirect to dashboard if already logged in
  if (user && (
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/signup' ||
    request.nextUrl.pathname === '/forgot-password'
  )) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Protected pages - redirect to login if not authenticated
  const protectedPaths = ['/dashboard', '/inbox', '/contacts', '/pipelines', '/broadcasts', '/automations', '/settings']
  if (!user && protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // API routes that need auth (not webhooks)
  if (!user && request.nextUrl.pathname.startsWith('/api/whatsapp/') &&
      !request.nextUrl.pathname.includes('/webhook')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
