import React from 'react'
import './styles.css'
import { config, library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

// Prevent FontAwesome from auto-adding CSS (we're using SVG core)
config.autoAddCss = false

// Add all icons to the library
library.add(fas, far, fab)

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
