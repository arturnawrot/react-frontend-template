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
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || []
    const types = searchParams.get('types')?.split(',').filter(Boolean) || []
    const year = searchParams.get('year')
    const authorId = searchParams.get('author')

    // Pagination defaults
    const limit = limitParam ? parseInt(limitParam, 10) : 12
    const offset = offsetParam ? parseInt(offsetParam, 10) : 0

    // Calculate page from offset
    const page = Math.floor(offset / limit) + 1

    const payload = await getPayload({ config })

    // Build where clause
    const whereConditions: any[] = []

    // Text search on title or description
    if (searchQuery) {
      whereConditions.push({
        or: [
          { title: { contains: searchQuery } },
          { description: { contains: searchQuery } },
        ],
      })
    }

    // Filter by categories (relationship field)
    if (categories.length > 0) {
      whereConditions.push({
        categories: {
          in: categories,
        },
      })
    }

    // Filter by types
    if (types.length > 0) {
      whereConditions.push({
        type: {
          in: types,
        },
      })
    }

    // Filter by year (using createdAt)
    if (year) {
      const yearNum = parseInt(year, 10)
      const startDate = new Date(yearNum, 0, 1).toISOString()
      const endDate = new Date(yearNum + 1, 0, 1).toISOString()
      whereConditions.push({
        and: [
          { createdAt: { greater_than_equal: startDate } },
          { createdAt: { less_than: endDate } },
        ],
      })
    }

    // Filter by author
    if (authorId) {
      whereConditions.push({
        author: {
          equals: authorId,
        },
      })
    }

    // Build final where clause
    const where = whereConditions.length > 0 ? { and: whereConditions } : undefined

    // Fetch blogs with relationships populated
    const result = await payload.find({
      collection: 'blogs',
      where,
      limit,
      page,
      depth: 2, // Populate relationships (author, categories, featuredImage)
      sort: '-createdAt', // Newest first
    })

    // Fetch filter options
    const [categoriesResult, authorsResult] = await Promise.all([
      payload.find({
        collection: 'blog-categories',
        limit: 1000,
        sort: 'name',
      }),
      payload.find({
        collection: 'users',
        limit: 1000,
        sort: 'email',
      }),
    ])

    // Calculate available years from all blogs
    const allBlogsForYears = await payload.find({
      collection: 'blogs',
      limit: 0, // We just need the dates
      select: {
        createdAt: true,
      },
    })

    const yearsSet = new Set<number>()
    // Since we're selecting createdAt, iterate properly
    const allBlogsResult = await payload.find({
      collection: 'blogs',
      limit: 1000,
    })
    allBlogsResult.docs.forEach((blog) => {
      const blogYear = new Date(blog.createdAt).getFullYear()
      yearsSet.add(blogYear)
    })
    const years = Array.from(yearsSet).sort((a, b) => b - a) // Descending

    const allCategories = categoriesResult.docs.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    }))

    const authors = authorsResult.docs.map((u) => ({
      id: u.id,
      email: u.email,
    }))

    return NextResponse.json({
      success: true,
      blogs: result.docs,
      count: result.totalDocs,
      totalPages: result.totalPages,
      currentPage: page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      filters: {
        categories: allCategories,
        authors,
        years,
      },
    })
  } catch (error) {
    console.error('Error searching blogs:', error)

    const errorMessage = error instanceof Error ? error.message : 'An error occurred while searching blogs'

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
