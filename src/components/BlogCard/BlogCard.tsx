'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Arrow from '../Arrow/Arrow'
import type { Blog, BlogCategory, User, Media } from '@/payload-types'

export interface BlogCardProps {
  blog: Blog
  variant?: 'featured' | 'default' | 'story'
}

// Helper to get image URL from media
const getImageUrl = (media: string | Media | null | undefined): string => {
  if (!media) return '/placeholder-blog.jpg'
  if (typeof media === 'string') return media
  return media.url || '/placeholder-blog.jpg'
}

// Helper to get author name
const getAuthorName = (author: string | User | null | undefined): string => {
  if (!author) return 'Unknown Author'
  if (typeof author === 'string') return 'Unknown Author'
  return author.email?.split('@')[0] || 'Unknown Author'
}

// Helper to get category names
const getCategoryNames = (categories: (string | BlogCategory)[] | undefined): string[] => {
  if (!categories) return []
  return categories
    .map((cat) => {
      if (typeof cat === 'string') return null
      return cat.name
    })
    .filter(Boolean) as string[]
}

// Helper to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

// Helper to get blog URL
const getBlogUrl = (blog: Blog): string => {
  const typePathMap: Record<string, string> = {
    article: 'article',
    'market-report': 'market-report',
    'investment-spotlight': 'investment-spotlight',
  }
  const typePath = typePathMap[blog.type] || 'article'
  return `/${typePath}/${blog.slug}`
}

// Featured variant - Large horizontal card with image on left
const FeaturedCard: React.FC<{ blog: Blog }> = ({ blog }) => {
  const imageUrl = getImageUrl(blog.featuredImage)
  const authorName = getAuthorName(blog.author)
  const categories = getCategoryNames(blog.categories)
  const formattedDate = formatDate(blog.createdAt)
  const blogUrl = getBlogUrl(blog)

  return (
    <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Section */}
      <Link href={blogUrl} className="relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden rounded-xl group block">
        <Image
          src={imageUrl}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </Link>

      {/* Content Section */}
      <div className="flex flex-col justify-center">
        <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl text-[#1a2e2a] leading-tight mb-4">
          <Link href={blogUrl} className="hover:opacity-80 transition-opacity">
            {blog.title}
          </Link>
        </h2>

        {blog.description && (
          <p className="text-stone-600 text-base lg:text-lg mb-6 line-clamp-3">
            {blog.description}
          </p>
        )}

        <div className="flex items-center gap-3 text-sm text-stone-500 mb-6">
          <span className="font-medium text-[#1a2e2a]">{authorName}</span>
          <span>·</span>
          <time dateTime={blog.createdAt}>{formattedDate}</time>
        </div>

        <div className="flex items-center justify-between gap-4">
          <Link
            href={blogUrl}
            className="group/link inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1a2e2a] hover:opacity-70 transition-opacity"
          >
            Read More
            <Arrow
              direction="right"
              variant="fill"
              size={16}
              className="transform transition-transform group-hover/link:translate-x-1"
            />
          </Link>

          {categories.length > 0 && (
            <div className="flex gap-2 flex-wrap justify-end">
              {categories.slice(0, 2).map((cat, index) => (
                <span
                  key={index}
                  className="bg-[#f0eee6] text-[#1a2e2a] text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-md"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

// Default variant - Vertical card for grid display
const DefaultCard: React.FC<{ blog: Blog }> = ({ blog }) => {
  const imageUrl = getImageUrl(blog.featuredImage)
  const authorName = getAuthorName(blog.author)
  const categories = getCategoryNames(blog.categories)
  const formattedDate = formatDate(blog.createdAt)
  const blogUrl = getBlogUrl(blog)

  return (
    <article className="flex flex-col h-full">
      {/* Image Container */}
      <Link href={blogUrl} className="relative aspect-[4/3] overflow-hidden rounded-xl group block mb-5">
        <Image
          src={imageUrl}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Floating Tags */}
        {categories.length > 0 && (
          <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
            {categories.slice(0, 2).map((cat, index) => (
              <span
                key={index}
                className="bg-[#f0eee6] text-[#1a2e2a] text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-md shadow-sm"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        <h3 className="font-serif text-xl lg:text-2xl text-[#1a2e2a] leading-tight mb-3 line-clamp-2">
          <Link href={blogUrl} className="hover:opacity-80 transition-opacity">
            {blog.title}
          </Link>
        </h3>

        {blog.description && (
          <p className="text-stone-600 text-sm mb-4 line-clamp-2 flex-grow">
            {blog.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-4 mt-auto">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="font-medium text-[#1a2e2a]">{authorName}</span>
            <span>·</span>
            <time dateTime={blog.createdAt}>{formattedDate}</time>
          </div>

          <Link
            href={blogUrl}
            className="group/link inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1a2e2a] hover:opacity-70 transition-opacity whitespace-nowrap"
          >
            Read More
            <Arrow
              direction="right"
              variant="fill"
              size={14}
              className="transform transition-transform group-hover/link:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </article>
  )
}

// Story variant - Horizontal card with text left, image right
const StoryCard: React.FC<{ blog: Blog }> = ({ blog }) => {
  const imageUrl = getImageUrl(blog.featuredImage)
  const authorName = getAuthorName(blog.author)
  const categories = getCategoryNames(blog.categories)
  const formattedDate = formatDate(blog.createdAt)
  const blogUrl = getBlogUrl(blog)

  return (
    <article className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Content Section - Left */}
      <div className="flex flex-col justify-center order-2 sm:order-1">
        <h3 className="font-serif text-xl lg:text-2xl text-[#1a2e2a] leading-tight mb-3 line-clamp-2">
          <Link href={blogUrl} className="hover:opacity-80 transition-opacity">
            {blog.title}
          </Link>
        </h3>

        <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
          <span className="font-medium text-[#1a2e2a]">{authorName}</span>
          <span>·</span>
          <time dateTime={blog.createdAt}>{formattedDate}</time>
        </div>

        {blog.description && (
          <p className="text-stone-600 text-sm mb-4 line-clamp-3">
            {blog.description}
          </p>
        )}

        <Link
          href={blogUrl}
          className="group/link inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1a2e2a] hover:opacity-70 transition-opacity"
        >
          Read More
          <Arrow
            direction="right"
            variant="fill"
            size={14}
            className="transform transition-transform group-hover/link:translate-x-1"
          />
        </Link>
      </div>

      {/* Image Section - Right */}
      <Link href={blogUrl} className="relative aspect-[4/3] overflow-hidden rounded-xl group block order-1 sm:order-2">
        <Image
          src={imageUrl}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
        {/* Floating Tags */}
        {categories.length > 0 && (
          <div className="absolute bottom-4 left-4 flex gap-2">
            {categories.slice(0, 2).map((cat, index) => (
              <span
                key={index}
                className="bg-[#f0eee6] text-[#1a2e2a] text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-md shadow-sm"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  )
}

// Main BlogCard Component
const BlogCard: React.FC<BlogCardProps> = ({ blog, variant = 'default' }) => {
  switch (variant) {
    case 'featured':
      return <FeaturedCard blog={blog} />
    case 'story':
      return <StoryCard blog={blog} />
    case 'default':
    default:
      return <DefaultCard blog={blog} />
  }
}

export default BlogCard
