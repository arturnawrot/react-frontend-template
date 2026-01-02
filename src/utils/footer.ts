import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Footer as FooterType } from '@/payload-types'
import { getPageUrl } from './getPageUrl'

export interface FooterLink {
  label: string
  href: string
}

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

/**
 * Fetches footer data from Payload and transforms it to FooterData format
 */
export async function getFooterData(): Promise<FooterData> {
  const payload = await getPayload({ config })

  let footer: FooterType | null = null
  try {
    footer = await payload.findGlobal({
      slug: 'footer',
      depth: 1, // Populate page relationships
    })
  } catch (error) {
    console.error('Error fetching footer:', error)
  }

  // Transform navigation columns
  const navigationColumns: FooterLink[][] =
    footer?.navigationColumns?.map((column) => {
      return (
        column.links?.map((link) => {
          if (link.linkType === 'page' && typeof link.page === 'object' && link.page !== null) {
            return {
              label: link.label || '',
              href: getPageUrl(link.page.slug),
            }
          } else if (link.linkType === 'custom') {
            return {
              label: link.label || '',
              href: link.customUrl || '#',
            }
          }
          return {
            label: link.label || '',
            href: '#',
          }
        }) || []
      )
    }) || []

  // Transform offices
  const offices: FooterOffice[] =
    footer?.offices?.map((office) => ({
      label: office.label || undefined,
      address: office.address || '',
      phone: office.phone || undefined,
      fax: office.fax || undefined,
      tollFree: office.tollFree || undefined,
    })) || []

  // Transform social media
  const socialMedia = {
    facebook: footer?.socialMedia?.facebook || undefined,
    linkedin: footer?.socialMedia?.linkedin || undefined,
  }

  // Transform policy links
  const policyLinks: FooterLink[] =
    footer?.bottomBar?.policyLinks?.map((link) => {
      if (link.linkType === 'page' && typeof link.page === 'object' && link.page !== null) {
        return {
          label: link.label || '',
          href: getPageUrl(link.page.slug),
        }
      } else if (link.linkType === 'custom') {
        return {
          label: link.label || '',
          href: link.customUrl || '#',
        }
      }
      return {
        label: link.label || '',
        href: '#',
      }
    }) || []

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

