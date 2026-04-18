import { cachedFind, getCachedBlogHighlights } from '@/utils/payload-cache'
import BlogAllContent from '@/components/BlogAllContent/BlogAllContent'
import type { Blog, BlogCategory, User, BlogHighlight as BlogHighlightsType } from '@/payload-types'
import DarkNavbar from '@/components/Navbar/DarkNavbar'
import CTAFooter from '@/components/CTAFooter/CTAFooter'
import Footer from '@/components/Footer/Footer'

// force-dynamic: skip build-time prerender (no DB during Docker build)
// Data is still cached at the query layer via unstable_cache in payload-cache.ts
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'All Content | Meybohm Commercial',
  description: 'Browse all articles, market reports, and investment spotlights from Meybohm Commercial.',
}

const POSTS_PER_PAGE = 12

export default async function AllContentPage() {
  // Fetch initial blogs
  const initialBlogsResult = await cachedFind('blogs', {
    limit: POSTS_PER_PAGE,
    depth: 2,
    sort: 'publishedAt',
  })

  // Fetch BlogHighlights config for displayed categories
  let displayedCategories: BlogCategory[] = []
  try {
    const blogHighlightsConfig = await getCachedBlogHighlights() as BlogHighlightsType

    displayedCategories = (blogHighlightsConfig.exploreByCategory?.displayedCategories || []).filter(
      (cat): cat is BlogCategory => typeof cat !== 'string'
    )
  } catch {
    // BlogHighlights global might not exist yet
    console.warn('BlogHighlights global not found, using empty displayed categories')
  }

  // Fetch all categories for filters
  const categoriesResult = await cachedFind('blog-categories', {
    limit: 1000,
    sort: 'name',
  })

  // Fetch all users (authors) for filters
  const usersResult = await cachedFind('users', {
    limit: 1000,
    sort: 'email',
  })

  // Calculate available years
  const allBlogsResult = await cachedFind('blogs', {
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
    <>
      <DarkNavbar />
      <BlogAllContent
        initialBlogs={initialBlogsResult.docs as Blog[]}
        initialTotalCount={initialBlogsResult.totalDocs}
        allCategories={categoriesResult.docs as BlogCategory[]}
        displayedCategories={displayedCategories}
        authors={usersResult.docs as User[]}
        years={years}
        showTypeFilters={true}
      />
      <CTAFooter
        block={{
          blockType: 'ctaFooter',
          heading: 'Want Insight Specific to Your Goals?',
          subheading: "Let's connect and align content with strategy.",
          buttons: [
            { label: 'Talk to Our Team', variant: 'primary' },
            { label: 'Request Market Report', variant: 'secondary' },
            { label: 'See Client Stories', variant: 'secondary' },
          ],
          id: 'blog-all-cta-footer',
        }}
      />
      <Footer />
    </>
  )
}
