/**
 * Redis Client Utility
 * Provides a singleton Redis client for caching
 */

import Redis from 'ioredis'

let redisClient: Redis | null = null

/**
 * Get or create Redis client instance
 */
export function getRedisClient(): Redis | null {
  // If Redis URL is not provided, return null (cache disabled)
  const redisUrl = process.env.REDIS_URL
  
  if (!redisUrl) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Redis] REDIS_URL not set, caching disabled')
    }
    return null
  }

  // Return existing client if already created
  if (redisClient) {
    return redisClient
  }

  try {
    // Create new Redis client
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
      reconnectOnError: (err) => {
        const targetError = 'READONLY'
        if (err.message.includes(targetError)) {
          return true
        }
        return false
      },
    })

    redisClient.on('error', (err) => {
      console.error('[Redis] Error:', err)
    })

    redisClient.on('connect', () => {
      console.log('[Redis] Connected')
    })

    return redisClient
  } catch (error) {
    console.error('[Redis] Failed to create client:', error)
    return null
  }
}

/**
 * Close Redis connection (useful for cleanup)
 */
export async function closeRedisClient(): Promise<void> {
  if (redisClient) {
    await redisClient.quit()
    redisClient = null
  }
}

/**
 * Cache key prefixes
 */
export const CACHE_KEYS = {
  PROPERTIES: 'buildout:properties',
  BROKERS: 'buildout:brokers',
} as const

/**
 * Get cache key with prefix
 */
export function getCacheKey(key: string): string {
  return key
}

