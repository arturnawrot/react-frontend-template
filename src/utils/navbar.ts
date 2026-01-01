import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Navbar as NavbarType } from '@/payload-types'
import { getPageUrl } from './getPageUrl'
import type { NavbarLink } from '@/components/Navbar/Navbar'

/**
 * Fetches navbar data from Payload and transforms it to NavbarLink format
 */
export async function getNavbarLinks(): Promise<{
  upperLinks: NavbarLink[]
  mainLinks: NavbarLink[]
}> {
  const payload = await getPayload({ config })

  let navbar: NavbarType | null = null
  try {
    navbar = await payload.findGlobal({
      slug: 'navbar',
      depth: 1, // Populate page relationships
    })
  } catch (error) {
    console.error('Error fetching navbar:', error)
  }

  // Transform navbar data to NavbarLink format
  const upperLinks: NavbarLink[] =
    navbar?.upperLinks?.map((link) => {
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

  const mainLinks: NavbarLink[] =
    navbar?.mainLinks?.map((link) => {
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

  return { upperLinks, mainLinks }
}

