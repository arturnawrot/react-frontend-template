import { NextRequest, NextResponse } from 'next/server'
import { buildoutApi } from '@/utils/buildout-api'
import { addressToSlug } from '@/utils/address-slug'

export async function GET(request: NextRequest) {
  const propertyId = request.nextUrl.searchParams.get('propertyId')
  const match = propertyId?.match(/\d{7}/)

  if (match) {
    let slug: string | null = null
    try {
      const property = await buildoutApi.getPropertyById(parseInt(match[0], 10))
      if (property) slug = addressToSlug(property.address || property.name || match[0])
    } catch { /* not found */ }
    if (slug) return new Response(null, { status: 302, headers: { Location: `/property/${slug}` } })
  }

  return NextResponse.next()
}
