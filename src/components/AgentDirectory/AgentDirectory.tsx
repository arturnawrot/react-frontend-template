'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import type { Page } from '@/payload-types'
import AgentCard from '../AgentCard/AgentCard'

type AgentDirectoryBlock = Extract<Page['blocks'][number], { blockType: 'agentDirectory' }>

interface Agent {
  id: string
  name: string
  role: string
  image?: string | null
  servingLocations: string[]
  serviceTags: string[]
  email?: string | null
  phone?: string | null
  linkedin?: string | null
  slug?: string
}

interface FilterOption {
  id: string
  name: string
}

interface AgentDirectoryProps {
  block: AgentDirectoryBlock
}

export default function AgentDirectory({ block }: AgentDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [specialties, setSpecialties] = useState<FilterOption[]>([])
  const [servingLocations, setServingLocations] = useState<FilterOption[]>([])
  const [showRegionDropdown, setShowRegionDropdown] = useState(false)
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false)
  
  // Ref for infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement>(null)
  // Ref to track current offset for infinite scroll
  const offsetRef = useRef(0)

  const itemsPerPage = block.itemsPerPage || 12
  const heading = block.heading || 'Agent Directory'

  // Check mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Fetch agents function
  const fetchAgents = useCallback(async (reset: boolean = false) => {
    if (reset) {
      setLoading(true)
      offsetRef.current = 0
    } else {
      setLoadingMore(true)
    }
    setError(null)

    try {
      const params = new URLSearchParams({
        limit: itemsPerPage.toString(),
        offset: offsetRef.current.toString(),
      })

      if (searchQuery) {
        params.append('search', searchQuery)
      }

      if (selectedSpecialty) {
        params.append('specialty', selectedSpecialty)
      }

      if (selectedRegion) {
        params.append('servingLocation', selectedRegion)
      }

      const response = await fetch(`/api/agents/search?${params.toString()}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch agents')
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch agents')
      }

      const newAgents = data.agents || []
      
      if (reset) {
        setAgents(newAgents)
      } else {
        setAgents(prev => [...prev, ...newAgents])
      }
      
      setTotalCount(data.count || 0)
      
      // Update offset for next fetch
      offsetRef.current += newAgents.length
      
      // Check if there are more agents to load
      setHasMore(offsetRef.current < (data.count || 0))
      
      // Update filter options if provided (they're included in every response)
      if (data.specialties) {
        setSpecialties(data.specialties)
      }
      if (data.servingLocations) {
        setServingLocations(data.servingLocations)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch agents'
      setError(errorMessage)
      console.error('Error fetching agents:', err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [searchQuery, selectedSpecialty, selectedRegion, itemsPerPage])

  // Load more function for infinite scroll
  const loadMore = useCallback(() => {
    if (!loadingMore && !loading && hasMore) {
      fetchAgents(false)
    }
  }, [loadingMore, loading, hasMore, fetchAgents])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      {
        rootMargin: '100px',
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [loadMore])

  // Debounced search effect - resets and fetches when search/filter values change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAgents(true) // Reset and fetch from beginning
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
    // Only depend on the actual filter/search values, not fetchAgents
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedSpecialty, selectedRegion])

  const selectedRegionName = selectedRegion 
    ? servingLocations.find(l => l.id === selectedRegion)?.name || 'Region'
    : 'Region'

  const selectedSpecialtyName = selectedSpecialty
    ? specialties.find(s => s.id === selectedSpecialty)?.name || 'Specialty'
    : 'Specialty'

  return (
    <div className="w-full py-12 md:py-16 px-4 md:px-8 bg-white">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-serif text-[#1C2B28] font-light">
            {heading}
          </h1>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border-none rounded bg-[#EBEBE8] text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#CDDC39] text-sm font-medium"
                placeholder="Q Search"
              />
            </div>

            {/* Region Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowRegionDropdown(!showRegionDropdown)
                  setShowSpecialtyDropdown(false)
                }}
                className="flex items-center justify-between gap-2 bg-[#EBEBE8] hover:bg-[#D4D4D1] text-gray-700 px-4 py-3 rounded text-sm font-semibold transition-colors min-w-[120px]"
              >
                {selectedRegionName}
                <ChevronDown size={14} className="opacity-70" />
              </button>
              {showRegionDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowRegionDropdown(false)}
                  />
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-20 min-w-[120px] max-h-60 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedRegion(null)
                        setShowRegionDropdown(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                    >
                      All Regions
                    </button>
                    {servingLocations.map((location) => (
                      <button
                        key={location.id}
                        onClick={() => {
                          setSelectedRegion(location.id)
                          setShowRegionDropdown(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                      >
                        {location.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Specialty Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowSpecialtyDropdown(!showSpecialtyDropdown)
                  setShowRegionDropdown(false)
                }}
                className="flex items-center justify-between gap-2 bg-[#EBEBE8] hover:bg-[#D4D4D1] text-gray-700 px-4 py-3 rounded text-sm font-semibold transition-colors min-w-[120px]"
              >
                {selectedSpecialtyName}
                <ChevronDown size={14} className="opacity-70" />
              </button>
              {showSpecialtyDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowSpecialtyDropdown(false)}
                  />
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-20 min-w-[120px] max-h-60 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedSpecialty(null)
                        setShowSpecialtyDropdown(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                    >
                      All Specialties
                    </button>
                    {specialties.map((specialty) => (
                      <button
                        key={specialty.id}
                        onClick={() => {
                          setSelectedSpecialty(specialty.id)
                          setShowSpecialtyDropdown(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                      >
                        {specialty.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading agents...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        {/* Agent Cards Grid */}
        {!loading && !error && (
          <>
            {agents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No agents found matching your criteria.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {agents.map((agent) => (
                    <AgentCard
                      key={agent.id}
                      name={agent.name}
                      role={agent.role}
                      image={agent.image}
                      variant={isMobile ? "horizontal" : "vertical"}
                      servingLocations={agent.servingLocations}
                      serviceTags={agent.serviceTags}
                      email={agent.email}
                      phone={agent.phone}
                      linkedin={agent.linkedin}
                      slug={agent.slug}
                    />
                  ))}
                </div>

                {/* Infinite scroll sentinel */}
                <div ref={sentinelRef} className="h-4" />
                
                {/* Loading more indicator */}
                {loadingMore && (
                  <div className="text-center py-6">
                    <p className="text-gray-600">Loading more agents...</p>
                  </div>
                )}

                {/* Results count */}
                <div className="text-center mt-6 text-sm text-gray-600">
                  Showing {agents.length} of {totalCount} agents
                  {!hasMore && agents.length > 0 && ' (all loaded)'}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
