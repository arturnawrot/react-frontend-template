'use client'
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Search, ChevronDown, List, Grid, Share2, RotateCcw } from 'lucide-react'
import PropertyCard from '../PropertyCard/PropertyCard'
import type { BuildoutProperty } from '@/utils/buildout-api'
import { transformPropertyToCard, type PropertyCardData } from '@/utils/property-transform'
import type { BuildoutBroker } from '@/utils/buildout-api'

// Dynamically import PropertyMap with SSR disabled
const PropertyMap = dynamic(() => import('../PropertyMap/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-stone-600">Loading map...</p>
    </div>
  ),
})

interface FilterState {
  brokerId: number | null
  propertyType: number | null
  minPrice: number | null
  maxPrice: number | null
  saleOrLease: 'sale' | 'lease' | 'both' | null
  minCapRate: number | null
  maxCapRate: number | null
}

type PropertySearchAdvancedProps = {
  backgroundColor?: string
  backgroundExtendPx?: number
}

const ITEMS_PER_PAGE = 20

export default function PropertySearchAdvanced({ 
  backgroundColor, 
  backgroundExtendPx = 200 
}: PropertySearchAdvancedProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    brokerId: null,
    propertyType: null,
    minPrice: null,
    maxPrice: null,
    saleOrLease: null,
    minCapRate: null,
    maxCapRate: null,
  })
  const [properties, setProperties] = useState<PropertyCardData[]>([])
  const [allProperties, setAllProperties] = useState<PropertyCardData[]>([]) // All filtered properties for map
  const [brokers, setBrokers] = useState<BuildoutBroker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [mapType, setMapType] = useState<'map' | 'satellite'>('map')
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null)
  const [mapZoom, setMapZoom] = useState<number | null>(null)
  
  // Refs for dropdowns
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const dropdown = dropdownRefs.current[openDropdown]
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setOpenDropdown(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openDropdown])

  // Fetch brokers on mount
  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const response = await fetch('/api/buildout/brokers?limit=1000')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setBrokers(data.brokers || [])
          }
        }
      } catch (err) {
        console.error('Error fetching brokers:', err)
      }
    }
    fetchBrokers()
  }, [])

  // Fetch properties with filters
  const fetchProperties = useCallback(async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        limit: ITEMS_PER_PAGE.toString(),
        offset: ((page - 1) * ITEMS_PER_PAGE).toString(),
      })

      if (searchQuery) {
        params.append('search', searchQuery)
      }

      if (filters.brokerId) {
        params.append('brokerId', filters.brokerId.toString())
      }

      if (filters.propertyType) {
        params.append('propertyType', filters.propertyType.toString())
      }

      if (filters.minPrice) {
        params.append('minPrice', filters.minPrice.toString())
      }

      if (filters.maxPrice) {
        params.append('maxPrice', filters.maxPrice.toString())
      }

      if (filters.saleOrLease && filters.saleOrLease !== 'both') {
        params.append('saleOrLease', filters.saleOrLease)
      }

      if (filters.minCapRate) {
        params.append('minCapRate', filters.minCapRate.toString())
      }

      if (filters.maxCapRate) {
        params.append('maxCapRate', filters.maxCapRate.toString())
      }

      const response = await fetch(`/api/buildout/search-properties?${params.toString()}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch properties')
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch properties')
      }

      const transformedProperties = (data.properties || []).map((property: BuildoutProperty) => {
        const broker = brokers.find(b => b.id === property.broker_id)
        const agentName = broker ? `${broker.first_name} ${broker.last_name}` : 'Agent'
        return transformPropertyToCard(property, agentName)
      })

      const validProperties = transformedProperties.filter(
        (prop: PropertyCardData) =>
          prop.latitude && prop.longitude && !isNaN(prop.latitude) && !isNaN(prop.longitude)
      )

      setProperties(validProperties)
      setTotalCount(data.count || 0)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch properties'
      setError(errorMessage)
      console.error('Error fetching properties:', err)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, filters, brokers])

  // Fetch all properties for map (without pagination)
  const fetchAllPropertiesForMap = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        limit: '1000', // Get more properties for map
      })

      if (searchQuery) {
        params.append('search', searchQuery)
      }

      if (filters.brokerId) {
        params.append('brokerId', filters.brokerId.toString())
      }

      if (filters.propertyType) {
        params.append('propertyType', filters.propertyType.toString())
      }

      if (filters.minPrice) {
        params.append('minPrice', filters.minPrice.toString())
      }

      if (filters.maxPrice) {
        params.append('maxPrice', filters.maxPrice.toString())
      }

      if (filters.saleOrLease && filters.saleOrLease !== 'both') {
        params.append('saleOrLease', filters.saleOrLease)
      }

      if (filters.minCapRate) {
        params.append('minCapRate', filters.minCapRate.toString())
      }

      if (filters.maxCapRate) {
        params.append('maxCapRate', filters.maxCapRate.toString())
      }

      const response = await fetch(`/api/buildout/search-properties?${params.toString()}`)

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const transformedProperties = (data.properties || []).map((property: BuildoutProperty) => {
            const broker = brokers.find(b => b.id === property.broker_id)
            const agentName = broker ? `${broker.first_name} ${broker.last_name}` : 'Agent'
            return transformPropertyToCard(property, agentName)
          })

          const validProperties = transformedProperties.filter(
            (prop: PropertyCardData) =>
              prop.latitude && prop.longitude && !isNaN(prop.latitude) && !isNaN(prop.longitude)
          )

          setAllProperties(validProperties)
          
          // Calculate most saturated area
          if (validProperties.length > 0) {
            calculateMapCenter(validProperties)
          }
        }
      }
    } catch (err) {
      console.error('Error fetching all properties for map:', err)
    }
  }, [searchQuery, filters, brokers])

  // Calculate map center based on most saturated area
  const calculateMapCenter = useCallback((props: PropertyCardData[]) => {
    if (props.length === 0) return

    // Simple approach: use the center of all properties
    const center: [number, number] = [
      props.reduce((sum, p) => sum + (p.latitude || 0), 0) / props.length,
      props.reduce((sum, p) => sum + (p.longitude || 0), 0) / props.length,
    ]

    // Calculate zoom based on spread of properties
    const latitudes = props.map(p => p.latitude).filter(Boolean) as number[]
    const longitudes = props.map(p => p.longitude).filter(Boolean) as number[]
    
    if (latitudes.length > 0 && longitudes.length > 0) {
      const latRange = Math.max(...latitudes) - Math.min(...latitudes)
      const lngRange = Math.max(...longitudes) - Math.min(...longitudes)
      const maxRange = Math.max(latRange, lngRange)
      
      // Calculate appropriate zoom level
      let zoom = 11
      if (maxRange > 0.5) zoom = 9
      else if (maxRange > 0.2) zoom = 10
      else if (maxRange > 0.1) zoom = 11
      else if (maxRange > 0.05) zoom = 12
      else zoom = 13

      setMapCenter(center)
      setMapZoom(zoom)
    } else {
      setMapCenter(center)
      setMapZoom(11)
    }
  }, [])

  // Fetch properties when filters or search change
  useEffect(() => {
    setCurrentPage(1)
    fetchProperties(1)
    fetchAllPropertiesForMap()
  }, [searchQuery, filters, fetchProperties, fetchAllPropertiesForMap])

  // Fetch properties when page changes
  useEffect(() => {
    fetchProperties(currentPage)
  }, [currentPage, fetchProperties])

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setOpenDropdown(null)
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setFilters({
      brokerId: null,
      propertyType: null,
      minPrice: null,
      maxPrice: null,
      saleOrLease: null,
      minCapRate: null,
      maxCapRate: null,
    })
  }

  // Property types (simplified - you may want to fetch these from API)
  const propertyTypes = [
    { id: 1, label: 'Office' },
    { id: 2, label: 'Retail' },
    { id: 3, label: 'Industrial' },
    { id: 4, label: 'Land' },
    { id: 5, label: 'Multi-Family' },
  ]

  const priceRanges = [
    { min: null, max: 100000, label: 'Under $100k' },
    { min: 100000, max: 500000, label: '$100k - $500k' },
    { min: 500000, max: 1000000, label: '$500k - $1M' },
    { min: 1000000, max: 5000000, label: '$1M - $5M' },
    { min: 5000000, max: null, label: 'Over $5M' },
  ]

  const capRateRanges = [
    { min: null, max: 5, label: 'Under 5%' },
    { min: 5, max: 7, label: '5% - 7%' },
    { min: 7, max: 10, label: '7% - 10%' },
    { min: 10, max: null, label: 'Over 10%' },
  ]

  const getFilterLabel = (filterKey: keyof FilterState) => {
    switch (filterKey) {
      case 'brokerId':
        if (filters.brokerId) {
          const broker = brokers.find(b => b.id === filters.brokerId)
          return broker ? `${broker.first_name} ${broker.last_name}` : 'Brokers'
        }
        return 'Brokers'
      case 'propertyType':
        if (filters.propertyType) {
          const type = propertyTypes.find(t => t.id === filters.propertyType)
          return type ? type.label : 'Property Type'
        }
        return 'Property Type'
      case 'minPrice':
      case 'maxPrice':
        if (filters.minPrice || filters.maxPrice) {
          const min = filters.minPrice ? `$${(filters.minPrice / 1000).toFixed(0)}k` : ''
          const max = filters.maxPrice ? `$${(filters.maxPrice / 1000).toFixed(0)}k` : ''
          return min && max ? `${min} - ${max}` : min || max || 'Price Range'
        }
        return 'Price Range'
      case 'saleOrLease':
        if (filters.saleOrLease === 'sale') return 'For Sale'
        if (filters.saleOrLease === 'lease') return 'For Lease'
        return 'Sale or Lease'
      case 'minCapRate':
      case 'maxCapRate':
        if (filters.minCapRate || filters.maxCapRate) {
          const min = filters.minCapRate ? `${filters.minCapRate}%` : ''
          const max = filters.maxCapRate ? `${filters.maxCapRate}%` : ''
          return min && max ? `${min} - ${max}` : min || max || 'Cap Rate'
        }
        return 'Cap Rate'
      default:
        return ''
    }
  }

  const propertiesCountText = useMemo(() => {
    if (loading) return 'Loading properties...'
    if (error) return 'Error loading properties'
    return `${totalCount} ${totalCount === 1 ? 'Property' : 'Properties'} For ${filters.saleOrLease === 'sale' ? 'Sale' : filters.saleOrLease === 'lease' ? 'Lease' : 'Sale'}`
  }, [totalCount, loading, error, filters.saleOrLease])

  return (
    <div
      className="min-h-screen font-sans text-stone-800"
      style={
        backgroundColor
          ? {
              background: `linear-gradient(${backgroundColor} 0px, ${backgroundColor} ${backgroundExtendPx}px, #ffffff ${backgroundExtendPx}px, #ffffff 100%)`,
            }
          : undefined
      }
    >
      {/* Top block shares the hero background when provided */}
      <div className="px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          {/* --- Filter Section --- */}
          <div className="py-6">
            <div className="flex flex-col xl:flex-row gap-4 items-center justify-between w-full">
              
              {/* Search Input */}
              <div className="relative w-full xl:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-stone-500" />
                </div>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border-none rounded bg-[#EBEBE8] text-stone-900 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-[#CDDC39] text-sm font-medium" 
                  placeholder="Search" 
                />
              </div>

              {/* Filter Dropdowns */}
              <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                {/* Brokers */}
                <div className="relative" ref={(el) => (dropdownRefs.current['brokers'] = el)}>
                  <button 
                    onClick={() => setOpenDropdown(openDropdown === 'brokers' ? null : 'brokers')}
                    className="flex items-center justify-between gap-2 bg-[#A8B2AD] hover:bg-[#EBEBE8] text-[#1C2B28] px-4 py-3 rounded text-sm font-semibold transition-colors min-w-[120px]"
                  >
                    {getFilterLabel('brokerId')} <ChevronDown size={14} className="opacity-70" />
                  </button>
                  {openDropdown === 'brokers' && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg z-50 max-h-60 overflow-y-auto min-w-[200px]">
                      <button
                        onClick={() => handleFilterChange('brokerId', null)}
                        className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                      >
                        All Brokers
                      </button>
                      {brokers.map((broker) => (
                        <button
                          key={broker.id}
                          onClick={() => handleFilterChange('brokerId', broker.id)}
                          className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                        >
                          {broker.first_name} {broker.last_name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Property Type */}
                <div className="relative" ref={(el) => (dropdownRefs.current['propertyType'] = el)}>
                  <button 
                    onClick={() => setOpenDropdown(openDropdown === 'propertyType' ? null : 'propertyType')}
                    className="flex items-center justify-between gap-2 bg-[#A8B2AD] hover:bg-[#EBEBE8] text-[#1C2B28] px-4 py-3 rounded text-sm font-semibold transition-colors min-w-[120px]"
                  >
                    {getFilterLabel('propertyType')} <ChevronDown size={14} className="opacity-70" />
                  </button>
                  {openDropdown === 'propertyType' && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg z-50 min-w-[150px]">
                      <button
                        onClick={() => handleFilterChange('propertyType', null)}
                        className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                      >
                        All Types
                      </button>
                      {propertyTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => handleFilterChange('propertyType', type.id)}
                          className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Range */}
                <div className="relative" ref={(el) => (dropdownRefs.current['priceRange'] = el)}>
                  <button 
                    onClick={() => setOpenDropdown(openDropdown === 'priceRange' ? null : 'priceRange')}
                    className="flex items-center justify-between gap-2 bg-[#A8B2AD] hover:bg-[#EBEBE8] text-[#1C2B28] px-4 py-3 rounded text-sm font-semibold transition-colors min-w-[120px]"
                  >
                    {getFilterLabel('minPrice')} <ChevronDown size={14} className="opacity-70" />
                  </button>
                  {openDropdown === 'priceRange' && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg z-50 min-w-[180px]">
                      <button
                        onClick={() => {
                          setFilters(prev => ({ ...prev, minPrice: null, maxPrice: null }))
                          setOpenDropdown(null)
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                      >
                        All Prices
                      </button>
                      {priceRanges.map((range, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setFilters(prev => ({ ...prev, minPrice: range.min, maxPrice: range.max }))
                            setOpenDropdown(null)
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sale or Lease */}
                <div className="relative" ref={(el) => (dropdownRefs.current['saleOrLease'] = el)}>
                  <button 
                    onClick={() => setOpenDropdown(openDropdown === 'saleOrLease' ? null : 'saleOrLease')}
                    className="flex items-center justify-between gap-2 bg-[#A8B2AD] hover:bg-[#EBEBE8] text-[#1C2B28] px-4 py-3 rounded text-sm font-semibold transition-colors min-w-[120px]"
                  >
                    {getFilterLabel('saleOrLease')} <ChevronDown size={14} className="opacity-70" />
                  </button>
                  {openDropdown === 'saleOrLease' && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg z-50 min-w-[150px]">
                      <button
                        onClick={() => handleFilterChange('saleOrLease', null)}
                        className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                      >
                        Both
                      </button>
                      <button
                        onClick={() => handleFilterChange('saleOrLease', 'sale')}
                        className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                      >
                        For Sale
                      </button>
                      <button
                        onClick={() => handleFilterChange('saleOrLease', 'lease')}
                        className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                      >
                        For Lease
                      </button>
                    </div>
                  )}
                </div>

                {/* Cap Rate */}
                <div className="relative" ref={(el) => (dropdownRefs.current['capRate'] = el)}>
                  <button 
                    onClick={() => setOpenDropdown(openDropdown === 'capRate' ? null : 'capRate')}
                    className="flex items-center justify-between gap-2 bg-[#A8B2AD] hover:bg-[#EBEBE8] text-[#1C2B28] px-4 py-3 rounded text-sm font-semibold transition-colors min-w-[120px]"
                  >
                    {getFilterLabel('minCapRate')} <ChevronDown size={14} className="opacity-70" />
                  </button>
                  {openDropdown === 'capRate' && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg z-50 min-w-[150px]">
                      <button
                        onClick={() => {
                          setFilters(prev => ({ ...prev, minCapRate: null, maxCapRate: null }))
                          setOpenDropdown(null)
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                      >
                        All Cap Rates
                      </button>
                      {capRateRanges.map((range, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setFilters(prev => ({ ...prev, minCapRate: range.min, maxCapRate: range.max }))
                            setOpenDropdown(null)
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                 
                <button 
                  onClick={handleResetFilters}
                  className="whitespace-nowrap bg-transparent border border-stone-500 hover:border-white text-stone-400 hover:text-white px-6 py-3 rounded text-sm font-medium ml-auto xl:ml-2 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* --- Toolbar + Heading --- */}
          <div>
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-stone-700 text-white">
                {propertiesCountText}
              </h2>
              <div className="flex gap-2 items-center">
                 <div className="hidden sm:flex bg-white rounded border border-stone-300 p-1">
                   <button className="p-1.5 hover:bg-stone-100 rounded text-stone-600"><List size={18} /></button>
                   <button className="p-1.5 bg-stone-100 rounded text-stone-800 shadow-sm"><Grid size={18} /></button>
                 </div>
                 <button className="flex items-center gap-1 text-xs font-bold bg-stone-100 px-3 py-2 rounded-md hover:bg-stone-200 text-stone-600 border border-stone-200">
                    <RotateCcw size={12}/> Last Updated
                 </button>
                 <button className="p-2 hover:bg-stone-100 rounded-full text-stone-600 border border-stone-200"><Share2 size={16} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content Section --- */}
      <div className="px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto py-6">
          
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* Left Column: Property Grid (2 cards per row) */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {loading ? (
                  <div className="col-span-2 text-center py-8 text-stone-600">Loading properties...</div>
                ) : error ? (
                  <div className="col-span-2 text-center py-8 text-red-600">{error}</div>
                ) : properties.length === 0 ? (
                  <div className="col-span-2 text-center py-8 text-stone-600">No properties found</div>
                ) : (
                  properties.map((prop) => (
                    <PropertyCard key={prop.id} property={prop} variant="vertical" />
                  ))
                )}
              </div>
              
              {/* Pagination Controls */}
              {!loading && !error && totalCount > ITEMS_PER_PAGE && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded border border-stone-300 bg-white hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, Math.ceil(totalCount / ITEMS_PER_PAGE)) }, (_, i) => {
                      const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
                      let pageNum: number
                      
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 rounded text-sm font-medium ${
                            currentPage === pageNum
                              ? 'bg-[#A8B2AD] text-white'
                              : 'bg-white border border-stone-300 hover:bg-stone-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalCount / ITEMS_PER_PAGE), prev + 1))}
                    disabled={currentPage >= Math.ceil(totalCount / ITEMS_PER_PAGE)}
                    className="px-4 py-2 rounded border border-stone-300 bg-white hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Map */}
            <div className="w-full lg:w-1/2 relative min-h-[600px] lg:min-h-[600px] lg:sticky lg:top-6">
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-sm border border-stone-200">
                {loading ? (
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
                    mapType={mapType}
                    onMapTypeChange={setMapType}
                    center={mapCenter || undefined}
                    zoom={mapZoom || undefined}
                    // Don't pass onBoundsChange - we don't want map to update properties
                  />
                )}
                
                {/* Map Controls */}
                <div className="absolute top-4 left-4 flex bg-white rounded-md shadow-md z-10 overflow-hidden text-sm font-bold text-stone-700">
                  <button 
                    onClick={() => setMapType('map')}
                    className={`px-4 py-2 ${mapType === 'map' ? 'bg-white' : 'bg-stone-50'} hover:bg-stone-50`}
                  >
                    Map
                  </button>
                  <button 
                    onClick={() => setMapType('satellite')}
                    className={`px-4 py-2 border-l ${mapType === 'satellite' ? 'bg-white' : 'bg-stone-50'} hover:bg-stone-50 text-stone-500 font-normal`}
                  >
                    Satellite
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

