import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Navbar as NavbarType } from '@/payload-types'
import { resolveLink, getConstantLinksMap, type ConstantLinksMap, type LinkData, type ResolvedLink } from './linkResolver'

export interface DropdownColumn {
  columnName: string
  links: (ResolvedLink & { label: string })[]
  bottomLink?: ResolvedLink & { label: string }
}

export interface DropdownQuote {
  text: string
  highlightedText?: string
  author: string
  company?: string
}

export type NavbarLinkWithDropdown = ResolvedLink & {
  label: string
  hasDropdown: boolean
  dropdownColumns?: DropdownColumn[]
  quote?: DropdownQuote
}

export interface NavbarData {
  upperLinks: NavbarLinkWithDropdown[]
  mainLinks: NavbarLinkWithDropdown[]
}

function resolveNavLink(link: {
  linkType?: string | null
  page?: unknown
  customUrl?: string | null
  constantLink?: string | null
  calLink?: string | null
  calNamespace?: string | null
  openInNewTab?: boolean | null
}, constantLinksMap: ConstantLinksMap): ResolvedLink {
  return resolveLink(
    {
      linkType: link.linkType ?? undefined,
      page: link.page as LinkData['page'],
      customUrl: link.customUrl,
      constantLink: link.constantLink,
      calLink: link.calLink,
      calNamespace: link.calNamespace,
      openInNewTab: link.openInNewTab ?? false,
    } as LinkData,
    constantLinksMap,
  )
}

function transformDropdownColumns(
  rawColumns: NonNullable<NonNullable<NavbarType['mainLinks']>[number]['dropdownColumns']>,
  constantLinksMap: ConstantLinksMap,
): DropdownColumn[] {
  return rawColumns.map((col) => ({
    columnName: col.columnName || '',
    links:
      col.links?.map((link) => ({
        label: link.label || '',
        ...resolveNavLink(link, constantLinksMap),
      })) || [],
    bottomLink:
      col.bottomLink?.enabled && col.bottomLink.label
        ? {
            label: col.bottomLink.label,
            ...resolveNavLink(col.bottomLink, constantLinksMap),
          }
        : undefined,
  }))
}

export async function getNavbarLinks(): Promise<NavbarData> {
  const payload = await getPayload({ config })

  let navbar: NavbarType | null = null
  try {
    navbar = await payload.findGlobal({ slug: 'navbar', depth: 2 })
  } catch (error) {
    console.error('Error fetching navbar:', error)
  }

  const constantLinksMap = await getConstantLinksMap(payload)

  function extractQuote(link: { dropdownQuote?: { text?: string | null; highlightedText?: string | null; author?: string | null; company?: string | null } | null }): DropdownQuote | undefined {
    const raw = link.dropdownQuote
    const text = raw?.text?.trim()
    const author = raw?.author?.trim()
    if (!text || !author) return undefined
    return {
      text,
      highlightedText: raw?.highlightedText?.trim() || undefined,
      author,
      company: raw?.company?.trim() || undefined,
    }
  }

  const upperLinks: NavbarLinkWithDropdown[] =
    navbar?.upperLinks?.map((link) => ({
      label: link.label || '',
      ...resolveNavLink(link, constantLinksMap),
      hasDropdown: link.hasDropdown || false,
      dropdownColumns:
        link.hasDropdown && link.dropdownColumns
          ? transformDropdownColumns(link.dropdownColumns, constantLinksMap)
          : undefined,
      quote: link.hasDropdown ? extractQuote(link) : undefined,
    })) || []

  const mainLinks: NavbarLinkWithDropdown[] =
    navbar?.mainLinks?.map((link) => ({
      label: link.label || '',
      ...resolveNavLink(link, constantLinksMap),
      hasDropdown: link.hasDropdown || false,
      dropdownColumns:
        link.hasDropdown && link.dropdownColumns
          ? transformDropdownColumns(link.dropdownColumns, constantLinksMap)
          : undefined,
      quote: link.hasDropdown ? extractQuote(link) : undefined,
    })) || []

  return { upperLinks, mainLinks }
}
