/**
 * @deprecated This file is deprecated. Use transformPropertyToCard from '@/utils/property-transform' instead.
 * This file is kept for backward compatibility only.
 */

import type { BuildoutProperty } from '@/utils/buildout-api'
import { transformPropertyToCard, type PropertyCardData } from '@/utils/property-transform'

/**
 * @deprecated Use PropertyCardData from '@/utils/property-transform' instead
 */
export type TransformedProperty = Omit<PropertyCardData, 'latitude' | 'longitude'>

/**
 * @deprecated Use transformPropertyToCard from '@/utils/property-transform' instead
 * Transforms a Buildout property to PropertyCard format
 */
export function transformBuildoutProperty(
  property: BuildoutProperty,
  agentName: string,
  agentImage?: string | null
): TransformedProperty {
  const transformed = transformPropertyToCard(property, agentName, agentImage)
  // Remove latitude/longitude for backward compatibility
  const { latitude, longitude, ...rest } = transformed
  return rest
}

