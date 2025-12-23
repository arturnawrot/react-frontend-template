/**
 * Buildout API Client
 * Documentation: https://buildout.com/api/v1/
 */

const BUILDOUT_API_BASE = 'https://buildout.com/api/v1'
const BUILDOUT_API_KEY = process.env.BUILDOUT_API_KEY

// Cache configuration
const CACHE_TTL_SECONDS = parseInt(process.env.BUILDOUT_CACHE_TTL || '3600', 10) // Default: 1 hour
const ENABLE_CACHE = process.env.BUILDOUT_CACHE_ENABLED !== 'false' // Default: enabled

if (!BUILDOUT_API_KEY) {
  console.warn('BUILDOUT_API_KEY is not set in environment variables')
}

/**
 * In-memory cache with TTL
 */
interface CacheEntry<T> {
  data: T
  expiresAt: number
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>()

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  set<T>(key: string, data: T, ttlSeconds: number): void {
    const expiresAt = Date.now() + ttlSeconds * 1000
    this.cache.set(key, { data, expiresAt })
  }

  clear(): void {
    this.cache.clear()
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    }
  }
}

const memoryCache = new MemoryCache()

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => memoryCache.cleanup(), 5 * 60 * 1000)
}

/**
 * Buildout API Response wrapper
 */
interface BuildoutResponse<T> {
  message: string
  [key: string]: any
}

/**
 * Buildout Broker License
 */
export interface BuildoutBrokerLicense {
  id: number
  number: string
  state: string
  expiration: string
}

/**
 * Buildout Broker model
 */
export interface BuildoutBroker {
  id: number
  external_id: number | null
  first_name: string
  last_name: string
  email: string
  job_title: string
  biography: string | null
  bio_pdf_url: string | null
  address: string
  address2: string
  city: string
  state: string
  zip: string
  phone_number: string
  phone_extension: string
  cell_phone: string
  fax: string
  profile_photo_url: string | null
  linked_in_url: string
  facebook_url: string
  twitter_url: string
  instagram_url: string
  company_id: number
  company_office_id: number
  licenses: BuildoutBrokerLicense[]
  specialties: string[]
  education: string
  memberships_and_associations: string
  custom_fields: Record<string, any>
  can_access_property_edit_form: boolean
  can_have_properties: boolean
  can_make_non_branded_changes_in_documents: boolean
  force_include_on_broker_plugin: boolean
  hide_on_broker_plugin: boolean
  managing_director: boolean
}

/**
 * List Brokers Response
 */
export interface ListBrokersResponse extends BuildoutResponse<BuildoutBroker> {
  brokers: BuildoutBroker[]
  count: number
}

/**
 * Generic HTTP client for Buildout API
 */
class BuildoutApiClient {
  private baseUrl: string

  constructor() {
    if (!BUILDOUT_API_KEY) {
      console.warn('BUILDOUT_API_KEY is not set. Buildout API calls will fail.')
      this.baseUrl = `${BUILDOUT_API_BASE}/`
    } else {
      this.baseUrl = `${BUILDOUT_API_BASE}/${BUILDOUT_API_KEY}`
    }
  }

  /**
   * Generate cache key from endpoint and params
   */
  private getCacheKey(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const paramString = params
      ? Object.entries(params)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, value]) => `${key}=${value}`)
          .join('&')
      : ''
    return `buildout:${endpoint}${paramString ? `?${paramString}` : ''}`
  }

  /**
   * Generic GET request method with caching
   */
  private async get<T extends BuildoutResponse<any>>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
    options?: { skipCache?: boolean }
  ): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params)

    // Check cache first (unless skipCache is true)
    if (ENABLE_CACHE && !options?.skipCache) {
      const cached = memoryCache.get<T>(cacheKey)
      if (cached !== null) {
        return cached
      }
    }

    const url = new URL(`${this.baseUrl}${endpoint}`)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Next.js fetch cache options (if available)
      next: ENABLE_CACHE && !options?.skipCache
        ? { revalidate: CACHE_TTL_SECONDS }
        : undefined,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Buildout API error: ${response.status} ${response.statusText}. ${errorText}`
      )
    }

    const data = await response.json()

    // Store in memory cache
    if (ENABLE_CACHE && !options?.skipCache) {
      memoryCache.set(cacheKey, data, CACHE_TTL_SECONDS)
    }

    return data
  }

  /**
   * Find broker ID by email
   * @param email - Broker email address
   * @param options - Optional cache control options
   * @returns Broker ID if found, null if not found
   * @throws Error if API key is not set or API call fails
   */
  async findBrokerIdByEmail(
    email: string,
    options?: { skipCache?: boolean }
  ): Promise<number | null> {
    if (!BUILDOUT_API_KEY) {
      throw new Error('BUILDOUT_API_KEY environment variable is required')
    }

    try {
      const response = await this.get<ListBrokersResponse>(
        '/brokers.json',
        {
          limit: '1',
          email: email,
        },
        options
      )

      if (response.brokers && response.brokers.length > 0) {
        return response.brokers[0].id
      }

      return null
    } catch (error) {
      console.error('Error fetching broker from Buildout API:', error)
      throw error
    }
  }

  /**
   * Get broker by email (full broker object)
   * @param email - Broker email address
   * @param options - Optional cache control options
   * @returns Broker object if found, null if not found
   */
  async getBrokerByEmail(
    email: string,
    options?: { skipCache?: boolean }
  ): Promise<BuildoutBroker | null> {
    try {
      const response = await this.get<ListBrokersResponse>(
        '/brokers.json',
        {
          limit: 1,
          email: email,
        },
        options
      )

      if (response.brokers && response.brokers.length > 0) {
        return response.brokers[0]
      }

      return null
    } catch (error) {
      console.error('Error fetching broker from Buildout API:', error)
      throw error
    }
  }
}

// Export singleton instance (lazy initialization)
let _buildoutApiInstance: BuildoutApiClient | null = null

export const buildoutApi = {
  getInstance(): BuildoutApiClient {
    if (!_buildoutApiInstance) {
      _buildoutApiInstance = new BuildoutApiClient()
    }
    return _buildoutApiInstance
  },
  
  async findBrokerIdByEmail(email: string, options?: { skipCache?: boolean }): Promise<number | null> {
    return this.getInstance().findBrokerIdByEmail(email, options)
  },
  
  async getBrokerByEmail(email: string, options?: { skipCache?: boolean }): Promise<BuildoutBroker | null> {
    return this.getInstance().getBrokerByEmail(email, options)
  },

  /**
   * Clear the cache (useful for testing or manual cache invalidation)
   */
  clearCache(): void {
    memoryCache.clear()
  },
}

