/**
 * Buildout API Client
 * Documentation: https://buildout.com/api/v1/
 */

import { revalidateTag, revalidatePath } from 'next/cache'
import { getRedisClient, CACHE_KEYS } from './redis'

const BUILDOUT_API_BASE = 'https://buildout.com/api/v1'
const BUILDOUT_API_KEY = process.env.BUILDOUT_API_KEY
const CACHE_TTL_SECONDS = parseInt(process.env.BUILDOUT_CACHE_TTL || '3600', 10)
const ENABLE_CACHE = process.env.BUILDOUT_CACHE_ENABLED !== 'false'

if (!BUILDOUT_API_KEY) {
  console.warn('BUILDOUT_API_KEY is not set in environment variables')
}

// ----------------------------------------------------------------------
// Types & Interfaces
// ----------------------------------------------------------------------

// Import PropertyType for use in this file
import { PropertyType, getPropertyTypeLabel } from './property-types'

// Re-export PropertyType and helper from client-safe module
export { PropertyType, getPropertyTypeLabel }

export interface BuildoutResponse<T> {
  message: string
  [key: string]: unknown
}

export interface BuildoutBrokerLicense {
  id: number
  number: string
  state: string
  expiration: string
}

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

export interface ListBrokersResponse extends BuildoutResponse<BuildoutBroker> {
  brokers: BuildoutBroker[]
  count: number
}

export interface BuildoutPropertyDocument {
  id: number
  name: string
  original_file_name: string
  url: string
}

export interface BuildoutPropertyPhotoFormats {
  large: string
  medium: string
  thumb: string
  xlarge: string
}

export interface BuildoutPropertyPhoto {
  description: string
  formats: BuildoutPropertyPhotoFormats
  id: number
  original_file_url: string
  sort_order: number
  type: string
  url: string
}

export interface BuildoutPropertyComps {
  lease: unknown[]
  sale: unknown[]
}

export interface BuildoutPropertyCustomFields {
  ricoh_tour_url?: string
  [key: string]: unknown
}

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
  property_type_id: PropertyType
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

export interface ListPropertiesResponse extends BuildoutResponse<BuildoutProperty> {
  properties: BuildoutProperty[]
  count: number
}

export interface LightweightProperty {
  id: number
  latitude: number
  longitude: number
  address: string
  sale_price_dollars: number | null
  photos: Array<{ url: string }>
  city?: string
  state?: string
  zip?: string
  name?: string
  sale_listing_web_title?: string
  lease_listing_web_title?: string
  property_type_id?: PropertyType
  sale?: boolean
  sale_listing_published?: boolean
  lease?: boolean
  lease_listing_published?: boolean
  cap_rate_pct?: number | null
  building_size_sf?: number | null
  created_at?: string
  broker_id?: number
}

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

export interface LightweightPropertiesResponse {
  properties: LightweightProperty[]
  count: number
  message: string
}

// ----------------------------------------------------------------------
// Filters Logic
// ----------------------------------------------------------------------

export interface PropertyFilters {
  propertyIds?: number[]
  brokerId?: number
  propertyType?: PropertyType
  minPrice?: number
  maxPrice?: number
  saleOrLease?: 'sale' | 'lease' | string
  minCapRate?: number
  maxCapRate?: number
  minSquareFootage?: number
  maxSquareFootage?: number
  search?: string
}

export function filterProperties(
  properties: BuildoutProperty[],
  filters: PropertyFilters
): BuildoutProperty[] {
  let filtered = properties

  // Filter by property IDs (for saved properties)
  if (filters.propertyIds && filters.propertyIds.length > 0) {
    filtered = filtered.filter(p => filters.propertyIds!.includes(p.id))
  }

  // Filter by broker
  if (filters.brokerId !== null && filters.brokerId !== undefined) {
    filtered = filtered.filter(p => p.broker_id === filters.brokerId)
  }

  // Filter by property type
  if (filters.propertyType !== null && filters.propertyType !== undefined) {
    filtered = filtered.filter(p => p.property_type_id === filters.propertyType)
  }

  // Filter by price
  if (filters.minPrice !== null && filters.minPrice !== undefined) {
    filtered = filtered.filter(p => 
      p.sale_price_dollars !== null && 
      p.sale_price_dollars !== undefined && 
      p.sale_price_dollars >= filters.minPrice!
    )
  }

  if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
    filtered = filtered.filter(p => 
      p.sale_price_dollars !== null && 
      p.sale_price_dollars !== undefined && 
      p.sale_price_dollars <= filters.maxPrice!
    )
  }

  // Filter by sale/lease
  if (filters.saleOrLease === 'sale') {
    filtered = filtered.filter(p => 
      p.sale === true && p.sale_listing_published === true
    )
  } else if (filters.saleOrLease === 'lease') {
    filtered = filtered.filter(p => 
      p.lease === true && p.lease_listing_published === true
    )
  }

  // Filter by cap rate
  if (filters.minCapRate !== null && filters.minCapRate !== undefined) {
    filtered = filtered.filter(p => 
      p.cap_rate_pct !== null && 
      p.cap_rate_pct !== undefined && 
      p.cap_rate_pct >= filters.minCapRate!
    )
  }

  if (filters.maxCapRate !== null && filters.maxCapRate !== undefined) {
    filtered = filtered.filter(p => 
      p.cap_rate_pct !== null && 
      p.cap_rate_pct !== undefined && 
      p.cap_rate_pct <= filters.maxCapRate!
    )
  }

  // Filter by square footage
  if (filters.minSquareFootage !== null && filters.minSquareFootage !== undefined) {
    filtered = filtered.filter(p => 
      p.building_size_sf !== null && 
      p.building_size_sf !== undefined && 
      p.building_size_sf >= filters.minSquareFootage!
    )
  }

  if (filters.maxSquareFootage !== null && filters.maxSquareFootage !== undefined) {
    filtered = filtered.filter(p => 
      p.building_size_sf !== null && 
      p.building_size_sf !== undefined && 
      p.building_size_sf <= filters.maxSquareFootage!
    )
  }

  // Filter by text search - unified logic that handles both partial queries and full addresses
  if (filters.search) {
    const query = filters.search.toLowerCase().trim()
    
    // Split query by commas to handle full addresses like "6316 San Juan Avenue, Jacksonville, FL, USA"
    const queryParts = query.split(',').map(part => part.trim()).filter(Boolean)
    
    filtered = filtered.filter(p => {
      // Build combined address string for matching
      const fullAddressString = [
        p.address,
        p.city,
        p.state,
        p.zip,
      ].filter(Boolean).join(', ').toLowerCase()
      
      // Check if full query matches the combined address string
      if (fullAddressString.includes(query)) {
        return true
      }
      
      // Check if query matches individual fields (original behavior)
      if (
        (p.address || '').toLowerCase().includes(query) ||
        (p.city || '').toLowerCase().includes(query) ||
        (p.state || '').toLowerCase().includes(query) ||
        (p.zip || '').toLowerCase().includes(query) ||
        (p.name || '').toLowerCase().includes(query) ||
        (p.sale_listing_web_title || '').toLowerCase().includes(query) ||
        (p.lease_listing_web_title || '').toLowerCase().includes(query)
      ) {
        return true
      }
      
      // If query has multiple parts (comma-separated), check if parts match corresponding fields
      // This handles cases like "6316 San Juan Avenue, Jacksonville" where:
      // - First part should match address
      // - Second part should match city
      if (queryParts.length > 1) {
        const addressMatch = queryParts[0] && (p.address || '').toLowerCase().includes(queryParts[0])
        const cityMatch = queryParts.length > 1 && queryParts[1] && (p.city || '').toLowerCase().includes(queryParts[1])
        const stateMatch = queryParts.length > 2 && queryParts[2] && (p.state || '').toLowerCase().includes(queryParts[2])
        const zipMatch = queryParts.length > 3 && queryParts[3] && (p.zip || '').toLowerCase().includes(queryParts[3])
        
        // Match if address part matches AND at least one other part matches
        if (addressMatch && (cityMatch || stateMatch || zipMatch)) {
          return true
        }
        
        // Also match if any part matches any field (more flexible)
        const allParts = queryParts.join(' ')
        if (
          (p.address || '').toLowerCase().includes(allParts) ||
          (p.city || '').toLowerCase().includes(allParts) ||
          fullAddressString.includes(allParts)
        ) {
          return true
        }
      }
      
      return false
    })
  }

  return filtered
}


// ----------------------------------------------------------------------
// Base Fetch Logic
// ----------------------------------------------------------------------

async function fetchFromBuildout<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean>
): Promise<T> {
  if (!BUILDOUT_API_KEY) {
    throw new Error('BUILDOUT_API_KEY environment variable is required')
  }

  const baseUrl = `${BUILDOUT_API_BASE}/${BUILDOUT_API_KEY}`
  const url = new URL(`${baseUrl}${endpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  // console.log(`[Buildout API] Fetching: ${url.toString()}`)

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Buildout API error: ${response.status} ${response.statusText}. ${errorText}`)
  }

  return response.json()
}

// ----------------------------------------------------------------------
// Redis Cache (Shared across all serverless instances)
// ----------------------------------------------------------------------

interface CacheEntry<T> {
  data: T
  timestamp: number
}

/**
 * Get data from Redis cache
 */
async function getFromRedisCache<T>(key: string): Promise<T | null> {
  if (!ENABLE_CACHE) return null
  
  const redis = getRedisClient()
  if (!redis) return null

  try {
    const cached = await redis.get(key)
    if (!cached) return null

    const entry: CacheEntry<T> = JSON.parse(cached)
    const now = Date.now()
    
    // Check if cache is expired
    if (now - entry.timestamp > CACHE_TTL_SECONDS * 1000) {
      // Delete expired entry
      await redis.del(key)
      return null
    }

    return entry.data
  } catch (error) {
    console.error(`[Redis] Error getting cache for key ${key}:`, error)
    return null
  }
}

/**
 * Set data in Redis cache
 */
async function setRedisCache<T>(key: string, data: T): Promise<void> {
  if (!ENABLE_CACHE) return

  const redis = getRedisClient()
  if (!redis) return

  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    }
    
    // Store with TTL (in seconds) for automatic expiration
    await redis.setex(key, CACHE_TTL_SECONDS, JSON.stringify(entry))
  } catch (error) {
    console.error(`[Redis] Error setting cache for key ${key}:`, error)
  }
}

/**
 * Delete specific cache key from Redis
 */
async function _deleteRedisCache(key: string): Promise<void> {
  const redis = getRedisClient()
  if (!redis) return

  try {
    await redis.del(key)
  } catch (error) {
    console.error(`[Redis] Error deleting cache for key ${key}:`, error)
  }
}

/**
 * Clear all buildout cache keys from Redis
 */
async function clearAllRedisCache(): Promise<void> {
  const redis = getRedisClient()
  if (!redis) return

  try {
    // Delete all buildout cache keys
    const keys = await redis.keys('buildout:*')
    if (keys.length > 0) {
      await redis.del(...keys)
      console.log(`[Redis] Deleted ${keys.length} cache keys`)
    }
  } catch (error) {
    console.error('[Redis] Error clearing cache:', error)
  }
}

// ----------------------------------------------------------------------
// Distance Utilities
// ----------------------------------------------------------------------

/**
 * Calculate distance between two points using the Haversine formula
 * Returns distance in miles
 */
function calculateDistanceMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export interface NearestPropertiesOptions {
  /** The property to find neighbors for */
  currentProperty: BuildoutProperty
  /** Maximum number of properties to return (default: 4) */
  limit?: number
  /** Skip cache when fetching properties */
  skipCache?: boolean
}

export interface NearestPropertiesResult {
  properties: BuildoutProperty[]
  /** Whether we fell back to all types (true) or stayed with same type (false) */
  usedFallback: boolean
}

/**
 * Find nearest properties to a given property.
 * Prioritizes properties of the same type, falls back to all types if not enough.
 * Results are cached in Redis.
 */
export async function getNearestProperties(
  options: NearestPropertiesOptions
): Promise<NearestPropertiesResult> {
  const { currentProperty, limit = 4, skipCache } = options
  const { latitude, longitude, property_type_id, id } = currentProperty

  // Check cache first
  const cacheKey = CACHE_KEYS.NEAREST_PROPERTIES(id, limit)
  if (!skipCache) {
    const cached = await getFromRedisCache<NearestPropertiesResult>(cacheKey)
    if (cached) {
      return cached
    }
  }

  // Fetch all properties (uses its own cache)
  const allPropertiesResponse = await buildoutApi.getAllProperties({ skipCache })
  const allProperties = allPropertiesResponse.properties

  // Filter out the current property and properties without valid coordinates
  const otherProperties = allProperties.filter(
    (p) =>
      p.id !== id &&
      p.latitude !== null &&
      p.latitude !== undefined &&
      p.longitude !== null &&
      p.longitude !== undefined &&
      // Only include published listings (either sale or lease)
      ((p.sale && p.sale_listing_published) || (p.lease && p.lease_listing_published))
  )

  // Add distance to each property
  const propertiesWithDistance = otherProperties.map((p) => ({
    property: p,
    distance: calculateDistanceMiles(latitude, longitude, p.latitude, p.longitude),
  }))

  // Sort by distance
  propertiesWithDistance.sort((a, b) => a.distance - b.distance)

  // First, try to get properties of the same type
  const sameTypeProperties = propertiesWithDistance.filter(
    (p) => p.property.property_type_id === property_type_id
  )

  // If we have enough same-type properties, return those
  if (sameTypeProperties.length >= limit) {
    const result: NearestPropertiesResult = {
      properties: sameTypeProperties.slice(0, limit).map((p) => p.property),
      usedFallback: false,
    }
    // Cache the result
    await setRedisCache(cacheKey, result)
    return result
  }

  // If not enough same-type properties, fill with nearest properties of any type
  // Start with same-type properties, then add from all types (avoiding duplicates)
  const resultIds = new Set<number>()
  const resultProperties: BuildoutProperty[] = []

  // Add same-type properties first
  for (const p of sameTypeProperties) {
    if (resultProperties.length >= limit) break
    resultProperties.push(p.property)
    resultIds.add(p.property.id)
  }

  // Fill remaining slots with nearest properties of any type
  for (const p of propertiesWithDistance) {
    if (resultProperties.length >= limit) break
    if (!resultIds.has(p.property.id)) {
      resultProperties.push(p.property)
      resultIds.add(p.property.id)
    }
  }

  const result: NearestPropertiesResult = {
    properties: resultProperties,
    usedFallback: sameTypeProperties.length < limit,
  }

  // Cache the result
  await setRedisCache(cacheKey, result)

  return result
}

// ----------------------------------------------------------------------
// API Client
// ----------------------------------------------------------------------

class BuildoutApiClient {

  /**
   * Helper: fetches ALL items from a paginated Buildout endpoint.
   * This handles the looping internally.
   */
  private async fetchAllFromEndpoint<TResponse extends { count: number; [key: string]: unknown }>(
    endpoint: string,
    arrayKey: string
  ): Promise<TResponse> {
    const batchSize = 100 // Buildout max limit per request usually
    let offset = 0
    const allItems: unknown[] = []
    
    // 1. Initial Fetch
    const firstResponse = await fetchFromBuildout<TResponse>(endpoint, { limit: batchSize, offset: 0 })
    
    // Dynamic access to array key - safe because we know TResponse has this key
    const firstBatch = (firstResponse as Record<string, unknown[]>)[arrayKey] as unknown[]
    allItems.push(...firstBatch)
    const totalCount = firstResponse.count
    
    // 2. Fetch remaining if necessary
    if (allItems.length < totalCount) {
      const promises: Promise<TResponse>[] = []
      
      for (offset = batchSize; offset < totalCount; offset += batchSize) {
        promises.push(
          fetchFromBuildout<TResponse>(endpoint, { limit: batchSize, offset })
        )
      }

      const responses = await Promise.all(promises)
      responses.forEach((res) => {
        // @ts-ignore
        allItems.push(...res[arrayKey])
      })
    }

    // Return a constructed response matching the original type structure
    return {
      ...firstResponse,
      count: allItems.length, // Ensure count matches actual retrieved
      [arrayKey]: allItems
    }
  }

  /**
   * Get ALL properties.
   * Uses Redis caching to share cache across all serverless instances.
   */
  async getAllProperties(
    options?: {
      skipCache?: boolean
      limit?: number
      brokerId?: number
      [key: string]: string | number | boolean | undefined
    }
  ): Promise<ListPropertiesResponse> {
    if (!options?.skipCache) {
      const cached = await getFromRedisCache<ListPropertiesResponse>(CACHE_KEYS.PROPERTIES)
      if (cached) return cached
    }

    const data = await this.fetchAllFromEndpoint<ListPropertiesResponse>('/properties.json', 'properties')
    
    // Save to Redis cache
    await setRedisCache(CACHE_KEYS.PROPERTIES, data)
    
    return data
  }

  /**
   * Get ALL brokers.
   * Uses Redis caching to share cache across all serverless instances.
   */
  async getAllBrokers(
    options?: {
      skipCache?: boolean
      limit?: number
    }
  ): Promise<ListBrokersResponse> {
    if (!options?.skipCache) {
      const cached = await getFromRedisCache<ListBrokersResponse>(CACHE_KEYS.BROKERS)
      if (cached) return cached
    }

    const data = await this.fetchAllFromEndpoint<ListBrokersResponse>('/brokers.json', 'brokers')
    
    await setRedisCache(CACHE_KEYS.BROKERS, data)
    
    return data
  }

  /**
   * Search properties.
   * Allows parameters, but filters on the cached dataset in memory.
   */
  async searchProperties(
    options?: {
      skipCache?: boolean
      limit?: number
      offset?: number
      [key: string]: string | number | boolean | undefined
    }
  ): Promise<ListPropertiesResponse> {
    // 1. Get the full cached dataset (Handles the >2MB issue via in-memory cache)
    const allData = await this.getAllProperties({ skipCache: options?.skipCache })
    let filtered = allData.properties

    // 2. Apply In-Memory Filtering
    if (options) {
      filtered = filtered.filter(p => {
        for (const [key, value] of Object.entries(options)) {
          // Skip pagination/cache keys
          if (['limit', 'offset', 'skipCache'].includes(key)) continue
          
          if (value === undefined || value === null || value === '') continue

          // Handle generic loose matching
          // @ts-ignore - dynamic access
          const propValue = p[key]

          // Array matching (e.g. broker_ids)
          if (Array.isArray(propValue)) {
            if (!propValue.includes(value)) return false
          }
          // Boolean matching
          else if (typeof propValue === 'boolean') {
             if (String(propValue) !== String(value)) return false
          }
          // String/Number matching
          else if (propValue != value) {
            // loose equality for string vs number, strictly no match
            return false
          }
        }
        return true
      })
    }

    // 3. Apply Pagination
    const limit = options?.limit ?? 20 // default to 20 if not set, unlike getAll which is infinite
    const offset = options?.offset ?? 0
    const paginated = filtered.slice(offset, offset + limit)

    return {
      message: 'Filtered from cache',
      count: filtered.length, // Count represents total MATCHING items
      properties: paginated
    }
  }

  /**
   * Find broker ID by email using cached list
   */
  async findBrokerIdByEmail(
    email: string,
    options?: { skipCache?: boolean }
  ): Promise<number | null> {
    const data = await this.getAllBrokers({ skipCache: options?.skipCache })
    const broker = data.brokers.find(b => b.email.toLowerCase() === email.toLowerCase())
    return broker ? broker.id : null
  }

  /**
   * Get broker by email using cached list
   */
  async getBrokerByEmail(
    email: string,
    options?: { skipCache?: boolean }
  ): Promise<BuildoutBroker | null> {
    const data = await this.getAllBrokers({ skipCache: options?.skipCache })
    return data.brokers.find(b => b.email.toLowerCase() === email.toLowerCase()) ?? null
  }

  /**
   * Get properties by broker ID using cached list and search filter
   */
  async getPropertiesByBrokerId(
    brokerId: number,
    options?: {
      skipCache?: boolean
      limit?: number
      offset?: number
    }
  ): Promise<ListPropertiesResponse> {
    return this.searchProperties({
      broker_id: brokerId,
      ...options
    })
  }

  /**
   * Get a single property by ID.
   * Uses Redis caching to share cache across all serverless instances.
   * Server-side only.
   */
  async getPropertyById(
    id: number,
    options?: {
      skipCache?: boolean
    }
  ): Promise<BuildoutProperty> {
    const cacheKey = CACHE_KEYS.PROPERTY_BY_ID(id)
    
    if (!options?.skipCache) {
      const cached = await getFromRedisCache<BuildoutProperty>(cacheKey)
      if (cached) return cached
    }

    const data = await fetchFromBuildout<BuildoutProperty>(`/properties/${id}.json`)
    
    // Save to Redis cache
    await setRedisCache(cacheKey, data)
    
    return data
  }
}

// ----------------------------------------------------------------------
// Export Singleton
// ----------------------------------------------------------------------

const instance = new BuildoutApiClient()

export const buildoutApi = {
  getInstance(): BuildoutApiClient {
    return instance
  },

  async findBrokerIdByEmail(email: string, options?: { skipCache?: boolean }): Promise<number | null> {
    return instance.findBrokerIdByEmail(email, options)
  },

  async getBrokerByEmail(email: string, options?: { skipCache?: boolean }): Promise<BuildoutBroker | null> {
    return instance.getBrokerByEmail(email, options)
  },

  async getPropertiesByBrokerId(
    brokerId: number,
    options?: { skipCache?: boolean; limit?: number; offset?: number }
  ): Promise<ListPropertiesResponse> {
    return instance.getPropertiesByBrokerId(brokerId, options)
  },

  async getAllProperties(
    options?: {
      skipCache?: boolean
      limit?: number
      brokerId?: number
      [key: string]: string | number | boolean | undefined
    }
  ): Promise<ListPropertiesResponse> {
    return instance.getAllProperties(options)
  },

  async getAllBrokers(options?: { skipCache?: boolean; limit?: number }): Promise<ListBrokersResponse> {
    return instance.getAllBrokers(options)
  },

  async searchProperties(
    options?: {
      skipCache?: boolean
      limit?: number
      offset?: number
      [key: string]: string | number | boolean | undefined
    }
  ): Promise<ListPropertiesResponse> {
    return instance.searchProperties(options)
  },

  async getPropertyById(
    id: number,
    options?: {
      skipCache?: boolean
    }
  ): Promise<BuildoutProperty> {
    return instance.getPropertyById(id, options)
  },

  async clearCache(): Promise<void> {
    // Clear Redis cache (all buildout keys)
    await clearAllRedisCache()
    
    // Clear Next.js route caches for all buildout API endpoints
    // This ensures route-level caches are also purged
    revalidatePath('/api/buildout/all-properties')
    revalidatePath('/api/buildout/brokers')
    revalidatePath('/api/buildout/search-properties')
    revalidatePath('/api/buildout/saved-properties')
    revalidatePath('/api/buildout/properties-by-broker-id')
    revalidatePath('/api/buildout/validate-broker-email')
    
    // Clear Next.js cache tag just in case
    revalidateTag('buildout-api')
    
    console.log('[Buildout API Cache] Cleared all caches (Redis + Next.js routes)')
  },

  async getCacheStatus(): Promise<{ enabled: boolean; ttl: number; size: number; redisConnected: boolean }> {
    const redis = getRedisClient()
    let size = 0
    
    if (redis) {
      try {
        const cached = await getFromRedisCache<ListPropertiesResponse>(CACHE_KEYS.PROPERTIES)
        if (cached) {
          size = cached.properties?.length || 0
        }
      } catch (error) {
        console.error('[Redis] Error getting cache status:', error)
      }
    }
    
    return {
      enabled: ENABLE_CACHE,
      ttl: CACHE_TTL_SECONDS,
      size,
      redisConnected: redis !== null,
    }
  },
}