import type { Metadata } from 'next'
import BlogPage from '@/components/BlogPage/BlogPage'
import { getBlogMetadata } from '@/utils/getBlogMetadata'

// Mark as dynamic to prevent build-time prerendering (requires MongoDB connection)
export const dynamic = 'force-dynamic'

interface BlogPageProps {
  params: Promise<{ slug: string[] }>
}

function buildSlug(slugArray: string[]): string {
  return `investment-spotlight/${Array.isArray(slugArray) ? slugArray.join('/') : slugArray}`
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug: slugArray } = await params
  return getBlogMetadata(buildSlug(slugArray))
}

export default async function InvestmentSpotlightPage({ params }: BlogPageProps) {
  const { slug: slugArray } = await params
  return <BlogPage slug={buildSlug(slugArray)} defaultType="investment-spotlight" />
}
