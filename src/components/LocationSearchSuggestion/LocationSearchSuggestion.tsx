'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { MapPin, Search } from 'lucide-react'

export interface AddressSuggestion {
  id: string
  mainText: string // Street number and name (e.g., "6316 San Juan Avenue")
  secondaryText: string // City, state, country (e.g., "Jacksonville, FL, USA")
  fullAddress: string // Complete address
  placeId?: string // Google Places ID if available
}

interface LocationSearchSuggestionProps {
  value: string
  onChange: (value: string) => void
  onSelect: (suggestion: AddressSuggestion) => void
  placeholder?: string
  className?: string
  inputClassName?: string
  label?: string
  showSearchIcon?: boolean // Show search icon on the left
  searchIconClassName?: string // Custom styling for search icon
  wrapperClassName?: string // Custom wrapper div className (for positioning icon)
}

export default function LocationSearchSuggestion({
  value,
  onChange,
  onSelect,
  placeholder = 'Search by address, city, state, or zip',
  className = '',
  inputClassName = '',
  label,
  showSearchIcon = false,
  searchIconClassName = '',
  wrapperClassName = '',
}: LocationSearchSuggestionProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isUserTypingRef = useRef<boolean>(false) // Track if change is from user input

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch suggestions from API
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/geocoding/autocomplete?query=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.suggestions) {
          setSuggestions(data.suggestions)
          setShowSuggestions(true)
        } else {
          setSuggestions([])
          setShowSuggestions(false)
        }
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSuggestions([])
      setShowSuggestions(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounce input changes - only fetch suggestions if user is typing
  useEffect(() => {
    // Skip if this change is not from user typing (e.g., from cookies, cache, programmatic)
    if (!isUserTypingRef.current) {
      return
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      if (value.trim()) {
        fetchSuggestions(value)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
      // Reset flag after processing
      isUserTypingRef.current = false
    }, 300) // 300ms debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [value, fetchSuggestions])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    // Mark as user typing
    isUserTypingRef.current = true
    onChange(newValue)
    setSelectedIndex(-1)
  }

  const handleInputFocus = () => {
    // Only show suggestions if they're already visible (from recent user typing)
    // Don't show suggestions if value was set programmatically (cookies, cache, etc.)
    if (showSuggestions && suggestions.length > 0) {
      // Keep suggestions visible if already showing
      return
    }
    // Don't fetch/show suggestions on focus if value was set programmatically
  }

  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    // Don't mark as user typing when selecting a suggestion
    isUserTypingRef.current = false
    onChange(suggestion.fullAddress)
    setShowSuggestions(false)
    setSelectedIndex(-1)
    onSelect(suggestion)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  // Parse address to extract street number (bold part) and rest
  const parseAddress = (address: string) => {
    // Match pattern like "6316" or "6316c" at the start
    const match = address.match(/^(\d+[a-z]?)\s+(.+)/i)
    if (match) {
      return {
        streetNumber: match[1],
        streetName: match[2],
      }
    }
    // If no match, return first word as number and rest as name
    const parts = address.split(' ')
    if (parts.length > 1) {
      return {
        streetNumber: parts[0],
        streetName: parts.slice(1).join(' '),
      }
    }
    return {
      streetNumber: '',
      streetName: address,
    }
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-[10px] font-bold tracking-[0.15em] text-stone-500 uppercase mb-1">
          {label}
        </label>
      )}
      <div className={`relative ${wrapperClassName}`}>
        {showSearchIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
            <Search className={searchIconClassName || 'text-stone-500 w-5 h-5'} size={18} />
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full text-stone-700 placeholder-stone-400 focus:outline-none bg-transparent text-sm md:text-base ${inputClassName} ${showSearchIcon && !inputClassName.includes('pl-') ? 'pl-10' : ''}`}
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-[9999] border border-stone-200 overflow-hidden">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-stone-500">Loading suggestions...</div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto">
              {suggestions.map((suggestion, index) => {
                const { streetNumber, streetName } = parseAddress(suggestion.mainText)
                const isSelected = index === selectedIndex

                return (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleSelectSuggestion(suggestion)
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-stone-50 transition-colors flex items-start gap-3 ${
                      isSelected ? 'bg-stone-50' : ''
                    }`}
                  >
                    <MapPin size={16} className="text-stone-700 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-stone-900 text-sm">
                        {streetNumber && (
                          <span className="font-semibold">{streetNumber} </span>
                        )}
                        <span>{streetName}</span>
                      </div>
                      <div className="text-stone-500 text-xs mt-0.5">
                        {suggestion.secondaryText}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

