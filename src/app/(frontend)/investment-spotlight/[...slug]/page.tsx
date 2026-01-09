import BlogPage from '@/components/BlogPage/BlogPage'

// Mark as dynamic to prevent build-time prerendering (requires MongoDB connection)
export const dynamic = 'force-dynamic'

interface BlogPageProps {
  params: Promise<{ slug: string[] }>
}

export default async function InvestmentSpotlightPage({ params }: BlogPageProps) {
  const { slug: slugArray } = await params
  // Construct full slug with type prefix: "investment-spotlight/my-title"
  const slug = `investment-spotlight/${Array.isArray(slugArray) ? slugArray.join('/') : slugArray}`

  return <BlogPage slug={slug} defaultType="investment-spotlight" />
}

