'use client'

import React, { useState, useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

const TestimonialSetSelector: TextFieldClientComponent = (props) => {
  const { path } = props
  const { value, setValue } = useField<string>({ path })
  
  const [sets, setSets] = useState<Array<{ name: string; testimonials?: any[] }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSets = async () => {
      try {
        // Fetch global via REST API (client components can't use Local API)
        const response = await fetch('/api/globals/testimonialsSets', {
          credentials: 'include', // Include cookies for authentication
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch testimonials sets: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        
        // Payload REST API returns { result: { ...globalData } }
        const global = data?.result || data
        
        // Sets is now an array field, testimonials is an array field
        if (global?.sets && Array.isArray(global.sets)) {
          const setsData = global.sets.map((set: any) => {
            // Extract testimonial count from array field
            const testimonials = set.testimonials || []
            const testimonialCount = Array.isArray(testimonials) ? testimonials.length : 0
            return {
              name: set.name,
              testimonials,
              testimonialCount // For display purposes
            }
          })
          setSets(setsData)
        }
      } catch (error) {
        console.error('Error fetching testimonials sets:', error)
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
        <option value="">Select a testimonial set...</option>
        {sets.map((set, index) => (
          <option key={index} value={set.name}>
            {set.name} ({(set as any).testimonialCount || 0} testimonials)
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
          No sets available. Create sets in the Testimonials Sets global.
        </p>
      )}
    </div>
  )
}

export default TestimonialSetSelector
