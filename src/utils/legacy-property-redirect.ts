import { buildoutApi } from '@/utils/buildout-api'
import type { BuildoutProperty } from '@/utils/buildout-api'
import { addressToSlug } from '@/utils/address-slug'

/**
 * Resolves a legacy property redirect by matching a Buildout listing slug
 * (sale_listing_slug or lease_listing_slug).
 *
 * Returns the target path (e.g. "/property/105-lancaster-st-sw") or null if no match.
 */
export async function resolvePropertyRedirect(slug: string): Promise<string | null> {
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

/**
 * Resolves a legacy property redirect by 7-digit Buildout property ID.
 *
 * Returns the target path or null if no match.
 */
export async function resolvePropertyIdRedirect(propertyId: string): Promise<string | null> {
  const match = propertyId.match(/\d{7}/)
  if (!match) return null

  try {
    const property = await buildoutApi.getPropertyById(parseInt(match[0], 10))
    if (property) {
      const addressSlug = addressToSlug(property.address || property.name || match[0])
      return `/property/${addressSlug}`
    }
  } catch { /* not found */ }

  return null
}
