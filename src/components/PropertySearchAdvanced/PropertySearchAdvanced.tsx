'use client'
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import { ChevronDown, List, Grid, Share2, RotateCcw, Filter } from 'lucide-react'
import PropertyCard from '../PropertyCard/PropertyCard'
import type { LightweightProperty, BuildoutBroker } from '@/utils/buildout-api'
import { transformPropertyToCard, type PropertyCardData } from '@/utils/property-transform'
import { getAgentInfoFromBrokers } from '@/utils/broker-utils'
import { buildFilterParams as buildFilterParamsUtil } from '@/utils/filter-params'
import LocationSearchSuggestion, { type AddressSuggestion } from '@/components/LocationSearchSuggestion/LocationSearchSuggestion'

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
  minSquareFootage: number | null
  maxSquareFootage: number | null
}

type PropertySearchAdvancedProps = {
  backgroundColor?: string
  backgroundExtendPx?: number
  savedPropertiesMode?: boolean // If true, fetch saved properties instead of all properties
  hideMap?: boolean // If true, hide the map and show grid-only layout
}

const ITEMS_PER_PAGE = 20

export default function PropertySearchAdvanced({ 
  backgroundColor, 
  backgroundExtendPx = 200,
  savedPropertiesMode = false,
  hideMap = false
}: PropertySearchAdvancedProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  // Initialize state from URL params
  const getInitialState = useCallback(() => {
    const search = searchParams.get('search') || ''
    const brokerId = searchParams.get('brokerId') ? parseInt(searchParams.get('brokerId')!, 10) : null
    const propertyType = searchParams.get('propertyType') ? parseInt(searchParams.get('propertyType')!, 10) : null
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!, 10) : null
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!, 10) : null
    const saleOrLease = searchParams.get('saleOrLease') as 'sale' | 'lease' | 'both' | null || null
    const minCapRate = searchParams.get('minCapRate') ? parseFloat(searchParams.get('minCapRate')!) : null
    const maxCapRate = searchParams.get('maxCapRate') ? parseFloat(searchParams.get('maxCapRate')!) : null
    const minSquareFootage = searchParams.get('minSquareFootage') ? parseInt(searchParams.get('minSquareFootage')!, 10) : null
    const maxSquareFootage = searchParams.get('maxSquareFootage') ? parseInt(searchParams.get('maxSquareFootage')!, 10) : null
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1

    return {
      search,
      filters: {
        brokerId: brokerId && !isNaN(brokerId) ? brokerId : null,
        propertyType: propertyType && !isNaN(propertyType) ? propertyType : null,
        minPrice: minPrice && !isNaN(minPrice) ? minPrice : null,
        maxPrice: maxPrice && !isNaN(maxPrice) ? maxPrice : null,
        saleOrLease: saleOrLease || null,
        minCapRate: minCapRate && !isNaN(minCapRate) ? minCapRate : null,
        maxCapRate: maxCapRate && !isNaN(maxCapRate) ? maxCapRate : null,
        minSquareFootage: minSquareFootage && !isNaN(minSquareFootage) ? minSquareFootage : null,
        maxSquareFootage: maxSquareFootage && !isNaN(maxSquareFootage) ? maxSquareFootage : null,
      },
      page: page && !isNaN(page) && page > 0 ? page : 1,
    }
  }, [searchParams])

  const initialState = getInitialState()
  
  const [searchQuery, setSearchQuery] = useState(initialState.search)
  const [filters, setFilters] = useState<FilterState>(initialState.filters)
  const [properties, setProperties] = useState<PropertyCardData[]>([])
  const [allProperties, setAllProperties] = useState<PropertyCardData[]>([]) // All filtered properties for map
  const [brokers, setBrokers] = useState<BuildoutBroker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(initialState.page)
  const [totalCount, setTotalCount] = useState(0)
  const [mapType, setMapType] = useState<'map' | 'satellite'>('map')
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null)
  const [mapZoom, setMapZoom] = useState<number | null>(null)
  
  // Refs for dropdowns
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const mobileFilterPanelRef = useRef<HTMLDivElement | null>(null)
  const mobileFilterButtonRef = useRef<HTMLButtonElement | null>(null)
  const isInitialMount = useRef(true)
  
  // Update URL params when filters/search/page change
  const updateURL = useCallback((newSearch: string, newFilters: FilterState, newPage: number) => {
    const params = new URLSearchParams()
    
    if (newSearch) {
      params.set('search', newSearch)
    }
    
    if (newFilters.brokerId) {
      params.set('brokerId', newFilters.brokerId.toString())
    }
    
    if (newFilters.propertyType) {
      params.set('propertyType', newFilters.propertyType.toString())
    }
    
    if (newFilters.minPrice) {
      params.set('minPrice', newFilters.minPrice.toString())
    }
    
    if (newFilters.maxPrice) {
      params.set('maxPrice', newFilters.maxPrice.toString())
    }
    
    if (newFilters.saleOrLease && newFilters.saleOrLease !== 'both') {
      params.set('saleOrLease', newFilters.saleOrLease)
    }
    
    if (newFilters.minCapRate !== null) {
      params.set('minCapRate', newFilters.minCapRate.toString())
    }
    
    if (newFilters.maxCapRate !== null) {
      params.set('maxCapRate', newFilters.maxCapRate.toString())
    }
    
    if (newFilters.minSquareFootage) {
      params.set('minSquareFootage', newFilters.minSquareFootage.toString())
    }
    
    if (newFilters.maxSquareFootage) {
      params.set('maxSquareFootage', newFilters.maxSquareFootage.toString())
    }
    
    if (newPage > 1) {
      params.set('page', newPage.toString())
    }
    
    // Update URL without adding to history (replace instead of push)
    const newURL = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.replace(newURL, { scroll: false })
  }, [router, pathname])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const dropdown = dropdownRefs.current[openDropdown]
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setOpenDropdown(null)
        }
      }
      // Close mobile filter panel when clicking outside
      if (mobileFiltersOpen) {
        const target = event.target as Node
        const panel = mobileFilterPanelRef.current
        const button = mobileFilterButtonRef.current
        if (panel && button && !panel.contains(target) && !button.contains(target)) {
          setMobileFiltersOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openDropdown, mobileFiltersOpen])

  // Helper function to build filter params from filter state
  const buildFilterParams = useCallback((filters: FilterState, searchQuery?: string, includeSearch = false): URLSearchParams => {
    return buildFilterParamsUtil(
      {
        search: searchQuery,
        brokerId: filters.brokerId,
        propertyType: filters.propertyType,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        saleOrLease: filters.saleOrLease,
        minCapRate: filters.minCapRate,
        maxCapRate: filters.maxCapRate,
        minSquareFootage: filters.minSquareFootage,
        maxSquareFootage: filters.maxSquareFootage,
      },
      { includeSearch }
    )
  }, [])

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

  // Fetch properties with server-side pagination (for list view)
  const fetchProperties = useCallback(async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)

      // Calculate offset for pagination
      const offset = (page - 1) * ITEMS_PER_PAGE

      let response: Response

      if (savedPropertiesMode) {
        // Fetch saved property IDs from localStorage
        if (typeof window === 'undefined') {
          return
        }

        const { getSavedPropertyIds } = await import('@/utils/saved-properties')
        const savedIds = getSavedPropertyIds()

        if (savedIds.length === 0) {
          setProperties([])
          setTotalCount(0)
          setAllProperties([])
          return
        }

        // Fetch saved properties by IDs with pagination and filters
        const filterParams = buildFilterParams(filters, searchQuery, true) // Include search for list view
        filterParams.append('ids', savedIds.join(','))
        filterParams.append('limit', ITEMS_PER_PAGE.toString())
        filterParams.append('offset', offset.toString())

        response = await fetch(`/api/buildout/saved-properties?${filterParams.toString()}`)
      } else {
        // ALL filtering is done server-side - use proper pagination for list view (20 per page)
        const filterParams = buildFilterParams(filters, searchQuery, true) // Include search for list view
        filterParams.append('limit', ITEMS_PER_PAGE.toString())
        filterParams.append('offset', offset.toString())

        response = await fetch(`/api/buildout/search-properties?${filterParams.toString()}`)
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch properties')
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch properties')
      }

      // Transform lightweight properties for list view
      // ALL filtering is done server-side, so we just transform and use the results
      const transformedProperties = (data.properties || []).map((property: LightweightProperty) => {
        const { name: agentName, image: agentImage } = getAgentInfoFromBrokers(property.broker_id, brokers)
        return transformPropertyToCard(property, agentName, agentImage)
      })

      // Filter out properties without valid coordinates (this is the only client-side filtering we do)
      const validProperties = transformedProperties.filter(
        (prop: PropertyCardData) =>
          prop.latitude && prop.longitude && !isNaN(prop.latitude) && !isNaN(prop.longitude)
      )

      // Server-side pagination was already applied (20 per page)
      setProperties(validProperties)
      setTotalCount(data.count || 0)
      
      // Use the same paginated properties for map (no separate request)
      setAllProperties(validProperties)
      if (!hideMap && validProperties.length > 0) {
        calculateMapCenter(validProperties)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch properties'
      setError(errorMessage)
      console.error('Error fetching properties:', err)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, filters, brokers, savedPropertiesMode, calculateMapCenter, hideMap, buildFilterParams])

  // fetchAllPropertiesForMap is now handled by fetchProperties - no longer needed

  // Store latest function in ref to avoid dependency issues
  const fetchPropertiesRef = useRef(fetchProperties)
  
  // Update ref when function changes
  useEffect(() => {
    fetchPropertiesRef.current = fetchProperties
  }, [fetchProperties])

  // Track previous filter/search values to prevent duplicate fetches
  const prevFiltersRef = useRef<string>(JSON.stringify(filters))
  const prevSearchQueryRef = useRef<string>(searchQuery)
  const hasInitialFetchRef = useRef<boolean>(false)
  const isUpdatingFromURLRef = useRef<boolean>(false)
  const prevURLSearchRef = useRef<string>('')

  // Sync state from URL params when they change externally (e.g., from navbar search)
  useEffect(() => {
    // Skip on initial mount (already handled by initialState)
    if (isInitialMount.current) {
      // Store initial URL search value
      prevURLSearchRef.current = searchParams.get('search') || ''
      return
    }

    // Read current URL params
    const urlSearch = searchParams.get('search') || ''
    
    // Only sync if URL actually changed externally (not from our own updates)
    const urlSearchChanged = urlSearch !== prevURLSearchRef.current
    if (!urlSearchChanged) {
      // URL didn't change externally, don't sync
      return
    }

    // Update the ref to track the new URL value
    prevURLSearchRef.current = urlSearch

    const urlBrokerId = searchParams.get('brokerId') ? parseInt(searchParams.get('brokerId')!, 10) : null
    const urlPropertyType = searchParams.get('propertyType') ? parseInt(searchParams.get('propertyType')!, 10) : null
    const urlMinPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!, 10) : null
    const urlMaxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!, 10) : null
    const urlSaleOrLease = searchParams.get('saleOrLease') as 'sale' | 'lease' | 'both' | null || null
    const urlMinCapRate = searchParams.get('minCapRate') ? parseFloat(searchParams.get('minCapRate')!) : null
    const urlMaxCapRate = searchParams.get('maxCapRate') ? parseFloat(searchParams.get('maxCapRate')!) : null
    const urlMinSquareFootage = searchParams.get('minSquareFootage') ? parseInt(searchParams.get('minSquareFootage')!, 10) : null
    const urlMaxSquareFootage = searchParams.get('maxSquareFootage') ? parseInt(searchParams.get('maxSquareFootage')!, 10) : null
    const urlPage = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1

    const newFilters: FilterState = {
      brokerId: urlBrokerId && !isNaN(urlBrokerId) ? urlBrokerId : null,
      propertyType: urlPropertyType && !isNaN(urlPropertyType) ? urlPropertyType : null,
      minPrice: urlMinPrice && !isNaN(urlMinPrice) ? urlMinPrice : null,
      maxPrice: urlMaxPrice && !isNaN(urlMaxPrice) ? urlMaxPrice : null,
      saleOrLease: urlSaleOrLease || null,
      minCapRate: urlMinCapRate && !isNaN(urlMinCapRate) ? urlMinCapRate : null,
      maxCapRate: urlMaxCapRate && !isNaN(urlMaxCapRate) ? urlMaxCapRate : null,
      minSquareFootage: urlMinSquareFootage && !isNaN(urlMinSquareFootage) ? urlMinSquareFootage : null,
      maxSquareFootage: urlMaxSquareFootage && !isNaN(urlMaxSquareFootage) ? urlMaxSquareFootage : null,
    }
    const newPage = urlPage && !isNaN(urlPage) && urlPage > 0 ? urlPage : 1

    const searchChanged = urlSearch !== searchQuery
    const filtersChanged = JSON.stringify(newFilters) !== JSON.stringify(filters)
    const pageChanged = newPage !== currentPage

    // Only update if URL params actually changed
    if (searchChanged || filtersChanged || pageChanged) {
      isUpdatingFromURLRef.current = true
      
      if (searchChanged) {
        setSearchQuery(urlSearch)
      }
      
      if (filtersChanged) {
        setFilters(newFilters)
      }
      
      if (pageChanged) {
        setCurrentPage(newPage)
      }
      
      // Reset flag after state updates
      setTimeout(() => {
        isUpdatingFromURLRef.current = false
      }, 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]) // Intentionally only depend on searchParams to prevent input locking when user types

  // Update URL when filters/search/page change (skip initial mount and external URL updates)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    
    // Don't update URL if we're syncing from URL (to avoid loops)
    if (isUpdatingFromURLRef.current) {
      return
    }
    
    updateURL(searchQuery, filters, currentPage)
  }, [searchQuery, filters, currentPage, updateURL])

  // Initial fetch when brokers are loaded (only once on mount)
  useEffect(() => {
    if (brokers.length > 0 && !hasInitialFetchRef.current) {
      hasInitialFetchRef.current = true
      fetchPropertiesRef.current(1)
    }
  }, [brokers.length])

  // Fetch properties when filters or search change (skip initial mount)
  useEffect(() => {
    // Skip if this is the initial mount (handled by brokers effect)
    if (!hasInitialFetchRef.current) return

    const filtersString = JSON.stringify(filters)
    const filtersChanged = prevFiltersRef.current !== filtersString
    const searchChanged = prevSearchQueryRef.current !== searchQuery

    if (filtersChanged || searchChanged) {
      prevFiltersRef.current = filtersString
      prevSearchQueryRef.current = searchQuery
      setCurrentPage(1)
      fetchPropertiesRef.current(1)
    }
  }, [searchQuery, filters])

  // Track previous page to detect actual page changes
  const prevPageRef = useRef<number>(currentPage)
  
  // Fetch properties when page changes (only if it's a real page change, not a reset to 1)
  useEffect(() => {
    // Only fetch if:
    // 1. Brokers are loaded
    // 2. We've done initial fetch  
    // 3. Page actually changed from a previous value (not initial state)
    if (brokers.length > 0 && hasInitialFetchRef.current) {
      const pageChanged = prevPageRef.current !== currentPage && prevPageRef.current > 0
      if (pageChanged) {
        fetchPropertiesRef.current(currentPage)
      }
      prevPageRef.current = currentPage
    }
  }, [currentPage, brokers.length])

  const handleFilterChange = (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
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
      minSquareFootage: null,
      maxSquareFootage: null,
    })
    setCurrentPage(1)
    // URL will be updated by the useEffect that watches these state changes
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

  const squareFootageRanges = [
    { min: null, max: 5000, label: 'Under 5,000 sq ft' },
    { min: 5000, max: 10000, label: '5,000 - 10,000 sq ft' },
    { min: 10000, max: 25000, label: '10,000 - 25,000 sq ft' },
    { min: 25000, max: 50000, label: '25,000 - 50,000 sq ft' },
    { min: 50000, max: null, label: 'Over 50,000 sq ft' },
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
      case 'minSquareFootage':
      case 'maxSquareFootage':
        if (filters.minSquareFootage || filters.maxSquareFootage) {
          const min = filters.minSquareFootage ? `${(filters.minSquareFootage / 1000).toFixed(0)}k` : ''
          const max = filters.maxSquareFootage ? `${(filters.maxSquareFootage / 1000).toFixed(0)}k` : ''
          return min && max ? `${min} - ${max} sq ft` : min || max || 'Square Footage'
        }
        return 'Square Footage'
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
                <LocationSearchSuggestion
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSelect={(suggestion: AddressSuggestion) => {
                    // Clear all other filters (same logic as PropertySearchInput)
                    setFilters({
                      brokerId: null,
                      propertyType: null,
                      minPrice: null,
                      maxPrice: null,
                      saleOrLease: null,
                      minCapRate: null,
                      maxCapRate: null,
                      minSquareFootage: null,
                      maxSquareFootage: null,
                    })
                    
                    // Set search query to the selected address
                    setSearchQuery(suggestion.fullAddress)
                    
                    // Reset to page 1
                    setCurrentPage(1)
                  }}
                  placeholder="Search"
                  showSearchIcon={true}
                  searchIconClassName="text-stone-500"
                  wrapperClassName=""
                  inputClassName="block w-full pr-4 py-3 border-none rounded bg-[#EBEBE8] text-stone-900 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-[#CDDC39] text-sm font-medium"
                />
              </div>

              {/* Desktop: Filter Dropdowns - Always Visible */}
              <div className="hidden xl:flex flex-wrap items-center gap-2 w-auto">
                {/* Brokers */}
                <div className="relative" ref={(el) => { dropdownRefs.current['brokers'] = el }}>
                  <button 
                    onClick={() => setOpenDropdown(openDropdown === 'brokers' ? null : 'brokers')}
                    className="flex items-center justify-between gap-2 bg-[#1C2B28] hover:bg-[#2A3D38] text-white px-4 py-3 rounded text-sm font-semibold transition-colors min-w-[120px] max-w-[200px]"
                  >
                    <span className="truncate">{getFilterLabel('brokerId')}</span>
                    <ChevronDown size={14} className="opacity-70 flex-shrink-0" />
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
                <div className="relative" ref={(el) => { dropdownRefs.current['propertyType'] = el }}>
                  <button 
                    onClick={() => setOpenDropdown(openDropdown === 'propertyType' ? null : 'propertyType')}
                    className="flex items-center justify-between gap-2 bg-[#1C2B28] hover:bg-[#2A3D38] text-white px-4 py-3 rounded text-sm font-semibold transition-colors min-w-[120px] max-w-[180px]"
                  >
                    <span className="truncate">{getFilterLabel('propertyType')}</span>
                    <ChevronDown size={14} className="opacity-70 flex-shrink-0" />
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
                <div className="relative" ref={(el) => { dropdownRefs.current['priceRange'] = el }}>
                  <button 
                    onClick={() => setOpenDropdown(openDropdown === 'priceRange' ? null : 'priceRange')}
                    className="flex items-center justify-between gap-2 bg-[#1C2B28] hover:bg-[#2A3D38] text-white px-4 py-3 rounded text-sm font-semibold transition-colors min-w-[120px] max-w-[180px]"
                  >
                    <span className="truncate">{getFilterLabel('minPrice')}</span>
                    <ChevronDown size={14} className="opacity-70 flex-shrink-0" />
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
                <div className="relative" ref={(el) => { dropdownRefs.current['saleOrLease'] = el }}>
                  <button 
                    onClick={() => setOpenDropdown(openDropdown === 'saleOrLease' ? null : 'saleOrLease')}
                    className="flex items-center justify-between gap-2 bg-[#1C2B28] hover:bg-[#2A3D38] text-white px-4 py-3 rounded text-sm font-semibold transition-colors min-w-[120px] max-w-[150px]"
                  >
                    <span className="truncate">{getFilterLabel('saleOrLease')}</span>
                    <ChevronDown size={14} className="opacity-70 flex-shrink-0" />
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
                <div className="relative" ref={(el) => { dropdownRefs.current['capRate'] = el }}>
                  <button 
                    onClick={() => setOpenDropdown(openDropdown === 'capRate' ? null : 'capRate')}
                    className="flex items-center justify-between gap-2 bg-[#1C2B28] hover:bg-[#2A3D38] text-white px-4 py-3 rounded text-sm font-semibold transition-colors min-w-[120px] max-w-[150px]"
                  >
                    <span className="truncate">{getFilterLabel('minCapRate')}</span>
                    <ChevronDown size={14} className="opacity-70 flex-shrink-0" />
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

                {/* Square Footage */}
                <div className="relative" ref={(el) => { dropdownRefs.current['squareFootage'] = el }}>
                  <button 
                    onClick={() => setOpenDropdown(openDropdown === 'squareFootage' ? null : 'squareFootage')}
                    className="flex items-center justify-between gap-2 bg-[#1C2B28] hover:bg-[#2A3D38] text-white px-4 py-3 rounded text-sm font-semibold transition-colors min-w-[120px] max-w-[180px]"
                  >
                    <span className="truncate">{getFilterLabel('minSquareFootage')}</span>
                    <ChevronDown size={14} className="opacity-70 flex-shrink-0" />
                  </button>
                  {openDropdown === 'squareFootage' && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg z-50 min-w-[200px]">
                      <button
                        onClick={() => {
                          setFilters(prev => ({ ...prev, minSquareFootage: null, maxSquareFootage: null }))
                          setOpenDropdown(null)
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                      >
                        Any Size
                      </button>
                      {squareFootageRanges.map((range, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setFilters(prev => ({ ...prev, minSquareFootage: range.min, maxSquareFootage: range.max }))
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
                  className="whitespace-nowrap bg-transparent border border-white/30 hover:border-white text-white hover:text-white px-6 py-3 rounded text-sm font-medium ml-auto xl:ml-2 transition-colors"
                >
                  Reset Filters
                </button>
              </div>

              {/* Mobile: Filter Button and Collapsible Panel */}
              <div className="xl:hidden w-full flex items-center gap-2">
                <button
                  ref={mobileFilterButtonRef}
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="flex items-center justify-center gap-2 bg-[#1C2B28] hover:bg-[#2A3D38] text-white px-4 py-3 rounded text-sm font-semibold transition-colors"
                >
                  <Filter size={18} />
                  <span>Filters</span>
                </button>
                
                <button 
                  onClick={handleResetFilters}
                  className="whitespace-nowrap bg-transparent border border-white/30 hover:border-white text-white hover:text-white px-4 py-3 rounded text-sm font-medium transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Mobile: Collapsible Filter Panel */}
              {mobileFiltersOpen && (
                <div ref={mobileFilterPanelRef} className="xl:hidden w-full mt-4 p-4 bg-[#1C2B28] rounded-lg space-y-3">
                  {/* Brokers */}
                  <div className="relative" ref={(el) => { dropdownRefs.current['brokers-mobile'] = el }}>
                    <button 
                      onClick={() => setOpenDropdown(openDropdown === 'brokers-mobile' ? null : 'brokers-mobile')}
                      className="flex items-center justify-between gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded text-sm font-semibold transition-colors w-full"
                    >
                      <span className="truncate">{getFilterLabel('brokerId')}</span>
                      <ChevronDown size={14} className="opacity-70 flex-shrink-0" />
                    </button>
                    {openDropdown === 'brokers-mobile' && (
                      <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg z-50 max-h-60 overflow-y-auto min-w-[200px] w-full">
                        <button
                          onClick={() => {
                            handleFilterChange('brokerId', null)
                            setMobileFiltersOpen(false)
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                        >
                          All Brokers
                        </button>
                        {brokers.map((broker) => (
                          <button
                            key={broker.id}
                            onClick={() => {
                              handleFilterChange('brokerId', broker.id)
                              setMobileFiltersOpen(false)
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                          >
                            {broker.first_name} {broker.last_name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Property Type */}
                  <div className="relative" ref={(el) => { dropdownRefs.current['propertyType-mobile'] = el }}>
                    <button 
                      onClick={() => setOpenDropdown(openDropdown === 'propertyType-mobile' ? null : 'propertyType-mobile')}
                      className="flex items-center justify-between gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded text-sm font-semibold transition-colors w-full"
                    >
                      <span className="truncate">{getFilterLabel('propertyType')}</span>
                      <ChevronDown size={14} className="opacity-70 flex-shrink-0" />
                    </button>
                    {openDropdown === 'propertyType-mobile' && (
                      <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg z-50 min-w-[150px] w-full">
                        <button
                          onClick={() => {
                            handleFilterChange('propertyType', null)
                            setMobileFiltersOpen(false)
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                        >
                          All Types
                        </button>
                        {propertyTypes.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => {
                              handleFilterChange('propertyType', type.id)
                              setMobileFiltersOpen(false)
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price Range */}
                  <div className="relative" ref={(el) => { dropdownRefs.current['priceRange-mobile'] = el }}>
                    <button 
                      onClick={() => setOpenDropdown(openDropdown === 'priceRange-mobile' ? null : 'priceRange-mobile')}
                      className="flex items-center justify-between gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded text-sm font-semibold transition-colors w-full"
                    >
                      <span className="truncate">{getFilterLabel('minPrice')}</span>
                      <ChevronDown size={14} className="opacity-70 flex-shrink-0" />
                    </button>
                    {openDropdown === 'priceRange-mobile' && (
                      <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg z-50 min-w-[180px] w-full">
                        <button
                          onClick={() => {
                            setFilters(prev => ({ ...prev, minPrice: null, maxPrice: null }))
                            setOpenDropdown(null)
                            setMobileFiltersOpen(false)
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
                              setMobileFiltersOpen(false)
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
                  <div className="relative" ref={(el) => { dropdownRefs.current['saleOrLease-mobile'] = el }}>
                    <button 
                      onClick={() => setOpenDropdown(openDropdown === 'saleOrLease-mobile' ? null : 'saleOrLease-mobile')}
                      className="flex items-center justify-between gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded text-sm font-semibold transition-colors w-full"
                    >
                      <span className="truncate">{getFilterLabel('saleOrLease')}</span>
                      <ChevronDown size={14} className="opacity-70 flex-shrink-0" />
                    </button>
                    {openDropdown === 'saleOrLease-mobile' && (
                      <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg z-50 min-w-[150px] w-full">
                        <button
                          onClick={() => {
                            handleFilterChange('saleOrLease', null)
                            setMobileFiltersOpen(false)
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                        >
                          Both
                        </button>
                        <button
                          onClick={() => {
                            handleFilterChange('saleOrLease', 'sale')
                            setMobileFiltersOpen(false)
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                        >
                          For Sale
                        </button>
                        <button
                          onClick={() => {
                            handleFilterChange('saleOrLease', 'lease')
                            setMobileFiltersOpen(false)
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                        >
                          For Lease
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Cap Rate */}
                  <div className="relative" ref={(el) => { dropdownRefs.current['capRate-mobile'] = el }}>
                    <button 
                      onClick={() => setOpenDropdown(openDropdown === 'capRate-mobile' ? null : 'capRate-mobile')}
                      className="flex items-center justify-between gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded text-sm font-semibold transition-colors w-full"
                    >
                      <span className="truncate">{getFilterLabel('minCapRate')}</span>
                      <ChevronDown size={14} className="opacity-70 flex-shrink-0" />
                    </button>
                    {openDropdown === 'capRate-mobile' && (
                      <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg z-50 min-w-[150px] w-full">
                        <button
                          onClick={() => {
                            setFilters(prev => ({ ...prev, minCapRate: null, maxCapRate: null }))
                            setOpenDropdown(null)
                            setMobileFiltersOpen(false)
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
                              setMobileFiltersOpen(false)
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Square Footage */}
                  <div className="relative" ref={(el) => { dropdownRefs.current['squareFootage-mobile'] = el }}>
                    <button 
                      onClick={() => setOpenDropdown(openDropdown === 'squareFootage-mobile' ? null : 'squareFootage-mobile')}
                      className="flex items-center justify-between gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded text-sm font-semibold transition-colors w-full"
                    >
                      <span className="truncate">{getFilterLabel('minSquareFootage')}</span>
                      <ChevronDown size={14} className="opacity-70 flex-shrink-0" />
                    </button>
                    {openDropdown === 'squareFootage-mobile' && (
                      <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg z-50 min-w-[200px] w-full">
                        <button
                          onClick={() => {
                            setFilters(prev => ({ ...prev, minSquareFootage: null, maxSquareFootage: null }))
                            setOpenDropdown(null)
                            setMobileFiltersOpen(false)
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                        >
                          Any Size
                        </button>
                        {squareFootageRanges.map((range, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setFilters(prev => ({ ...prev, minSquareFootage: range.min, maxSquareFootage: range.max }))
                              setOpenDropdown(null)
                              setMobileFiltersOpen(false)
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
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
          
          <div className={`flex flex-col ${hideMap ? '' : 'lg:flex-row'} gap-6 items-start`}>
            
            {/* Left Column: Property Grid (2 cards per row when map shown, 4 when map hidden) */}
            <div className={`w-full ${hideMap ? '' : 'lg:w-1/2'} flex flex-col`}>
              <div className={`grid grid-cols-1 ${hideMap ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2'} gap-6`}>
                {loading ? (
                  <div className={`col-span-full text-center py-8 text-stone-600`}>Loading properties...</div>
                ) : error ? (
                  <div className={`col-span-full text-center py-8 text-red-600`}>{error}</div>
                ) : properties.length === 0 ? (
                  <div className={`col-span-full text-center py-8 text-stone-600`}>
                    {savedPropertiesMode ? 'No saved properties found' : 'No properties found'}
                  </div>
                ) : (
                  properties.map((prop) => (
                    <PropertyCard key={prop.id} property={prop} variant="vertical" />
                  ))
                )}
              </div>
              
              {/* Pagination Controls */}
              {!error && totalCount > ITEMS_PER_PAGE && (() => {
                const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
                return (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={loading || currentPage === 1}
                      className="px-4 py-2 rounded border border-stone-300 bg-white hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {/* First page */}
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={loading}
                        className={`px-3 py-2 rounded text-sm font-medium ${
                          currentPage === 1
                            ? 'bg-[#A8B2AD] text-white'
                            : 'bg-white border border-stone-300 hover:bg-stone-50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        1
                      </button>
                      
                      {/* Ellipsis after first page if needed */}
                      {currentPage > 3 && totalPages > 5 && (
                        <span className="px-2 py-2 text-stone-400 text-sm">...</span>
                      )}
                      
                      {/* Middle pages */}
                      {Array.from({ length: Math.min(3, totalPages - 2) }, (_, i) => {
                        let pageNum: number
                        
                        if (totalPages <= 5) {
                          pageNum = i + 2
                          if (pageNum >= totalPages) return null
                        } else if (currentPage <= 3) {
                          pageNum = i + 2
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 3 + i
                        } else {
                          pageNum = currentPage - 1 + i
                        }
                        
                        // Don't render if it's the first or last page (handled separately)
                        if (pageNum <= 1 || pageNum >= totalPages) return null
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            disabled={loading}
                            className={`px-3 py-2 rounded text-sm font-medium ${
                              currentPage === pageNum
                                ? 'bg-[#A8B2AD] text-white'
                                : 'bg-white border border-stone-300 hover:bg-stone-50'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                      
                      {/* Ellipsis before last page if needed */}
                      {currentPage < totalPages - 2 && totalPages > 5 && (
                        <span className="px-2 py-2 text-stone-400 text-sm">...</span>
                      )}
                      
                      {/* Last page (only if more than 1 page) */}
                      {totalPages > 1 && (
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={loading}
                          className={`px-3 py-2 rounded text-sm font-medium ${
                            currentPage === totalPages
                              ? 'bg-[#A8B2AD] text-white'
                              : 'bg-white border border-stone-300 hover:bg-stone-50'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {totalPages}
                        </button>
                      )}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={loading || currentPage >= totalPages}
                      className="px-4 py-2 rounded border border-stone-300 bg-white hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      Next
                    </button>
                  </div>
                )
              })()}
            </div>

            {/* Right Column: Map */}
            {!hideMap && (
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
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

