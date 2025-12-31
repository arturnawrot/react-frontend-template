'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { BuildoutProperty } from '@/utils/buildout-api'

const DEFAULT_ITEMS_PER_PAGE = 5

export interface UsePropertySelectorOptions {
  brokerId: number | null // null means show all properties
  itemsPerPage?: number
  selectedPropertyIds: number[]
  onSelectionChange: (propertyIds: number[]) => void
  maxSelected?: number
}

export interface UsePropertySelectorReturn {
  properties: BuildoutProperty[]
  totalCount: number
  currentPage: number
  totalPages: number
  loading: boolean
  error: string | null
  saving: boolean
  selectedPropertyIds: number[]
  setCurrentPage: (page: number) => void
  toggleSelection: (propertyId: number) => void
  isSelected: (propertyId: number) => boolean
  formatPrice: (price: number | null) => string
  formatAddress: (property: BuildoutProperty) => string
  getPropertyImage: (property: BuildoutProperty) => string
}

export function usePropertySelector({
  brokerId,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  selectedPropertyIds,
  onSelectionChange,
  maxSelected = 4,
}: UsePropertySelectorOptions): UsePropertySelectorReturn {
  const [properties, setProperties] = useState<BuildoutProperty[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<boolean>(false)
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Reset to page 1 when brokerId changes
  useEffect(() => {
    setCurrentPage(1)
  }, [brokerId])

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      setError(null)

      try {
        const offset = (currentPage - 1) * itemsPerPage
        
        // Use search-properties endpoint which supports pagination
        const params = new URLSearchParams({
          limit: itemsPerPage.toString(),
          offset: offset.toString(),
        })
        
        // Add brokerId filter if provided (null means show all)
        if (brokerId !== null) {
          params.append('brokerId', brokerId.toString())
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

        setProperties(data.properties || [])
        setTotalCount(data.count || 0)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch properties'
        setError(errorMessage)
        console.error('Error fetching properties:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [brokerId, currentPage, itemsPerPage])

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  const formatPrice = useCallback((price: number | null): string => {
    if (!price) return 'Price on Request'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }, [])

  const formatAddress = useCallback((property: BuildoutProperty): string => {
    const parts = [property.address, property.city, property.state, property.zip]
    return parts.filter(Boolean).join(', ')
  }, [])

  const getPropertyImage = useCallback((property: BuildoutProperty): string => {
    if (property.photos && property.photos.length > 0) {
      return property.photos[0].formats?.large || property.photos[0].url || ''
    }
    return ''
  }, [])

  const isSelected = useCallback((propertyId: number): boolean => {
    return selectedPropertyIds.includes(propertyId)
  }, [selectedPropertyIds])

  const toggleSelection = useCallback((propertyId: number) => {
    if (saving) return

    const currentlySelected = isSelected(propertyId)
    let newSelectedIds: number[]

    if (currentlySelected) {
      // Remove from selection
      newSelectedIds = selectedPropertyIds.filter((id) => id !== propertyId)
    } else {
      // Add to selection (check max limit)
      if (selectedPropertyIds.length >= maxSelected) {
        // Clear any existing timeout
        if (errorTimeoutRef.current) {
          clearTimeout(errorTimeoutRef.current)
        }
        setError(`Maximum ${maxSelected} properties allowed. Please uncheck another property first.`)
        errorTimeoutRef.current = setTimeout(() => setError(null), 4000)
        return
      }
      newSelectedIds = [...selectedPropertyIds, propertyId]
    }

    setSaving(true)
    
    // Clear any existing error timeout
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current)
      errorTimeoutRef.current = null
    }
    setError(null)

    try {
      onSelectionChange(newSelectedIds)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update selection'
      setError(errorMessage)
      console.error('Error updating selection:', err)
      errorTimeoutRef.current = setTimeout(() => setError(null), 4000)
    } finally {
      setSaving(false)
    }
  }, [saving, isSelected, selectedPropertyIds, maxSelected, onSelectionChange])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
      }
    }
  }, [])

  return {
    properties,
    totalCount,
    currentPage,
    totalPages,
    loading,
    error,
    saving,
    selectedPropertyIds,
    setCurrentPage,
    toggleSelection,
    isSelected,
    formatPrice,
    formatAddress,
    getPropertyImage,
  }
}

