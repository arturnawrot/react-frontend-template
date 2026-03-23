import { NextRequest, NextResponse } from 'next/server'
import { resolvePropertyIdRedirect } from '@/utils/legacy-property-redirect'

export async function GET(request: NextRequest) {
  const propertyId = request.nextUrl.searchParams.get('propertyId')

  if (propertyId) {
    const redirectUrl = await resolvePropertyIdRedirect(propertyId)
    if (redirectUrl) return new Response(null, { status: 302, headers: { Location: redirectUrl } })
  }

  return NextResponse.next()
}
