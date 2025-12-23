/**
 * Converts a page slug to its URL path.
 * The "home" slug maps to "/" (root), all other slugs map to "/{slug}".
 */
export function getPageUrl(slug: string | null | undefined): string {
  if (!slug) return '/'
  return slug === 'home' ? '/' : `/${slug}`
}

