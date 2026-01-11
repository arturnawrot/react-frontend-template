import { getPageUrl } from './getPageUrl'

/**
 * Resolves a link URL from the new linkType structure
 * Supports both the new structure (linkType, page, customUrl) and legacy structure (direct href)
 * Returns null if linkType is 'none' or no link is configured
 */
export function resolveLinkUrl(linkData: {
  linkType?: 'none' | 'page' | 'custom'
  page?: string | { slug?: string; id?: string } | null
  customUrl?: string | null
  openInNewTab?: boolean
  // Field prefixes for multiple links
  ctaPrimaryLinkType?: 'none' | 'page' | 'custom'
  ctaPrimaryPage?: string | { slug?: string; id?: string } | null
  ctaPrimaryCustomUrl?: string | null
  ctaPrimaryOpenInNewTab?: boolean
  ctaSecondaryLinkType?: 'none' | 'page' | 'custom'
  ctaSecondaryPage?: string | { slug?: string; id?: string } | null
  ctaSecondaryCustomUrl?: string | null
  ctaSecondaryOpenInNewTab?: boolean
  // Legacy support
  href?: string | null
  linkHref?: string | null
  ctaHref?: string | null
  ctaPrimaryLink?: string | null
  ctaSecondaryLink?: string | null
}): string | null {
  // New structure: check linkType first
  if (linkData.linkType === 'none') {
    return null
  }

  if (linkData.linkType === 'page') {
    const page = linkData.page
    if (typeof page === 'object' && page !== null && 'slug' in page) {
      return getPageUrl(page.slug)
    }
    if (typeof page === 'string') {
      // If it's just an ID, we'd need to fetch it, but for now return null
      // In practice, pages should be populated with depth
      return null
    }
    return null
  }

  if (linkData.linkType === 'custom') {
    return linkData.customUrl || null
  }

  // Legacy support: fall back to old field names
  const legacyUrl =
    linkData.href ||
    linkData.linkHref ||
    linkData.ctaHref ||
    linkData.ctaPrimaryLink ||
    linkData.ctaSecondaryLink

  return legacyUrl || null
}

/**
 * Checks if a link should open in a new tab
 * Supports both the new structure and legacy (defaults to false)
 */
export function shouldOpenInNewTab(linkData: {
  linkType?: 'none' | 'page' | 'custom'
  openInNewTab?: boolean
  // Field prefixes for multiple links
  ctaPrimaryLinkType?: 'none' | 'page' | 'custom'
  ctaPrimaryOpenInNewTab?: boolean
  ctaSecondaryLinkType?: 'none' | 'page' | 'custom'
  ctaSecondaryOpenInNewTab?: boolean
}): boolean {
  // Check for prefixed fields first (for Hero CTAs)
  if (linkData.ctaPrimaryLinkType && linkData.ctaPrimaryLinkType !== 'none') {
    return linkData.ctaPrimaryOpenInNewTab || false
  }
  if (linkData.ctaSecondaryLinkType && linkData.ctaSecondaryLinkType !== 'none') {
    return linkData.ctaSecondaryOpenInNewTab || false
  }

  // Check standard field
  if (linkData.linkType && linkData.linkType !== 'none') {
    return linkData.openInNewTab || false
  }

  return false
}
