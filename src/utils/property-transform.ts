import type { BuildoutProperty, LightweightProperty } from './buildout-api'
import { getPropertyTypeLabel } from './property-types'

export interface PropertyCardData {
  id: number
  address: string
  cityStateZip: string
  price: string
  sqft: string
  type: string
  agent: string
  agentImage?: string | null
  agentSlug?: string | null
  brokerId?: number | null
  image: string
  badges?: Array<{ text: string; color: string }>
  latitude: number
  longitude: number
}

// Common property fields interface for unified transformation
interface PropertyLike {
  id: number
  address?: string | null
  name?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  sale_price_dollars?: number | null
  lease_listing_published?: boolean | null
  building_size_sf?: number | null
  property_type_id?: number | null
  property_type_label_override?: string | null
  photos?: Array<{ formats?: { large?: string } | null; url?: string | null }> | null
  sale?: boolean | null
  sale_listing_published?: boolean | null
  lease?: boolean | null
  created_at?: string | null
  broker_id?: number | null
  broker_ids?: number[] | null
  latitude: number
  longitude: number
}

/**
 * Unified property transformation function
 * Works with both BuildoutProperty and LightweightProperty
 */
export function transformPropertyToCard(
  property: BuildoutProperty | LightweightProperty,
  agentName: string = 'Agent',
  agentImage?: string | null,
  agentSlug?: string | null
): PropertyCardData {
  const prop = property as PropertyLike

  // Format address
  const address = prop.address || prop.name || 'Property'
  const cityStateZip = [prop.city, prop.state, prop.zip].filter(Boolean).join(', ')
  
  // Format price
  let price = 'Price on Request'
  if (prop.sale_price_dollars) {
    price = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(prop.sale_price_dollars)
  } else if (prop.lease_listing_published) {
    price = 'Lease Available'
  }
  
  // Format square footage
  const sqft = prop.building_size_sf
    ? `${prop.building_size_sf.toLocaleString()} SF`
    : ''
  
  // Get property type
  const type = prop.property_type_label_override || getPropertyTypeLabel(prop.property_type_id)
  
  // Get image - handle both BuildoutProperty (with formats) and LightweightProperty (url only)
  const image = prop.photos && prop.photos.length > 0
    ? (prop.photos[0] as any).formats?.large || prop.photos[0].url || ''
    : ''
  
  // Build badges
  const badges: Array<{ text: string; color: string }> = []
  if (prop.sale && prop.sale_listing_published) {
    badges.push({ text: 'For Sale', color: 'bg-[#CDDC39]' })
  }
  if (prop.lease && prop.lease_listing_published) {
    badges.push({ text: 'For Lease', color: 'bg-[#D4E157]' })
  }
  // Check if it's a new listing (recently created)
  if (prop.created_at) {
    const createdAt = new Date(prop.created_at)
    const daysSinceCreated = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceCreated < 30) {
      badges.push({ text: 'New Listing', color: 'bg-[#D4E157]' })
    }
  }
  
  // Get broker ID - handle both single broker_id and broker_ids array
  const brokerId = prop.broker_id || (prop.broker_ids && prop.broker_ids[0]) || null
  
  return {
    id: prop.id,
    address,
    cityStateZip,
    price,
    sqft,
    type,
    agent: agentName,
    agentImage,
    agentSlug,
    brokerId,
    image,
    badges: badges.length > 0 ? badges : undefined,
    latitude: prop.latitude,
    longitude: prop.longitude,
  }
}

/**
 * @deprecated Use transformPropertyToCard instead
 * Kept for backward compatibility
 */
export function transformLightweightPropertyToCard(
  property: LightweightProperty,
  agentName: string = 'Agent',
  agentImage?: string | null,
  agentSlug?: string | null
): PropertyCardData {
  return transformPropertyToCard(property, agentName, agentImage, agentSlug)
}



