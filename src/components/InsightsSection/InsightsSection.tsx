'use client'
import React from 'react'
import type { Page } from '@/payload-types'
import ArticleCard from '../ArticleCard/ArticleCard'
import { resolveLinkUrl, shouldOpenInNewTab } from '@/utils/linkResolver'
import Container from '@/components/Container/Container'
import SectionHeading from '@/components/SectionHeading/SectionHeading'
import ArrowLink from '@/components/ArrowLink/ArrowLink'
import Arrow from '@/components/Arrow/Arrow'
import { Carousel, CarouselTrackElement } from '../Carousel'

type InsightsSectionBlock = Extract<Page['blocks'][number], { blockType: 'insightsSection' }>

interface Article {
  title: string
  image: string | { id: string; url?: string } | null
  tags: Array<{ tag: string }>
  slug?: string
  type?: 'article' | 'market-report' | 'investment-spotlight'
}

interface InsightsSectionProps {
  block: InsightsSectionBlock
  articles?: Article[]
}

// Article Card Wrapper Component
const ArticleCardWrapper = ({ article }: { article: Article }) => {
  const image = typeof article.image === 'object' && article.image !== null ? article.image : null
  const imageUrl = image?.url || ''
  const tags = article.tags?.map(t => t.tag).filter(Boolean) || []

  // Map type to URL path
  const typePathMap: Record<string, string> = {
    'article': 'article',
    'market-report': 'market-report',
    'investment-spotlight': 'investment-spotlight',
  }

  const articleType = article.type || 'article'
  const typePath = typePathMap[articleType] || 'article'
  const link = article.slug ? `/${typePath}/${article.slug}` : '#'

  return (
    <ArticleCard
      imageSrc={imageUrl}
      title={article.title}
      tags={tags}
      link={link}
    />
  )
}

export default function InsightsSection({ block, articles: propArticles }: InsightsSectionProps) {
  const heading = block.heading || 'Insights That Shape Smart Investments'
  const linkText = block.linkText || 'Explore More Insights'
  const linkHref = resolveLinkUrl(block as any)
  const openInNewTab = shouldOpenInNewTab(block as any)
  // Use prop articles if provided, otherwise fall back to block articles (for backward compatibility)
  const articles: Article[] = propArticles || (block as { articles?: Article[] }).articles || []

  if (articles.length === 0) {
    return null
  }

  const renderItem = (article: Article) => <ArticleCardWrapper article={article} />

  const renderLayout = ({ trackElement, renderProps }: CarouselTrackElement) => {
    const { handleNext, handlePrev } = renderProps

    return (
      <Container className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        {/* LEFT SECTION: Fixed Content */}
        <div className="lg:col-span-4 flex flex-col justify-between z-10">
          <div>
            <SectionHeading as="h1" className="mb-8 whitespace-normal leading-[1.1]">
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
            </SectionHeading>

            {linkText && linkHref && (
              <ArrowLink href={linkHref} openInNewTab={openInNewTab}>
                {linkText}
              </ArrowLink>
            )}
          </div>

          {/* Desktop Arrows (positioned at bottom of left col) */}
          <div className="hidden lg:flex gap-4 mt-12">
            <button
              onClick={handlePrev}
              className="flex items-center justify-center hover:opacity-70 text-[#1a2e2a] transition-opacity"
            >
              <Arrow direction="up" variant="triangle" size={12} />
            </button>
            <button
              onClick={handleNext}
              className="flex items-center justify-center hover:opacity-70 text-[#1a2e2a] transition-opacity"
            >
              <Arrow direction="down" variant="triangle" size={12} />
            </button>
          </div>
        </div>

        {/* RIGHT SECTION: Overflow Slider */}
        <div className="lg:col-span-8 relative min-h-[450px] -mx-5 lg:mx-0">
          <div className="lg:absolute left-0 top-0 w-full lg:w-screen h-full">
            {trackElement}
          </div>
        </div>

        {/* Mobile Arrows (Visible only on mobile) */}
        <div className="flex lg:hidden justify-center gap-4 col-span-1">
          <button
            onClick={handlePrev}
            className="flex items-center justify-center hover:opacity-70 text-[#1a2e2a] transition-opacity"
          >
            <Arrow direction="up" variant="triangle" size={12} />
          </button>
          <button
            onClick={handleNext}
            className="flex items-center justify-center hover:opacity-70 text-[#1a2e2a] transition-opacity"
          >
            <Arrow direction="down" variant="triangle" size={12} />
          </button>
        </div>
      </Container>
    )
  }

  return (
    <section className="w-full bg-[#dad6cc] py-20 overflow-x-hidden">
      <Carousel
        items={articles}
        renderItem={renderItem}
        config={{
          cardWidth: [300, 400, 400], // ArticleCard responsive widths
          gap: 24,
        }}
        trackClassName="h-full pb-8"
        wrapperClassName="h-full pl-6 lg:pl-0"
        renderLayout={renderLayout}
      />
    </section>
  )
}
