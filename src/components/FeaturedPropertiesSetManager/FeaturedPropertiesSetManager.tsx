'use client'

import React, { useState, useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'
import PropertySelector from '../PropertySelector/PropertySelector'

const MAX_PROPERTIES_PER_SET = 4

interface FeaturedPropertiesSet {
  name: string
  propertyIds: number[]
}

const FeaturedPropertiesSetManager: UIFieldClientComponent = () => {
  const { value: setsValue, setValue: setSetsValue } = useField<FeaturedPropertiesSet[]>({
    path: 'sets',
  })

  const [currentSetIndex, setCurrentSetIndex] = useState<number | null>(null)

  // Initialize with empty array if needed
  const sets = Array.isArray(setsValue) ? setsValue : []

  const handleSetSelectionChange = (propertyIds: number[]) => {
    if (currentSetIndex === null) return

    const newSets = [...sets]
    newSets[currentSetIndex] = {
      ...newSets[currentSetIndex],
      propertyIds: propertyIds.slice(0, MAX_PROPERTIES_PER_SET), // Enforce max
    }
    setSetsValue(newSets)
  }

  // Initialize sets if empty and normalize propertyIds
  useEffect(() => {
    if (!Array.isArray(setsValue)) {
      setSetsValue([])
    } else {
      // Normalize sets to ensure all have propertyIds array
      const normalizedSets = setsValue.map((set) => ({
        ...set,
        propertyIds: Array.isArray(set.propertyIds) ? set.propertyIds : [],
      }))
      
      // Only update if normalization changed anything
      const needsUpdate = normalizedSets.some((set, index) => 
        !Array.isArray(setsValue[index]?.propertyIds)
      )
      
      if (needsUpdate) {
        setSetsValue(normalizedSets)
      }
    }
  }, [setsValue, setSetsValue])

  const addNewSet = () => {
    const newSet = {
      name: `Set ${sets.length + 1}`,
      propertyIds: [],
    }
    setSetsValue([...sets, newSet])
    setCurrentSetIndex(sets.length)
  }

  const removeSet = (index: number) => {
    const newSets = sets.filter((_, i) => i !== index)
    setSetsValue(newSets)
    if (currentSetIndex === index) {
      setCurrentSetIndex(null)
    } else if (currentSetIndex !== null && currentSetIndex > index) {
      setCurrentSetIndex(currentSetIndex - 1)
    }
  }

  const updateSetName = (index: number, name: string) => {
    const newSets = [...sets]
    newSets[index] = {
      ...newSets[index],
      name,
      propertyIds: newSets[index].propertyIds || [], // Ensure propertyIds is always an array
    }
    setSetsValue(newSets)
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
          Featured Properties Sets
        </h2>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
          Create and manage sets of featured properties (max {MAX_PROPERTIES_PER_SET} properties per set).
          Each set can be assigned to agents.
        </p>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {sets.map((set, index) => (
            <div
              key={index}
              style={{
                border: currentSetIndex === index ? '2px solid #2563eb' : '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px',
                backgroundColor: currentSetIndex === index ? '#eff6ff' : '#ffffff',
                cursor: 'pointer',
                minWidth: '150px',
              }}
              onClick={() => setCurrentSetIndex(index)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={set.name}
                  onChange={(e) => updateSetName(index, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '16px',
                    fontWeight: '600',
                    flex: 1,
                    outline: 'none',
                    padding: '4px',
                  }}
                  placeholder="Set name"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeSet(index)
                  }}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#dc2626',
                    cursor: 'pointer',
                    fontSize: '18px',
                    padding: '0 4px',
                  }}
                >
                  ×
                </button>
              </div>
              <p style={{ color: '#6b7280', fontSize: '12px' }}>
                {set.propertyIds?.length || 0} of {MAX_PROPERTIES_PER_SET} properties
              </p>
            </div>
          ))}

          <button
            onClick={addNewSet}
            style={{
              border: '2px dashed #d1d5db',
              borderRadius: '8px',
              padding: '12px 24px',
              backgroundColor: '#ffffff',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            + Add New Set
          </button>
        </div>
      </div>

      {currentSetIndex !== null && sets[currentSetIndex] && (
        <PropertySelector
          key={currentSetIndex}
          brokerId={null}
          selectedPropertyIds={sets[currentSetIndex].propertyIds || []}
          onSelectionChange={handleSetSelectionChange}
          maxSelected={MAX_PROPERTIES_PER_SET}
        />
      )}

      {currentSetIndex === null && sets.length > 0 && (
        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
          Select a set above to manage its properties
        </div>
      )}

      {sets.length === 0 && (
        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
          <p style={{ marginBottom: '16px' }}>No sets created yet.</p>
          <button
            onClick={addNewSet}
            style={{
              padding: '12px 24px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Create Your First Set
          </button>
        </div>
      )}
    </div>
  )
}

export default FeaturedPropertiesSetManager

