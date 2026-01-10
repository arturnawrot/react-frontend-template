'use client'
import { useState, useEffect } from 'react'

// Cache for the broker ID to agent slug map
let agentSlugMapCache: Map<number, string> | null = null
let fetchPromise: Promise<Map<number, string>> | null = null

/**
 * Hook to get a map of broker IDs to agent slugs
 * Fetches agents once and caches the result
 */
export function useAgentSlugMap(): Map<number, string> {
  const [map, setMap] = useState<Map<number, string>>(new Map())

  useEffect(() => {
    // Return cached map if available
    if (agentSlugMapCache) {
      setMap(agentSlugMapCache)
      return
    }

    // If fetch is already in progress, wait for it
    if (fetchPromise) {
      fetchPromise.then(setMap)
      return
    }

    // Fetch agents and create the map
    fetchPromise = (async () => {
      try {
        const response = await fetch('/api/agents?limit=1000&depth=0', {
          credentials: 'include',
        })

        if (!response.ok) {
          console.warn('Failed to fetch agents for slug mapping')
          return new Map<number, string>()
        }

        const data = await response.json()
        const agents = data?.docs || []

        // Create map: brokerId (as number) -> slug
        const slugMap = new Map<number, string>()
        agents.forEach((agent: { buildout_broker_id?: string | null; slug?: string }) => {
          if (agent.buildout_broker_id && agent.slug) {
            const brokerId = parseInt(agent.buildout_broker_id, 10)
            if (!isNaN(brokerId)) {
              slugMap.set(brokerId, agent.slug)
            }
          }
        })

        // Cache the result
        agentSlugMapCache = slugMap
        return slugMap
      } catch (error) {
        console.error('Error fetching agents for slug mapping:', error)
        return new Map<number, string>()
      } finally {
        fetchPromise = null
      }
    })()

    fetchPromise.then(setMap)
  }, [])

  return map
}
