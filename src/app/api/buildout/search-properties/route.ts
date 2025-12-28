import { NextResponse } from 'next/server'
import { buildoutApi, toLightweightProperty, type LightweightPropertiesResponse, type BuildoutProperty } from '@/utils/buildout-api'

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

    const options: Record<string, string | number | boolean | undefined> = {}

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

    // Buildout API only supports broker_id and property_type_id directly
    // We need to fetch properties and filter the rest server-side
    if (brokerId !== null) {
      options.broker_id = brokerId
    }

    if (propertyType !== null) {
      options.property_type_id = propertyType
    }

    // For other filters, we need to fetch more properties and filter server-side
    // Use a higher limit to get enough properties to filter
    const hasServerSideFilters = 
      minPrice !== null || 
      maxPrice !== null || 
      (saleOrLeaseParam !== null && saleOrLeaseParam !== 'both') ||
      minCapRate !== null || 
      maxCapRate !== null || 
      minSquareFootage !== null || 
      maxSquareFootage !== null || 
      !!searchQueryParam

    // Set pagination options
    if (hasServerSideFilters) {
      // If we have server-side filters, fetch more properties to filter
      // Fetch up to 1000 properties to filter (or use limit if it's higher)
      options.limit = Math.max(limit, 1000)
      options.offset = 0 // Start from beginning for filtering - we'll paginate after filtering
    } else {
      // No server-side filters - use Buildout API pagination directly
      options.limit = limit
      options.offset = offset
    }

    if (skipCacheParam === 'true') {
      options.skipCache = true
    }

    // Fetch properties from Buildout API (with broker_id and property_type_id filters if provided)
    let response = await buildoutApi.searchProperties(options)

    // Apply server-side filtering for filters not supported by Buildout API
    if (hasServerSideFilters && response.properties.length > 0) {
      let filteredProperties = response.properties

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

      // Apply pagination after filtering
      const totalFiltered = filteredProperties.length
      const startIndex = offset
      const endIndex = Math.min(startIndex + limit, totalFiltered)
      const paginatedProperties = filteredProperties.slice(startIndex, endIndex)

      response = {
        properties: paginatedProperties,
        count: totalFiltered,
        message: response.message,
      }
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

