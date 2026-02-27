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
}

export interface NavbarData {
  upperLinks: NavbarLinkWithDropdown[]
  mainLinks: NavbarLinkWithDropdown[]
  dropdownQuote?: DropdownQuote
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

  const rawQuote = navbar?.dropdownQuote
  const quoteText = rawQuote?.text?.trim()
  const quoteAuthor = rawQuote?.author?.trim()

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

  const upperLinks: NavbarLinkWithDropdown[] =
    navbar?.upperLinks?.map((link) => ({
      label: link.label || '',
      ...resolveNavLink(link, constantLinksMap),
      hasDropdown: link.hasDropdown || false,
      dropdownColumns:
        link.hasDropdown && link.dropdownColumns
          ? transformDropdownColumns(link.dropdownColumns, constantLinksMap)
          : undefined,
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
    })) || []

  return { upperLinks, mainLinks, dropdownQuote }
}
