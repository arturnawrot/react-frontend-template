import type { CollectionConfig } from 'payload'

import { Hero } from '../blocks/Hero'
import { FlippedM } from '../blocks/FlippedM'
import { Container } from '../blocks/Container'
import { CardSection } from '../blocks/CardSection'
import { PropertySearchInput } from '../blocks/PropertySearchInput'
import { FeaturedProperties } from '../blocks/FeaturedProperties'
import { TestimonialCarousel } from '../blocks/TestimonialCarousel'
import { SplitSection } from '../blocks/SplitSection'
import { InsightsSection } from '../blocks/InsightsSection'
import { TrackRecordSection } from '../blocks/TrackRecordSection'
import { PropertySearch } from '../blocks/PropertySearch'
import { AgentCarousel } from '../blocks/AgentCarousel'
import { AgentIconsSection } from '../blocks/AgentIconsSection'
import { CTAFooter } from '../blocks/CTAFooter'
import { Footer } from '../blocks/Footer'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL slug for this page (e.g., "home", "about")',
      },
    },
    {
      name: 'blocks',
      type: 'blocks',
      required: true,
      minRows: 1,
      blocks: [
        Hero,
        FlippedM,
        Container,
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
        CTAFooter,
        Footer,
      ],
    },
  ],
  timestamps: true,
}

