import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import config from '@/payload.config'
import HeroWrapper from '@/components/Hero/HeroWrapper'
import LexicalRenderer from '@/components/LexicalRenderer/LexicalRenderer'
import type { Blog, BlogCategory, User } from '@/payload-types'
import Link from 'next/link'

// Mark as dynamic to prevent build-time prerendering (requires MongoDB connection)
export const dynamic = 'force-dynamic'

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params

  const payload = await getPayload({ config })

  // Fetch the blog by slug
  // Use depth 3 to ensure uploads in Lexical content are fully populated
  const { docs } = await payload.find({
    collection: 'blogs',
    where: {
      slug: {
        equals: slug,
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
  let relatedArticlesData: Blog[] = []
  
  if (blog.relatedArticles && blog.relatedArticles.length > 0) {
    // Use manually selected related articles
    const relatedIds = blog.relatedArticles.map((rel: any) =>
      typeof rel === 'object' && rel !== null ? rel.id : rel
    )
    const { docs: relatedDocs } = await payload.find({
      collection: 'blogs',
      where: {
        id: {
          in: relatedIds,
        },
      },
      depth: 1,
      limit: 10,
    })
    relatedArticlesData = relatedDocs as Blog[]
  } else if (blog.categories && Array.isArray(blog.categories) && blog.categories.length > 0) {
    // If no manually selected articles, find articles with same categories
    const categoryIds = blog.categories.map((cat: any) =>
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
      <HeroWrapper block={heroBlock as any} />

      {/* Content Section */}
      <div className="container mx-auto px-6 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left Column - Related Articles */}
          <aside className="w-full lg:w-[350px] shrink-0">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-serif text-[#1a2e2a]">Related Articles</h2>
              <Link
                href="/insights"
                className="text-sm font-sans text-[#1a2e2a] hover:underline"
              >
                Browse All Insights →
              </Link>
            </div>

            {relatedArticlesData.length > 0 ? (
              <div className="space-y-6">
                {relatedArticlesData.map((article) => {
                  const articleTitle = article.title || 'Untitled Article'
                  const articleSlug = article.slug || ''
                  return (
                    <div key={article.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <Link href={`/blog/${articleSlug}`}>
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
                <LexicalRenderer content={blog.content as any} />
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

