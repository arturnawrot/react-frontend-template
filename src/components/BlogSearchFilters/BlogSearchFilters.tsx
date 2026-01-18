'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { BlogCategory, User } from '@/payload-types'

export interface BlogFilters {
  search: string
  categories: string[]
  types: string[]
  year: string | null
  author: string | null
}

export interface BlogSearchFiltersProps {
  // Quick filter categories from Payload
  displayedCategories?: BlogCategory[]
  // All categories for dropdown
  allCategories?: BlogCategory[]
  // Authors for dropdown
  authors?: User[]
  // Available years
  years?: number[]
  // Show type filter buttons
  showTypeFilters?: boolean
  // Current filters
  filters: BlogFilters
  // Callback when filters change
  onFiltersChange: (filters: BlogFilters) => void
  // Redirect to all content page (for BlogHighlights)
  redirectOnFilter?: boolean
  // Compact mode for mobile
  compact?: boolean
}

// Type filter options
const typeFilters = [
  { label: 'Blog & Articles', value: 'article' },
  { label: 'Market Reports', value: 'market-report' },
  { label: 'Investment Spotlights', value: 'investment-spotlight' },
  { label: 'Client Stories', value: 'client-stories' },
]

export default function BlogSearchFilters({
  displayedCategories = [],
  allCategories = [],
  authors = [],
  years = [],
  showTypeFilters = true,
  filters,
  onFiltersChange,
  redirectOnFilter = false,
  compact = false,
}: BlogSearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filtersDropdownOpen, setFiltersDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFiltersDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Build URL with filters and redirect
  const redirectWithFilters = (newFilters: BlogFilters) => {
    const params = new URLSearchParams()
    if (newFilters.search) params.set('search', newFilters.search)
    if (newFilters.categories.length > 0) params.set('categories', newFilters.categories.join(','))
    if (newFilters.types.length > 0) params.set('types', newFilters.types.join(','))
    if (newFilters.year) params.set('year', newFilters.year)
    if (newFilters.author) params.set('author', newFilters.author)
    
    const queryString = params.toString()
    router.push(`/blog/all${queryString ? `?${queryString}` : ''}`)
  }

  // Handle filter changes
  const handleFilterChange = (newFilters: BlogFilters) => {
    if (redirectOnFilter) {
      redirectWithFilters(newFilters)
    } else {
      onFiltersChange(newFilters)
    }
  }

  // Toggle category filter
  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId]
    handleFilterChange({ ...filters, categories: newCategories })
  }

  // Toggle type filter
  const toggleType = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type]
    handleFilterChange({ ...filters, types: newTypes })
  }

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange({ ...filters, search: e.target.value })
  }

  // Handle year change
  const handleYearChange = (year: string | null) => {
    handleFilterChange({ ...filters, year })
    setFiltersDropdownOpen(false)
  }

  // Handle author change
  const handleAuthorChange = (authorId: string | null) => {
    handleFilterChange({ ...filters, author: authorId })
    setFiltersDropdownOpen(false)
  }

  // Clear all filters
  const clearAllFilters = () => {
    handleFilterChange({
      search: '',
      categories: [],
      types: [],
      year: null,
      author: null,
    })
  }

  // Check if any filters are active
  const hasActiveFilters =
    filters.search ||
    filters.categories.length > 0 ||
    filters.types.length > 0 ||
    filters.year ||
    filters.author

  // Count active dropdown filters
  const activeDropdownFilters =
    (filters.year ? 1 : 0) +
    (filters.author ? 1 : 0) +
    filters.categories.filter((c) => !displayedCategories.find((dc) => dc.id === c)).length

  return (
    <div className="w-full">
      {/* Search and Filters Row */}
      <div className={`flex flex-col ${compact ? 'gap-3' : 'sm:flex-row gap-4'} items-stretch sm:items-center`}>
        {/* Search Input */}
        <div className="relative flex-shrink-0 w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search"
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2e2a]/20 focus:border-[#1a2e2a] transition-colors"
          />
        </div>

        {/* Type Filters - Desktop */}
        {showTypeFilters && !compact && (
          <div className="hidden md:flex gap-2 flex-wrap">
            {typeFilters.map((type) => (
              <button
                key={type.value}
                onClick={() => toggleType(type.value)}
                className={`px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors whitespace-nowrap ${
                  filters.types.includes(type.value)
                    ? 'bg-[#1a2e2a] text-white border-[#1a2e2a]'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        )}

        {/* Filters Dropdown */}
        <div className="relative ml-auto" ref={dropdownRef}>
          <button
            onClick={() => setFiltersDropdownOpen(!filtersDropdownOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
              activeDropdownFilters > 0
                ? 'bg-[#1a2e2a] text-white border-[#1a2e2a]'
                : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
            }`}
          >
            Filters
            {activeDropdownFilters > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-white text-[#1a2e2a] rounded-full">
                {activeDropdownFilters}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${filtersDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {filtersDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-stone-200 z-50 overflow-hidden">
              <div className="p-4 space-y-4">
                {/* Categories */}
                {allCategories.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                      Categories
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {allCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => toggleCategory(category.id)}
                          className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                            filters.categories.includes(category.id)
                              ? 'bg-[#1a2e2a] text-white'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Year Filter */}
                {years.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                      Year
                    </label>
                    <select
                      value={filters.year || ''}
                      onChange={(e) => handleYearChange(e.target.value || null)}
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2e2a]/20"
                    >
                      <option value="">All Years</option>
                      {years.map((year) => (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Author Filter */}
                {authors.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                      Author
                    </label>
                    <select
                      value={filters.author || ''}
                      onChange={(e) => handleAuthorChange(e.target.value || null)}
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2e2a]/20"
                    >
                      <option value="">All Authors</option>
                      {authors.map((author) => (
                        <option key={author.id} value={author.id}>
                          {author.email?.split('@')[0] || author.email}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Type Filters (for mobile/compact) */}
                {(compact || showTypeFilters) && (
                  <div className="md:hidden">
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                      Content Type
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {typeFilters.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => toggleType(type.value)}
                          className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                            filters.types.includes(type.value)
                              ? 'bg-[#1a2e2a] text-white'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="w-full py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Category Filters - Below search (Desktop only) */}
      {displayedCategories.length > 0 && !compact && (
        <div className="hidden md:flex gap-2 mt-4 flex-wrap">
          {displayedCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                filters.categories.includes(category.id)
                  ? 'bg-[#1a2e2a] text-white border-[#1a2e2a]'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Active Filters Pills */}
      {hasActiveFilters && (
        <div className="flex gap-2 mt-4 flex-wrap">
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 text-stone-700 text-xs rounded-full">
              Search: {filters.search}
              <button
                onClick={() => handleFilterChange({ ...filters, search: '' })}
                className="hover:text-stone-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.types.map((type) => {
            const typeLabel = typeFilters.find((t) => t.value === type)?.label || type
            return (
              <span
                key={type}
                className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 text-stone-700 text-xs rounded-full"
              >
                {typeLabel}
                <button onClick={() => toggleType(type)} className="hover:text-stone-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )
          })}
          {filters.categories.map((catId) => {
            const category = allCategories.find((c) => c.id === catId) || displayedCategories.find((c) => c.id === catId)
            if (!category) return null
            return (
              <span
                key={catId}
                className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 text-stone-700 text-xs rounded-full"
              >
                {category.name}
                <button onClick={() => toggleCategory(catId)} className="hover:text-stone-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )
          })}
          {filters.year && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 text-stone-700 text-xs rounded-full">
              Year: {filters.year}
              <button
                onClick={() => handleFilterChange({ ...filters, year: null })}
                className="hover:text-stone-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.author && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 text-stone-700 text-xs rounded-full">
              Author: {authors.find((a) => a.id === filters.author)?.email?.split('@')[0] || 'Unknown'}
              <button
                onClick={() => handleFilterChange({ ...filters, author: null })}
                className="hover:text-stone-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// Export filters type
export type { BlogFilters as BlogFiltersType }
