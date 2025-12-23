import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { buildoutApi } from '@/utils/buildout-api'
import { POST } from '@/app/api/buildout/clear-cache/route'

// Store original fetch
const originalFetch = global.fetch

describe('Buildout Cache Clearing', () => {
  beforeEach(() => {
    // Clear cache before each test
    buildoutApi.clearCache()
  })

  afterEach(() => {
    // Restore original fetch
    global.fetch = originalFetch
    // Clear cache after each test
    buildoutApi.clearCache()
  })

  describe('API Route', () => {
    it('should clear cache successfully', async () => {
      const request = new Request('http://localhost/api/buildout/clear-cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Buildout API cache cleared successfully')
    })

    it('should handle errors gracefully', async () => {
      // Suppress console.error for this test to avoid stderr noise
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Mock buildoutApi.clearCache to throw an error
      const originalClearCache = buildoutApi.clearCache
      buildoutApi.clearCache = () => {
        throw new Error('Cache clear failed')
      }

      const request = new Request('http://localhost/api/buildout/clear-cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Cache clear failed')

      // Restore original
      buildoutApi.clearCache = originalClearCache
      consoleErrorSpy.mockRestore()
    })
  })

  describe('Cache Functionality', () => {
    it('should clear cache without throwing', () => {
      expect(() => {
        buildoutApi.clearCache()
      }).not.toThrow()
    })

    it('should clear cache and force fresh API calls', async () => {
      // Mock fetch to track calls
      let fetchCallCount = 0
      const mockBrokerResponse = {
        brokers: [{ id: 123, email: 'test@example.com', first_name: 'Test', last_name: 'User' }],
        count: 1,
        message: 'Success',
      }

      global.fetch = vi.fn().mockImplementation(() => {
        fetchCallCount++
        return Promise.resolve({
          ok: true,
          json: async () => mockBrokerResponse,
        } as Response)
      })

      // Set environment variable for API key
      process.env.BUILDOUT_API_KEY = 'test-key'

      try {
        // First call - should hit API
        await buildoutApi.getBrokerByEmail('test@example.com')
        expect(fetchCallCount).toBe(1)

        // Second call - should use cache (no new fetch)
        await buildoutApi.getBrokerByEmail('test@example.com')
        expect(fetchCallCount).toBe(1) // Still 1, cache hit

        // Clear cache
        buildoutApi.clearCache()

        // Third call - should hit API again after cache clear
        await buildoutApi.getBrokerByEmail('test@example.com')
        expect(fetchCallCount).toBe(2) // Now 2, cache was cleared
      } finally {
        // Cleanup
        delete process.env.BUILDOUT_API_KEY
      }
    })

    it('should clear cache multiple times without issues', () => {
      expect(() => {
        buildoutApi.clearCache()
        buildoutApi.clearCache()
        buildoutApi.clearCache()
      }).not.toThrow()
    })
  })
})

