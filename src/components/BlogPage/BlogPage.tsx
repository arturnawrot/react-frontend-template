import { notFound } from 'next/navigation'
import HeroWrapper from '@/components/Hero/HeroWrapper'
import LexicalRenderer from '@/components/LexicalRenderer/LexicalRenderer'
import InvestmentSpotlightSidebar from '@/components/InvestmentSpotlightSidebar/InvestmentSpotlightSidebar'
import BlogBanner from '@/components/BlogBanner/BlogBanner'
import type { Blog, Page } from '@/payload-types'
import Link from 'next/link'
import { cachedFind, getCachedConstantLinks } from '@/utils/payload-cache'
import { getConstantLinksMap } from '@/utils/linkResolver'
import Footer from '@/components/Footer/Footer'

type HeroBlock = Extract<Page['blocks'][number], { blockType: 'hero' }>

interface BlogPageProps {
  slug: string
  defaultType?: 'article' | 'market-report' | 'investment-spotlight'
}

export default async function BlogPage({ slug, defaultType = 'article' }: BlogPageProps) {
  // Extract the actual slug (remove type prefix if present)
  // Slugs in DB are stored without type prefix (e.g., "my-title" not "article/my-title")
  const actualSlug = slug.includes('/')
    ? slug.split('/').slice(1).join('/') // Remove first segment (type prefix)
    : slug

  // Fetch the blog by slug
  // Use depth 3 to ensure uploads in Lexical content are fully populated
  const { docs } = await cachedFind<Blog>('blogs', {
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
    const { docs: relatedDocs } = await cachedFind<Blog>('blogs', {
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
    const { docs: relatedDocs } = await cachedFind<Blog>('blogs', {
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

  const constantLinksGlobal = await getCachedConstantLinks()
  const constantLinksMap = await getConstantLinksMap(constantLinksGlobal)

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
    blogDate: (blog.publishedAt || blog.createdAt) ? new Date((blog.publishedAt as string) || blog.createdAt).toISOString().split('T')[0] : undefined,
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

            {/* Sidebar Banner */}
            {(blog as any).banners?.sidebar?.enabled && (blog as any).banners.sidebar.image && (
              <BlogBanner
                image={(blog as any).banners.sidebar.image}
                linkType={(blog as any).banners.sidebar.linkType}
                page={(blog as any).banners.sidebar.page}
                customUrl={(blog as any).banners.sidebar.customUrl}
                constantLink={(blog as any).banners.sidebar.constantLink}
                calLink={(blog as any).banners.sidebar.calLink}
                calNamespace={(blog as any).banners.sidebar.calNamespace}
                openInNewTab={(blog as any).banners.sidebar.openInNewTab}
                disabled={(blog as any).banners.sidebar.disabled}
                constantLinksMap={constantLinksMap}
                className="mb-8 w-full"
              />
            )}

            <div className="mb-8">
              <h2 className="text-3xl font-serif text-[#1a2e2a]">{relatedLabel}</h2>
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

            <div className="mt-8">
              <Link
                href="/blog/all"
                className="text-sm font-sans text-[#1a2e2a] hover:underline"
              >
                {browseAllText} →
              </Link>
            </div>
          </aside>

          {/* Right Column - Article Content */}
          <article className="flex-1">
            {/* Before Content Banner */}
            {(blog as any).banners?.beforeContent?.enabled && (blog as any).banners.beforeContent.image && (
              <BlogBanner
                image={(blog as any).banners.beforeContent.image}
                linkType={(blog as any).banners.beforeContent.linkType}
                page={(blog as any).banners.beforeContent.page}
                customUrl={(blog as any).banners.beforeContent.customUrl}
                constantLink={(blog as any).banners.beforeContent.constantLink}
                calLink={(blog as any).banners.beforeContent.calLink}
                calNamespace={(blog as any).banners.beforeContent.calNamespace}
                openInNewTab={(blog as any).banners.beforeContent.openInNewTab}
                disabled={(blog as any).banners.beforeContent.disabled}
                constantLinksMap={constantLinksMap}
                className="mb-8"
              />
            )}

            <div className="prose prose-lg max-w-none">
              {blog.content ? (
                <LexicalRenderer content={blog.content} constantLinksMap={constantLinksMap} />
              ) : (
                <p className="text-gray-500 italic">No content available.</p>
              )}
            </div>

            {/* After Content Banner */}
            {(blog as any).banners?.afterContent?.enabled && (blog as any).banners.afterContent.image && (
              <BlogBanner
                image={(blog as any).banners.afterContent.image}
                linkType={(blog as any).banners.afterContent.linkType}
                page={(blog as any).banners.afterContent.page}
                customUrl={(blog as any).banners.afterContent.customUrl}
                constantLink={(blog as any).banners.afterContent.constantLink}
                calLink={(blog as any).banners.afterContent.calLink}
                calNamespace={(blog as any).banners.afterContent.calNamespace}
                openInNewTab={(blog as any).banners.afterContent.openInNewTab}
                disabled={(blog as any).banners.afterContent.disabled}
                constantLinksMap={constantLinksMap}
                className="mt-8"
              />
            )}
          </article>
        </div>
      </div>
      <Footer />
    </div>
  )
}


