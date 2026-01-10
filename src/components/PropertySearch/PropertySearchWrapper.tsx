import React from 'react'
import type { Page } from '@/payload-types'
import { buildoutApi } from '@/utils/buildout-api'
import { transformPropertyToCard } from '@/utils/property-transform'
import { createBrokerMaps, getAgentInfo } from '@/utils/broker-utils'
import { filterValidCoordinates } from '@/utils/property-utils'
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
    // Fetch properties and brokers in parallel
    const [propertiesResponse, brokersResponse] = await Promise.all([
      buildoutApi.searchProperties({
        limit: 1000,
        offset: 0,
      }),
      buildoutApi.getAllBrokers(),
    ])

    // Create broker lookup maps
    const brokerMaps = createBrokerMaps(brokersResponse.brokers)

    // Transform lightweight properties to PropertyCard format with broker names and images
    const transformedProperties = propertiesResponse.properties.map((property) => {
      const { name: agentName, image: agentImage } = getAgentInfo(property.broker_id, brokerMaps)
      return transformPropertyToCard(property, agentName, agentImage)
    })

    // Filter out properties without valid coordinates
    const initialProperties = filterValidCoordinates(transformedProperties)

    return <PropertySearch block={block} initialProperties={initialProperties} />
  } catch (error) {
    console.error('Error fetching properties in PropertySearchWrapper:', error)
    // On error, still render PropertySearch but without initial properties
    // It will fall back to client-side fetch
    return <PropertySearch block={block} />
  }
}

