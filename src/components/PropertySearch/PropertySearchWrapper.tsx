import React from 'react'
import type { Page } from '@/payload-types'
import { buildoutApi } from '@/utils/buildout-api'
import { transformLightweightPropertyToCard, type PropertyCardData } from '@/utils/property-transform'
import PropertySearch from './PropertySearch'

type PropertySearchBlock = Extract<Page['blocks'][number], { blockType: 'propertySearch' }>

interface PropertySearchWrapperProps {
  block: PropertySearchBlock
}

/**
 * Server component wrapper for PropertySearch that fetches properties server-side
 */
export default async function PropertySearchWrapper({ block }: PropertySearchWrapperProps) {
  try {
    // Fetch properties server-side with limit=1000 for map view
    const response = await buildoutApi.searchProperties({
      limit: 1000,
      offset: 0,
    })

    // Transform lightweight properties to PropertyCard format
    const transformedProperties = response.properties.map((property) =>
      transformLightweightPropertyToCard(property)
    )

    // Filter out properties without valid coordinates
    const initialProperties: PropertyCardData[] = transformedProperties.filter(
      (prop) =>
        prop.latitude &&
        prop.longitude &&
        !isNaN(prop.latitude) &&
        !isNaN(prop.longitude)
    )

    return <PropertySearch block={block} initialProperties={initialProperties} />
  } catch (error) {
    console.error('Error fetching properties in PropertySearchWrapper:', error)
    // On error, still render PropertySearch but without initial properties
    // It will fall back to client-side fetch
    return <PropertySearch block={block} />
  }
}

