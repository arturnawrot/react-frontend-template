import type { Metadata } from 'next'
import BlogPage from '@/components/BlogPage/BlogPage'
import { getBlogMetadata } from '@/utils/getBlogMetadata'

// ISR: cached for 60s then revalidated in background (see PAGE_REVALIDATE_SECONDS in payload-cache.ts)
export const revalidate = 60
export const dynamicParams = true
export async function generateStaticParams() { return [] }

interface BlogPageProps {
  params: Promise<{ slug: string[] }>
}

function buildSlug(slugArray: string[]): string {
  return `market-report/${Array.isArray(slugArray) ? slugArray.join('/') : slugArray}`
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug: slugArray } = await params
  return getBlogMetadata(buildSlug(slugArray))
}

export default async function MarketReportPage({ params }: BlogPageProps) {
  const { slug: slugArray } = await params
  return <BlogPage slug={buildSlug(slugArray)} defaultType="market-report" />
}
