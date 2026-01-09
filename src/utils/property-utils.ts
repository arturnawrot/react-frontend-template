import type { PropertyCardData } from './property-transform'

/**
 * Format price as currency
 */
export function formatPrice(price: number | null | undefined): string {
  if (!price) {
    return 'Price on Request'
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Filter properties to only those with valid coordinates
 * Used across multiple components for map display
 */
export function filterValidCoordinates(
  properties: PropertyCardData[]
): PropertyCardData[] {
  return properties.filter(
    (prop) =>
      prop.latitude &&
      prop.longitude &&
      !isNaN(prop.latitude) &&
      !isNaN(prop.longitude)
  )
}

