'use client'

import React, { useState, useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

const AgentIconsSetSelector: TextFieldClientComponent = (props) => {
  const { path } = props
  const { value, setValue } = useField<string>({ path })
  
  const [sets, setSets] = useState<Array<{ name: string; agents?: any[] | string[] }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSets = async () => {
      try {
        // Fetch global via REST API (client components can't use Local API)
        const response = await fetch('/api/globals/agentIconsSets', {
          credentials: 'include', // Include cookies for authentication
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch agent icons sets: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        
        // Payload REST API returns { result: { ...globalData } }
        const global = data?.result || data
        
        // Sets is now an array field, agents is a relationship field
        if (global?.sets && Array.isArray(global.sets)) {
          const setsData = global.sets.map((set: any) => {
            // Extract agent count from relationship field (could be objects or IDs)
            const agents = set.agents || []
            const agentCount = Array.isArray(agents) ? agents.length : 0
            return {
              name: set.name,
              agents,
              agentCount // For display purposes
            }
          })
          setSets(setsData)
        }
      } catch (error) {
        console.error('Error fetching agent icons sets:', error)
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
        <option value="">None (use manual selection)</option>
        {sets.map((set, index) => (
          <option key={index} value={set.name}>
            {set.name} ({(set as any).agentCount || 0} agents)
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
          No sets available. Create sets in the Agent Icons Sets global.
        </p>
      )}
    </div>
  )
}

export default AgentIconsSetSelector
