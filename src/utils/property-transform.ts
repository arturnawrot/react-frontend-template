import type { BuildoutProperty } from './buildout-api'

export interface PropertyCardData {
  id: number
  address: string
  cityStateZip: string
  price: string
  sqft: string
  type: string
  agent: string
  image: string
  badges?: Array<{ text: string; color: string }>
  latitude: number
  longitude: number
}

/**
 * Transform BuildoutProperty to PropertyCard format
 */
export function transformPropertyToCard(
  property: BuildoutProperty,
  agentName: string = 'Agent'
): PropertyCardData {
  // Format address
  const address = property.address || property.name || 'Property'
  const cityStateZip = [property.city, property.state, property.zip].filter(Boolean).join(', ')
  
  // Format price
  let price = 'Price on Request'
  if (property.sale_price_dollars) {
    price = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(property.sale_price_dollars)
  } else if (property.lease_listing_published) {
    price = 'Lease Available'
  }
  
  // Format square footage
  const sqft = property.building_size_sf
    ? `${property.building_size_sf.toLocaleString()} SF`
    : ''
  
  // Get property type
  const type = property.property_type_label_override || property.property_type_id?.toString() || 'Property'
  
  // Get image
  const image = property.photos && property.photos.length > 0
    ? property.photos[0].formats?.large || property.photos[0].url || ''
    : ''
  
  // Build badges
  const badges: Array<{ text: string; color: string }> = []
  if (property.sale && property.sale_listing_published) {
    badges.push({ text: 'For Sale', color: 'bg-[#CDDC39]' })
  }
  if (property.lease && property.lease_listing_published) {
    badges.push({ text: 'For Lease', color: 'bg-[#D4E157]' })
  }
  // Check if it's a new listing (recently created)
  const createdAt = new Date(property.created_at)
  const daysSinceCreated = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  if (daysSinceCreated < 30) {
    badges.push({ text: 'New Listing', color: 'bg-[#D4E157]' })
  }
  
  return {
    id: property.id,
    address,
    cityStateZip,
    price,
    sqft,
    type,
    agent: agentName,
    image,
    badges: badges.length > 0 ? badges : undefined,
    latitude: property.latitude,
    longitude: property.longitude,
  }
}


