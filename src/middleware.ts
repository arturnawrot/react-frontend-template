import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip admin routes and API routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const response = NextResponse.next()

  // Add CDN-friendly cache headers for frontend pages
  // s-maxage: CDN/Cloudflare caches for 60s
  // stale-while-revalidate: serve stale for up to 5 min while revalidating in background
  response.headers.set(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=300'
  )

  return response
}

export const config = {
  // Only run on frontend pages, not on static assets, admin, or API
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|admin|api|fontawesome).*)',
  ],
}
