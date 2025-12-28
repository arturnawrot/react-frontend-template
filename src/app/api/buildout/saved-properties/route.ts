import { NextResponse } from 'next/server'
import { buildoutApi, toLightweightProperty, type BuildoutProperty, type LightweightPropertiesResponse } from '@/utils/buildout-api'

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
    
    // Fetch properties from Buildout API
    // Since Buildout API doesn't support filtering by multiple IDs directly,
    // we need to fetch enough properties to find all saved ones.
    // Fetch in batches until we find all saved properties or reach a reasonable limit
    let allSavedProperties: BuildoutProperty[] = []
    let currentOffset = 0
    const maxFetchLimit = 1000 // Maximum properties to fetch in total
    const batchSize = 100 // Fetch 100 at a time
    
    while (allSavedProperties.length < propertyIds.length && currentOffset < maxFetchLimit) {
      const options: Record<string, string | number | boolean | undefined> = {
        limit: batchSize,
        offset: currentOffset,
      }

      if (skipCacheParam === 'true') {
        options.skipCache = true
      }

      // Fetch properties from Buildout API
      const response = await buildoutApi.searchProperties(options)

      // Filter to only include saved property IDs
      const batchSavedProperties = response.properties.filter((property: BuildoutProperty) =>
        propertyIds.includes(property.id)
      )
      
      allSavedProperties.push(...batchSavedProperties)

      // If we got fewer properties than requested, we've reached the end
      if (response.properties.length < batchSize) {
        break
      }

      // If we found all saved properties, we can stop
      if (allSavedProperties.length >= propertyIds.length) {
        break
      }

      currentOffset += batchSize
    }

    // Parse filter values
    const brokerId = brokerIdParam && !isNaN(parseInt(brokerIdParam, 10)) ? parseInt(brokerIdParam, 10) : null
    const propertyType = propertyTypeParam && !isNaN(parseInt(propertyTypeParam, 10)) ? parseInt(propertyTypeParam, 10) : null
    const minPrice = minPriceParam && !isNaN(parseInt(minPriceParam, 10)) ? parseInt(minPriceParam, 10) : null
    const maxPrice = maxPriceParam && !isNaN(parseInt(maxPriceParam, 10)) ? parseInt(maxPriceParam, 10) : null
    const minCapRate = minCapRateParam && !isNaN(parseFloat(minCapRateParam)) ? parseFloat(minCapRateParam) : null
    const maxCapRate = maxCapRateParam && !isNaN(parseFloat(maxCapRateParam)) ? parseFloat(maxCapRateParam) : null
    const minSquareFootage = minSquareFootageParam && !isNaN(parseInt(minSquareFootageParam, 10)) ? parseInt(minSquareFootageParam, 10) : null
    const maxSquareFootage = maxSquareFootageParam && !isNaN(parseInt(maxSquareFootageParam, 10)) ? parseInt(maxSquareFootageParam, 10) : null

    // Apply server-side filtering to saved properties
    let filteredProperties = allSavedProperties

    // Filter by broker
    if (brokerId !== null) {
      filteredProperties = filteredProperties.filter(p => p.broker_id === brokerId)
    }

    // Filter by property type
    if (propertyType !== null) {
      filteredProperties = filteredProperties.filter(p => p.property_type_id === propertyType)
    }

    // Filter by price
    if (minPrice !== null) {
      filteredProperties = filteredProperties.filter(p => 
        p.sale_price_dollars !== null && 
        p.sale_price_dollars !== undefined && 
        p.sale_price_dollars >= minPrice
      )
    }

    if (maxPrice !== null) {
      filteredProperties = filteredProperties.filter(p => 
        p.sale_price_dollars !== null && 
        p.sale_price_dollars !== undefined && 
        p.sale_price_dollars <= maxPrice
      )
    }

    // Filter by sale/lease
    if (saleOrLeaseParam === 'sale') {
      filteredProperties = filteredProperties.filter(p => 
        p.sale === true && p.sale_listing_published === true
      )
    } else if (saleOrLeaseParam === 'lease') {
      filteredProperties = filteredProperties.filter(p => 
        p.lease === true && p.lease_listing_published === true
      )
    }

    // Filter by cap rate
    if (minCapRate !== null) {
      filteredProperties = filteredProperties.filter(p => 
        p.cap_rate_pct !== null && 
        p.cap_rate_pct !== undefined && 
        p.cap_rate_pct >= minCapRate
      )
    }

    if (maxCapRate !== null) {
      filteredProperties = filteredProperties.filter(p => 
        p.cap_rate_pct !== null && 
        p.cap_rate_pct !== undefined && 
        p.cap_rate_pct <= maxCapRate
      )
    }

    // Filter by square footage
    if (minSquareFootage !== null) {
      filteredProperties = filteredProperties.filter(p => 
        p.building_size_sf !== null && 
        p.building_size_sf !== undefined && 
        p.building_size_sf >= minSquareFootage
      )
    }

    if (maxSquareFootage !== null) {
      filteredProperties = filteredProperties.filter(p => 
        p.building_size_sf !== null && 
        p.building_size_sf !== undefined && 
        p.building_size_sf <= maxSquareFootage
      )
    }

    // Filter by text search
    if (searchQueryParam) {
      const query = searchQueryParam.toLowerCase()
      filteredProperties = filteredProperties.filter(p => 
        (p.address || '').toLowerCase().includes(query) ||
        (p.city || '').toLowerCase().includes(query) ||
        (p.state || '').toLowerCase().includes(query) ||
        (p.zip || '').toLowerCase().includes(query) ||
        (p.name || '').toLowerCase().includes(query) ||
        (p.sale_listing_web_title || '').toLowerCase().includes(query) ||
        (p.lease_listing_web_title || '').toLowerCase().includes(query)
      )
    }

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
        message: `Found ${totalFiltered} of ${allSavedProperties.length} saved properties matching filters`,
      })
    } else {
      // Transform to lightweight format
      const lightweightProperties = paginatedProperties.map(toLightweightProperty)
      
      return NextResponse.json({
        success: true,
        properties: lightweightProperties,
        count: totalFiltered, // Total count after filtering
        message: `Found ${totalFiltered} of ${allSavedProperties.length} saved properties matching filters`,
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

