import React from 'react'
import './styles.css'
import { config, library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { HashNavigation } from '@/components/HashNavigation'

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
        <HashNavigation />
        <main>{children}</main>
      </body>
    </html>
  )
}
