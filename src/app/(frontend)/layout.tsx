import React from 'react'
import Script from 'next/script'
import './styles.css'
import { HashNavigation } from '@/components/HashNavigation'
import { PasswordGate } from '@/components/PasswordGate'
import { HeadScripts, HeadTags, BodyScripts } from '@/components/ScriptInjection'

import type { ScriptInjection } from '@/payload-types'
import { getCachedSiteLock, getCachedScriptInjection } from '@/utils/payload-cache'

export const metadata = {
  title: 'Meybohm Real Estate',
  description: 'Your trusted partner in real estate.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  // Fetch site lock settings (excluding password - never sent to client)
  let siteLockSettings: {
    enabled?: boolean | null
    lockScreenTitle?: string | null
    lockScreenMessage?: string | null
    excludedPages?: Array<{ slug: string } | string> | null
  } | null = null

  // Fetch script injection settings
  let scriptInjection: ScriptInjection | null = null

  try {
    const [fullSettings, scripts] = await Promise.all([
      getCachedSiteLock(),
      getCachedScriptInjection(),
    ])

    // Only pass safe settings to client (NO PASSWORD)
    siteLockSettings = {
      enabled: fullSettings.enabled,
      lockScreenTitle: fullSettings.lockScreenTitle,
      lockScreenMessage: fullSettings.lockScreenMessage,
      excludedPages: fullSettings.excludedPages as Array<{ slug: string } | string> | null,
    }

    scriptInjection = scripts
  } catch (error) {
    // If fetch fails, don't block the site - just disable the lock
    console.error('Failed to fetch site settings:', error)
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Catch webpack module resolution errors when navigating from admin to frontend
              // This is a workaround for Next.js 15 issue with route groups
              if (typeof window !== 'undefined') {
                window.addEventListener('error', function(e) {
                  if (e.message && e.message.includes("Cannot read properties of undefined (reading 'call')")) {
                    console.warn('Webpack module resolution error detected, reloading page...');
                    setTimeout(() => {
                      window.location.reload();
                    }, 100);
                  }
                });
                
                window.addEventListener('unhandledrejection', function(e) {
                  if (e.reason && e.reason.message && e.reason.message.includes("Cannot read properties of undefined (reading 'call')")) {
                    console.warn('Webpack module resolution error detected in promise, reloading page...');
                    setTimeout(() => {
                      window.location.reload();
                    }, 100);
                  }
                });
              }
            `,
          }}
        />
        {/* Custom head tags from CMS (meta, link, style) */}
        <HeadTags tags={scriptInjection?.headTags} />
        {/* Custom head scripts from CMS */}
        <HeadScripts scripts={scriptInjection?.headScripts} />
      </head>
      <body>
        {/* Custom body start scripts from CMS */}
        <BodyScripts scripts={scriptInjection?.bodyStartScripts} position="start" />
        {/* Font Awesome Pro Kit */}
        <Script src="/fontawesome/js/all.min.js" strategy="afterInteractive" />
        {/* Cal.com embed loader — loads embed.js once; namespaces are initialized via <CalNamespaceInit> */}
        <Script id="cal-embed" strategy="afterInteractive">{`
          (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
        `}</Script>
        <HashNavigation />
        <PasswordGate siteLockSettings={siteLockSettings}>
          <main>{children}</main>
        </PasswordGate>
        {/* Custom body end scripts from CMS */}
        <BodyScripts scripts={scriptInjection?.bodyEndScripts} position="end" />
      </body>
    </html>
  )
}
