import React from 'react'
import Link from 'next/link'
import type { Page } from '@/payload-types'
import PropertyCard from '../PropertyCard/PropertyCard'
import Arrow from '../Arrow/Arrow'
import type { TransformedProperty } from '@/utils/transform-buildout-property'

type FeaturedPropertiesBlock = Extract<Page['blocks'][number], { blockType: 'featuredProperties' }>

interface FeaturedPropertiesProps {
  // Support both CMS block and direct props
  block?: FeaturedPropertiesBlock
  properties?: TransformedProperty[]
  heading?: string
  seeAllLink?: string
}

export default function FeaturedProperties({ block, properties, heading, seeAllLink }: FeaturedPropertiesProps) {
  // If block is provided, use block values; otherwise use direct props
  const displayHeading = heading || block?.heading || 'Featured Properties'
  const displaySeeAllLink = seeAllLink || block?.seeAllLink || '/property-search'
  
  // Use provided properties or fall back to empty array (CMS block would need to provide properties)
  const displayProperties = properties || []

  // Debug logging
  console.log('[FeaturedProperties] Component rendered:', {
    propertiesCount: displayProperties.length,
    hasBlock: !!block,
    setName: (block as any)?.featuredPropertySetName,
    heading: displayHeading,
  })

  // Don't render if no properties
  if (displayProperties.length === 0) {
    // Show debug message in development
    if (process.env.NODE_ENV === 'development' && (block as any)?.featuredPropertySetName) {
      return (
        <section className="max-w-[1400px] mx-auto px-4 py-16 md:py-24 font-sans text-[#1C2B28]">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              <strong>Debug:</strong> FeaturedProperties block has set name &quot;{(block as any).featuredPropertySetName}&quot; but no properties were loaded. Check console for details.
            </p>
          </div>
        </section>
      )
    }
    return null
  }

  return (
    <section className="max-w-[1400px] mx-auto px-4 py-10 md:py-10 font-sans text-[#1C2B28]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <p className="text-sm font-semibold tracking-[0.08em] uppercase text-stone-500 mb-2">
            Featured
          </p>
          <h2 className="text-4xl md:text-5xl font-serif leading-tight">{displayHeading}</h2>
        </div>

        <Link
          href={displaySeeAllLink}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1C2B28] hover:underline"
        >
          See All Listings <Arrow direction="right" size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayProperties.map((property) => (
          <PropertyCard key={property.id} property={property} variant="vertical" />
        ))}
      </div>
    </section>
  )
}

