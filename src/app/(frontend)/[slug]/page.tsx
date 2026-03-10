import { getPayload } from 'payload'
import { notFound, redirect } from 'next/navigation'
import React from 'react'
import config from '@/payload.config'
import type { Metadata } from 'next'
import { renderBlocks } from '@/utils/renderBlocks'
import type { Page as PageType } from '@/payload-types'
import { getSeoMetadata } from '@/utils/getSeoMetadata'

// ISR: cached for 60s then revalidated in background (see PAGE_REVALIDATE_SECONDS in payload-cache.ts)
export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  if (slug === 'home') {
    return {}
  }

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })

  const page = docs[0] as PageType | undefined
  if (!page) {
    return { title: 'Page Not Found' }
  }

  return getSeoMetadata({
    path: `/${slug}`,
    docMeta: page.meta,
    fallbackTitle: page.title || undefined,
  })
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params

  // Redirect /home to root
  if (slug === 'home') {
    redirect('/')
  }

  const payload = await getPayload({ config })

  // Fetch the page by slug
  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2,
    limit: 1,
  })

  const page = docs[0] as PageType | undefined

  if (!page) {
    notFound()
  }

  const blocks = await renderBlocks(page.blocks, payload)

  return <div>{blocks}</div>
}

