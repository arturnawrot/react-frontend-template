import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { GET } from '@/app/api/cron/purge-caches/route'
import * as purgeCaches from '@/utils/purge-caches'

const CRON_SECRET = 'test-cron-secret'

function makeRequest(authHeader?: string) {
  const headers: Record<string, string> = {}
  if (authHeader) {
    headers['authorization'] = authHeader
  }
  return new Request('http://localhost/api/cron/purge-caches', { headers })
}

describe('Cron Purge Caches', () => {
  beforeEach(() => {
    process.env.CRON_SECRET = CRON_SECRET
  })

  afterEach(() => {
    delete process.env.CRON_SECRET
  })

  it('should return 401 when no authorization header is provided', async () => {
    const response = await GET(makeRequest())
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should return 401 when token is wrong', async () => {
    const response = await GET(makeRequest('Bearer wrong-token'))
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should return 401 when CRON_SECRET is not set', async () => {
    delete process.env.CRON_SECRET

    const response = await GET(makeRequest(`Bearer ${CRON_SECRET}`))
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should purge all caches with valid token', async () => {
    const purgeSpy = vi.spyOn(purgeCaches, 'purgeAllCaches').mockResolvedValue()

    const response = await GET(makeRequest(`Bearer ${CRON_SECRET}`))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.message).toBe('All caches purged successfully')
    expect(data.timestamp).toBeDefined()
    expect(purgeSpy).toHaveBeenCalled()

    purgeSpy.mockRestore()
  })

  it('should return 500 when cache clearing fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const purgeSpy = vi.spyOn(purgeCaches, 'purgeAllCaches').mockRejectedValue(new Error('Redis connection lost'))

    const response = await GET(makeRequest(`Bearer ${CRON_SECRET}`))
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Redis connection lost')

    purgeSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })
})
