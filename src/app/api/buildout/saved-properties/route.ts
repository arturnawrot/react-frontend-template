import { NextResponse } from 'next/server'
import { buildoutApi, toLightweightProperty, filterProperties, type PropertyFilters } from '@/utils/buildout-api'

export const dynamic = 'force-dynamic'

/**
 * GET /api/buildout/saved-properties
 * Retrieves properties by their IDs with optional filtering
 * Query params:
 *   - ids: Comma-separated list of property IDs (e.g., "1,2,3")
 *   - limit: Optional limit (default: 20 per page for pagination)
 *   - offset: Optional offset for pagination
 *   - skipCache: Optional cache control
 *   - fullData: If true, return full property objects (default: false, returns lightweight)
 *   - brokerId: Optional broker filter
 *   - propertyType: Optional property type filter
 *   - minPrice: Optional minimum price filter
 *   - maxPrice: Optional maximum price filter
 *   - saleOrLease: Optional 'sale' or 'lease' filter
 *   - minCapRate: Optional minimum cap rate filter
 *   - maxCapRate: Optional maximum cap rate filter
 *   - minSquareFootage: Optional minimum square footage filter
 *   - maxSquareFootage: Optional maximum square footage filter
 *   - search: Optional text search filter
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const idsParam = searchParams.get('ids')
    const limitParam = searchParams.get('limit')
    const offsetParam = searchParams.get('offset')
    const skipCacheParam = searchParams.get('skipCache')
    const fullDataParam = searchParams.get('fullData') // If true, return full property objects
    
    // Filter parameters
    const brokerIdParam = searchParams.get('brokerId')
    const propertyTypeParam = searchParams.get('propertyType')
    const minPriceParam = searchParams.get('minPrice')
    const maxPriceParam = searchParams.get('maxPrice')
    const saleOrLeaseParam = searchParams.get('saleOrLease')
    const minCapRateParam = searchParams.get('minCapRate')
    const maxCapRateParam = searchParams.get('maxCapRate')
    const minSquareFootageParam = searchParams.get('minSquareFootage')
    const maxSquareFootageParam = searchParams.get('maxSquareFootage')
    const searchQueryParam = searchParams.get('search')

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

    // Use pagination - default to 20 per page
    const limit = limitParam ? parseInt(limitParam, 10) : 20
    const offset = offsetParam ? parseInt(offsetParam, 10) : 0

    // Parse filter values
    const brokerId = brokerIdParam && !isNaN(parseInt(brokerIdParam, 10)) ? parseInt(brokerIdParam, 10) : null
    const propertyType = propertyTypeParam && !isNaN(parseInt(propertyTypeParam, 10)) ? parseInt(propertyTypeParam, 10) : null
    const minPrice = minPriceParam && !isNaN(parseInt(minPriceParam, 10)) ? parseInt(minPriceParam, 10) : null
    const maxPrice = maxPriceParam && !isNaN(parseInt(maxPriceParam, 10)) ? parseInt(maxPriceParam, 10) : null
    const minCapRate = minCapRateParam && !isNaN(parseFloat(minCapRateParam)) ? parseFloat(minCapRateParam) : null
    const maxCapRate = maxCapRateParam && !isNaN(parseFloat(maxCapRateParam)) ? parseFloat(maxCapRateParam) : null
    const minSquareFootage = minSquareFootageParam && !isNaN(parseInt(minSquareFootageParam, 10)) ? parseInt(minSquareFootageParam, 10) : null
    const maxSquareFootage = maxSquareFootageParam && !isNaN(parseInt(maxSquareFootageParam, 10)) ? parseInt(maxSquareFootageParam, 10) : null

    // Fetch all properties using getAllProperties (same approach as search-properties)
    const allPropertiesResponse = await buildoutApi.getAllProperties({
      skipCache: skipCacheParam === 'true',
    })

    // Build filter object - include propertyIds to filter by saved properties
    const filters: PropertyFilters = {
      propertyIds: propertyIds,
      brokerId: brokerId ?? undefined,
      propertyType: propertyType ?? undefined,
      minPrice: minPrice ?? undefined,
      maxPrice: maxPrice ?? undefined,
      saleOrLease: saleOrLeaseParam ?? undefined,
      minCapRate: minCapRate ?? undefined,
      maxCapRate: maxCapRate ?? undefined,
      minSquareFootage: minSquareFootage ?? undefined,
      maxSquareFootage: maxSquareFootage ?? undefined,
      search: searchQueryParam ?? undefined,
    }

    // Apply filtering using shared filter function
    const filteredProperties = filterProperties(allPropertiesResponse.properties, filters)

    // Apply pagination to filtered results
    const totalFiltered = filteredProperties.length
    const startIndex = offset
    const endIndex = Math.min(startIndex + limit, totalFiltered)
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex)

    // Return lightweight properties by default (unless fullData=true)
    if (fullDataParam === 'true') {
      return NextResponse.json({
        success: true,
        properties: paginatedProperties,
        count: totalFiltered, // Total count after filtering
        message: `Found ${totalFiltered} of ${propertyIds.length} saved properties matching filters`,
      })
    } else {
      // Transform to lightweight format
      const lightweightProperties = paginatedProperties.map(toLightweightProperty)
      
      return NextResponse.json({
        success: true,
        properties: lightweightProperties,
        count: totalFiltered, // Total count after filtering
        message: `Found ${totalFiltered} of ${propertyIds.length} saved properties matching filters`,
      })
    }
  } catch (error) {
    console.error('Error fetching saved properties:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching saved properties'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

