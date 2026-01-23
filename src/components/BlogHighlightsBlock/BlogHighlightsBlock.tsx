'use client'
import React, { useState, useEffect } from 'react'
import BlogHighlights from '../BlogHighlights/BlogHighlights'
import type { Blog, BlogCategory, User, BlogHighlight as BlogHighlightsType } from '@/payload-types'

interface BlogHighlightsBlockProps {
  config: BlogHighlightsType
  initialBlogs: Blog[]
  allCategories: BlogCategory[]
  authors: User[]
  years: number[]
}

export default function BlogHighlightsBlock({
  config,
  initialBlogs,
  allCategories,
  authors,
  years,
}: BlogHighlightsBlockProps) {
  return (
    <BlogHighlights
      config={config}
      initialBlogs={initialBlogs}
      allCategories={allCategories}
      authors={authors}
      years={years}
    />
  )
}
