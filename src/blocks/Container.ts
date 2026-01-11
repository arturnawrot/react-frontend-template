import type { Block } from 'payload'

import { Hero } from './Hero'
import { FlippedM } from './FlippedM'
import { CardSection } from './CardSection'
import { PropertySearchInput } from './PropertySearchInput'
import { FeaturedProperties } from './FeaturedProperties'
import { TestimonialCarousel } from './TestimonialCarousel'
import { SplitSection } from './SplitSection'
import { InsightsSection } from './InsightsSection'
import { TrackRecordSection } from './TrackRecordSection'
import { PropertySearch } from './PropertySearch'
import { AgentCarousel } from './AgentCarousel'
import { CTAFooter } from './CTAFooter'
import { Footer } from './Footer'

/**
 * Creates a Container block with nested container support
 * Uses maxDepth to prevent infinite recursion
 * @param maxDepth Maximum nesting depth (default: 3)
 */
const getContainerBlock = (maxDepth: number = 3): Block => {
  // Base blocks that are always available
  const baseBlocks: Block[] = [
    Hero,
    FlippedM,
    CardSection,
    PropertySearchInput,
    FeaturedProperties,
    TestimonialCarousel,
    SplitSection,
    InsightsSection,
    TrackRecordSection,
    PropertySearch,
    AgentCarousel,
    CTAFooter,
    Footer,
  ]

  // Add nested Container if we haven't reached max depth
  const blocks: Block[] =
    maxDepth > 0
      ? [...baseBlocks, getContainerBlock(maxDepth - 1)]
      : baseBlocks

  return {
    slug: 'container',
    labels: {
      singular: 'Container',
      plural: 'Containers',
    },
    fields: [
      {
        name: 'cssStyles',
        type: 'relationship',
        relationTo: 'css-styles',
        hasMany: true,
        label: 'CSS Styles',
        admin: {
          description: 'Select one or more CSS styles to apply to this container',
        },
        filterOptions: {
          active: {
            equals: true,
          },
        },
      },
      {
        name: 'blocks',
        type: 'blocks',
        label: 'Content Blocks',
        minRows: 1,
        blocks,
        admin: {
          description: 'Add one or more blocks to display inside this container',
        },
      },
    ],
  }
}

export const Container = getContainerBlock()

