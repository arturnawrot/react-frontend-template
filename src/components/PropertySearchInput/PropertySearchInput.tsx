'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown } from 'lucide-react'
import { buildFilterParams } from '@/utils/filter-params'
import LocationSearchSuggestion, { type AddressSuggestion } from '@/components/LocationSearchSuggestion/LocationSearchSuggestion'
import SectionHeading from '@/components/SectionHeading/SectionHeading'
import { PropertyType, getPropertyTypeLabel } from '@/utils/property-types'

// Property types using enum
const propertyTypes = [
  { id: PropertyType.Office, label: getPropertyTypeLabel(PropertyType.Office) },
  { id: PropertyType.Retail, label: getPropertyTypeLabel(PropertyType.Retail) },
  { id: PropertyType.Industrial, label: getPropertyTypeLabel(PropertyType.Industrial) },
  { id: PropertyType.Land, label: getPropertyTypeLabel(PropertyType.Land) },
  { id: PropertyType.Multifamily, label: getPropertyTypeLabel(PropertyType.Multifamily) },
  { id: PropertyType.SpecialPurpose, label: getPropertyTypeLabel(PropertyType.SpecialPurpose) },
  { id: PropertyType.Hospitality, label: getPropertyTypeLabel(PropertyType.Hospitality) },
]

// Price ranges matching PropertySearchAdvanced
const priceRanges = [
  { min: null, max: 100000, label: 'Under $100k' },
  { min: 100000, max: 500000, label: '$100k - $500k' },
  { min: 500000, max: 1000000, label: '$500k - $1M' },
  { min: 1000000, max: 5000000, label: '$1M - $5M' },
  { min: 5000000, max: null, label: 'Over $5M' },
]

// Square footage ranges
const squareFootageRanges = [
  { min: null, max: 5000, label: 'Under 5,000 sq ft' },
  { min: 5000, max: 10000, label: '5,000 - 10,000 sq ft' },
  { min: 10000, max: 25000, label: '10,000 - 25,000 sq ft' },
  { min: 25000, max: 50000, label: '25,000 - 50,000 sq ft' },
  { min: 50000, max: null, label: 'Over 50,000 sq ft' },
]

type PriceRange = { min: number | null; max: number | null; label: string }
type SquareFootageRange = { min: number | null; max: number | null; label: string }

const STORAGE_KEYS = {
  location: 'propertySearch_location',
  propertyType: 'propertySearch_propertyType',
  priceRange: 'propertySearch_priceRange',
  squareFootage: 'propertySearch_squareFootage',
}

export default function PropertySearchInput() {
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [selectedPropertyType, setSelectedPropertyType] = useState<number | null>(null)
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange | null>(null)
  const [selectedSquareFootage, setSelectedSquareFootage] = useState<SquareFootageRange | null>(null)
  
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const isInitialized = useRef(false)

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined' || isInitialized.current) return

    try {
      const savedLocation = localStorage.getItem(STORAGE_KEYS.location)
      if (savedLocation) {
        setLocation(savedLocation)
      }

      const savedPropertyType = localStorage.getItem(STORAGE_KEYS.propertyType)
      if (savedPropertyType) {
        const propertyTypeId = parseInt(savedPropertyType, 10)
        if (!isNaN(propertyTypeId)) {
          setSelectedPropertyType(propertyTypeId)
        }
      }

      const savedPriceRange = localStorage.getItem(STORAGE_KEYS.priceRange)
      if (savedPriceRange) {
        try {
          const priceRange = JSON.parse(savedPriceRange) as PriceRange
          // Verify it matches one of our price ranges
          const isValid = priceRanges.some(
            range => range.min === priceRange.min && range.max === priceRange.max
          )
          if (isValid) {
            setSelectedPriceRange(priceRange)
          }
        } catch (_e) {
          // Invalid JSON, ignore
        }
      }

      const savedSquareFootage = localStorage.getItem(STORAGE_KEYS.squareFootage)
      if (savedSquareFootage) {
        try {
          const squareFootage = JSON.parse(savedSquareFootage) as SquareFootageRange
          // Verify it matches one of our square footage ranges
          const isValid = squareFootageRanges.some(
            range => range.min === squareFootage.min && range.max === squareFootage.max
          )
          if (isValid) {
            setSelectedSquareFootage(squareFootage)
          }
        } catch (_e) {
          // Invalid JSON, ignore
        }
      }

      isInitialized.current = true
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
  }, [])

  // Save to localStorage whenever values change
  useEffect(() => {
    if (typeof window === 'undefined' || !isInitialized.current) return

    try {
      if (location) {
        localStorage.setItem(STORAGE_KEYS.location, location)
      } else {
        localStorage.removeItem(STORAGE_KEYS.location)
      }
    } catch (error) {
      console.error('Error saving location to localStorage:', error)
    }
  }, [location])

  useEffect(() => {
    if (typeof window === 'undefined' || !isInitialized.current) return

    try {
      if (selectedPropertyType !== null) {
        localStorage.setItem(STORAGE_KEYS.propertyType, selectedPropertyType.toString())
      } else {
        localStorage.removeItem(STORAGE_KEYS.propertyType)
      }
    } catch (error) {
      console.error('Error saving propertyType to localStorage:', error)
    }
  }, [selectedPropertyType])

  useEffect(() => {
    if (typeof window === 'undefined' || !isInitialized.current) return

    try {
      if (selectedPriceRange) {
        localStorage.setItem(STORAGE_KEYS.priceRange, JSON.stringify(selectedPriceRange))
      } else {
        localStorage.removeItem(STORAGE_KEYS.priceRange)
      }
    } catch (error) {
      console.error('Error saving priceRange to localStorage:', error)
    }
  }, [selectedPriceRange])

  useEffect(() => {
    if (typeof window === 'undefined' || !isInitialized.current) return

    try {
      if (selectedSquareFootage) {
        localStorage.setItem(STORAGE_KEYS.squareFootage, JSON.stringify(selectedSquareFootage))
      } else {
        localStorage.removeItem(STORAGE_KEYS.squareFootage)
      }
    } catch (error) {
      console.error('Error saving squareFootage to localStorage:', error)
    }
  }, [selectedSquareFootage])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const dropdown = dropdownRefs.current[openDropdown]
        const target = event.target as Node
        if (dropdown && !dropdown.contains(target)) {
          setOpenDropdown(null)
        }
      }
    }

    // Use a slight delay to avoid closing immediately when opening
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdown])

  const handleSearch = (clearFilters = false) => {
    const params = buildFilterParams(
      {
        search: location.trim() || undefined,
        propertyType: clearFilters ? undefined : (selectedPropertyType || undefined),
        minPrice: clearFilters ? undefined : (selectedPriceRange?.min || undefined),
        maxPrice: clearFilters ? undefined : (selectedPriceRange?.max || undefined),
        minSquareFootage: clearFilters ? undefined : (selectedSquareFootage?.min || undefined),
        maxSquareFootage: clearFilters ? undefined : (selectedSquareFootage?.max || undefined),
      },
      { includeSearch: true, useSet: true } // useSet for URL navigation
    )
    
    const queryString = params.toString()
    router.push(`/property-search${queryString ? `?${queryString}` : ''}`)
  }

  const handleLocationSuggestionSelect = (suggestion: AddressSuggestion) => {
    // LocationSearchSuggestion handles redirect internally when propertySlug is available
    // Clear all other filters and set location for any side effects
    setSelectedPropertyType(null)
    setSelectedPriceRange(null)
    setSelectedSquareFootage(null)
    setLocation(suggestion.fullAddress)
  }

  const getPropertyTypeLabel = () => {
    if (!selectedPropertyType) return 'Select Property Type'
    const type = propertyTypes.find(t => t.id === selectedPropertyType)
    return type ? type.label : 'Select Property Type'
  }

  const getPriceRangeLabel = () => {
    if (!selectedPriceRange) return 'Select Price Range'
    return selectedPriceRange.label
  }

  const getSquareFootageLabel = () => {
    if (!selectedSquareFootage) return 'Select Square Footage'
    return selectedSquareFootage.label
  }

  return (
    <div className="relative w-full font-sans py-10">
      {/* Main Content Container */}
      <div className="relative max-w-[1200px] mx-auto px-4">
        
        {/* Beige Card */}
        <div className="bg-[#DCD7CC] rounded-[2.5rem] shadow-xl px-6 py-12 md:px-12 md:py-16 text-center">
            
          {/* Heading */}
          <SectionHeading align="center" className="mb-10 tracking-tight">
            Search Commercial Properties for Sale
          </SectionHeading>

          {/* Search Bar (Pill Shape) */}
          <div className="bg-white rounded-[2rem] p-2 shadow-sm flex flex-col lg:flex-row lg:items-center divide-y lg:divide-y-0 lg:divide-x divide-stone-200 max-w-5xl mx-auto">
              
              {/* Field 1: Location */}
              <div className="flex-grow px-4 md:px-6 py-3 text-left group cursor-text relative">
                  <LocationSearchSuggestion
                    value={location}
                    onChange={setLocation}
                    onSelect={handleLocationSuggestionSelect}
                    placeholder="Search by address, city, state, or zip"
                    label="Location"
                    className="relative"
                    inputClassName="truncate pr-2"
                  />
              </div>

              {/* Field 2: Property Type */}
              <div 
                className="relative flex-shrink-0 px-4 md:px-6 py-3 text-left lg:w-[200px]"
                ref={(el) => { dropdownRefs.current['propertyType'] = el }}
              >
                  <label className="block text-[10px] font-bold tracking-[0.15em] text-stone-500 uppercase mb-1">
                    Property Type
                  </label>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenDropdown(openDropdown === 'propertyType' ? null : 'propertyType')
                    }}
                    className="w-full flex items-center justify-between hover:bg-stone-50 transition-colors rounded p-1 -ml-1"
                  >
                      <span className={`text-xs md:text-sm truncate flex-1 text-left ${selectedPropertyType ? 'text-stone-700' : 'text-stone-400'}`}>
                        {getPropertyTypeLabel()}
                      </span>
                      <ChevronDown size={14} className="text-stone-400 flex-shrink-0 ml-1" />
                  </button>
                  {openDropdown === 'propertyType' && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg z-[100] min-w-[200px] max-h-[300px] overflow-y-auto border border-stone-200">
                      <button
                        onClick={() => {
                          setSelectedPropertyType(null)
                          setOpenDropdown(null)
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                      >
                        All Types
                      </button>
                      {propertyTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => {
                            setSelectedPropertyType(type.id)
                            setOpenDropdown(null)
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  )}
              </div>

              {/* Field 3: Price Range */}
              <div 
                className="relative flex-shrink-0 px-4 md:px-6 py-3 text-left lg:w-[180px]"
                ref={(el) => { dropdownRefs.current['priceRange'] = el }}
              >
                  <label className="block text-[10px] font-bold tracking-[0.15em] text-stone-500 uppercase mb-1">
                    Price Range
                  </label>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenDropdown(openDropdown === 'priceRange' ? null : 'priceRange')
                    }}
                    className="w-full flex items-center justify-between hover:bg-stone-50 transition-colors rounded p-1 -ml-1"
                  >
                      <span className={`text-xs md:text-sm truncate flex-1 text-left ${selectedPriceRange ? 'text-stone-700' : 'text-stone-400'}`}>
                        {getPriceRangeLabel()}
                      </span>
                      <ChevronDown size={14} className="text-stone-400 flex-shrink-0 ml-1" />
                  </button>
                  {openDropdown === 'priceRange' && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg z-[100] min-w-[180px] max-h-[300px] overflow-y-auto border border-stone-200">
                      <button
                        onClick={() => {
                          setSelectedPriceRange(null)
                          setOpenDropdown(null)
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                      >
                        Any Price
                      </button>
                      {priceRanges.map((range, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedPriceRange(range)
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

               {/* Field 4: Square Footage & Button */}
               <div className="flex-shrink-0 pl-4 md:pl-6 pr-2 py-2 text-left flex flex-col lg:flex-row lg:items-center justify-between lg:w-[320px]">
                  <div 
                    className="relative flex-grow"
                    ref={(el) => { dropdownRefs.current['squareFootage'] = el }}
                  >
                      <label className="block text-[10px] font-bold tracking-[0.15em] text-stone-500 uppercase mb-1">
                        Square Footage
                      </label>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenDropdown(openDropdown === 'squareFootage' ? null : 'squareFootage')
                        }}
                        className="w-full flex items-center justify-between lg:justify-start lg:gap-2 hover:bg-stone-50 transition-colors rounded p-1 -ml-1"
                      >
                          <span className={`text-xs md:text-sm truncate flex-1 text-left ${selectedSquareFootage ? 'text-stone-700' : 'text-stone-400'}`}>
                            {getSquareFootageLabel()}
                          </span>
                          <ChevronDown size={14} className="text-stone-400 flex-shrink-0 ml-1 lg:hidden" />
                      </button>
                      {openDropdown === 'squareFootage' && (
                        <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg z-[100] min-w-[200px] max-h-[300px] overflow-y-auto border border-stone-200">
                          <button
                            onClick={() => {
                              setSelectedSquareFootage(null)
                              setOpenDropdown(null)
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
                          >
                            Any Size
                          </button>
                          {squareFootageRanges.map((range, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setSelectedSquareFootage(range)
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
                  
                   {/* Search Button */}
                   <button 
                     onClick={() => handleSearch()}
                     className="mt-4 lg:mt-0 bg-[#CDDC39] hover:bg-[#c3d135] text-[#1C2B28] rounded-full px-6 py-3 lg:py-3.5 flex items-center justify-center gap-2 font-medium transition-transform active:scale-95 shadow-sm min-w-fit"
                   >
                      Search <Search size={18} strokeWidth={2.5} />
                  </button>
              </div>

          </div>
        </div>
      </div>
    </div>
  )
}

