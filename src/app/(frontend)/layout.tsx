import React from 'react'
import Script from 'next/script'
import './styles.css'
import { config, library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { HashNavigation } from '@/components/HashNavigation'
import { PasswordGate } from '@/components/PasswordGate'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { cookies } from 'next/headers'

// Prevent FontAwesome from auto-adding CSS (we're using SVG core)
config.autoAddCss = false

// Add all icons to the library
library.add(fas, far, fab)

export const metadata = {
  title: {
    default: 'Meybohm Real Estate',
    template: '%s | Meybohm Real Estate',
  },
  description: 'Your trusted partner in real estate.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  // Check if user is unlocked via HTTP-only cookie
  const cookieStore = await cookies()
  const isUnlocked = cookieStore.get('meybohm_site_unlocked')?.value === 'true'

  // Fetch site lock settings (excluding password - never sent to client)
  let siteLockSettings: {
    enabled?: boolean | null
    lockScreenTitle?: string | null
    lockScreenMessage?: string | null
    excludedPages?: Array<{ slug: string } | string> | null
  } | null = null

  try {
    const payload = await getPayload({ config: payloadConfig })
    const fullSettings = await payload.findGlobal({
      slug: 'siteLock',
      depth: 1, // Get page slugs for excluded pages
    })
    
    // Only pass safe settings to client (NO PASSWORD)
    siteLockSettings = {
      enabled: fullSettings.enabled,
      lockScreenTitle: fullSettings.lockScreenTitle,
      lockScreenMessage: fullSettings.lockScreenMessage,
      excludedPages: fullSettings.excludedPages as Array<{ slug: string } | string> | null,
    }
  } catch (error) {
    // If fetch fails, don't block the site - just disable the lock
    console.error('Failed to fetch site lock settings:', error)
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
      </head>
      <body>
        {/* Font Awesome Pro Kit */}
        <Script src="/fontawesome/js/all.min.js" strategy="afterInteractive" />
        <HashNavigation />
        <PasswordGate siteLockSettings={siteLockSettings} isUnlocked={isUnlocked}>
          <main>{children}</main>
        </PasswordGate>
      </body>
    </html>
  )
}
