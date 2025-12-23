'use client'

import React, { useState, useEffect } from 'react'
import { useDocumentInfo, useFormFields, useField } from '@payloadcms/ui'
import type { BuildoutProperty } from '@/utils/buildout-api'
import type { UIFieldClientComponent } from 'payload'

const ITEMS_PER_PAGE = 5
const MAX_FEATURED = 4

const AgentPropertiesDashboard: UIFieldClientComponent = () => {
  const { id } = useDocumentInfo()
  
  // Get broker ID from the form fields
  const brokerIdValue = useFormFields(([fields]) => {
    const brokerIdField = fields['buildout_broker_id']
    return brokerIdField?.value as string | undefined
  })

  // Get featured property IDs field with setValue function
  // Using JSON field to avoid Payload array serialization issues
  const { value: featuredFieldValue, setValue: setFeaturedValue } = useField<number[]>({
    path: 'featuredPropertyIds',
  })

  // Log when featuredFieldValue changes (from backend/initial load)
  useEffect(() => {
    console.log('[AgentPropertiesDashboard] featuredFieldValue changed:', {
      rawValue: featuredFieldValue,
      type: typeof featuredFieldValue,
      isArray: Array.isArray(featuredFieldValue),
      length: Array.isArray(featuredFieldValue) ? featuredFieldValue.length : 0,
      timestamp: new Date().toISOString(),
    })
    
    // If value is corrupted (number instead of array), try to fix it
    if (typeof featuredFieldValue === 'number' && featuredFieldValue > 0) {
      console.error('[AgentPropertiesDashboard] CRITICAL: featuredFieldValue is corrupted (number instead of array)! Value:', featuredFieldValue)
      console.error('[AgentPropertiesDashboard] This should not happen with JSON field. Resetting to empty array.')
      // Reset to empty array to prevent further corruption
      setTimeout(() => {
        console.log('[AgentPropertiesDashboard] Resetting corrupted value to empty array')
        setFeaturedValue([])
      }, 100)
    }
  }, [featuredFieldValue, setFeaturedValue])

  // Extract featured property IDs array
  const featuredPropertyIds = React.useMemo(() => {
    console.log('[AgentPropertiesDashboard] Computing featuredPropertyIds from:', featuredFieldValue)
    
    // Handle case where value might be corrupted (number instead of array)
    if (typeof featuredFieldValue === 'number') {
      console.warn('[AgentPropertiesDashboard] featuredFieldValue is a number instead of array! This indicates a save/load issue. Value:', featuredFieldValue)
      return [] as number[]
    }
    
    // JSON field stores array directly, not array of objects
    if (featuredFieldValue && Array.isArray(featuredFieldValue)) {
      // Filter to ensure all items are numbers
      const extracted = featuredFieldValue.filter((id: any) => typeof id === 'number') as number[]
      console.log('[AgentPropertiesDashboard] Extracted featuredPropertyIds:', extracted)
      return extracted
    }
    
    console.log('[AgentPropertiesDashboard] No featuredFieldValue or not array, returning empty array')
    return [] as number[]
  }, [featuredFieldValue])

  const [properties, setProperties] = useState<BuildoutProperty[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [brokerId, setBrokerId] = useState<number | null>(null)
  const [saving, setSaving] = useState<boolean>(false)
  const errorTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Extract broker ID from form field
  useEffect(() => {
    console.log('[AgentPropertiesDashboard] Component mounted/updated:', {
      agentId: id,
      brokerIdValue,
      featuredPropertyIds,
      featuredFieldValue,
      timestamp: new Date().toISOString(),
    })
    
    if (brokerIdValue) {
      const brokerIdNum = parseInt(String(brokerIdValue), 10)
      if (!isNaN(brokerIdNum)) {
        setBrokerId(brokerIdNum)
      } else {
        setBrokerId(null)
      }
    } else {
      setBrokerId(null)
    }
  }, [brokerIdValue, id])

  // Fetch properties when broker ID is available
  useEffect(() => {
    const fetchProperties = async () => {
      if (!brokerId) return

      setLoading(true)
      setError(null)

      try {
        const offset = (currentPage - 1) * ITEMS_PER_PAGE
        const params = new URLSearchParams({
          brokerId: brokerId.toString(),
          limit: ITEMS_PER_PAGE.toString(),
          offset: offset.toString(),
        })

        const response = await fetch(`/api/buildout/properties-by-broker-id?${params.toString()}`)

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
  }, [brokerId, currentPage])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

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

  const isFeatured = (propertyId: number): boolean => {
    const result = featuredPropertyIds.includes(propertyId)
    console.log('[AgentPropertiesDashboard] isFeatured check:', {
      propertyId,
      featuredPropertyIds,
      result,
    })
    return result
  }

  const toggleFeatured = async (propertyId: number) => {
    console.log('[AgentPropertiesDashboard] toggleFeatured called:', {
      propertyId,
      agentId: id,
      currentFeaturedIds: featuredPropertyIds,
      currentFeaturedFieldValue: featuredFieldValue,
      timestamp: new Date().toISOString(),
    })

    if (!id) {
      console.warn('[AgentPropertiesDashboard] No agent ID, cannot toggle featured')
      return
    }

    const currentlyFeatured = isFeatured(propertyId)
    console.log('[AgentPropertiesDashboard] Currently featured?', currentlyFeatured)
    
    let newFeaturedIds: number[]

    if (currentlyFeatured) {
      // Remove from featured
      newFeaturedIds = featuredPropertyIds.filter((id) => id !== propertyId)
      console.log('[AgentPropertiesDashboard] Removing from featured, new array:', newFeaturedIds)
    } else {
      // Add to featured (check max limit)
      if (featuredPropertyIds.length >= MAX_FEATURED) {
        console.warn('[AgentPropertiesDashboard] Max featured reached, cannot add more')
        // Clear any existing timeout
        if (errorTimeoutRef.current) {
          clearTimeout(errorTimeoutRef.current)
        }
        setError(`Maximum ${MAX_FEATURED} featured listings allowed. Please uncheck another property first.`)
        errorTimeoutRef.current = setTimeout(() => setError(null), 4000)
        return
      }
      newFeaturedIds = [...featuredPropertyIds, propertyId]
      console.log('[AgentPropertiesDashboard] Adding to featured, new array:', newFeaturedIds)
    }

    setSaving(true)
    
    // Clear any existing error timeout
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current)
      errorTimeoutRef.current = null
    }
    setError(null)

    try {
      // JSON field stores array of numbers directly (no object structure needed)
      console.log('[AgentPropertiesDashboard] Setting featuredArray value:', newFeaturedIds)
      console.log('[AgentPropertiesDashboard] Current featuredFieldValue before set:', featuredFieldValue)
      console.log('[AgentPropertiesDashboard] setFeaturedValue function:', typeof setFeaturedValue)
      
      // Update the form field value - JSON field stores array directly
      console.log('[AgentPropertiesDashboard] Calling setFeaturedValue with:', newFeaturedIds)
      setFeaturedValue(newFeaturedIds)
      console.log('[AgentPropertiesDashboard] setFeaturedValue called successfully')
      
      // Verify the value was set correctly by checking in next render
      // The value will be reflected in the next render via the useField hook
      // We'll see it in the useEffect that watches featuredFieldValue
      
      // Note: The form will auto-save when the user saves the document
      // For immediate save, we could call an API endpoint here if needed
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update featured properties'
      setError(errorMessage)
      console.error('[AgentPropertiesDashboard] Error updating featured properties:', err)
      errorTimeoutRef.current = setTimeout(() => setError(null), 4000)
    } finally {
      setSaving(false)
      console.log('[AgentPropertiesDashboard] toggleFeatured completed, saving:', false)
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

  if (!brokerId) {
    return (
      <div style={{ padding: '20px', color: '#6b7280' }}>
        <p>No Buildout broker ID found for this agent. Please set the broker ID in the agent settings.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: '#dc2626' }}>
        <p><strong>Error:</strong> {error}</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
          Agent Properties
        </h2>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
          Showing {properties.length} of {totalCount} properties
        </p>
        <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: error ? '8px' : '0' }}>
          {featuredPropertyIds.length} of {MAX_FEATURED} featured listings selected
          {featuredPropertyIds.length >= MAX_FEATURED && (
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
          No properties found for this agent.
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
            {properties.map((property) => {
              const imageUrl = getPropertyImage(property)
              const address = formatAddress(property)
              const price = property.sale_price_dollars || property.lease_listing_published ? 'Lease Available' : null
              const featured = isFeatured(property.id)
              
              console.log('[AgentPropertiesDashboard] Rendering property:', {
                propertyId: property.id,
                address,
                featured,
                featuredPropertyIds,
                featuredFieldValue,
              })

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
                            color: featured ? '#2563eb' : '#6b7280',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={featured}
                            onChange={() => {
                              console.log('[AgentPropertiesDashboard] Checkbox onChange triggered for property:', property.id)
                              toggleFeatured(property.id)
                            }}
                            disabled={saving || (!featured && featuredPropertyIds.length >= MAX_FEATURED)}
                            style={{
                              width: '18px',
                              height: '18px',
                              cursor: saving ? 'not-allowed' : 'pointer',
                              accentColor: '#2563eb',
                            }}
                          />
                          <span>Featured</span>
                        </label>
                        {featured && (
                          <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: '600' }}>
                            ✓ Featured
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

export default AgentPropertiesDashboard

