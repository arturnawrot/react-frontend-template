/**
 * Buildout API Client
 * Documentation: https://buildout.com/api/v1/
 */

import { unstable_cache } from 'next/cache'
import { revalidateTag } from 'next/cache'

const BUILDOUT_API_BASE = 'https://buildout.com/api/v1'
const BUILDOUT_API_KEY = process.env.BUILDOUT_API_KEY

// Cache configuration
const CACHE_TTL_SECONDS = parseInt(process.env.BUILDOUT_CACHE_TTL || '3600', 10) // Default: 1 hour
const ENABLE_CACHE = process.env.BUILDOUT_CACHE_ENABLED !== 'false' // Default: enabled

if (!BUILDOUT_API_KEY) {
  console.warn('BUILDOUT_API_KEY is not set in environment variables')
}

// Log cache configuration on module load (only once per process)
declare global {
  // eslint-disable-next-line no-var
  var _buildoutCacheConfigLogged: boolean | undefined
}

if (!globalThis._buildoutCacheConfigLogged) {
  console.log(`[Buildout API Cache] Configuration: ENABLE_CACHE=${ENABLE_CACHE}, TTL=${CACHE_TTL_SECONDS}s`)
  globalThis._buildoutCacheConfigLogged = true
}

/**
 * In-memory cache for tracking cache hits/misses (for debugging)
 * Note: This is separate from the actual caching mechanism which uses Next.js unstable_cache
 */
class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>()

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) {
      return null
    }

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

  size(): number {
    return this.cache.size
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

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

// Track cache operations for debugging (this is ephemeral, resets on module reload)
const cacheTracker = new MemoryCache()

// In-memory cache for API responses (fallback when unstable_cache doesn't work)
// This persists across requests within the same process
const responseCache = new MemoryCache()

// Module-level fetch function that doesn't capture 'this'
// This is needed for unstable_cache to work properly
async function fetchBuildoutData<T>(
  baseUrl: string,
  endpoint: string,
  params?: Record<string, string | number | boolean>
): Promise<T> {
  const url = new URL(`${baseUrl}${endpoint}`)
  
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
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Buildout API error: ${response.status} ${response.statusText}. ${errorText}`
    )
  }

  const data = await response.json()
  return data
}

// Store cached functions to reuse the same function reference for the same cache key
// This is critical for unstable_cache to work properly
const cachedFunctionStore = new Map<string, () => Promise<any>>()

// Get or create a cached function for a given cache key
function getCachedFunction<T>(
  cacheKey: string,
  baseUrl: string,
  endpoint: string,
  params?: Record<string, string | number | boolean>
): () => Promise<T> {
  // Reuse existing cached function if it exists
  if (cachedFunctionStore.has(cacheKey)) {
    return cachedFunctionStore.get(cacheKey)! as () => Promise<T>
  }

  // Create new cached function and store it
  const paramsKey = params ? JSON.stringify(params) : ''
  const cachedFn = unstable_cache(
    async () => {
      console.log(`[Buildout API Cache] FETCHING (cache miss): ${cacheKey}`)
      const data = await fetchBuildoutData<T>(baseUrl, endpoint, params)
      console.log(`[Buildout API Cache] STORED: ${cacheKey} (TTL: ${CACHE_TTL_SECONDS}s)`)
      return data
    },
    [cacheKey, baseUrl, endpoint, paramsKey],
    {
      tags: ['buildout-api'],
      revalidate: CACHE_TTL_SECONDS,
    }
  )

  cachedFunctionStore.set(cacheKey, cachedFn)
  return cachedFn
}

// Clean up expired entries from cacheTracker periodically (every 5 minutes)
// Note: This only cleans up the ephemeral cacheTracker, not the actual Next.js cache
if (typeof setInterval !== 'undefined') {
  setInterval(() => cacheTracker.cleanup(), 5 * 60 * 1000)
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
 * Buildout Property Document
 */
export interface BuildoutPropertyDocument {
  id: number
  name: string
  original_file_name: string
  url: string
}

/**
 * Buildout Property Photo Formats
 */
export interface BuildoutPropertyPhotoFormats {
  large: string
  medium: string
  thumb: string
  xlarge: string
}

/**
 * Buildout Property Photo
 */
export interface BuildoutPropertyPhoto {
  description: string
  formats: BuildoutPropertyPhotoFormats
  id: number
  original_file_url: string
  sort_order: number
  type: string
  url: string
}

/**
 * Buildout Property Comps
 */
export interface BuildoutPropertyComps {
  lease: any[]
  sale: any[]
}

/**
 * Buildout Property Custom Fields
 */
export interface BuildoutPropertyCustomFields {
  ricoh_tour_url?: string
  [key: string]: any
}

/**
 * Buildout Property model
 */
export interface BuildoutProperty {
  additional_property_subtype_ids: number[]
  address: string
  adr: string | null
  amenities: string
  apn: string
  auction: boolean
  auction_date: string | null
  auction_location: string
  auction_starting_bid_dollars: number | null
  auction_time: string
  auction_url: string
  best_use: string
  branding: string
  broker_id: number
  broker_ids: number[]
  building_class: string
  building_size_sf: number | null
  cable: boolean | null
  cable_description: string
  cap_rate_pct: number | null
  cash_on_cash: number | null
  ceiling_height_f: number | null
  ceiling_height_min: number | null
  city: string
  column_space: string
  construction_description: string
  construction_status_id: number | null
  country_code: string
  country_name: string
  county: string
  crane_description: string
  created_at: string
  cross_streets: string
  currency_format: string
  currency_key: string | null
  custom_fields: BuildoutPropertyCustomFields
  custom_lat_lng: boolean
  days_on_market: number
  debt_service: number | null
  display_locale_override: string | null
  distressed: boolean
  dock_door_description: string
  dock_high_doors: number | null
  documents: BuildoutPropertyDocument[]
  down_payment: number | null
  draft: boolean
  drive_in_bays: number | null
  easements_description: string
  elevators: string
  environmental_issues: string
  exterior_description: string
  exterior_walls: string
  external_id: string | null
  floor_coverings: string
  foundation: string
  framing: string
  free_standing: boolean | null
  frontage: number | null
  gas: boolean | null
  gas_description: string
  grade_level_doors: number | null
  gross_leasable_area: number | null
  gross_scheduled_income: number | null
  hidden_price_label: string
  hide_address: boolean
  hide_address_label_override: string
  hide_sale_price: boolean
  hvac: string
  id: number
  includes_real_estate: boolean
  industrial_office_space: number | null
  investment_type: string | null
  irrigation: boolean | null
  irrigation_description: string
  land_legal_description: string
  landscaping: string
  latitude: number
  lease: boolean
  lease_bullets: string[]
  lease_deal_status_ids: number[]
  lease_description: string
  lease_expiration_date: string | null
  lease_listed_on: string | null
  lease_listing_published: boolean
  lease_listing_searchable: boolean
  lease_listing_slug: string
  lease_listing_url: string | null
  lease_listing_web_description: string
  lease_listing_web_title: string
  lease_pdf_url: string
  lease_proposal: boolean
  lease_title: string
  leed_certified: string
  load_factor: number | null
  location_description: string
  longitude: number
  lot_depth: number | null
  lot_size_acres: number | null
  mapright_embed_code: string
  market: string
  matterport_url: string
  measurements: string
  mls_id: string
  name: string
  nearest_highway: string
  net_operating_income: number | null
  nnn_lease_expiration: string
  nnn_years_left_on_lease: number
  notes: string
  number_of_buildings: number | null
  number_of_cranes: number | null
  number_of_escalators: number | null
  number_of_floors: number | null
  number_of_lots: number | null
  number_of_parking_spaces: number | null
  number_of_units: number | null
  occupancy_pct: number | null
  office_buildout: string
  operating_expenses: number | null
  other_income: number | null
  parking_description: string
  parking_ratio: number | null
  parking_type_id: number | null
  photos: BuildoutPropertyPhoto[]
  power: boolean | null
  power_description: string
  principal_reduction_yr_1: number | null
  property_comps: BuildoutPropertyComps
  property_subtype_id: number
  property_type_id: number
  property_type_label_override: string
  property_use_id: number | null
  proposal: boolean
  rail_access: string
  renovated: boolean | null
  restrooms: string
  rev_par: number | null
  roof: string
  sale: boolean
  sale_bullets: string[]
  sale_deal_status_id: number
  sale_description: string
  sale_expiration_date: string | null
  sale_listed_on: string
  sale_listing_published: boolean
  sale_listing_searchable: boolean
  sale_listing_slug: string
  sale_listing_url: string
  sale_listing_web_description: string
  sale_listing_web_title: string
  sale_pdf_url: string
  sale_price_dollars: number | null
  sale_price_per_unit: number | null
  sale_price_units: string
  sale_proposal: boolean
  sale_terms: string
  sale_title: string
  second_broker_id: number | null
  sewer: boolean | null
  signal_intersection: boolean | null
  site_description: string
  soil_type: string
  sprinkler_description: string
  sprinklers: boolean | null
  state: string
  submarket: string
  taxes: number | null
  telephone: boolean | null
  telephone_description: string
  tenancy_id: number | null
  third_broker_id: number | null
  topography: string
  total_return: number | null
  traffic_count: number | null
  traffic_count_frontage: number | null
  traffic_count_street: string
  trailer_parking: string
  typical_floor_size: number | null
  updated_at: string
  utilities_description: string
  vacancy_cost: number | null
  virtual_tour_url: string
  walls: string
  warehouse_pct: number | null
  water: boolean | null
  water_description: string
  year_built: number | null
  you_tube_url: string
  zip: string
  zoning: string
}

/**
 * List Properties Response
 */
export interface ListPropertiesResponse extends BuildoutResponse<BuildoutProperty> {
  properties: BuildoutProperty[]
  count: number
}

/**
 * Lightweight property type for map/list views
 * Contains only essential fields to reduce response size
 */
export interface LightweightProperty {
  id: number
  latitude: number
  longitude: number
  address: string
  sale_price_dollars: number | null
  photos: Array<{ url: string }> // Only first photo URL
  // Keep minimal fields needed for filtering/display
  city?: string
  state?: string
  zip?: string
  name?: string
  sale_listing_web_title?: string
  lease_listing_web_title?: string
  property_type_id?: number
  sale?: boolean
  sale_listing_published?: boolean
  lease?: boolean
  lease_listing_published?: boolean
  cap_rate_pct?: number | null
  building_size_sf?: number | null
  created_at?: string
  broker_id?: number
}

/**
 * Transform full BuildoutProperty to lightweight format
 * Removes large fields like full photo arrays, documents, descriptions, etc.
 */
export function toLightweightProperty(property: BuildoutProperty): LightweightProperty {
  return {
    id: property.id,
    latitude: property.latitude,
    longitude: property.longitude,
    address: property.address,
    sale_price_dollars: property.sale_price_dollars,
    photos: property.photos && property.photos.length > 0
      ? [{ url: property.photos[0].formats?.large || property.photos[0].url || '' }]
      : [],
    city: property.city,
    state: property.state,
    zip: property.zip,
    name: property.name,
    sale_listing_web_title: property.sale_listing_web_title,
    lease_listing_web_title: property.lease_listing_web_title,
    property_type_id: property.property_type_id,
    sale: property.sale,
    sale_listing_published: property.sale_listing_published,
    lease: property.lease,
    lease_listing_published: property.lease_listing_published,
    cap_rate_pct: property.cap_rate_pct,
    building_size_sf: property.building_size_sf,
    created_at: property.created_at,
    broker_id: property.broker_id,
  }
}

/**
 * Lightweight properties response
 */
export interface LightweightPropertiesResponse {
  properties: LightweightProperty[]
  count: number
  message: string
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
   * Generic GET request method with caching using Next.js unstable_cache
   */
  private async get<T extends BuildoutResponse<any>>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
    options?: { skipCache?: boolean }
  ): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params)
    const baseUrl = this.baseUrl // Capture baseUrl to avoid 'this' in closure

    // If cache is disabled or skipCache is true, fetch directly
    if (!ENABLE_CACHE || options?.skipCache) {
      console.log(`[Buildout API Cache] SKIPPED: ${cacheKey} (ENABLE_CACHE=${ENABLE_CACHE}, skipCache=${options?.skipCache})`)
      return fetchBuildoutData<T>(baseUrl, endpoint, params)
    }

    // Check in-memory cache first (fastest, works across requests in same process)
    // This is the primary cache since unstable_cache doesn't work reliably in API routes
    const cachedResponse = responseCache.get<T>(cacheKey)
    if (cachedResponse) {
      console.log(`[Buildout API Cache] HIT (from memory cache): ${cacheKey}`)
      return cachedResponse
    }

    // If not in memory cache, fetch fresh data
    // Note: We're not using unstable_cache here because it doesn't work reliably
    // The in-memory cache (responseCache) is our primary caching mechanism
    console.log(`[Buildout API Cache] MISS (will fetch): ${cacheKey}`)
    
    // Track that we've seen this key (for logging)
    cacheTracker.set(cacheKey, true, CACHE_TTL_SECONDS)
    
    // Fetch fresh data from API
    const data = await fetchBuildoutData<T>(baseUrl, endpoint, params)
    
    // Store in in-memory cache for faster subsequent access
    responseCache.set(cacheKey, data, CACHE_TTL_SECONDS)
    console.log(`[Buildout API Cache] STORED (in memory): ${cacheKey} (TTL: ${CACHE_TTL_SECONDS}s)`)
    
    return data
  }

  /**
   * Internal method to perform the actual fetch (without caching)
   */
  private async fetchData<T extends BuildoutResponse<any>>(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): Promise<T> {
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
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Buildout API error: ${response.status} ${response.statusText}. ${errorText}`
      )
    }

    const data = await response.json()
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

  /**
   * Get properties by broker ID
   * @param brokerId - Broker ID
   * @param options - Optional cache control and pagination options
   * @returns Properties response with count, message, and properties array
   * @throws Error if API key is not set or API call fails
   */
  async getPropertiesByBrokerId(
    brokerId: number,
    options?: { 
      skipCache?: boolean
      limit?: number
      offset?: number
    }
  ): Promise<ListPropertiesResponse> {
    if (!BUILDOUT_API_KEY) {
      throw new Error('BUILDOUT_API_KEY environment variable is required')
    }

    try {
      const params: Record<string, string | number | boolean> = {
        broker_id: brokerId,
      }

      if (options?.limit !== undefined) {
        params.limit = options.limit
      }

      if (options?.offset !== undefined) {
        params.offset = options.offset
      }

      const response = await this.get<ListPropertiesResponse>(
        '/properties.json',
        params,
        options
      )

      return response
    } catch (error) {
      console.error('Error fetching properties from Buildout API:', error)
      throw error
    }
  }

  /**
   * Get all properties with pagination
   * Makes multiple requests based on total count and limit
   * @param options - Optional cache control, pagination, and filter options
   * @returns Combined properties response with all properties
   * @throws Error if API key is not set or API call fails
   */
  async getAllProperties(
    options?: {
      skipCache?: boolean
      limit?: number
      brokerId?: number
      [key: string]: string | number | boolean | undefined
    }
  ): Promise<ListPropertiesResponse> {
    if (!BUILDOUT_API_KEY) {
      throw new Error('BUILDOUT_API_KEY environment variable is required')
    }

    // Note: We don't cache the combined result because it exceeds Next.js 2MB cache limit
    // Individual page requests are cached, so subsequent calls will be fast
    return this._getAllPropertiesInternal(options)
  }

  /**
   * Get all brokers
   * @param options - Optional cache control and pagination options
   * @returns Brokers response with count, message, and brokers array
   * @throws Error if API key is not set or API call fails
   */
  async getAllBrokers(
    options?: {
      skipCache?: boolean
      limit?: number
    }
  ): Promise<ListBrokersResponse> {
    if (!BUILDOUT_API_KEY) {
      throw new Error('BUILDOUT_API_KEY environment variable is required')
    }

    try {
      const params: Record<string, string | number | boolean> = {}
      
      if (options?.limit !== undefined) {
        params.limit = options.limit
      }

      const response = await this.get<ListBrokersResponse>(
        '/brokers.json',
        params,
        options
      )

      return response
    } catch (error) {
      console.error('Error fetching brokers from Buildout API:', error)
      throw error
    }
  }

  /**
   * Search properties with filters and pagination
   * @param options - Filter and pagination options
   * @returns Properties response with count, message, and properties array
   * @throws Error if API key is not set or API call fails
   */
  async searchProperties(
    options?: {
      skipCache?: boolean
      limit?: number
      offset?: number
      [key: string]: string | number | boolean | undefined
    }
  ): Promise<ListPropertiesResponse> {
    if (!BUILDOUT_API_KEY) {
      throw new Error('BUILDOUT_API_KEY environment variable is required')
    }

    try {
      const params: Record<string, string | number | boolean> = {}
      
      if (options?.limit !== undefined) {
        params.limit = options.limit
      }
      
      if (options?.offset !== undefined) {
        params.offset = options.offset
      }

      // Add all other filter options (excluding skipCache, limit, offset)
      Object.entries(options || {}).forEach(([key, value]) => {
        if (key !== 'skipCache' && key !== 'limit' && key !== 'offset' && value !== undefined) {
          params[key] = value
        }
      })

      const response = await this.get<ListPropertiesResponse>(
        '/properties.json',
        params,
        { skipCache: options?.skipCache }
      )

      return response
    } catch (error) {
      console.error('Error searching properties from Buildout API:', error)
      throw error
    }
  }

  /**
   * Internal method to fetch all properties (without caching the combined result)
   * This is called by getAllProperties and can also be called directly if skipCache is true
   * Made public so it can be called from the cached function
   * Supports all filter options like searchProperties
   */
  async _getAllPropertiesInternal(
    options?: {
      skipCache?: boolean
      limit?: number
      brokerId?: number
      offset?: number
      [key: string]: string | number | boolean | undefined
    }
  ): Promise<ListPropertiesResponse> {
    try {
      const limit = options?.limit ?? 10
      const baseParams: Record<string, string | number | boolean> = {
        limit,
        offset: options?.offset ?? 0,
      }

      // Add optional filters (like broker_id)
      if (options?.brokerId !== undefined) {
        baseParams.broker_id = options.brokerId
      }

      // Add any other custom params (excluding skipCache, limit, offset, and brokerId which are handled separately)
      Object.entries(options || {}).forEach(([key, value]) => {
        if (key !== 'skipCache' && key !== 'limit' && key !== 'offset' && key !== 'brokerId' && value !== undefined) {
          baseParams[key] = value
        }
      })

      // First request to get total count
      const firstResponse = await this.get<ListPropertiesResponse>(
        '/properties.json',
        baseParams,
        options
      )

      const totalCount = firstResponse.count
      const allProperties = [...firstResponse.properties]

      // If we already have all properties, return early
      if (allProperties.length >= totalCount) {
        return {
          ...firstResponse,
          properties: allProperties,
        }
      }

      // Calculate number of additional pages needed
      const totalPages = Math.ceil(totalCount / limit)
      const remainingPages = totalPages - 1

      if (remainingPages > 0) {
        // Create requests for remaining pages
        const pagePromises = Array.from({ length: remainingPages }, (_, i) => {
          const pageOffset = (i + 1) * limit
          const pageParams = {
            ...baseParams,
            offset: pageOffset,
          }

          return this.get<ListPropertiesResponse>(
            '/properties.json',
            pageParams,
            options
          )
        })

        // Fetch all remaining pages in parallel
        const pageResponses = await Promise.all(pagePromises)

        // Combine all properties from all pages
        pageResponses.forEach((response) => {
          allProperties.push(...response.properties)
        })
      }

      // Return combined response
      return {
        message: firstResponse.message,
        properties: allProperties,
        count: totalCount,
      }
    } catch (error) {
      console.error('Error fetching all properties from Buildout API:', error)
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
   * Get properties by broker ID
   * @param brokerId - Broker ID
   * @param options - Optional cache control and pagination options
   * @returns Properties response with count, message, and properties array
   */
  async getPropertiesByBrokerId(
    brokerId: number,
    options?: { 
      skipCache?: boolean
      limit?: number
      offset?: number
    }
  ): Promise<ListPropertiesResponse> {
    return this.getInstance().getPropertiesByBrokerId(brokerId, options)
  },

  /**
   * Get all properties with pagination
   * Makes multiple requests based on total count and limit
   * @param options - Optional cache control, pagination, and filter options
   * @returns Combined properties response with all properties
   */
  async getAllProperties(
    options?: {
      skipCache?: boolean
      limit?: number
      brokerId?: number
      [key: string]: string | number | boolean | undefined
    }
  ): Promise<ListPropertiesResponse> {
    return this.getInstance().getAllProperties(options)
  },

  /**
   * Get all brokers
   * @param options - Optional cache control and pagination options
   * @returns Brokers response with count, message, and brokers array
   */
  async getAllBrokers(
    options?: {
      skipCache?: boolean
      limit?: number
    }
  ): Promise<ListBrokersResponse> {
    return this.getInstance().getAllBrokers(options)
  },

  /**
   * Search properties with filters and pagination
   * @param options - Filter and pagination options
   * @returns Properties response with count, message, and properties array
   */
  async searchProperties(
    options?: {
      skipCache?: boolean
      limit?: number
      offset?: number
      [key: string]: string | number | boolean | undefined
    }
  ): Promise<ListPropertiesResponse> {
    return this.getInstance().searchProperties(options)
  },

  /**
   * Clear the cache (useful for testing or manual cache invalidation)
   * This revalidates all cache entries tagged with 'buildout-api'
   */
  async clearCache(): Promise<void> {
    // Get cache sizes before clearing for logging
    const responseCacheSize = responseCache.size()
    const functionStoreSize = cachedFunctionStore.size
    
    // Revalidate Next.js cache tags (for unstable_cache if it was used)
    revalidateTag('buildout-api')
    revalidateTag('buildout-api-all-properties')
    
    // Clear in-memory caches
    cacheTracker.clear()
    responseCache.clear()
    
    // Clear cached function store - this forces new functions to be created
    // which will fetch fresh data on next call
    cachedFunctionStore.clear()
    
    console.log(`[Buildout API Cache] CLEARED - Removed ${responseCacheSize} response cache entries and ${functionStoreSize} cached functions`)
    console.log('[Buildout API Cache] All caches cleared (Next.js tags revalidated, memory caches cleared)')
  },

  /**
   * Get cache status (for debugging)
   */
  getCacheStatus(): { enabled: boolean; ttl: number; size: number } {
    return {
      enabled: ENABLE_CACHE,
      ttl: CACHE_TTL_SECONDS,
      size: cacheTracker.size(),
    }
  },
}

