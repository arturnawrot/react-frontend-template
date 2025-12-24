import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import { renderBlocks } from '@/utils/renderBlocks'
import type { Page as PageType } from '@/payload-types'

// Mark as dynamic to prevent build-time prerendering (requires MongoDB connection)
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config })
  
  // Fetch the page with slug 'home' or the first page if no slug matches
  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
    },
    depth: 2,
    limit: 1,
  })

  const page = docs[0] as PageType | undefined

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No home page found. Please create a page with slug &quot;home&quot; in the admin panel.</p>
      </div>
    )
  }

  return <div>{renderBlocks(page.blocks)}</div>
}
