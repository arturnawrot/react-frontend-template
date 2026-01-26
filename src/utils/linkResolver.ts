import { getPageUrl } from './getPageUrl'
import type { Payload } from 'payload'

/**
 * Map of constant link keys to URLs
 */
export type ConstantLinksMap = Map<string, string> | Record<string, string>

/**
 * Fetches constant links from the global and returns a map of key -> URL
 * Can be used in server components to pre-fetch constant links
 */
export async function getConstantLinksMap(payload?: Payload): Promise<ConstantLinksMap> {
  if (!payload) {
    return new Map()
  }

  try {
    const global = await payload.findGlobal({
      slug: 'constantLinks',
    })

    if (!global?.links || !Array.isArray(global.links)) {
      return new Map()
    }

    const map = new Map<string, string>()
    for (const link of global.links) {
      if (link.key && link.url) {
        map.set(link.key, link.url)
      }
    }

    return map
  } catch (error) {
    console.error('Error fetching constant links:', error)
    return new Map()
  }
}

/**
 * Resolves a link URL from the new linkType structure
 * Supports both the new structure (linkType, page, customUrl, constantLink) and legacy structure (direct href)
 * Returns null if linkType is 'none' or no link is configured
 */
export function resolveLinkUrl(
  linkData: {
    linkType?: 'none' | 'page' | 'custom' | 'constant'
    page?: string | { slug?: string; id?: string } | null
    customUrl?: string | null
    constantLink?: string | null
    openInNewTab?: boolean
    // Field prefixes for multiple links
    ctaPrimaryLinkType?: 'none' | 'page' | 'custom' | 'constant'
    ctaPrimaryPage?: string | { slug?: string; id?: string } | null
    ctaPrimaryCustomUrl?: string | null
    ctaPrimaryConstantLink?: string | null
    ctaPrimaryOpenInNewTab?: boolean
    ctaSecondaryLinkType?: 'none' | 'page' | 'custom' | 'constant'
    ctaSecondaryPage?: string | { slug?: string; id?: string } | null
    ctaSecondaryCustomUrl?: string | null
    ctaSecondaryConstantLink?: string | null
    ctaSecondaryOpenInNewTab?: boolean
    // Legacy support
    href?: string | null
    linkHref?: string | null
    ctaHref?: string | null
    ctaPrimaryLink?: string | null
    ctaSecondaryLink?: string | null
  },
  constantLinksMap?: ConstantLinksMap
): string | null {
  // Determine the effective linkType and related fields
  // Check prefixed fields first (for Hero CTAs), then standard fields
  let effectiveLinkType: 'none' | 'page' | 'custom' | 'constant' | undefined
  let effectivePage: string | { slug?: string; id?: string } | null | undefined
  let effectiveCustomUrl: string | null | undefined
  let effectiveConstantLink: string | null | undefined

  if (linkData.ctaPrimaryLinkType) {
    effectiveLinkType = linkData.ctaPrimaryLinkType
    effectivePage = linkData.ctaPrimaryPage
    effectiveCustomUrl = linkData.ctaPrimaryCustomUrl
    effectiveConstantLink = linkData.ctaPrimaryConstantLink
  } else if (linkData.ctaSecondaryLinkType) {
    effectiveLinkType = linkData.ctaSecondaryLinkType
    effectivePage = linkData.ctaSecondaryPage
    effectiveCustomUrl = linkData.ctaSecondaryCustomUrl
    effectiveConstantLink = linkData.ctaSecondaryConstantLink
  } else {
    effectiveLinkType = linkData.linkType
    effectivePage = linkData.page
    effectiveCustomUrl = linkData.customUrl
    effectiveConstantLink = linkData.constantLink
  }

  // Handle the link type
  if (effectiveLinkType === 'none' || !effectiveLinkType) {
    // Fall through to legacy support
  } else if (effectiveLinkType === 'page') {
    if (typeof effectivePage === 'object' && effectivePage !== null && 'slug' in effectivePage) {
      return getPageUrl(effectivePage.slug)
    }
    if (typeof effectivePage === 'string') {
      // If it's just an ID, we'd need to fetch it, but for now return null
      // In practice, pages should be populated with depth
      return null
    }
    return null
  } else if (effectiveLinkType === 'custom') {
    return effectiveCustomUrl || null
  } else if (effectiveLinkType === 'constant') {
    if (!effectiveConstantLink || !constantLinksMap) {
      return null
    }
    // Support both Map and Record types
    if (constantLinksMap instanceof Map) {
      return constantLinksMap.get(effectiveConstantLink) || null
    }
    return constantLinksMap[effectiveConstantLink] || null
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
  linkType?: 'none' | 'page' | 'custom' | 'constant'
  openInNewTab?: boolean
  // Field prefixes for multiple links
  ctaPrimaryLinkType?: 'none' | 'page' | 'custom' | 'constant'
  ctaPrimaryOpenInNewTab?: boolean
  ctaSecondaryLinkType?: 'none' | 'page' | 'custom' | 'constant'
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
