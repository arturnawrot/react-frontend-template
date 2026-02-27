'use client'

import React, { useState, useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

interface ConstantLinkEntry {
  key: string
  label: string
  url?: string
  linkType?: string
  page?: { slug?: string } | string | null
  customUrl?: string | null
  calLink?: string | null
}

function getLinkDetail(link: ConstantLinkEntry): string {
  if (!link.linkType && link.url) {
    return `URL: ${link.url}`
  }
  if (link.linkType === 'custom') {
    return `URL: ${link.customUrl || 'Not set'}`
  }
  if (link.linkType === 'page') {
    const slug = typeof link.page === 'object' ? link.page?.slug : link.page
    return `Page: ${slug || 'Not set'}`
  }
  if (link.linkType === 'cal') {
    return `Cal.com: ${link.calLink || 'Not set'}`
  }
  return ''
}

const ConstantLinkSelector: TextFieldClientComponent = (props) => {
  const { path } = props
  const { value, setValue } = useField<string>({ path })

  const [links, setLinks] = useState<ConstantLinkEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        // Fetch global via REST API (client components can't use Local API)
        const response = await fetch('/api/globals/constantLinks?depth=1', {
          credentials: 'include', // Include cookies for authentication
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch constant links: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        // Payload REST API returns { result: { ...globalData } }
        const global = data?.result || data

        // Links is an array field
        if (global?.links && Array.isArray(global.links)) {
          setLinks(global.links)
        }
      } catch (error) {
        console.error('Error fetching constant links:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLinks()
  }, [])

  const selectedLink = value ? links.find((l) => l.key === value) : null

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
        <option value="">Select a constant link...</option>
        {links.map((link) => (
          <option key={link.key} value={link.key}>
            {link.label}
          </option>
        ))}
      </select>
      {loading && (
        <p style={{ marginTop: '8px', color: '#6b7280', fontSize: '12px' }}>
          Loading constant links...
        </p>
      )}
      {!loading && links.length === 0 && (
        <p style={{ marginTop: '8px', color: '#6b7280', fontSize: '12px' }}>
          No constant links available. Create links in the Constant Links global.
        </p>
      )}
      {selectedLink && !loading && (
        <p style={{ marginTop: '8px', color: '#6b7280', fontSize: '12px' }}>
          {getLinkDetail(selectedLink)}
        </p>
      )}
    </div>
  )
}

export default ConstantLinkSelector
