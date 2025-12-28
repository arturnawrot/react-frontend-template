import { NextResponse } from 'next/server'
import { buildoutApi, toLightweightProperty, type LightweightPropertiesResponse } from '@/utils/buildout-api'

// Mark as dynamic since we use request.url
export const dynamic = 'force-dynamic'

// Enable caching for this route
export const revalidate = 3600 // Revalidate every hour (same as CACHE_TTL_SECONDS)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const brokerIdParam = searchParams.get('brokerId')
    const skipCacheParam = searchParams.get('skipCache')
    const fullDataParam = searchParams.get('fullData') // If true, return full property objects

    const options: {
      skipCache?: boolean
      limit?: number
      brokerId?: number
    } = {}

    if (limitParam) {
      const limit = parseInt(limitParam, 10)
      if (!isNaN(limit)) {
        options.limit = limit
      }
    }

    if (brokerIdParam) {
      const brokerId = parseInt(brokerIdParam, 10)
      if (!isNaN(brokerId)) {
        options.brokerId = brokerId
      }
    }

    if (skipCacheParam === 'true') {
      options.skipCache = true
    }

    // Note: We don't cache the combined result at the API route level because it exceeds Next.js 2MB limit
    // Individual page requests inside getAllProperties are cached, so subsequent calls will be fast
    const response = await buildoutApi.getAllProperties(options)

    // Return lightweight properties by default (unless fullData=true)
    if (fullDataParam === 'true') {
      return NextResponse.json({
        success: true,
        ...response,
      })
    } else {
      // Transform to lightweight format
      const lightweightProperties = response.properties.map(toLightweightProperty)
      
      const lightweightResponse: LightweightPropertiesResponse = {
        properties: lightweightProperties,
        count: response.count,
        message: response.message,
      }

      return NextResponse.json({
        success: true,
        ...lightweightResponse,
      })
    }
  } catch (error) {
    console.error('Error fetching all properties:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching properties'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

