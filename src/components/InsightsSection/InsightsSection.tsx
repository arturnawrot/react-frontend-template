'use client'
import React, { useRef } from 'react'
import type { Page } from '@/payload-types'
import ArticleCard from '../ArticleCard/ArticleCard'
import Arrow from '../Arrow/Arrow'

type InsightsSectionBlock = Extract<Page['blocks'][number], { blockType: 'insightsSection' }>

interface Article {
  title: string
  image: string | { id: string; url?: string } | null
  tags: Array<{ tag: string }>
  slug?: string
}

interface InsightsSectionProps {
  block: InsightsSectionBlock
  articles?: Article[]
}

export default function InsightsSection({ block, articles: propArticles }: InsightsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 420 // Card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const heading = block.heading || 'Insights That Shape Smart Investments'
  const linkText = block.linkText || 'Explore More Insights'
  const linkHref = block.linkHref || '#'
  // Use prop articles if provided, otherwise fall back to block articles (for backward compatibility)
  const articles: Article[] = propArticles || (block as { articles?: Article[] }).articles || []

  return (
    <section className="w-full bg-[#dad6cc] py-20 overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* LEFT SECTION: Fixed Content */}
        <div className="lg:col-span-4 flex flex-col justify-between z-10">
          <div>
            <h1 className="text-5xl md:text-6xl font-serif text-[#1a2e2a] leading-[1.1] mb-8 whitespace-normal">
              {heading.split(' ').map((word, i, arr) => {
                // Add line breaks after word at index 0 and index 2
                const shouldAddBreak = (i === 0 || i === 2) && i < arr.length - 1
                
                return (
                  <React.Fragment key={i}>
                    {word}
                    {shouldAddBreak ? <br /> : i < arr.length - 1 ? ' ' : null}
                  </React.Fragment>
                )
              })}
            </h1>
            
            <a href={linkHref} className="inline-flex items-center gap-2 font-bold uppercase tracking-wider text-xs md:text-sm text-[#1a2e2a] hover:opacity-70 transition-opacity">
              {linkText}
              <Arrow direction="right" size={16} />
            </a>
          </div>

          {/* Desktop Arrows (positioned at bottom of left col) */}
          <div className="hidden lg:flex gap-4 mt-12">
            <button 
              onClick={() => scroll('left')}
              className="flex items-center justify-center hover:opacity-70 text-[#1a2e2a] transition-opacity"
            >
              <Arrow direction="left" size="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="flex items-center justify-center hover:opacity-70 text-[#1a2e2a] transition-opacity"
            >
              <Arrow direction="right" size="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* RIGHT SECTION: Overflow Slider */}
        <div className="lg:col-span-8 relative min-h-[450px]">
          <div className="lg:absolute left-0 top-0 w-full lg:w-screen h-full">
            <div 
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto h-full pb-8 pr-6 lg:pr-40 scrollbar-hide snap-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {articles.map((article: Article, index: number) => {
                const image = typeof article.image === 'object' && article.image !== null ? article.image : null
                const imageUrl = image?.url || ''
                const tags = article.tags?.map(t => t.tag).filter(Boolean) || []
                const link = article.slug ? `/${article.slug}` : '#'
                
                return (
                  <ArticleCard 
                    key={index}
                    imageSrc={imageUrl}
                    title={article.title}
                    tags={tags}
                    link={link}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* Mobile Arrows (Visible only on mobile) */}
        <div className="flex lg:hidden justify-center gap-4 col-span-1">
          <button 
            onClick={() => scroll('left')}
            className="flex items-center justify-center hover:opacity-70 text-[#1a2e2a] transition-opacity"
          >
            <Arrow direction="left" size="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="flex items-center justify-center hover:opacity-70 text-[#1a2e2a] transition-opacity"
          >
            <Arrow direction="right" size="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  )
}

