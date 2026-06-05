import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const FILE_EXT_REGEX = /\.[a-zA-Z0-9]+$/

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Intercept requests that look like static files (have a file extension or are .well-known paths)
  // Skip API and media routes to avoid overhead and infinite loops
  if (
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/media') &&
    (FILE_EXT_REGEX.test(pathname) || pathname.startsWith('/.well-known'))
  ) {
    const checkUrl = new URL('/api/static-file', request.nextUrl.origin)
    checkUrl.searchParams.set('path', pathname)

    const res = await fetch(checkUrl.toString(), {
      headers: { 'x-static-file-internal': '1' },
    })

    if (res.ok) {
      const content = await res.text()
      return new NextResponse(content, {
        status: 200,
        headers: {
          'Content-Type': res.headers.get('Content-Type') || 'text/plain; charset=utf-8',
          'Cache-Control': res.headers.get('Cache-Control') || 'public, max-age=300',
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|fontawesome).*)',
  ],
}
