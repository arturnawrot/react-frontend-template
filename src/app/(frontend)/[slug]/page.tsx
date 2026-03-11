import { notFound } from 'next/navigation'
import React from 'react'
import type { Metadata } from 'next'
import { renderBlocks } from '@/utils/renderBlocks'
import type { Page as PageType } from '@/payload-types'
import { getSeoMetadata } from '@/utils/getSeoMetadata'
import { cachedFind } from '@/utils/payload-cache'

// ISR: cached for 60s then revalidated in background
export const revalidate = 60

// Allow on-demand ISR for any slug (not just pre-built ones)
export const dynamicParams = true

// Return empty array — pages are generated on first request and cached via ISR
export async function generateStaticParams() {
  return []
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  const { docs } = await cachedFind<PageType>('pages', {
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })

  const page = docs[0]
  if (!page) {
    return { title: 'Page Not Found' }
  }

  return getSeoMetadata({
    path: slug === 'home' ? '/' : `/${slug}`,
    docMeta: page.meta,
    fallbackTitle: page.title || undefined,
  })
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params

  const { docs } = await cachedFind<PageType>('pages', {
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })

  const page = docs[0]

  if (!page) {
    notFound()
  }

  const blocks = await renderBlocks(page.blocks)

  return <div>{blocks}</div>
}
