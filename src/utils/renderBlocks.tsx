import React from 'react'
import type { Page } from '@/payload-types'
import Hero from '@/components/Hero'
import FlippedM from '@/components/FlippedM/FlippedM'
import Container from '@/components/Container/Container'
import CardSection from '@/components/CardSection/CardSection'

// Type for any block from a Page (also compatible with Container blocks)
type PageBlock = Page['blocks'][number]

/**
 * Renders a single block based on its blockType
 * Works with both Page blocks and Container nested blocks
 */
export function renderBlock(block: PageBlock, index: number): React.ReactNode {
  if (block.blockType === 'hero') {
    return <Hero key={index} block={block} />
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

