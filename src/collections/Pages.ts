import type { CollectionConfig } from 'payload'
import { seoFields } from '../fields/seoFields'

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
import { AgentDecoration } from '../blocks/AgentDecoration'
import { AgentDirectory } from '../blocks/AgentDirectory'
import { AgentsByCategory } from '../blocks/AgentsByCategory'
import { FAQSection } from '../blocks/FAQSection'
import { FAQSectionFull } from '../blocks/FAQSectionFull'
import { CTAFooter } from '../blocks/CTAFooter'
import { CardOnBackground } from '../blocks/CardOnBackground'
import { Footer } from '../blocks/Footer'
import { BlogHighlightsBlock } from '../blocks/BlogHighlightsBlock'
import { LocalRootsSection } from '../blocks/LocalRootsSection'
import { StatsSection } from '../blocks/StatsSection'
import { AvailableRoles } from '../blocks/AvailableRoles'
import { OfficeLocations } from '../blocks/OfficeLocations'
import { AssetTypeCard } from '../blocks/AssetTypeCard'
import { CenteredSectionHeader } from '../blocks/CenteredSectionHeader'
import { CustomHtmlBlock } from '../blocks/CustomHtmlBlock'
import { ComingSoon } from '../blocks/ComingSoon'
import { DarkNavbar } from '../blocks/DarkNavbar'
import { ContentBlock } from '../blocks/ContentBlock'

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
        AgentDecoration,
        AgentDirectory,
        AgentsByCategory,
        FAQSection,
        FAQSectionFull,
        CTAFooter,
        CardOnBackground,
        Footer,
        BlogHighlightsBlock,
        LocalRootsSection,
        StatsSection,
        AvailableRoles,
        OfficeLocations,
        AssetTypeCard,
        CenteredSectionHeader,
        CustomHtmlBlock,
        ComingSoon,
        DarkNavbar,
        ContentBlock,
      ],
    },
    seoFields,
  ],
  timestamps: true,
}

