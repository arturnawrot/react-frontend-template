'use client'
import React, { useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { List, Grid, Share2, Loader2 } from 'lucide-react'
import type { Page } from '@/payload-types'
import PropertyCard from '../PropertyCard/PropertyCard'
import type { LightweightProperty, BuildoutBroker } from '@/utils/buildout-api'
import { transformPropertyToCard, type PropertyCardData } from '@/utils/property-transform'
import { createBrokerMaps, getAgentInfo } from '@/utils/broker-utils'
import { filterValidCoordinates } from '@/utils/property-utils'
import { CONTAINER_MAX_WIDTH_CLASS, CONTAINER_PADDING_X } from '@/utils/constants'

// Dynamically import PropertyMap with SSR disabled to avoid window is not defined error
const PropertyMap = dynamic(() => import('../PropertyMap/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-stone-600">Loading map...</p>
    </div>
  ),
})

type PropertySearchBlock = Extract<Page['blocks'][number], { blockType: 'propertySearch' }>

interface PropertySearchProps {
  block: PropertySearchBlock
}

const CHUNK_SIZE = 50

export default function PropertySearch({ block }: PropertySearchProps) {
  const heading = block.heading || 'Local Insight. National Scale.'
  const description = block.description || 'Headquartered in the Southeast, our brokers and partners support commercial activity across state lines and sector boundaries.'
  const buttonText = block.buttonText || 'Explore Properties by Market'
  
  const [allProperties, setAllProperties] = useState<PropertyCardData[]>([])
  const [visibleProperties, setVisibleProperties] = useState<PropertyCardData[]>([])
  const [mapType, setMapType] = useState<'map' | 'satellite'>('map')
  const [loading, setLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all properties in chunks of 50, updating incrementally
  useEffect(() => {
    const fetchAllProperties = async () => {
      try {
        setLoading(true)
        setError(null)
        setIsInitialLoad(true)

        // First, fetch brokers (needed for transformation)
        let brokerMaps = createBrokerMaps([])
        try {
          const brokersResponse = await fetch('/api/buildout/brokers')
          if (brokersResponse.ok) {
            const brokersData = await brokersResponse.json()
            if (brokersData.success && brokersData.brokers) {
              const brokers = brokersData.brokers as BuildoutBroker[]
              brokerMaps = createBrokerMaps(brokers)
            }
          }
        } catch (e) {
          console.warn('Failed to fetch brokers:', e)
        }

        // Fetch properties in chunks, updating state incrementally
        let offset = 0
        let hasMore = true
        let isFirstChunk = true

        while (hasMore) {
          const response = await fetch(`/api/buildout/search-properties?limit=${CHUNK_SIZE}&offset=${offset}`)
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
            throw new Error(errorData.error || 'Failed to fetch properties')
          }

          const data = await response.json()
          
          if (!data.success) {
            throw new Error(data.error || 'Failed to fetch properties')
          }

          const properties = data.properties || []
          
          if (properties.length === 0) {
            hasMore = false
            break
          }

          // Transform lightweight properties to PropertyCard format with broker names and images
          const transformedProperties = properties.map((property: LightweightProperty) => {
            const { name: agentName, image: agentImage } = getAgentInfo(property.broker_id, brokerMaps)
            return transformPropertyToCard(property, agentName, agentImage)
          })

          // Filter out properties without valid coordinates
          const validProperties = filterValidCoordinates(transformedProperties)

          // Update state incrementally - append new properties to existing ones
          setAllProperties(prev => {
            const newProperties = [...prev, ...validProperties]
            return newProperties
          })

          // After first chunk, show the map immediately
          if (isFirstChunk) {
            setIsInitialLoad(false)
            isFirstChunk = false
          }

          // If we got less than CHUNK_SIZE, we've reached the end
          if (properties.length < CHUNK_SIZE) {
            hasMore = false
          } else {
            offset += CHUNK_SIZE
          }
        }

        // All chunks fetched, stop loading
        setLoading(false)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch properties'
        setError(errorMessage)
        console.error('Error fetching properties:', err)
        setLoading(false)
        setIsInitialLoad(false)
      }
    }

    fetchAllProperties()
  }, [])

  // Handle map bounds change - filter properties and show 4
  interface LeafletBounds {
    north: number
    south: number
    east: number
    west: number
  }

  const handleBoundsChange = React.useCallback((bounds: LeafletBounds, visible: PropertyCardData[]) => {
    // Show up to 4 properties from the visible area
    const limited = visible.slice(0, 4)
    
    // Only update if the visible properties have actually changed
    setVisibleProperties(prev => {
      // Compare by IDs to avoid unnecessary updates
      const prevIds = prev.map(p => p.id).sort().join(',')
      const newIds = limited.map(p => p.id).sort().join(',')
      if (prevIds === newIds) {
        return prev // Return previous state if nothing changed
      }
      return limited
    })
  }, [])

  // Display properties count
  const propertiesCountText = useMemo(() => {
    if (error) return 'Error loading properties'
    const count = allProperties.length
    return `${count} ${count === 1 ? 'Property' : 'Properties'} For Sale`
  }, [allProperties.length, error])

  return (
    <div className={`${CONTAINER_MAX_WIDTH_CLASS} ${CONTAINER_PADDING_X} mx-auto font-sans text-stone-800 bg-transparent`}>
      
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1C2B28] mb-4 tracking-tight">
              {heading}
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>
          <div className="flex-shrink-0">
            <button className="whitespace-nowrap px-8 py-3 rounded-full border border-stone-800 hover:bg-stone-800 hover:text-white transition-colors font-medium text-sm tracking-wide">
              {buttonText}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content (Equal Height Split) */}
      <div>
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT COLUMN: Map */}
          <div className="w-full lg:w-1/2 relative h-[600px] lg:h-[600px] flex-shrink-0">
            <div className="absolute inset-0 bg-[#E5F0EC] rounded-3xl overflow-hidden border border-stone-200 shadow-inner">
              {isInitialLoad ? (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-stone-600">Loading map...</p>
                </div>
              ) : error ? (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-red-600">Error: {error}</p>
                </div>
              ) : (
                <PropertyMap
                  properties={allProperties}
                  onBoundsChange={handleBoundsChange}
                  mapType={mapType}
                  onMapTypeChange={setMapType}
                />
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Property List */}
          <div className="flex flex-col w-full lg:w-1/2 h-[600px] lg:h-[600px]">
            
            {/* List Toolbar - Above property cards container */}
            <div className="flex flex-wrap gap-2 justify-between items-center mb-4 pb-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-medium text-stone-800">
                  {propertiesCountText}
                </h2>
                {loading && (
                  <Loader2 className="h-4 w-4 text-stone-600 animate-spin" />
                )}
              </div>
              <div className="flex gap-2 items-center">
                 <div className="hidden sm:flex bg-white rounded border border-stone-200 p-1">
                   <button className="p-1 hover:bg-stone-100 rounded text-stone-600"><List size={18} /></button>
                   <button className="p-1 hover:bg-stone-100 rounded text-stone-400"><Grid size={18} /></button>
                 </div>
                 <button className="text-xs font-medium bg-stone-100 px-3 py-1.5 rounded hover:bg-stone-200 text-stone-600">Last Updated</button>
                 <button className="p-1.5 hover:bg-stone-100 rounded text-stone-600 border border-transparent hover:border-stone-200"><Share2 size={16} /></button>
              </div>
            </div>

            {/* Cards Stack - Fixed height container, no scrolling */}
            <div className="flex flex-col gap-2 flex-1 min-h-0 overflow-hidden">
              {isInitialLoad ? (
                <p className="text-stone-600">Loading properties...</p>
              ) : error ? (
                <p className="text-red-600">Error: {error}</p>
              ) : visibleProperties.length === 0 ? (
                <p className="text-stone-600">Zoom in or move the map to see properties in this area</p>
              ) : (
                visibleProperties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} variant="horizontal" />
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

