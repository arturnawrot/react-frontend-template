import { NextResponse } from 'next/server'
import { buildoutApi } from '@/utils/buildout-api'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination
    const limitParam = searchParams.get('limit')
    const offsetParam = searchParams.get('offset')
    
    // Filters
    const brokerIdParam = searchParams.get('brokerId')
    const propertyTypeParam = searchParams.get('propertyType')
    const minPriceParam = searchParams.get('minPrice')
    const maxPriceParam = searchParams.get('maxPrice')
    const saleOrLeaseParam = searchParams.get('saleOrLease') // 'sale', 'lease', or 'both'
    const minCapRateParam = searchParams.get('minCapRate')
    const maxCapRateParam = searchParams.get('maxCapRate')
    const searchQueryParam = searchParams.get('search') // Text search
    const skipCacheParam = searchParams.get('skipCache')

    const options: Record<string, string | number | boolean | undefined> = {}

    // Pagination
    const limit = limitParam ? parseInt(limitParam, 10) : 20
    const offset = offsetParam ? parseInt(offsetParam, 10) : 0
    
    if (!isNaN(limit)) {
      options.limit = limit
    }
    
    if (!isNaN(offset)) {
      options.offset = offset
    }

    // Filters
    if (brokerIdParam) {
      const brokerId = parseInt(brokerIdParam, 10)
      if (!isNaN(brokerId)) {
        options.broker_id = brokerId
      }
    }

    if (propertyTypeParam) {
      const propertyType = parseInt(propertyTypeParam, 10)
      if (!isNaN(propertyType)) {
        options.property_type_id = propertyType
      }
    }

    if (minPriceParam) {
      const minPrice = parseInt(minPriceParam, 10)
      if (!isNaN(minPrice)) {
        options.min_sale_price_dollars = minPrice
      }
    }

    if (maxPriceParam) {
      const maxPrice = parseInt(maxPriceParam, 10)
      if (!isNaN(maxPrice)) {
        options.max_sale_price_dollars = maxPrice
      }
    }

    if (saleOrLeaseParam === 'sale') {
      options.sale = true
      options.sale_listing_published = true
    } else if (saleOrLeaseParam === 'lease') {
      options.lease = true
      options.lease_listing_published = true
    }
    // If 'both' or not specified, we don't filter by sale/lease

    if (minCapRateParam) {
      const minCapRate = parseFloat(minCapRateParam)
      if (!isNaN(minCapRate)) {
        options.min_cap_rate_pct = minCapRate
      }
    }

    if (maxCapRateParam) {
      const maxCapRate = parseFloat(maxCapRateParam)
      if (!isNaN(maxCapRate)) {
        options.max_cap_rate_pct = maxCapRate
      }
    }

    if (searchQueryParam) {
      // Buildout API supports text search via 'q' parameter
      options.q = searchQueryParam
    }

    if (skipCacheParam === 'true') {
      options.skipCache = true
    }

    // Use searchProperties method for filtered search with pagination
    const response = await buildoutApi.searchProperties(options)

    return NextResponse.json({
      success: true,
      ...response,
    })
  } catch (error) {
    console.error('Error searching properties:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while searching properties'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

