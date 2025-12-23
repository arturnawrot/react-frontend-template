import { getPayload } from 'payload'
import { notFound, redirect } from 'next/navigation'
import React from 'react'
import config from '@/payload.config'
import { renderBlocks } from '@/utils/renderBlocks'
import type { Page as PageType } from '@/payload-types'

interface PageProps {
  params: Promise<{ slug: string }>
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

  return <div>{renderBlocks(page.blocks)}</div>
}

