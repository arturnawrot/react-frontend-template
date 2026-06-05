import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

// Internal endpoint called only by middleware to look up static files
export async function GET(request: NextRequest) {
  if (!request.headers.get('x-static-file-internal')) {
    return new NextResponse(null, { status: 403 })
  }

  const filePath = request.nextUrl.searchParams.get('path')
  if (!filePath) {
    return new NextResponse(null, { status: 400 })
  }

  // Strip leading slash to match how paths are stored in the collection
  const normalizedPath = filePath.startsWith('/') ? filePath.slice(1) : filePath

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'static-files',
    where: { path: { equals: normalizedPath } },
    limit: 1,
  })

  if (result.docs.length === 0) {
    return new NextResponse(null, { status: 404 })
  }

  const file = result.docs[0]

  return new NextResponse(file.content as string, {
    status: 200,
    headers: {
      'Content-Type': (file.contentType as string) || 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
    },
  })
}
