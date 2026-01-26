'use client'

import { useState, useEffect } from 'react'
import type { ConstantLinksMap } from '@/utils/linkResolver'

/**
 * Client-side hook to fetch constant links
 * Returns a map of constant link keys to URLs
 */
export function useConstantLinks(): ConstantLinksMap | null {
  const [constantLinksMap, setConstantLinksMap] = useState<ConstantLinksMap | null>(null)

  useEffect(() => {
    const fetchConstantLinks = async () => {
      try {
        const response = await fetch('/api/globals/constantLinks', {
          credentials: 'include',
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch constant links: ${response.status}`)
        }
        
        const data = await response.json()
        const global = data?.result || data
        
        if (global?.links && Array.isArray(global.links)) {
          const map = new Map<string, string>()
          for (const link of global.links) {
            if (link.key && link.url) {
              map.set(link.key, link.url)
            }
          }
          setConstantLinksMap(map)
        }
      } catch (error) {
        console.error('Error fetching constant links:', error)
      }
    }

    fetchConstantLinks()
  }, [])

  return constantLinksMap
}
