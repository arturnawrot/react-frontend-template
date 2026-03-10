import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import { renderBlocks } from '@/utils/renderBlocks'
import type { Page as PageType } from '@/payload-types'

// ISR: cached for 60s then revalidated in background (see PAGE_REVALIDATE_SECONDS in payload-cache.ts)
export const revalidate = 60

export default async function BuyPage() {
  const payload = await getPayload({ config })
  
  // Fetch the page with slug 'buy'
  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'buy',
      },
    },
    depth: 2,
    limit: 1,
  })

  const page = docs[0] as PageType | undefined

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No buy page found. Please create a page with slug &quot;buy&quot; in the admin panel.</p>
      </div>
    )
  }

  const blocks = await renderBlocks(page.blocks, payload)

  return <div>{blocks}</div>
}

