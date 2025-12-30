'use client'

import React, { useState, useEffect } from 'react'
import type { BuildoutProperty } from '@/utils/buildout-api'

const ITEMS_PER_PAGE = 5
const MAX_SELECTED = 4

interface PropertySelectorProps {
  brokerId: number | null
  selectedPropertyIds: number[]
  onSelectionChange: (propertyIds: number[]) => void
  maxSelected?: number
  itemsPerPage?: number
  showAllProperties?: boolean // If true, fetch all properties instead of broker-specific
}

export default function PropertySelector({
  brokerId,
  selectedPropertyIds,
  onSelectionChange,
  maxSelected = MAX_SELECTED,
  itemsPerPage = ITEMS_PER_PAGE,
  showAllProperties = false,
}: PropertySelectorProps) {
  const [properties, setProperties] = useState<BuildoutProperty[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<boolean>(false)
  const errorTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      if (!showAllProperties && !brokerId) return

      setLoading(true)
      setError(null)

      try {
        const offset = (currentPage - 1) * itemsPerPage
        
        let response: Response
        if (showAllProperties) {
          // Fetch all properties
          const params = new URLSearchParams({
            limit: itemsPerPage.toString(),
            offset: offset.toString(),
          })
          response = await fetch(`/api/buildout/all-properties?${params.toString()}`)
        } else {
          // Fetch broker-specific properties
          const params = new URLSearchParams({
            brokerId: brokerId!.toString(),
            limit: itemsPerPage.toString(),
            offset: offset.toString(),
          })
          response = await fetch(`/api/buildout/properties-by-broker-id?${params.toString()}`)
        }

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
  }, [brokerId, currentPage, itemsPerPage, showAllProperties])

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  const formatPrice = (price: number | null): string => {
    if (!price) return 'Price on Request'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatAddress = (property: BuildoutProperty): string => {
    const parts = [property.address, property.city, property.state, property.zip]
    return parts.filter(Boolean).join(', ')
  }

  const getPropertyImage = (property: BuildoutProperty): string => {
    if (property.photos && property.photos.length > 0) {
      return property.photos[0].formats?.large || property.photos[0].url || ''
    }
    return ''
  }

  const isSelected = (propertyId: number): boolean => {
    return selectedPropertyIds.includes(propertyId)
  }

  const toggleSelection = (propertyId: number) => {
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
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
      }
    }
  }, [])

  if (!showAllProperties && !brokerId) {
    return (
      <div style={{ padding: '20px', color: '#6b7280' }}>
        <p>No broker ID available. Please set the broker ID first.</p>
      </div>
    )
  }

  if (error && !loading) {
    return (
      <div style={{ padding: '20px', color: '#dc2626' }}>
        <p><strong>Error:</strong> {error}</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
          Showing {properties.length} of {totalCount} properties
        </p>
        <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: error ? '8px' : '0' }}>
          {selectedPropertyIds.length} of {maxSelected} properties selected
          {selectedPropertyIds.length >= maxSelected && (
            <span style={{ color: '#dc2626', marginLeft: '8px', fontWeight: '500' }}>
              (Maximum reached)
            </span>
          )}
        </p>
        {error && (
          <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
            {error}
          </p>
        )}
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
          Loading properties...
        </div>
      ) : properties.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
          No properties found.
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
            {properties.map((property) => {
              const imageUrl = getPropertyImage(property)
              const address = formatAddress(property)
              const price = property.sale_price_dollars
                ? formatPrice(property.sale_price_dollars)
                : property.lease_listing_published
                ? 'Lease Available'
                : 'Price on Request'
              const selected = isSelected(property.id)

              return (
                <div
                  key={property.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    display: 'flex',
                    backgroundColor: '#ffffff',
                  }}
                >
                  {imageUrl && (
                    <div
                      style={{
                        width: '200px',
                        height: '150px',
                        flexShrink: 0,
                        backgroundColor: '#f3f4f6',
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt={property.name || address}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  )}
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                          {property.name || address}
                        </h3>
                        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                          {address}
                        </p>
                      </div>
                      <div style={{ marginLeft: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            opacity: saving ? 0.6 : 1,
                            fontSize: '13px',
                            fontWeight: '500',
                            color: selected ? '#2563eb' : '#6b7280',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleSelection(property.id)}
                            disabled={saving || (!selected && selectedPropertyIds.length >= maxSelected)}
                            style={{
                              width: '18px',
                              height: '18px',
                              cursor: saving ? 'not-allowed' : 'pointer',
                              accentColor: '#2563eb',
                            }}
                          />
                          <span>Select</span>
                        </label>
                        {selected && (
                          <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: '600' }}>
                            ✓ Selected
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '14px' }}>
                      {price && (
                        <span style={{ fontWeight: '500' }}>{price}</span>
                      )}
                      {property.building_size_sf && (
                        <span style={{ color: '#6b7280' }}>
                          {property.building_size_sf.toLocaleString()} SF
                        </span>
                      )}
                      {property.property_type_label_override && (
                        <span style={{ color: '#6b7280' }}>
                          {property.property_type_label_override}
                        </span>
                      )}
                    </div>
                    {property.sale_listing_url && (
                      <a
                        href={property.sale_listing_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-block',
                          marginTop: '12px',
                          color: '#2563eb',
                          textDecoration: 'none',
                          fontSize: '14px',
                        }}
                      >
                        View Listing →
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '16px',
                borderTop: '1px solid #e5e7eb',
              }}
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || loading}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: currentPage === 1 || loading ? '#f3f4f6' : '#ffffff',
                  color: currentPage === 1 || loading ? '#9ca3af' : '#374151',
                  cursor: currentPage === 1 || loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                }}
              >
                Previous
              </button>

              <span style={{ color: '#6b7280', fontSize: '14px' }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || loading}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: currentPage === totalPages || loading ? '#f3f4f6' : '#ffffff',
                  color: currentPage === totalPages || loading ? '#9ca3af' : '#374151',
                  cursor: currentPage === totalPages || loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

