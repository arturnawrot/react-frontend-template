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
    const response = await buildoutApi.getAllBrokers(options)

    return NextResponse.json({
      success: true,
      brokers: response.brokers || [],
      count: response.count || 0,
    })
  } catch (error) {
    console.error('Error fetching brokers:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching brokers'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

