import { getPageUrl } from './getPageUrl'
import type { Payload } from 'payload'

/**
 * Resolved link properties for rendering
 */
export interface ResolvedLink {
  href: string | null
  openInNewTab: boolean
  disabled: boolean
  calLink?: string | null
  calNamespace?: string | null
}

/**
 * Map of constant link keys to resolved link data
 */
export type ConstantLinksMap = Map<string, ResolvedLink> | Record<string, ResolvedLink>

/**
 * Module-level cache for constant links map
 * This allows resolveLinkUrl to automatically use constant links without requiring
 * each component to pass constantLinksMap explicitly
 */
let cachedConstantLinksMap: ConstantLinksMap | null = null

/**
 * Sets the cached constant links map for automatic resolution
 * Should be called once after fetching constant links (e.g., in renderBlocks)
 */
export function setCachedConstantLinksMap(map: ConstantLinksMap | null): void {
  cachedConstantLinksMap = map
}

/**
 * Gets the cached constant links map
 */
export function getCachedConstantLinksMap(): ConstantLinksMap | null {
  return cachedConstantLinksMap
}

/**
 * Fetches constant links from the global and returns a map of key -> ResolvedLink
 * Can be used in server components to pre-fetch constant links
 */
export async function getConstantLinksMap(payload?: Payload): Promise<ConstantLinksMap> {
  if (!payload) {
    return new Map()
  }

  try {
    const global = await payload.findGlobal({
      slug: 'constantLinks',
      depth: 1, // Populate page relationships
    })

    if (!global?.links || !Array.isArray(global.links)) {
      return new Map()
    }

    const map = new Map<string, ResolvedLink>()
    for (const link of global.links) {
      if (!link.key) continue

      // Backward compatibility: legacy entries with url but no linkType
      if (!link.linkType && link.url) {
        map.set(link.key, {
          href: link.url,
          openInNewTab: link.openInNewTab || false,
          disabled: link.disabled || false,
        })
        continue
      }

      // Resolve using standard logic (no constantLinksMap to avoid circular refs)
      const isCal = link.linkType === 'cal'
      map.set(link.key, {
        href: resolveLinkUrl({
          linkType: link.linkType ?? undefined,
          page: link.page,
          customUrl: link.customUrl,
          calLink: link.calLink,
          calNamespace: link.calNamespace,
        }),
        openInNewTab: link.openInNewTab || false,
        disabled: link.disabled || false,
        calLink: isCal ? (link.calLink || null) : null,
        calNamespace: isCal ? (link.calNamespace || null) : null,
      })
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
export type LinkType = 'none' | 'page' | 'custom' | 'constant' | 'cal'

export function resolveLinkUrl(
  linkData: {
    linkType?: LinkType
    page?: string | { slug?: string; id?: string } | null
    customUrl?: string | null
    constantLink?: string | null
    calLink?: string | null
    calNamespace?: string | null
    openInNewTab?: boolean
    // Field prefixes for multiple links
    ctaPrimaryLinkType?: LinkType
    ctaPrimaryPage?: string | { slug?: string; id?: string } | null
    ctaPrimaryCustomUrl?: string | null
    ctaPrimaryConstantLink?: string | null
    ctaPrimaryCalLink?: string | null
    ctaPrimaryCalNamespace?: string | null
    ctaPrimaryOpenInNewTab?: boolean
    ctaSecondaryLinkType?: LinkType
    ctaSecondaryPage?: string | { slug?: string; id?: string } | null
    ctaSecondaryCustomUrl?: string | null
    ctaSecondaryConstantLink?: string | null
    ctaSecondaryCalLink?: string | null
    ctaSecondaryCalNamespace?: string | null
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
  let effectiveLinkType: LinkType | undefined
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
  } else if (effectiveLinkType === 'cal') {
    return null // Cal.com uses data attributes, not a URL
  } else if (effectiveLinkType === 'custom') {
    return effectiveCustomUrl || null
  } else if (effectiveLinkType === 'constant') {
    if (!effectiveConstantLink) {
      return null
    }
    // Use provided map, or fall back to cached map
    const mapToUse = constantLinksMap || cachedConstantLinksMap
    if (!mapToUse) {
      return null
    }
    // Support both Map and Record types — extract href from ResolvedLink
    const entry = mapToUse instanceof Map
      ? mapToUse.get(effectiveConstantLink)
      : mapToUse[effectiveConstantLink]
    return entry?.href || null
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
  linkType?: LinkType
  openInNewTab?: boolean
  // Field prefixes for multiple links
  ctaPrimaryLinkType?: LinkType
  ctaPrimaryOpenInNewTab?: boolean
  ctaSecondaryLinkType?: LinkType
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

/**
 * Checks if a link is disabled (renders as non-clickable text)
 * Supports both the new structure and legacy (defaults to false)
 */
export function isLinkDisabled(linkData: {
  linkType?: LinkType
  disabled?: boolean
  // Field prefixes for multiple links
  ctaPrimaryLinkType?: LinkType
  ctaPrimaryDisabled?: boolean
  ctaSecondaryLinkType?: LinkType
  ctaSecondaryDisabled?: boolean
}): boolean {
  // Check for prefixed fields first (for Hero CTAs)
  if (linkData.ctaPrimaryLinkType && linkData.ctaPrimaryLinkType !== 'none') {
    return linkData.ctaPrimaryDisabled || false
  }
  if (linkData.ctaSecondaryLinkType && linkData.ctaSecondaryLinkType !== 'none') {
    return linkData.ctaSecondaryDisabled || false
  }

  // Check standard field
  if (linkData.linkType && linkData.linkType !== 'none') {
    return linkData.disabled || false
  }

  return false
}

/**
 * Link data input type - supports all link field variations
 */
export type LinkData = {
  linkType?: LinkType
  page?: string | { slug?: string; id?: string } | null
  customUrl?: string | null
  constantLink?: string | null
  calLink?: string | null
  calNamespace?: string | null
  openInNewTab?: boolean
  disabled?: boolean
  // Field prefixes for multiple links
  ctaPrimaryLinkType?: LinkType
  ctaPrimaryPage?: string | { slug?: string; id?: string } | null
  ctaPrimaryCustomUrl?: string | null
  ctaPrimaryConstantLink?: string | null
  ctaPrimaryCalLink?: string | null
  ctaPrimaryCalNamespace?: string | null
  ctaPrimaryOpenInNewTab?: boolean
  ctaPrimaryDisabled?: boolean
  ctaSecondaryLinkType?: LinkType
  ctaSecondaryPage?: string | { slug?: string; id?: string } | null
  ctaSecondaryCustomUrl?: string | null
  ctaSecondaryConstantLink?: string | null
  ctaSecondaryCalLink?: string | null
  ctaSecondaryCalNamespace?: string | null
  ctaSecondaryOpenInNewTab?: boolean
  ctaSecondaryDisabled?: boolean
  // Legacy support
  href?: string | null
  linkHref?: string | null
  ctaHref?: string | null
  ctaPrimaryLink?: string | null
  ctaSecondaryLink?: string | null
}

/**
 * Unified link resolver - returns all link properties in one call
 * Use this instead of calling resolveLinkUrl, shouldOpenInNewTab, and isLinkDisabled separately
 * 
 * @example
 * const link = resolveLink(block)
 * // link = { href: '/about', openInNewTab: false, disabled: false }
 * 
 * <PrimaryButton href={link.href} openInNewTab={link.openInNewTab} disabled={link.disabled}>
 *   Click me
 * </PrimaryButton>
 */
export function resolveLink(
  linkData: LinkData,
  constantLinksMap?: ConstantLinksMap
): ResolvedLink {
  const effectiveLinkType = linkData.ctaPrimaryLinkType || linkData.ctaSecondaryLinkType || linkData.linkType

  // For constant links, return the full stored ResolvedLink directly
  if (effectiveLinkType === 'constant') {
    const constantKey = linkData.ctaPrimaryConstantLink || linkData.ctaSecondaryConstantLink || linkData.constantLink
    if (constantKey) {
      const mapToUse = constantLinksMap || cachedConstantLinksMap
      if (mapToUse) {
        const entry = mapToUse instanceof Map
          ? mapToUse.get(constantKey)
          : mapToUse[constantKey]
        if (entry) {
          // Cal.com links have href=null but need truthy href for component visibility checks.
          // Rendering components (BaseButton, ArrowLink, NavbarLink) check calLink first.
          if (entry.calLink && !entry.href) return { ...entry, href: '#' }
          return entry
        }
      }
    }
    return { href: null, openInNewTab: false, disabled: false }
  }

  const isCal = effectiveLinkType === 'cal'

  return {
    href: isCal ? '#' : resolveLinkUrl(linkData, constantLinksMap),
    openInNewTab: shouldOpenInNewTab(linkData),
    disabled: isLinkDisabled(linkData),
    calLink: isCal
      ? (linkData.ctaPrimaryCalLink ?? linkData.ctaSecondaryCalLink ?? linkData.calLink ?? null)
      : null,
    calNamespace: isCal
      ? (linkData.ctaPrimaryCalNamespace ?? linkData.ctaSecondaryCalNamespace ?? linkData.calNamespace ?? null)
      : null,
  }
}

/**
 * Resolves link with a specific field prefix
 * Useful for blocks with multiple links (e.g., buttonLinkType, buttonPage, etc.)
 * 
 * @example
 * const buttonLink = resolvePrefixedLink(block, 'button')
 * // Reads buttonLinkType, buttonPage, buttonCustomUrl, buttonConstantLink, buttonOpenInNewTab, buttonDisabled
 */
export function resolvePrefixedLink(
  data: Record<string, unknown>,
  prefix: string,
  constantLinksMap?: ConstantLinksMap
): ResolvedLink {
  const linkData: LinkData = {
    linkType: data[`${prefix}LinkType`] as LinkData['linkType'],
    page: data[`${prefix}Page`] as LinkData['page'],
    customUrl: data[`${prefix}CustomUrl`] as LinkData['customUrl'],
    constantLink: data[`${prefix}ConstantLink`] as LinkData['constantLink'],
    calLink: data[`${prefix}CalLink`] as LinkData['calLink'],
    calNamespace: data[`${prefix}CalNamespace`] as LinkData['calNamespace'],
    openInNewTab: data[`${prefix}OpenInNewTab`] as boolean,
    disabled: data[`${prefix}Disabled`] as boolean,
  }
  return resolveLink(linkData, constantLinksMap)
}
