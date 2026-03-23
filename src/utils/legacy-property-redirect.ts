import { buildoutApi } from '@/utils/buildout-api'
import type { BuildoutProperty } from '@/utils/buildout-api'
import { addressToSlug } from '@/utils/address-slug'

/**
 * Resolves a legacy property redirect URL.
 *
 * Supports two formats:
 * 1. Buildout property ID (7-digit number in a query param)
 * 2. Buildout listing slug (sale_listing_slug or lease_listing_slug)
 *
 * Returns the target path (e.g. "/property/105-lancaster-st-sw") or null if no match.
 */

export async function resolvePropertyRedirect(slug: string, propertyId?: string | null): Promise<string | null> {
  // 1. Try property ID redirect (legacy /Property-Search?propertyId=1234567)
  if (propertyId) {
    const match = propertyId.match(/\d{7}/)
    if (match) {
      try {
        const property = await buildoutApi.getPropertyById(parseInt(match[0], 10))
        if (property) {
          const addressSlug = addressToSlug(property.address || property.name || match[0])
          return `/property/${addressSlug}`
        }
      } catch { /* not found */ }
    }
  }

  // 2. Try listing slug redirect (sale_listing_slug / lease_listing_slug)
  try {
    const allProperties = await buildoutApi.getAllProperties()
    const property = allProperties.properties.find(
      (p: BuildoutProperty) => p.sale_listing_slug === slug || p.lease_listing_slug === slug,
    )
    if (property) {
      const addressSlug = addressToSlug(property.address || property.name || String(property.id))
      return `/property/${addressSlug}`
    }
  } catch { /* not found */ }

  return null
}
