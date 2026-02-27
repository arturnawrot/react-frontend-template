import type { Metadata } from 'next'
import type { Media, PageSeo } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@/payload.config'

export interface SeoData {
  title?: string | null
  description?: string | null
  image?: Media | string | number | null
  noIndex?: boolean | null
}

interface GetSeoMetadataOptions {
  /** The URL path to look up in PageSEO collection (e.g., '/', '/about') */
  path?: string
  /** Page type for dynamic template lookup (e.g., 'agents', 'jobs', 'blogs', 'properties') */
  pageType?: string
  /** Template variables for interpolation (e.g., { fullName: 'John Smith', roles: 'Senior Associate' }) */
  templateVars?: Record<string, string>
  /** SEO data from a CMS document's meta field */
  docMeta?: SeoData | null
  /** Fallback title if no SEO data found */
  fallbackTitle?: string
  /** Fallback description if no SEO data found */
  fallbackDescription?: string
  /** Fallback image URL if no SEO image found */
  fallbackImage?: string
}

const DEFAULT_TITLE = 'Meybohm Real Estate'
const DEFAULT_DESCRIPTION = 'Your trusted partner in real estate.'

/**
 * Replaces {variable} placeholders in a template string with actual values.
 * Unknown variables are replaced with empty string.
 */
export function interpolateTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? '')
}

/**
 * Fetches SEO metadata with support for static paths and dynamic page type templates.
 *
 * Priority:
 * 1. PageSEO by exact path (static entries)
 * 2. Document's own meta field (from seoFields on the collection)
 * 3. PageSEO template by pageType (with {variable} interpolation)
 * 4. Fallback values
 * 5. Global defaults
 */
export async function getSeoMetadata(options: GetSeoMetadataOptions = {}): Promise<Metadata> {
  const { path, pageType, templateVars, docMeta, fallbackTitle, fallbackDescription, fallbackImage } = options

  let seoData: SeoData | null = null

  // 1. Check PageSEO collection for exact path match (static entries)
  if (path) {
    try {
      const payload = await getPayload({ config })
      const { docs } = await payload.find({
        collection: 'page-seo',
        where: {
          and: [
            { pageType: { equals: 'static' } },
            { path: { equals: path } },
          ],
        },
        limit: 1,
        depth: 1,
      })

      if (docs[0]) {
        const pageSeo = docs[0] as PageSeo
        seoData = {
          title: pageSeo.title,
          description: pageSeo.description,
          image: pageSeo.image,
          noIndex: pageSeo.noIndex,
        }
      }
    } catch (error) {
      console.error('Error fetching PageSEO:', error)
    }
  }

  // 2. Fall back to document meta if no static PageSEO found
  if (!seoData && docMeta?.title) {
    seoData = docMeta
  }

  // 3. Fall back to dynamic page type template if no document meta
  if (!seoData && pageType) {
    try {
      const payload = await getPayload({ config })
      const { docs } = await payload.find({
        collection: 'page-seo',
        where: { pageType: { equals: pageType } },
        limit: 1,
        depth: 1,
      })

      if (docs[0]) {
        const template = docs[0] as PageSeo
        const vars = templateVars || {}
        seoData = {
          title: template.title ? interpolateTemplate(template.title, vars) : null,
          description: template.description ? interpolateTemplate(template.description, vars) : null,
          image: template.image,
          noIndex: template.noIndex,
        }
      }
    } catch (error) {
      console.error('Error fetching PageSEO template:', error)
    }
  }

  // Build the metadata object
  const title = seoData?.title || fallbackTitle || DEFAULT_TITLE
  const description = seoData?.description || fallbackDescription || DEFAULT_DESCRIPTION

  const metadata: Metadata = {
    title,
    description,
  }

  // Determine the image URL
  let imageUrl: string | null = null
  if (seoData?.image && typeof seoData.image === 'object' && 'url' in seoData.image) {
    imageUrl = seoData.image.url as string
  } else if (fallbackImage) {
    imageUrl = fallbackImage
  }

  // Add Open Graph and Twitter metadata if we have an image
  if (imageUrl) {
    metadata.openGraph = {
      title,
      description,
      images: [{ url: imageUrl }],
    }
    metadata.twitter = {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    }
  }

  // Add noindex if specified
  if (seoData?.noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    }
  }

  return metadata
}

/**
 * Build SEO metadata directly from entity data (for dynamic routes)
 * Use this when you have all the data and don't need to fetch from PageSEO
 */
export function buildSeoMetadata(options: {
  title: string
  description?: string
  image?: string
  noIndex?: boolean
}): Metadata {
  const { title, description, image, noIndex } = options

  const metadata: Metadata = {
    title,
    description: description || DEFAULT_DESCRIPTION,
  }

  if (image) {
    metadata.openGraph = {
      title,
      description: description || DEFAULT_DESCRIPTION,
      images: [{ url: image }],
    }
    metadata.twitter = {
      card: 'summary_large_image',
      title,
      description: description || DEFAULT_DESCRIPTION,
      images: [image],
    }
  }

  if (noIndex) {
    metadata.robots = { index: false, follow: false }
  }

  return metadata
}
