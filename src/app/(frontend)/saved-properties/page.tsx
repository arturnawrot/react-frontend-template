import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import { renderBlocks } from '@/utils/renderBlocks'
import type { Page as PageType } from '@/payload-types'
import PropertySearchAdvanced from '@/components/PropertySearchAdvanced/PropertySearchAdvanced'
import HeroWrapper from '@/components/Hero/HeroWrapper'

export const dynamic = 'force-dynamic'

export default async function SavedPropertiesPage() {
  const payload = await getPayload({ config })
  
  // Fetch the page with slug 'saved-properties' if it exists, otherwise use default
  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'saved-properties',
      },
    },
    depth: 2,
    limit: 1,
  })

  const page = docs[0] as PageType | undefined

  // If page exists, render it with blocks, otherwise use default layout
  if (page && page.blocks && page.blocks.length > 0) {
    return <div>{renderBlocks(page.blocks)}</div>
  }

  // Default layout with Hero and PropertySearchAdvanced (saved properties mode, no map)
  const defaultHeroBlock = {
    blockType: 'hero' as const,
    variant: 'full-width-color' as const,
    headingSegments: [
      {
        text: 'Your Saved',
        breakOnMobile: true,
        breakOnDesktop: false,
      },
      {
        text: 'Properties',
        color: '#DAE684',
        breakOnMobile: true,
        breakOnDesktop: false,
      },
    ],
    subheading: "View and manage your saved properties. Filter and search through your favorites.",
    ctaPrimaryLabel: 'Start New Search',
    ctaSecondaryLabel: 'Schedule a Consultation',
  }

  return (
    <div>
      {/* Hero Block */}
      <HeroWrapper block={defaultHeroBlock} />

      {/* PropertySearchAdvanced with saved properties mode and no map */}
      <PropertySearchAdvanced 
        backgroundColor="var(--strong-green)"
        backgroundExtendPx={200}
        savedPropertiesMode={true}
        hideMap={true}
      />
    </div>
  )
}

