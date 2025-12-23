'use client'

import React from 'react'
import PropertyCard from '../PropertyCard/PropertyCard'
import Arrow from '../Arrow/Arrow'
import type { BuildoutProperty } from '@/utils/buildout-api'

interface FeaturedPropertiesAgentProps {
  properties: BuildoutProperty[]
  agentName: string
}

const FeaturedPropertiesAgent: React.FC<FeaturedPropertiesAgentProps> = ({ properties, agentName }) => {
  // Transform Buildout properties to PropertyCard format
  const transformedProperties = properties.map((property) => {
    // Format address
    const address = property.address || property.name || 'Property'
    const cityStateZip = [property.city, property.state, property.zip].filter(Boolean).join(', ')
    
    // Format price
    let price = 'Price on Request'
    if (property.sale_price_dollars) {
      price = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(property.sale_price_dollars)
    } else if (property.lease_listing_published) {
      price = 'Lease Available'
    }
    
    // Format square footage
    const sqft = property.building_size_sf
      ? `${property.building_size_sf.toLocaleString()} SF`
      : ''
    
    // Get property type
    const type = property.property_type_label_override || property.property_type_id?.toString() || 'Property'
    
    // Get image
    const image = property.photos && property.photos.length > 0
      ? property.photos[0].formats?.large || property.photos[0].url || ''
      : ''
    
    // Build badges
    const badges: Array<{ text: string; color: string }> = []
    if (property.sale && property.sale_listing_published) {
      badges.push({ text: 'For Sale', color: 'bg-[#CDDC39]' })
    }
    if (property.lease && property.lease_listing_published) {
      badges.push({ text: 'For Lease', color: 'bg-[#D4E157]' })
    }
    // Check if it's a new listing (recently created)
    const createdAt = new Date(property.created_at)
    const daysSinceCreated = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceCreated < 30) {
      badges.push({ text: 'New Listing', color: 'bg-[#D4E157]' })
    }
    
    return {
      id: property.id,
      address,
      cityStateZip,
      price,
      sqft,
      type,
      agent: agentName,
      image,
      badges: badges.length > 0 ? badges : undefined,
    }
  })

  // Don't render if no properties
  if (transformedProperties.length === 0) {
    return null
  }

  return (
    <section className="max-w-[1400px] mx-auto px-4 py-16 md:py-24 font-sans text-[#1C2B28]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <p className="text-sm font-semibold tracking-[0.08em] uppercase text-stone-500 mb-2">
            Featured
          </p>
          <h2 className="text-4xl md:text-5xl font-serif leading-tight">Featured Properties</h2>
        </div>

        <a
          href="/property-search"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1C2B28] hover:underline"
        >
          See All Listings <Arrow direction="right" size={16} />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {transformedProperties.map((property) => (
          <PropertyCard key={property.id} property={property} variant="vertical" />
        ))}
      </div>
    </section>
  )
}

export default FeaturedPropertiesAgent

