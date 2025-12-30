import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import { renderBlocks } from '@/utils/renderBlocks'
import type { Page as PageType } from '@/payload-types'
import PropertySearchAdvanced from '@/components/PropertySearchAdvanced/PropertySearchAdvanced'
import HeroWrapper from '@/components/Hero/HeroWrapper'

export const dynamic = 'force-dynamic'

export default async function PropertySearchPage() {
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
        text: 'Buy With Insight.',
        breakOnMobile: true,
        breakOnDesktop: false,
      },
      {
        text: 'Invest With Confidence.',
        color: '#DAE684',
        breakOnMobile: true,
        breakOnDesktop: false,
      },
    ],
    subheading: "Approach every deal confidently, knowing you're backed by analytical excellence, investment foresight, and personal care.",
    ctaPrimaryLabel: 'Start Your Property Search',
    ctaSecondaryLabel: 'Schedule a Consultation',
  }

  return (
    <div>
      {/* Hero Block */}
      <HeroWrapper block={defaultHeroBlock} />

      {/* PropertySearchAdvanced with hero background extension */}
      <PropertySearchAdvanced 
        backgroundColor="var(--strong-green)"
        backgroundExtendPx={200}
      />
    </div>
  )
}

