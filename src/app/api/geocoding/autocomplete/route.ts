import { NextRequest, NextResponse } from 'next/server'
import type { AddressSuggestion } from '@/components/LocationSearchSuggestion/LocationSearchSuggestion'
import { buildoutApi, filterProperties, type PropertyFilters } from '@/utils/buildout-api'
import { addressToSlug } from '@/utils/address-slug'

/**
 * Address autocomplete API endpoint
 * Uses Buildout API to search properties and extract unique addresses
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Query must be at least 2 characters',
      }, { status: 400 })
    }

    // Get all properties from Buildout API
    const allPropertiesResponse = await buildoutApi.getAllProperties()

    // Filter properties using the search query (this handles address, city, state, zip matching)
    const filters: PropertyFilters = {
      search: query,
    }
    const filteredProperties = filterProperties(allPropertiesResponse.properties, filters)

    // Extract unique addresses from filtered properties
    const addressMap = new Map<string, AddressSuggestion>()

    for (const property of filteredProperties.slice(0, 50)) {
      // Build full address
      const addressParts = [
        property.address,
        property.city,
        property.state,
        property.zip,
      ].filter(Boolean)

      if (addressParts.length === 0) continue

      const fullAddress = addressParts.join(', ')
      const mainText = property.address || ''
      const secondaryText = [property.city, property.state, property.zip]
        .filter(Boolean)
        .join(', ')

      // Use full address as key to avoid duplicates
      if (!addressMap.has(fullAddress) && mainText) {
        // Generate property slug from the property address
        const propertyAddress = property.address || property.name || ''
        const propertySlug = propertyAddress ? addressToSlug(propertyAddress) : undefined
        
        addressMap.set(fullAddress, {
          id: `buildout-${property.id}`,
          mainText: mainText,
          secondaryText: secondaryText || 'USA',
          fullAddress: fullAddress,
          propertySlug: propertySlug,
        })
      }

      // Limit to 5 suggestions
      if (addressMap.size >= 5) break
    }

    const suggestions = Array.from(addressMap.values())

    return NextResponse.json({
      success: true,
      suggestions: suggestions.slice(0, 5),
    })
  } catch (error) {
    console.error('Error in autocomplete API:', error)
    
    // Return empty suggestions on error
    return NextResponse.json({
      success: true,
      suggestions: [],
    })
  }
}


