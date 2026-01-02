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
    // Fetch properties and brokers in parallel
    const [propertiesResponse, brokersResponse] = await Promise.all([
      buildoutApi.searchProperties({
        limit: 1000,
        offset: 0,
      }),
      buildoutApi.getAllBrokers(),
    ])

    // Create a map of broker_id to broker name for quick lookup
    const brokerMap = new Map<number, string>()
    brokersResponse.brokers.forEach((broker) => {
      brokerMap.set(broker.id, `${broker.first_name} ${broker.last_name}`)
    })

    // Transform lightweight properties to PropertyCard format with broker names
    const transformedProperties = propertiesResponse.properties.map((property) => {
      const agentName = property.broker_id && brokerMap.has(property.broker_id)
        ? brokerMap.get(property.broker_id)!
        : 'Agent'
      return transformLightweightPropertyToCard(property, agentName)
    })

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

