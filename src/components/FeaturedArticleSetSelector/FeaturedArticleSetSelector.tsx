'use client'

import React, { useState, useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

const FeaturedArticleSetSelector: TextFieldClientComponent = (props) => {
  const { path } = props
  const { value, setValue } = useField<string>({ path })
  
  const [sets, setSets] = useState<Array<{ name: string; articles?: string[] | { id: string }[] }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSets = async () => {
      try {
        // Fetch global via REST API (client components can't use Local API)
        // Payload REST API endpoint for globals: /api/globals/{slug}
        const response = await fetch('/api/globals/featuredArticles', {
          credentials: 'include', // Include cookies for authentication
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch featured articles sets: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        
        // Payload REST API returns { result: { ...globalData } }
        const global = data?.result || data
        
        // Sets is an array field, so it should be directly accessible
        if (global?.sets && Array.isArray(global.sets)) {
          setSets(global.sets)
        }
      } catch (error) {
        console.error('Error fetching featured articles sets:', error)
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
        {sets.map((set, index) => {
          const articleCount = Array.isArray(set.articles) ? set.articles.length : 0
          return (
            <option key={index} value={set.name}>
              {set.name} ({articleCount} article{articleCount !== 1 ? 's' : ''})
            </option>
          )
        })}
      </select>
      {loading && (
        <p style={{ marginTop: '8px', color: '#6b7280', fontSize: '12px' }}>
          Loading sets...
        </p>
      )}
      {!loading && sets.length === 0 && (
        <p style={{ marginTop: '8px', color: '#6b7280', fontSize: '12px' }}>
          No sets available. Create sets in the Featured Articles global.
        </p>
      )}
    </div>
  )
}

export default FeaturedArticleSetSelector







