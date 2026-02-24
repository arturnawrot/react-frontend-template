'use client'
import { useState, useEffect } from 'react'

// Cache for individual broker ID to agent avatar URL lookups
const avatarCache = new Map<number, string | null>()
const fetchPromises = new Map<number, Promise<string | null>>()

/**
 * Hook to get agent avatar URL by brokerId
 * Fetches agent on-demand by buildout_broker_id and caches the result
 */
export function useAgentAvatar(brokerId: number | null | undefined): string | null {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    // If no brokerId, return null
    if (!brokerId) {
      setAvatarUrl(null)
      return
    }

    // Return cached result if available
    if (avatarCache.has(brokerId)) {
      setAvatarUrl(avatarCache.get(brokerId) || null)
      return
    }

    // If fetch is already in progress for this brokerId, wait for it
    const existingPromise = fetchPromises.get(brokerId)
    if (existingPromise) {
      existingPromise.then(setAvatarUrl)
      return
    }

    // Fetch agent by buildout_broker_id
    const fetchPromise = (async () => {
      try {
        // Query agent by buildout_broker_id using Payload REST API
        // buildout_broker_id is stored as text, so convert brokerId to string
        const response = await fetch(
          `/api/agents?where[buildout_broker_id][equals]=${String(brokerId)}&depth=1&limit=1`,
          {
            credentials: 'include',
          }
        )

        if (!response.ok) {
          console.warn(`Failed to fetch agent for brokerId ${brokerId}`)
          avatarCache.set(brokerId, null)
          return null
        }

        const data = await response.json()
        const agents = data?.docs || []
        
        if (agents.length === 0) {
          avatarCache.set(brokerId, null)
          return null
        }

        const agent = agents[0]
        const avatar = agent.cardImage?.url || null

        // Cache the result
        avatarCache.set(brokerId, avatar)
        return avatar
      } catch (error) {
        console.error(`Error fetching agent avatar for brokerId ${brokerId}:`, error)
        avatarCache.set(brokerId, null)
        return null
      } finally {
        fetchPromises.delete(brokerId)
      }
    })()

    fetchPromises.set(brokerId, fetchPromise)
    fetchPromise.then(setAvatarUrl)
  }, [brokerId])

  return avatarUrl
}
