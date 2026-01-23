'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import BlogCard from '../BlogCard/BlogCard'
import BlogSearchFilters, { type BlogFilters } from '../BlogSearchFilters/BlogSearchFilters'
import Container from '../Container/Container'
import type { Blog, BlogCategory, User } from '@/payload-types'

interface BlogAllContentProps {
  initialBlogs: Blog[]
  initialTotalCount: number
  allCategories: BlogCategory[]
  displayedCategories?: BlogCategory[]
  authors: User[]
  years: number[]
  showTypeFilters?: boolean
}

const POSTS_PER_PAGE = 12

export default function BlogAllContent({
  initialBlogs,
  initialTotalCount,
  allCategories,
  displayedCategories = [],
  authors,
  years,
  showTypeFilters = true,
}: BlogAllContentProps) {
  const searchParams = useSearchParams()
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Parse initial filters from URL
  const getInitialFilters = (): BlogFilters => {
    return {
      search: searchParams.get('search') || '',
      categories: searchParams.get('categories')?.split(',').filter(Boolean) || [],
      types: searchParams.get('types')?.split(',').filter(Boolean) || [],
      year: searchParams.get('year') || null,
      author: searchParams.get('author') || null,
    }
  }

  const [filters, setFilters] = useState<BlogFilters>(getInitialFilters)
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs)
  const [totalCount, setTotalCount] = useState(initialTotalCount)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(initialBlogs.length < initialTotalCount)
  const [offset, setOffset] = useState(initialBlogs.length)

  // Check if filters have changed from URL
  const hasActiveFilters =
    filters.search ||
    filters.categories.length > 0 ||
    filters.types.length > 0 ||
    filters.year ||
    filters.author

  // Fetch blogs with current filters
  const fetchBlogs = useCallback(
    async (resetOffset = true) => {
      const currentOffset = resetOffset ? 0 : offset
      
      if (resetOffset) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      try {
        const params = new URLSearchParams()
        params.set('limit', POSTS_PER_PAGE.toString())
        params.set('offset', currentOffset.toString())

        if (filters.search) params.set('search', filters.search)
        if (filters.categories.length > 0) params.set('categories', filters.categories.join(','))
        if (filters.types.length > 0) params.set('types', filters.types.join(','))
        if (filters.year) params.set('year', filters.year)
        if (filters.author) params.set('author', filters.author)

        const response = await fetch(`/api/blogs/search?${params.toString()}`)
        const data = await response.json()

        if (data.success) {
          if (resetOffset) {
            setBlogs(data.blogs)
            setOffset(data.blogs.length)
          } else {
            setBlogs((prev) => [...prev, ...data.blogs])
            setOffset((prev) => prev + data.blogs.length)
          }
          setTotalCount(data.count)
          setHasMore(data.hasNextPage)
        }
      } catch (error) {
        console.error('Error fetching blogs:', error)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [filters, offset]
  )

  // Fetch blogs when filters change
  useEffect(() => {
    // If there are active filters or URL params changed, fetch with new filters
    if (hasActiveFilters) {
      fetchBlogs(true)
    } else {
      // Reset to initial state
      setBlogs(initialBlogs)
      setTotalCount(initialTotalCount)
      setOffset(initialBlogs.length)
      setHasMore(initialBlogs.length < initialTotalCount)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  // Update URL when filters change (without navigation)
  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.categories.length > 0) params.set('categories', filters.categories.join(','))
    if (filters.types.length > 0) params.set('types', filters.types.join(','))
    if (filters.year) params.set('year', filters.year)
    if (filters.author) params.set('author', filters.author)

    const queryString = params.toString()
    const newUrl = `/blog/all${queryString ? `?${queryString}` : ''}`
    
    // Update URL without navigation
    window.history.replaceState(null, '', newUrl)
  }, [filters])

  // Infinite scroll - Intersection Observer
  useEffect(() => {
    if (!loadMoreRef.current || loading || loadingMore || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchBlogs(false)
        }
      },
      {
        rootMargin: '100px',
      }
    )

    observer.observe(loadMoreRef.current)

    return () => observer.disconnect()
  }, [fetchBlogs, hasMore, loading, loadingMore])

  // Handle filter changes
  const handleFiltersChange = (newFilters: BlogFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="min-h-screen">
      <Container className="py-16 lg:py-20">
        {/* Page Header - Inline layout with dividers */}
        <div className="mb-10">
          <div className="border-t border-stone-300" />
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 py-6">
            <h1 className="font-serif text-3xl lg:text-4xl text-[#1a2e2a] shrink-0">All Content</h1>

            {/* Search and Filters - Inline */}
            <BlogSearchFilters
              displayedCategories={displayedCategories}
              allCategories={allCategories}
              authors={authors}
              years={years}
              showTypeFilters={showTypeFilters}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              redirectOnFilter={false}
            />
          </div>
          <div className="border-b border-stone-300" />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-stone-500">
            {totalCount} {totalCount === 1 ? 'article' : 'articles'} found
          </p>
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a2e2a]" />
          </div>
        ) : blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} variant="default" lite />
              ))}
            </div>

            {/* Load More Trigger */}
            <div ref={loadMoreRef} className="h-20 flex items-center justify-center mt-8">
              {loadingMore && (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1a2e2a]" />
              )}
              {!hasMore && blogs.length > 0 && (
                <p className="text-sm text-stone-500">You&apos;ve reached the end</p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-stone-500 text-lg mb-4">No articles found matching your criteria.</p>
            <button
              onClick={() =>
                setFilters({
                  search: '',
                  categories: [],
                  types: [],
                  year: null,
                  author: null,
                })
              }
              className="text-[#1a2e2a] font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </Container>
    </div>
  )
}
