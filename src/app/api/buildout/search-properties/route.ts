import { NextResponse } from 'next/server'
import { buildoutApi, toLightweightProperty, filterProperties, type LightweightPropertiesResponse, type PropertyFilters } from '@/utils/buildout-api'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination - default to 20 per page for list view
    const limitParam = searchParams.get('limit')
    const offsetParam = searchParams.get('offset')
    const fullDataParam = searchParams.get('fullData') // If true, return full property objects
    
    // Filters
    const brokerIdParam = searchParams.get('brokerId')
    const propertyTypeParam = searchParams.get('propertyType')
    const minPriceParam = searchParams.get('minPrice')
    const maxPriceParam = searchParams.get('maxPrice')
    const saleOrLeaseParam = searchParams.get('saleOrLease') // 'sale', 'lease', or 'both'
    const minCapRateParam = searchParams.get('minCapRate')
    const maxCapRateParam = searchParams.get('maxCapRate')
    const minSquareFootageParam = searchParams.get('minSquareFootage')
    const maxSquareFootageParam = searchParams.get('maxSquareFootage')
    const searchQueryParam = searchParams.get('search') // Text search
    const skipCacheParam = searchParams.get('skipCache')

    // Pagination - default to 20 per page
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

    // Fetch all properties using getAllProperties (same approach for consistency)
    // This ensures we have all properties available for filtering
    const allPropertiesResponse = await buildoutApi.getAllProperties({
      skipCache: skipCacheParam === 'true',
    })

    // Build filter object
    const filters: PropertyFilters = {
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

    // Apply pagination after filtering
    const totalFiltered = filteredProperties.length
    const startIndex = offset
    const endIndex = Math.min(startIndex + limit, totalFiltered)
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex)

    const response = {
      properties: paginatedProperties,
      count: totalFiltered,
      message: allPropertiesResponse.message,
    }

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
    console.error('Error searching properties:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while searching properties'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

