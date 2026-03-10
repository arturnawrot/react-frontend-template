import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import type { Metadata } from 'next'
import { renderBlocks } from '@/utils/renderBlocks'
import type { Page as PageType } from '@/payload-types'
import { getSeoMetadata } from '@/utils/getSeoMetadata'
import PropertySearchAdvanced from '@/components/PropertySearchAdvanced/PropertySearchAdvanced'
import HeroWrapper from '@/components/Hero/HeroWrapper'
import Footer from '@/components/Footer/Footer'

// ISR: cached for 60s then revalidated in background (see PAGE_REVALIDATE_SECONDS in payload-cache.ts)
export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata({
    path: '/property-search',
    fallbackTitle: 'Property Search',
  })
}

export default async function PropertySearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const isForLease = params.saleOrLease === 'lease'
  const payload = await getPayload({ config })
  
  // Fetch the page with slug 'property-search' if it exists, otherwise use default
  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'property-search',
      },
    },
    depth: 2,
    limit: 1,
  })

  const page = docs[0] as PageType | undefined

  // If page exists, render it with blocks, otherwise use default layout
  if (page && page.blocks && page.blocks.length > 0) {
    const blocks = await renderBlocks(page.blocks, payload)
    return <div>{blocks}</div>
  }

  // Default layout with Hero and PropertySearchAdvanced
  const defaultHeroBlock = {
    blockType: 'hero' as const,
    variant: 'full-width-color' as const,
    headingSegments: [
      {
        text: 'Find Properties',
        breakOnMobile: true,
        breakOnDesktop: false,
      },
      {
        text: 'for',
        breakOnMobile: false,
        breakOnDesktop: false,
      },
      {
        text: isForLease ? 'Lease' : 'Sale',
        color: '#DAE684',
        breakOnMobile: false,
        breakOnDesktop: false,
      },
    ],
    subheading: "Browse commercial opportunities across Augusta, Aiken, Columbia, and beyond.",
    ctaPrimaryLabel: '',
    ctaSecondaryLabel: '',
  }

  return (
    <div>
      {/* Hero Block */}
      <HeroWrapper block={defaultHeroBlock} />

      {/* PropertySearchAdvanced with hero background extension */}
      <PropertySearchAdvanced 
        backgroundColor="var(--strong-green)"
      />


      <div className="mt-20"></div>
      {/* Footer */}
      <Footer />
    </div>
  )
}

