import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Navbar as NavbarType, Page } from '@/payload-types'
import { getPageUrl } from './getPageUrl'
import { getConstantLinksMap, type ConstantLinksMap } from './linkResolver'

// Types for dropdown columns
export interface DropdownLink {
  label: string
  href: string
  openInNewTab?: boolean
}

export interface DropdownColumn {
  columnName: string
  links: DropdownLink[]
  bottomLink?: {
    label: string
    href: string
    openInNewTab?: boolean
  }
}

export interface DropdownQuote {
  text: string
  highlightedText?: string
  author: string
  company?: string
}

export interface NavbarLinkWithDropdown {
  label: string
  href: string
  openInNewTab?: boolean
  hasDropdown: boolean
  dropdownColumns?: DropdownColumn[]
}

export interface NavbarData {
  upperLinks: NavbarLinkWithDropdown[]
  mainLinks: NavbarLinkWithDropdown[]
  dropdownQuote?: DropdownQuote
}

// Helper to resolve page, custom URL, or constant link
function resolveHref(
  linkType: 'none' | 'page' | 'custom' | 'constant' | 'cal' | null | undefined,
  page: (string | null) | Page | undefined,
  customUrl: string | null | undefined,
  constantLink: string | null | undefined,
  constantLinksMap: ConstantLinksMap,
): string {
  if (linkType === 'none') {
    return '#'
  } else if (linkType === 'page' && typeof page === 'object' && page !== null) {
    return getPageUrl(page.slug)
  } else if (linkType === 'custom' && customUrl) {
    return customUrl
  } else if (linkType === 'constant' && constantLink) {
    // Look up constant link from the map
    if (constantLinksMap instanceof Map) {
      return constantLinksMap.get(constantLink) || '#'
    }
    return constantLinksMap[constantLink] || '#'
  }
  return '#'
}

// Transform raw dropdown columns from Payload
function transformDropdownColumns(
  rawColumns: NonNullable<NonNullable<NavbarType['mainLinks']>[number]['dropdownColumns']>,
  constantLinksMap: ConstantLinksMap,
): DropdownColumn[] {
  return rawColumns.map((col) => ({
    columnName: col.columnName || '',
    links:
      col.links?.map((link) => ({
        label: link.label || '',
        href: resolveHref(link.linkType, link.page, link.customUrl, link.constantLink, constantLinksMap),
        openInNewTab: link.openInNewTab || false,
      })) || [],
    bottomLink:
      col.bottomLink?.enabled && col.bottomLink.label
        ? {
            label: col.bottomLink.label,
            href: resolveHref(col.bottomLink.linkType, col.bottomLink.page, col.bottomLink.customUrl, col.bottomLink.constantLink, constantLinksMap),
            openInNewTab: col.bottomLink.openInNewTab || false,
          }
        : undefined,
  }))
}

/**
 * Fetches navbar data from Payload and transforms it to NavbarLinkWithDropdown format
 */
export async function getNavbarLinks(): Promise<NavbarData> {
  const payload = await getPayload({ config })

  let navbar: NavbarType | null = null
  try {
    navbar = await payload.findGlobal({
      slug: 'navbar',
      depth: 2, // Populate page relationships in dropdowns
    })
  } catch (error) {
    console.error('Error fetching navbar:', error)
  }

  // Fetch constant links for resolving constant link types
  const constantLinksMap = await getConstantLinksMap(payload)

  // Transform dropdown quote - check for non-empty text and author
  const rawQuote = navbar?.dropdownQuote
  const quoteText = rawQuote?.text?.trim()
  const quoteAuthor = rawQuote?.author?.trim()
  
  // Debug logging
  console.log('[Navbar] Raw dropdownQuote from Payload:', JSON.stringify(rawQuote, null, 2))
  console.log('[Navbar] quoteText:', quoteText, '| quoteAuthor:', quoteAuthor)
  
  const dropdownQuote: DropdownQuote | undefined =
    quoteText && quoteAuthor
      ? {
          text: quoteText,
          highlightedText: rawQuote?.highlightedText?.trim() || undefined,
          author: quoteAuthor,
          company: rawQuote?.company?.trim() || undefined,
        }
      : undefined
  
  console.log('[Navbar] Final dropdownQuote:', dropdownQuote ? 'exists' : 'undefined')

  // Transform upper links
  const upperLinks: NavbarLinkWithDropdown[] =
    navbar?.upperLinks?.map((link) => ({
      label: link.label || '',
      href: resolveHref(link.linkType, link.page, link.customUrl, link.constantLink, constantLinksMap),
      openInNewTab: link.openInNewTab || false,
      hasDropdown: link.hasDropdown || false,
      dropdownColumns: link.hasDropdown && link.dropdownColumns
        ? transformDropdownColumns(link.dropdownColumns, constantLinksMap)
        : undefined,
    })) || []

  // Transform main links
  const mainLinks: NavbarLinkWithDropdown[] =
    navbar?.mainLinks?.map((link) => ({
      label: link.label || '',
      href: resolveHref(link.linkType, link.page, link.customUrl, link.constantLink, constantLinksMap),
      openInNewTab: link.openInNewTab || false,
      hasDropdown: link.hasDropdown || false,
      dropdownColumns: link.hasDropdown && link.dropdownColumns
        ? transformDropdownColumns(link.dropdownColumns, constantLinksMap)
        : undefined,
    })) || []

  return { upperLinks, mainLinks, dropdownQuote }
}







