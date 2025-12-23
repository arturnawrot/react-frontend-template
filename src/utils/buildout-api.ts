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

    // If cache is disabled or skipCache is true, fetch directly
    if (!ENABLE_CACHE || options?.skipCache) {
      console.log(`[Buildout API Cache] SKIPPED: ${cacheKey} (ENABLE_CACHE=${ENABLE_CACHE}, skipCache=${options?.skipCache})`)
      return this.fetchData<T>(endpoint, params)
    }

    // Use Next.js unstable_cache for persistent caching across module reloads
    // The function will only execute on cache miss; cached results are returned immediately
    const cachedFetch = unstable_cache(
      async () => {
        console.log(`[Buildout API Cache] FETCHING (cache miss): ${cacheKey}`)
        const data = await this.fetchData<T>(endpoint, params)
        console.log(`[Buildout API Cache] STORED: ${cacheKey} (TTL: ${CACHE_TTL_SECONDS}s)`)
        return data
      },
      [cacheKey], // Cache key parts - Next.js uses these to determine cache hits
      {
        tags: ['buildout-api'],
        revalidate: CACHE_TTL_SECONDS,
      }
    )

    // Check if we've seen this cache key in this process (for logging)
    // Note: This is ephemeral and resets on module reload, but unstable_cache persists
    const recentlyCached = cacheTracker.get<boolean>(cacheKey)
    if (recentlyCached) {
      console.log(`[Buildout API Cache] HIT (from Next.js cache): ${cacheKey}`)
    } else {
      console.log(`[Buildout API Cache] MISS (will check Next.js cache): ${cacheKey}`)
      // Track that we've seen this key (for logging only)
      cacheTracker.set(cacheKey, true, CACHE_TTL_SECONDS)
    }

    const data = await cachedFetch()
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
   * Clear the cache (useful for testing or manual cache invalidation)
   * This revalidates all cache entries tagged with 'buildout-api'
   */
  async clearCache(): Promise<void> {
    revalidateTag('buildout-api')
    cacheTracker.clear()
    console.log('[Buildout API Cache] CLEARED (revalidated tag: buildout-api)')
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

