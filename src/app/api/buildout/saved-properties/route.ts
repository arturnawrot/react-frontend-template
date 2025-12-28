import { NextResponse } from 'next/server'
import { buildoutApi } from '@/utils/buildout-api'
import type { BuildoutProperty } from '@/utils/buildout-api'

export const dynamic = 'force-dynamic'

/**
 * GET /api/buildout/saved-properties
 * Retrieves properties by their IDs
 * Query params:
 *   - ids: Comma-separated list of property IDs (e.g., "1,2,3")
 *   - limit: Optional limit (default: 1000 to get all saved properties)
 *   - skipCache: Optional cache control
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const idsParam = searchParams.get('ids')
    const limitParam = searchParams.get('limit')
    const skipCacheParam = searchParams.get('skipCache')

    if (!idsParam) {
      return NextResponse.json({
        success: true,
        properties: [],
        count: 0,
        message: 'No property IDs provided',
      })
    }

    // Parse property IDs from comma-separated string
    const propertyIds = idsParam
      .split(',')
      .map(id => parseInt(id.trim(), 10))
      .filter(id => !isNaN(id) && id > 0)

    if (propertyIds.length === 0) {
      return NextResponse.json({
        success: true,
        properties: [],
        count: 0,
        message: 'No valid property IDs provided',
      })
    }

    // Fetch a large set of properties to filter by IDs
    // Since Buildout API doesn't support filtering by multiple IDs directly,
    // we fetch a large set and filter client-side
    const limit = limitParam ? parseInt(limitParam, 10) : 1000
    const options: Record<string, string | number | boolean | undefined> = {
      limit,
      offset: 0,
    }

    if (skipCacheParam === 'true') {
      options.skipCache = true
    }

    // Fetch properties from Buildout API
    const response = await buildoutApi.searchProperties(options)

    // Filter to only include saved property IDs
    const savedProperties = response.properties.filter((property: BuildoutProperty) =>
      propertyIds.includes(property.id)
    )

    return NextResponse.json({
      success: true,
      properties: savedProperties,
      count: savedProperties.length,
      message: `Found ${savedProperties.length} of ${propertyIds.length} requested properties`,
    })
  } catch (error) {
    console.error('Error fetching saved properties:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching saved properties'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

