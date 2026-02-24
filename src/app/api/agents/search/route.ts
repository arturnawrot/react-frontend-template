import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination
    const limitParam = searchParams.get('limit')
    const offsetParam = searchParams.get('offset')
    
    // Filters
    const searchQuery = searchParams.get('search') || ''
    const specialtyName = searchParams.get('specialty')
    const regionName = searchParams.get('region')
    
    // Pagination defaults
    const limit = limitParam ? parseInt(limitParam, 10) : 12
    const offset = offsetParam ? parseInt(offsetParam, 10) : 0
    
    // Calculate page from offset (Payload uses page, not offset)
    const page = Math.floor(offset / limit) + 1
    
    const payload = await getPayload({ config })
    
    // Fetch filter options (specialties and serving locations)
    const [specialtiesResult, locationsResult] = await Promise.all([
      payload.find({
        collection: 'specialties',
        limit: 1000,
        sort: 'name',
      }),
      payload.find({
        collection: 'serving-locations',
        limit: 1000,
        sort: 'name',
      }),
    ])
    
    // Look up IDs from names (case-insensitive)
    let specialtyId: string | null = null
    let servingLocationId: string | null = null
    
    if (specialtyName) {
      const match = specialtiesResult.docs.find(
        (s) => s.name.toLowerCase() === specialtyName.toLowerCase()
      )
      if (match) {
        specialtyId = match.id
      }
    }
    
    if (regionName) {
      const match = locationsResult.docs.find(
        (l) => l.name.toLowerCase() === regionName.toLowerCase()
      )
      if (match) {
        servingLocationId = match.id
      }
    }
    
    // Build where clause
    const whereConditions: any[] = []
    
    // Text search on firstName, lastName, or fullName
    if (searchQuery) {
      whereConditions.push({
        or: [
          { firstName: { contains: searchQuery } },
          { lastName: { contains: searchQuery } },
          { fullName: { contains: searchQuery } },
        ],
      })
    }
    
    // Filter by specialty (relationship field - use 'in' operator)
    if (specialtyId) {
      whereConditions.push({
        specialties: {
          in: [specialtyId],
        },
      })
    }
    
    // Filter by serving location (relationship field - use 'in' operator)
    if (servingLocationId) {
      whereConditions.push({
        servingLocations: {
          in: [servingLocationId],
        },
      })
    }
    
    // Build final where clause
    const where = whereConditions.length > 0 
      ? { and: whereConditions }
      : undefined
    
    // Fetch agents with relationships populated
    // Payload uses 'page' instead of 'offset' for pagination
    const result = await payload.find({
      collection: 'agents',
      where,
      limit,
      page,
      depth: 2, // Populate relationships
      sort: 'fullName',
    })
    
    const specialties = specialtiesResult.docs.map((s) => ({
      id: s.id,
      name: s.name,
    }))
    
    const servingLocations = locationsResult.docs.map((l) => ({
      id: l.id,
      name: l.name,
    }))
    
    // Transform agents for frontend
    const agents = result.docs.map((agent) => {
      // Extract roles
      const roles = (agent.roles || [])
        .map((r: any) => (typeof r === 'object' && r !== null && 'name' in r ? r.name : null))
        .filter((name: any): name is string => Boolean(name))
      
      // Extract specialties
      const specialties = (agent.specialties || [])
        .map((s: any) => (typeof s === 'object' && s !== null && 'name' in s ? s.name : null))
        .filter((name: any): name is string => Boolean(name))
      
      // Extract serving locations
      const servingLocations = (agent.servingLocations || [])
        .map((l: any) => (typeof l === 'object' && l !== null && 'name' in l ? l.name : null))
        .filter((name: any): name is string => Boolean(name))
      
      // Get image URL
      const cardImage = agent.cardImage && typeof agent.cardImage === 'object' 
        ? agent.cardImage.url || null
        : null
      
      return {
        id: agent.id,
        name: agent.fullName || `${agent.firstName} ${agent.lastName}`,
        role: agent.displayTitle || 'Agent & Broker',
        image: cardImage,
        servingLocations,
        serviceTags: specialties,
        email: agent.email || null,
        phone: agent.phone || null,
        linkedin: agent.linkedin || null,
        slug: agent.slug,
      }
    })
    
    return NextResponse.json({
      success: true,
      agents,
      count: result.totalDocs,
      totalPages: Math.ceil(result.totalDocs / limit),
      currentPage: page,
      specialties,
      servingLocations,
    })
  } catch (error) {
    console.error('Error searching agents:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while searching agents'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
