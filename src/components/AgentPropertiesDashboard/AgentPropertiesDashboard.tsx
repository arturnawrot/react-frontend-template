'use client'

import React, { useState, useEffect } from 'react'
import { useDocumentInfo, useFormFields, useField } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'
import PropertySelector from '../PropertySelector/PropertySelector'

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

  const [brokerId, setBrokerId] = useState<number | null>(null)

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

  if (!brokerId) {
    return (
      <div style={{ padding: '20px', color: '#6b7280' }}>
        <p>No Buildout broker ID found for this agent. Please set the broker ID in the agent settings.</p>
      </div>
    )
  }

  return (
    <PropertySelector
      brokerId={brokerId}
      selectedPropertyIds={featuredPropertyIds}
      onSelectionChange={(newIds) => {
        console.log('[AgentPropertiesDashboard] onSelectionChange called:', newIds)
        setFeaturedValue(newIds)
      }}
      maxSelected={MAX_FEATURED}
      itemsPerPage={ITEMS_PER_PAGE}
      selectionLabel="Featured"
      title="Agent Properties"
      emptyMessage="No properties found for this agent."
    />
  )
}

export default AgentPropertiesDashboard

