import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Blog, Media, User, BlogCategory } from '@/payload-types'
import { getSeoMetadata } from './getSeoMetadata'

/**
 * Shared metadata generator for blog routes (article, market-report, investment-spotlight).
 * Extracts the actual slug, fetches the blog post, and builds SEO metadata with template support.
 */
export async function getBlogMetadata(fullSlug: string): Promise<Metadata> {
  // Extract actual slug (remove type prefix)
  const actualSlug = fullSlug.includes('/')
    ? fullSlug.split('/').slice(1).join('/')
    : fullSlug

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'blogs',
    where: { slug: { equals: actualSlug } },
    depth: 1,
    limit: 1,
  })

  const blog = docs[0] as Blog | undefined

  if (!blog) {
    return { title: 'Post Not Found' }
  }

  // Extract author name (User type uses 'username' field)
  const author = blog.author && typeof blog.author === 'object' && 'username' in blog.author
    ? (blog.author as User).username || ''
    : ''

  // Extract category names
  const categories = (blog.categories || [])
    .map((c) => (typeof c === 'object' && c !== null && 'name' in c ? (c as BlogCategory).name : null))
    .filter(Boolean)
    .join(', ')

  // Get featured image URL
  let imageUrl: string | undefined
  if (blog.featuredImage && typeof blog.featuredImage === 'object' && 'url' in blog.featuredImage) {
    imageUrl = (blog.featuredImage as Media).url || undefined
  }

  // Format type for display
  const typeLabel = (blog.type || 'article')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return getSeoMetadata({
    pageType: 'blogs',
    templateVars: {
      title: blog.title || '',
      description: blog.description || '',
      type: typeLabel,
      author,
      categories,
    },
    docMeta: blog.meta,
    fallbackTitle: `${blog.title} | Meybohm Real Estate`,
    fallbackDescription: blog.description || `${typeLabel} by Meybohm Real Estate`,
    fallbackImage: imageUrl,
  })
}
