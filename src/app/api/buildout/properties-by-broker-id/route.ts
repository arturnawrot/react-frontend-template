import { NextResponse } from 'next/server'
import { buildoutApi } from '@/utils/buildout-api'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const brokerIdParam = searchParams.get('brokerId')
    const limitParam = searchParams.get('limit')
    const offsetParam = searchParams.get('offset')
    const skipCacheParam = searchParams.get('skipCache')

    if (!brokerIdParam) {
      return NextResponse.json(
        { error: 'brokerId is required' },
        { status: 400 }
      )
    }

    const brokerId = parseInt(brokerIdParam, 10)
    if (isNaN(brokerId)) {
      return NextResponse.json(
        { error: 'Invalid brokerId' },
        { status: 400 }
      )
    }

    const options: {
      skipCache?: boolean
      limit?: number
      offset?: number
    } = {}

    if (limitParam) {
      const limit = parseInt(limitParam, 10)
      if (!isNaN(limit)) {
        options.limit = limit
      }
    }

    if (offsetParam) {
      const offset = parseInt(offsetParam, 10)
      if (!isNaN(offset)) {
        options.offset = offset
      }
    }

    if (skipCacheParam === 'true') {
      options.skipCache = true
    }

    // Fetch properties from Buildout API
    const response = await buildoutApi.getPropertiesByBrokerId(brokerId, options)

    return NextResponse.json({
      success: true,
      ...response,
    })
  } catch (error) {
    console.error('Error fetching properties by broker ID:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching properties'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

