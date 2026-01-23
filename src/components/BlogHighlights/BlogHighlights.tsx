'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import BlogCard from '../BlogCard/BlogCard'
import BlogSearchFilters, { type BlogFilters } from '../BlogSearchFilters/BlogSearchFilters'
import Container from '../Container/Container'
import Arrow from '../Arrow/Arrow'
import type { Blog, BlogCategory, User, BlogHighlight as BlogHighlightsType } from '@/payload-types'

interface BlogHighlightsProps {
  config: BlogHighlightsType
  initialBlogs?: Blog[]
  allCategories?: BlogCategory[]
  authors?: User[]
  years?: number[]
}

// Default empty filters
const defaultFilters: BlogFilters = {
  search: '',
  categories: [],
  types: [],
  year: null,
  author: null,
}

export default function BlogHighlights({
  config,
  initialBlogs = [],
  allCategories = [],
  authors = [],
  years = [],
}: BlogHighlightsProps) {
  const [filters, setFilters] = useState<BlogFilters>(defaultFilters)
  const [categoryBlogs, setCategoryBlogs] = useState<Blog[]>(initialBlogs)
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = config.exploreByCategory?.postsPerPage || 10

  // Extract featured posts
  const featuredPosts = (config.featuredPosts?.posts || []).filter(
    (post): post is Blog => typeof post !== 'string'
  )
  const firstFeatured = featuredPosts[0]
  const restFeatured = featuredPosts.slice(1, 4)

  // Extract displayed categories for quick filters
  const displayedCategories = (config.exploreByCategory?.displayedCategories || []).filter(
    (cat): cat is BlogCategory => typeof cat !== 'string'
  )

  // Fetch blogs when filters change
  const fetchBlogs = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('limit', postsPerPage.toString())
      params.set('offset', ((page - 1) * postsPerPage).toString())
      
      if (filters.search) params.set('search', filters.search)
      if (filters.categories.length > 0) params.set('categories', filters.categories.join(','))
      if (filters.types.length > 0) params.set('types', filters.types.join(','))
      if (filters.year) params.set('year', filters.year)
      if (filters.author) params.set('author', filters.author)

      const response = await fetch(`/api/blogs/search?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setCategoryBlogs(data.blogs)
        setTotalCount(data.count)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }, [filters, postsPerPage])

  // Fetch blogs when filters change
  useEffect(() => {
    const hasFilters =
      filters.search ||
      filters.categories.length > 0 ||
      filters.types.length > 0 ||
      filters.year ||
      filters.author

    if (hasFilters) {
      fetchBlogs(1)
    } else {
      setCategoryBlogs(initialBlogs)
      setTotalCount(initialBlogs.length)
    }
  }, [filters, initialBlogs, fetchBlogs])

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchBlogs(page)
    // Scroll to explore section
    const exploreSection = document.getElementById('explore-by-category')
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const totalPages = Math.ceil(totalCount / postsPerPage)

  return (
    <div className="w-full">
      {/* ============================================ */}
      {/* SECTION 1: Featured Posts */}
      {/* ============================================ */}
      {config.featuredPosts?.enabled && featuredPosts.length > 0 && (
        <section className="py-16 lg:py-20 bg-white">
          <Container>
            {/* First Featured Post - Large */}
            {firstFeatured && (
              <div className="mb-12 lg:mb-16">
                <BlogCard blog={firstFeatured} variant="featured" />
              </div>
            )}

            {/* Remaining Featured Posts - Grid */}
            {restFeatured.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {restFeatured.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} variant="default" />
                ))}
              </div>
            )}
          </Container>
        </section>
      )}

      {/* ============================================ */}
      {/* SECTION 2: Explore by Category */}
      {/* ============================================ */}
      {config.exploreByCategory?.enabled && (
        <section id="explore-by-category" className="py-16 lg:py-20">
          <Container>
            {/* Section Header - Inline layout with dividers */}
            <div className="mb-10">
              <div className="border-t border-stone-300" />
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 py-6">
                <h2 className="font-serif text-3xl lg:text-4xl text-[#1a2e2a] shrink-0">
                  {config.exploreByCategory?.heading || 'Explore by Category'}
                </h2>

                {/* Search and Filters - Inline */}
                <BlogSearchFilters
                  displayedCategories={displayedCategories}
                  allCategories={allCategories}
                  authors={authors}
                  years={years}
                  showTypeFilters={config.exploreByCategory?.showTypeFilters !== false}
                  filters={filters}
                  onFiltersChange={setFilters}
                  redirectOnFilter={false}
                />
              </div>
              <div className="border-b border-stone-300" />
            </div>

            {/* Blog Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a2e2a]" />
              </div>
            ) : categoryBlogs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {categoryBlogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} variant="default" lite />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium rounded-lg border border-stone-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-100 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-stone-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-medium rounded-lg border border-stone-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-100 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-stone-500 text-lg">No articles found matching your criteria.</p>
              </div>
            )}
          </Container>
        </section>
      )}

      {/* ============================================ */}
      {/* SECTION 3: Flexible Sections */}
      {/* ============================================ */}
      {config.flexibleSections?.map((section, index) => (
        <FlexibleSection key={index} section={section} />
      ))}
    </div>
  )
}

// Flexible Section Component
interface FlexibleSectionProps {
  section: NonNullable<BlogHighlightsType['flexibleSections']>[number]
}

function FlexibleSection({ section }: FlexibleSectionProps) {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      if (section.selectionMode === 'manual') {
        // Manual selection - blogs are already provided
        const manualBlogs = (section.manualArticles || []).filter(
          (blog): blog is Blog => typeof blog !== 'string'
        )
        setBlogs(manualBlogs)
        setLoading(false)
        return
      }

      // Auto selection - fetch from API
      try {
        const params = new URLSearchParams()
        params.set('limit', (section.limit || 3).toString())

        if (section.selectionMode === 'category' && section.categoryFilter) {
          const categoryId = typeof section.categoryFilter === 'string'
            ? section.categoryFilter
            : section.categoryFilter.id
          params.set('categories', categoryId)
        }

        if (section.selectionMode === 'type' && section.typeFilter) {
          params.set('types', section.typeFilter)
        }

        const response = await fetch(`/api/blogs/search?${params.toString()}`)
        const data = await response.json()

        if (data.success) {
          setBlogs(data.blogs)
        }
      } catch (error) {
        console.error('Error fetching flexible section blogs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [section])

  if (loading) {
    return (
      <section className="py-16 lg:py-20 bg-white">
        <Container>
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a2e2a]" />
          </div>
        </Container>
      </section>
    )
  }

  if (blogs.length === 0) {
    return null
  }

  return (
    <section className="py-16 lg:py-20 bg-white border-t border-stone-100">
      <Container>
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-serif text-3xl lg:text-4xl text-[#1a2e2a]">{section.title}</h2>
          {section.viewAllLink && (
            <Link
              href="/blog/all"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1a2e2a] hover:opacity-70 transition-opacity"
            >
              {section.viewAllLink}
              <Arrow
                direction="right"
                variant="fill"
                size={16}
                className="transform transition-transform group-hover:translate-x-1"
              />
            </Link>
          )}
        </div>

        {/* Story Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} variant="story" />
          ))}
        </div>
      </Container>
    </section>
  )
}
