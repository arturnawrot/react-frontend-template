import { NextResponse } from 'next/server'
import { buildoutApi } from '@/utils/buildout-api'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const skipCacheParam = searchParams.get('skipCache')

    const options: {
      skipCache?: boolean
      limit?: number
    } = {}

    if (limitParam) {
      const limit = parseInt(limitParam, 10)
      if (!isNaN(limit)) {
        options.limit = limit
      }
    } else {
      options.limit = 1000 // Get all brokers by default
    }

    if (skipCacheParam === 'true') {
      options.skipCache = true
    }

    // Fetch brokers using the buildout API
    // This will use cached data if available (via unstable_cache)
    const response = await buildoutApi.getAllBrokers(options)

    return NextResponse.json({
      success: true,
      brokers: response.brokers || [],
      count: response.count || 0,
    })
  } catch (error) {
    // Check if this is a network error (offline scenario)
    const isNetworkError = error instanceof Error && (
      error.message.includes('fetch failed') ||
      error.message.includes('ENOTFOUND') ||
      error.message.includes('network') ||
      (error as any).cause?.code === 'ENOTFOUND'
    )

    if (isNetworkError) {
      // When offline, unstable_cache should return cached data if it exists
      // If we get here, it means either:
      // 1. The cache doesn't exist (first request or cache was cleared)
      // 2. The cache expired and unstable_cache tried to revalidate but failed
      console.warn(
        'Network error fetching brokers (offline?):',
        error instanceof Error ? error.message : error,
        '- This usually means the cache was not available. Make sure to fetch brokers while online first.'
      )
      
      // Return empty brokers array - the component should handle this gracefully
      // Note: If brokers were cached by property-search, they should be available here
      // If not, it means the cache was cleared or this is the first request
      return NextResponse.json({
        success: true,
        brokers: [],
        count: 0,
        message: 'Offline: No cached brokers available. Please ensure brokers were fetched while online first.',
      })
    }

    // For other errors, return error response
    console.error('Error fetching brokers:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching brokers'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

