'use client'

import React, { useState, useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

const FeaturedPropertySetSelector: TextFieldClientComponent = (props) => {
  const { path } = props
  const { value, setValue } = useField<string>({ path })
  
  const [sets, setSets] = useState<Array<{ name: string; propertyIds: number[] }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSets = async () => {
      try {
        // Fetch global via REST API (client components can't use Local API)
        // Payload REST API endpoint for globals: /api/globals/{slug}
        const response = await fetch('/api/globals/featuredPropertiesSets', {
          credentials: 'include', // Include cookies for authentication
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch featured properties sets: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        
        // Payload REST API returns { result: { ...globalData } }
        const global = data?.result || data
        
        // Sets is now an array field, propertyIds is a JSON field
        if (global?.sets && Array.isArray(global.sets)) {
          const setsData = global.sets.map((set: any) => {
            let propertyIds: number[] = []
            if (set.propertyIds) {
              if (Array.isArray(set.propertyIds)) {
                propertyIds = set.propertyIds.filter((id: any): id is number => typeof id === 'number')
              } else if (typeof set.propertyIds === 'string') {
                try {
                  const parsed = JSON.parse(set.propertyIds)
                  if (Array.isArray(parsed)) {
                    propertyIds = parsed.filter((id: any): id is number => typeof id === 'number')
                  }
                } catch (e) {
                  console.error('Error parsing propertyIds JSON:', e)
                }
              }
            }
            return {
              name: set.name,
              propertyIds
            }
          })
          setSets(setsData)
        }
      } catch (error) {
        console.error('Error fetching featured properties sets:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSets()
  }, [])

  return (
    <div>
      <select
        value={value || ''}
        onChange={(e) => setValue(e.target.value || '')}
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '14px',
        }}
        disabled={loading}
      >
        <option value="">None</option>
        {sets.map((set, index) => (
          <option key={index} value={set.name}>
            {set.name} ({set.propertyIds?.length || 0} properties)
          </option>
        ))}
      </select>
      {loading && (
        <p style={{ marginTop: '8px', color: '#6b7280', fontSize: '12px' }}>
          Loading sets...
        </p>
      )}
      {!loading && sets.length === 0 && (
        <p style={{ marginTop: '8px', color: '#6b7280', fontSize: '12px' }}>
          No sets available. Create sets in the Featured Properties Sets global.
        </p>
      )}
    </div>
  )
}

export default FeaturedPropertySetSelector

