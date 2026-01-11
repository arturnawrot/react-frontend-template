import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import config from '@/payload.config'
import HeroWrapper from '@/components/Hero/HeroWrapper'
import LexicalRenderer from '@/components/LexicalRenderer/LexicalRenderer'
import InvestmentSpotlightSidebar from '@/components/InvestmentSpotlightSidebar/InvestmentSpotlightSidebar'
import type { Blog, Page } from '@/payload-types'
import Link from 'next/link'

type HeroBlock = Extract<Page['blocks'][number], { blockType: 'hero' }>

interface BlogPageProps {
  slug: string
  defaultType?: 'article' | 'market-report' | 'investment-spotlight'
}

export default async function BlogPage({ slug, defaultType = 'article' }: BlogPageProps) {
  const payload = await getPayload({ config })

  // Extract the actual slug (remove type prefix if present)
  // Slugs in DB are stored without type prefix (e.g., "my-title" not "article/my-title")
  const actualSlug = slug.includes('/') 
    ? slug.split('/').slice(1).join('/') // Remove first segment (type prefix)
    : slug

  // Fetch the blog by slug
  // Use depth 3 to ensure uploads in Lexical content are fully populated
  const { docs } = await payload.find({
    collection: 'blogs',
    where: {
      slug: {
        equals: actualSlug,
      },
    },
    depth: 3,
    limit: 1,
  })

  const blog = docs[0] as Blog | undefined

  if (!blog) {
    notFound()
  }

  // Get related articles - if manually selected, use those; otherwise use same-category articles
  // Filter by the same type as the current blog
  const blogType = blog.type || defaultType
  let relatedArticlesData: Blog[] = []
  
  if (blog.relatedArticles && blog.relatedArticles.length > 0) {
    // Use manually selected related articles, but filter by type
    const relatedIds = blog.relatedArticles.map((rel: string | Blog) =>
      typeof rel === 'object' && rel !== null ? rel.id : rel
    )
    const { docs: relatedDocs } = await payload.find({
      collection: 'blogs',
      where: {
        and: [
          {
            id: {
              in: relatedIds,
            },
          },
          {
            type: {
              equals: blogType,
            },
          },
        ],
      },
      depth: 1,
      limit: 10,
    })
    relatedArticlesData = relatedDocs as Blog[]
  } else if (blog.categories && Array.isArray(blog.categories) && blog.categories.length > 0) {
    // If no manually selected articles, find articles with same categories AND same type
    const categoryIds = blog.categories.map((cat: string | { id: string }) =>
      typeof cat === 'object' && cat !== null ? cat.id : cat
    )
    const { docs: relatedDocs } = await payload.find({
      collection: 'blogs',
      where: {
        and: [
          {
            id: {
              not_equals: blog.id,
            },
          },
          {
            type: {
              equals: blogType,
            },
          },
          {
            categories: {
              in: categoryIds,
            },
          },
        ],
      },
      depth: 1,
      limit: 5,
    })
    relatedArticlesData = relatedDocs as Blog[]
  }

  // Get type-specific label
  const getRelatedLabel = (type: string) => {
    switch (type) {
      case 'market-report':
        return 'Related Market Reports'
      case 'investment-spotlight':
        return 'Related Spotlights'
      case 'article':
      default:
        return 'Related Articles'
    }
  }

  const relatedLabel = getRelatedLabel(blogType)
  
  // Get browse all link text based on type
  const getBrowseAllText = (type: string) => {
    switch (type) {
      case 'market-report':
        return 'Browse All Market Reports'
      case 'investment-spotlight':
        return 'Browse All Spotlights'
      case 'article':
      default:
        return 'Browse All Insights'
    }
  }

  const browseAllText = getBrowseAllText(blogType)

  // Create hero block from blog data
  const heroBlock = {
    blockType: 'hero' as const,
    variant: 'blog' as const,
    headingSegments: [
      {
        text: blog.title,
        breakOnMobile: false,
        breakOnDesktop: false,
      },
    ],
    subheading: blog.description || undefined,
    backgroundImage: blog.featuredImage || undefined,
    blogAuthor: blog.author || undefined,
    blogDate: blog.createdAt ? new Date(blog.createdAt).toISOString().split('T')[0] : undefined,
    blogCategories: blog.categories || undefined,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroWrapper block={heroBlock as HeroBlock} />

      {/* Content Section */}
      <div className="container mx-auto px-6 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left Column - Related Articles / Sidebar */}
          <aside className="w-full lg:w-[350px] shrink-0">
            {/* Investment Spotlight Sidebar */}
            {blogType === 'investment-spotlight' && (
              <InvestmentSpotlightSidebar blog={blog} />
            )}

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-serif text-[#1a2e2a]">{relatedLabel}</h2>
              <Link
                href="/insights"
                className="text-sm font-sans text-[#1a2e2a] hover:underline"
              >
                {browseAllText} →
              </Link>
            </div>

            {relatedArticlesData.length > 0 ? (
              <div className="space-y-6">
                {relatedArticlesData.map((article) => {
                  const articleTitle = article.title || 'Untitled Article'
                  const articleSlug = article.slug || ''
                  const articleType = article.type || 'article'
                  
                  // Map type to URL path
                  const typePathMap: Record<string, string> = {
                    'article': 'article',
                    'market-report': 'market-report',
                    'investment-spotlight': 'investment-spotlight',
                  }
                  
                  const typePath = typePathMap[articleType] || 'article'
                  const articleUrl = `/${typePath}/${articleSlug}`
                  
                  return (
                    <div key={article.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <Link href={articleUrl}>
                        <h3 className="text-xl font-serif text-[#1a2e2a] mb-2 hover:underline">
                          {articleTitle}
                        </h3>
                        <span className="text-sm text-gray-600 hover:text-[#1a2e2a]">
                          Read More →
                        </span>
                      </Link>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-gray-500 italic">No related articles available.</p>
            )}
          </aside>

          {/* Right Column - Article Content */}
          <article className="flex-1">
            <div className="prose prose-lg max-w-none">
              {blog.content ? (
                <LexicalRenderer content={blog.content} />
              ) : (
                <p className="text-gray-500 italic">No content available.</p>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}


