import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Footer as FooterType } from '@/payload-types'
import { resolveLink, getConstantLinksMap, type ResolvedLink, type LinkData } from './linkResolver'

export type FooterLink = ResolvedLink & { label: string }

export interface FooterOffice {
  label?: string
  address: string
  phone?: string
  fax?: string
  tollFree?: string
}

export interface FooterData {
  navigationColumns: FooterLink[][]
  offices: FooterOffice[]
  socialMedia: {
    facebook?: string
    linkedin?: string
  }
  bottomBar: {
    copyrightText: string
    policyLinks: FooterLink[]
  }
}

function resolveFooterLink(link: {
  label?: string | null
  linkType?: string | null
  page?: unknown
  customUrl?: string | null
  constantLink?: string | null
  calLink?: string | null
  calNamespace?: string | null
  openInNewTab?: boolean | null
}, constantLinksMap: Parameters<typeof resolveLink>[1]): FooterLink {
  return {
    label: link.label || '',
    ...resolveLink(
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
    ),
  }
}

export async function getFooterData(): Promise<FooterData> {
  const payload = await getPayload({ config })

  let footer: FooterType | null = null
  try {
    footer = await payload.findGlobal({ slug: 'footer', depth: 2 })
  } catch (error) {
    console.error('Error fetching footer:', error)
  }

  const constantLinksMap = await getConstantLinksMap(payload)

  const navigationColumns: FooterLink[][] =
    footer?.navigationColumns?.map((column) =>
      column.links?.map((link) => resolveFooterLink(link, constantLinksMap)) ?? []
    ) ?? []

  const offices: FooterOffice[] =
    footer?.offices?.map((office) => ({
      label: office.label || undefined,
      address: office.address || '',
      phone: office.phone || undefined,
      fax: office.fax || undefined,
      tollFree: office.tollFree || undefined,
    })) ?? []

  const socialMedia = {
    facebook: footer?.socialMedia?.facebook || undefined,
    linkedin: footer?.socialMedia?.linkedin || undefined,
  }

  const policyLinks: FooterLink[] =
    footer?.bottomBar?.policyLinks?.map((link) => resolveFooterLink(link, constantLinksMap)) ?? []

  return {
    navigationColumns,
    offices,
    socialMedia,
    bottomBar: {
      copyrightText: footer?.bottomBar?.copyrightText || '© 2025 Real Estate Co. All rights reserved.',
      policyLinks,
    },
  }
}
