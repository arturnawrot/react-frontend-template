import { getPayload } from 'payload'
import config from '@/payload.config'
import BlogHighlights from '@/components/BlogHighlights/BlogHighlights'
import type { Blog, BlogCategory, User, BlogHighlight as BlogHighlightsType } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Insights & Research | Meybohm Commercial',
  description: 'Explore market reports, investment spotlights, and expert insights from Meybohm Commercial.',
}

export default async function BlogHighlightsPage() {
  const payload = await getPayload({ config })

  // Fetch BlogHighlights global config
  const blogHighlightsConfig = await payload.findGlobal({
    slug: 'blogHighlights',
    depth: 3,
  }) as BlogHighlightsType

  // Fetch initial blogs for Explore by Category (default: newest 10)
  const initialBlogsResult = await payload.find({
    collection: 'blogs',
    limit: blogHighlightsConfig.exploreByCategory?.postsPerPage || 10,
    depth: 2,
    sort: '-createdAt',
  })

  // Fetch all categories for filters
  const categoriesResult = await payload.find({
    collection: 'blog-categories',
    limit: 1000,
    sort: 'name',
  })

  // Fetch all users (authors) for filters
  const usersResult = await payload.find({
    collection: 'users',
    limit: 1000,
    sort: 'email',
  })

  // Calculate available years
  const allBlogsResult = await payload.find({
    collection: 'blogs',
    limit: 1000,
    select: {
      createdAt: true,
    },
  })

  const yearsSet = new Set<number>()
  allBlogsResult.docs.forEach((blog) => {
    const year = new Date(blog.createdAt).getFullYear()
    yearsSet.add(year)
  })
  const years = Array.from(yearsSet).sort((a, b) => b - a)

  return (
    <main className="min-h-screen bg-white">
      <BlogHighlights
        config={blogHighlightsConfig}
        initialBlogs={initialBlogsResult.docs as Blog[]}
        allCategories={categoriesResult.docs as BlogCategory[]}
        authors={usersResult.docs as User[]}
        years={years}
      />
    </main>
  )
}
