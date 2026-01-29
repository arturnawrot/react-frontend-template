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
import { AgentIconsSection } from './AgentIconsSection'
import { AgentDecoration } from './AgentDecoration'
import { AgentDirectory } from './AgentDirectory'
import { CTAFooter } from './CTAFooter'
import { CardOnBackground } from './CardOnBackground'
import { Footer } from './Footer'
import { BlogHighlightsBlock } from './BlogHighlightsBlock'
import { LocalRootsSection } from './LocalRootsSection'
import { AvailableRoles } from './AvailableRoles'
import { OfficeLocations } from './OfficeLocations'
import { StatsSection } from './StatsSection'
import { CustomHtmlBlock } from './CustomHtmlBlock'

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
    AgentIconsSection,
    AgentDecoration,
    AgentDirectory,
    CTAFooter,
    CardOnBackground,
    Footer,
    BlogHighlightsBlock,
    LocalRootsSection,
    AvailableRoles,
    OfficeLocations,
    StatsSection,
    CustomHtmlBlock,
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
        name: 'id',
        type: 'text',
        label: 'ID',
        admin: {
          description: 'Optional HTML id attribute for this container (useful for anchor links and CSS targeting)',
        },
      },
      {
        name: 'extraPadding',
        type: 'select',
        hasMany: true,
        label: 'Extra Padding',
        options: [
          { label: 'Top', value: 'top' },
          { label: 'Bottom', value: 'bottom' },
          { label: 'Top (Negative)', value: 'top-negative' },
          { label: 'Bottom (Negative)', value: 'bottom-negative' },
        ],
        admin: {
          description: 'Add extra vertical padding to the top and/or bottom of this container. Negative options apply negative margins for visual overlap.',
        },
      },
      {
        name: 'extraMargin',
        type: 'select',
        hasMany: true,
        label: 'Extra Margin',
        options: [
          { label: 'Top', value: 'top' },
          { label: 'Bottom', value: 'bottom' },
          { label: 'Top (Negative)', value: 'top-negative' },
          { label: 'Bottom (Negative)', value: 'bottom-negative' },
        ],
        admin: {
          description: 'Add extra vertical margin to the top and/or bottom of this container. Negative options pull the container closer to adjacent elements.',
        },
      },
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

