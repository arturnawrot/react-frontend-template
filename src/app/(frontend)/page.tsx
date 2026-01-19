import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import { renderBlocks } from '@/utils/renderBlocks'
import { getSeoMetadata } from '@/utils/getSeoMetadata'
import type { Page as PageType } from '@/payload-types'
import type { Metadata } from 'next'

// Mark as dynamic to prevent build-time prerendering (requires MongoDB connection)
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config })
  
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    depth: 1,
    limit: 1,
  })

  const page = docs[0] as PageType | undefined

  return getSeoMetadata({
    path: '/',
    docMeta: page?.meta,
    fallbackTitle: page?.title || 'Meybohm Real Estate',
  })
}

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

  const blocks = await renderBlocks(page.blocks, payload)

  return <div>{blocks}</div>
}
