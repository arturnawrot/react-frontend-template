import React from 'react'
import type { Metadata } from 'next'
import { renderBlocks } from '@/utils/renderBlocks'
import type { Page as PageType } from '@/payload-types'
import { getSeoMetadata } from '@/utils/getSeoMetadata'
import { cachedFind } from '@/utils/payload-cache'

// force-dynamic: skip build-time prerender (no DB during Docker build)
// Data is still cached at the query layer via unstable_cache in payload-cache.ts
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { docs } = await cachedFind<PageType>('pages', {
    where: { slug: { equals: 'home' } },
    depth: 1,
    limit: 1,
  })

  const page = docs[0]

  return getSeoMetadata({
    path: '/',
    docMeta: page?.meta,
    fallbackTitle: page?.title || 'Meybohm Real Estate',
  })
}

export default async function HomePage() {
  const { docs } = await cachedFind<PageType>('pages', {
    where: { slug: { equals: 'home' } },
    depth: 2,
    limit: 1,
  })

  const page = docs[0]

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No home page found. Please create a page with slug &quot;home&quot; in the admin panel.</p>
      </div>
    )
  }

  const blocks = await renderBlocks(page.blocks)

  return <div>{blocks}</div>
}
