/**
 * Cached Payload CMS data fetchers using Next.js unstable_cache
 *
 * These wrappers prevent redundant MongoDB queries on every request.
 * Data is cached in-memory and revalidated on a configurable interval.
 */
import { unstable_cache } from 'next/cache'
import { getPayload, type GlobalSlug, type Where } from 'payload'
import config from '@/payload.config'

// ─── Build-time guard ────────────────────────────────────────────────────────
// During Docker builds there is no MongoDB. Return empty data so prerender
// succeeds; the page will be regenerated on the first real request via ISR.
const IS_BUILD_SKIP_DB = process.env.NEXT_BUILD_SKIP_DB === 'true'

// ─── Revalidation intervals (seconds) ────────────────────────────────────────
// Change these values to control how often data is refreshed across the site.

/** Page-level ISR revalidation — used by all page.tsx `export const revalidate` */
export const PAGE_REVALIDATE_SECONDS = 60

const CACHE_SHORT = 60       // 1 minute - for frequently changing data
const CACHE_MEDIUM = 300     // 5 minutes - for globals that change occasionally
const CACHE_LONG = 600       // 10 minutes - for rarely changing config

// ─── Factory ─────────────────────────────────────────────────────────────────

/**
 * Creates a cached global fetcher for a Payload CMS global slug.
 * All globals follow the same pattern: getPayload → findGlobal → cache.
 */
function cachedGlobal<T = any>(
  slug: GlobalSlug,
  opts: { depth?: number; revalidate?: number } = {}
) {
  const { depth, revalidate = CACHE_MEDIUM } = opts
  if (IS_BUILD_SKIP_DB) return async () => ({} as T)
  return unstable_cache(
    async (): Promise<T> => {
      const payload = await getPayload({ config })
      return payload.findGlobal({ slug, ...(depth !== undefined && { depth }) }) as Promise<T>
    },
    [slug],
    { revalidate }
  )
}

// ─── Cached Collection Queries ───────────────────────────────────────────────

/**
 * Cached payload.find() — wraps the query in unstable_cache so that
 * getPayload's internal cookies()/headers() calls do NOT opt the page
 * out of ISR / static rendering.
 */
export async function cachedFind<T = any>(
  collection: string,
  opts: {
    where?: Where
    depth?: number
    limit?: number
    sort?: string
    select?: Record<string, boolean>
    revalidate?: number
  } = {},
): Promise<{ docs: T[]; totalDocs: number }> {
  const { where, depth, limit, sort, select, revalidate = PAGE_REVALIDATE_SECONDS } = opts
  if (IS_BUILD_SKIP_DB) return { docs: [] as T[], totalDocs: 0 }
  const cacheKey = `find:${collection}:${JSON.stringify(where ?? {})}:d${depth}:l${limit}:s${sort ?? ''}:sel${JSON.stringify(select ?? {})}`
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config })
      return payload.find({
        collection: collection as any,
        ...(where && { where }),
        ...(depth !== undefined && { depth }),
        ...(limit !== undefined && { limit }),
        ...(sort && { sort }),
        ...(select && { select }),
      })
    },
    [cacheKey],
    { revalidate },
  )() as Promise<{ docs: T[]; totalDocs: number }>
}

// ─── Cached Global Fetchers ──────────────────────────────────────────────────
// To add a new cached global, just add one line here.

export const getCachedSiteSettings          = cachedGlobal('siteSettings',          { depth: 0, revalidate: CACHE_LONG })
export const getCachedSiteLock              = cachedGlobal('siteLock',              { depth: 1 })
export const getCachedScriptInjection       = cachedGlobal('scriptInjection')
export const getCachedConstantLinks         = cachedGlobal('constantLinks',         { depth: 1 })
export const getCachedFeaturedPropertiesSets = cachedGlobal('featuredPropertiesSets', { revalidate: CACHE_SHORT })
export const getCachedTestimonialsSets      = cachedGlobal('testimonialsSets',      { depth: 0 })
export const getCachedFeaturedAgentsSets    = cachedGlobal('featuredAgentsSets',    { depth: 2 })
export const getCachedAgentIconsSets        = cachedGlobal('agentIconsSets',        { depth: 2 })
export const getCachedFeaturedArticles      = cachedGlobal('featuredArticles',      { depth: 2 })
export const getCachedProvenTrackRecordSets = cachedGlobal('provenTrackRecordSets', { depth: 2 })
export const getCachedFAQSets              = cachedGlobal('faqSets',               { depth: 0 })
export const getCachedFAQFullPage          = cachedGlobal('faqFullPage',           { depth: 0 })
export const getCachedAgentCategories      = cachedGlobal('agentCategories',       { depth: 1 })
export const getCachedBlogHighlights       = cachedGlobal('blogHighlights',        { depth: 2 })
export const getCachedAvailableJobSets     = cachedGlobal('availableJobSets',      { depth: 2 })
export const getCachedOfficeLocationSets   = cachedGlobal('officeLocationSets',    { depth: 2 })
