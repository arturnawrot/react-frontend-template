'use client'

import React from 'react'
import { usePropertySelector } from '@/hooks/usePropertySelector'

const ITEMS_PER_PAGE = 5
const MAX_SELECTED = 4

interface PropertySelectorProps {
  brokerId: number | null // null means show all properties
  selectedPropertyIds: number[]
  onSelectionChange: (propertyIds: number[]) => void
  maxSelected?: number
  itemsPerPage?: number
  selectionLabel?: string // Custom label for the checkbox (default: "Select")
  title?: string // Optional title to display above the list
  emptyMessage?: string // Custom message when no properties found
}

export default function PropertySelector({
  brokerId,
  selectedPropertyIds,
  onSelectionChange,
  maxSelected = MAX_SELECTED,
  itemsPerPage = ITEMS_PER_PAGE,
  selectionLabel = 'Select',
  title,
  emptyMessage,
}: PropertySelectorProps) {
  const {
    properties,
    totalCount,
    currentPage,
    totalPages,
    loading,
    error,
    saving,
    setCurrentPage,
    toggleSelection,
    isSelected,
    formatPrice,
    formatAddress,
    getPropertyImage,
  } = usePropertySelector({
    brokerId,
    itemsPerPage,
    selectedPropertyIds,
    onSelectionChange,
    maxSelected,
  })

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
        {title && (
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
            {title}
          </h2>
        )}
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
          Showing {properties.length} of {totalCount} properties
        </p>
        <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: error ? '8px' : '0' }}>
          {selectedPropertyIds.length} of {maxSelected} {selectionLabel === 'Featured' ? 'featured listings' : 'properties'} selected
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
          {emptyMessage || 'No properties found.'}
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
                : null
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
                          <span>{selectionLabel}</span>
                        </label>
                        {selected && (
                          <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: '600' }}>
                            ✓ {selectionLabel === 'Featured' ? 'Featured' : 'Selected'}
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
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setCurrentPage(Math.max(1, currentPage - 1))
                }}
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
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }}
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

