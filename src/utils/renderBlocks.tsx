import React from 'react'
import type { Page } from '@/payload-types'
import HeroWrapper from '@/components/Hero/HeroWrapper'
import FlippedM from '@/components/FlippedM/FlippedM'
import Container from '@/components/Container/Container'
import CardSection from '@/components/CardSection/CardSection'
import PropertySearchInput from '@/components/PropertySearchInput/PropertySearchInput'
import FeaturedProperties from '@/components/FeaturedProperties/FeaturedProperties'
import TestimonialCarousel from '@/components/TestimonialCarousel/TestimonialCarousel'
import SplitSection from '@/components/SplitSection/SplitSection'
import InsightsSection from '@/components/InsightsSection/InsightsSection'
import TrackRecordSection from '@/components/TrackRecordSection/TrackRecordSection'
import PropertySearch from '@/components/PropertySearch/PropertySearch'
import AgentCarousel from '@/components/AgentCarousel/AgentCarousel'
import CTAFooter from '@/components/CTAFooter/CTAFooter'
import Footer from '@/components/Footer/Footer'

// Type for any block from a Page (also compatible with Container blocks)
type PageBlock = Page['blocks'][number]

/**
 * Renders a single block based on its blockType
 * Works with both Page blocks and Container nested blocks
 */
export function renderBlock(block: PageBlock, index: number): React.ReactNode {
  if (block.blockType === 'hero') {
    return <HeroWrapper key={index} block={block} />
  }
  if (block.blockType === 'flippedM') {
    return <FlippedM key={index} block={block} />
  }
  if (block.blockType === 'container') {
    return <Container key={index} block={block} />
  }
  if (block.blockType === 'cardSection') {
    return <CardSection key={index} block={block} />
  }
  if (block.blockType === 'propertySearchInput') {
    return <PropertySearchInput key={index} />
  }
  if (block.blockType === 'featuredProperties') {
    return <FeaturedProperties key={index} block={block} />
  }
  if (block.blockType === 'testimonialCarousel') {
    return <TestimonialCarousel key={index} block={block} />
  }
  if (block.blockType === 'splitSection') {
    return <SplitSection key={index} block={block} />
  }
  if (block.blockType === 'insightsSection') {
    return <InsightsSection key={index} block={block} />
  }
  if (block.blockType === 'trackRecordSection') {
    return <TrackRecordSection key={index} block={block} />
  }
  if (block.blockType === 'propertySearch') {
    return <PropertySearch key={index} block={block} />
  }
  if (block.blockType === 'agentCarousel') {
    return <AgentCarousel key={index} block={block} />
  }
  if (block.blockType === 'ctaFooter') {
    return <CTAFooter key={index} block={block} />
  }
  if (block.blockType === 'footer') {
    return <Footer key={index} />
  }
  return null
}

/**
 * Renders an array of blocks
 * Works with both Page blocks and Container nested blocks
 */
export function renderBlocks(
  blocks: Page['blocks'] | null | undefined
): React.ReactNode[] {
  if (!blocks || !Array.isArray(blocks)) {
    return []
  }
  return blocks.map((block, index) => renderBlock(block, index))
}

