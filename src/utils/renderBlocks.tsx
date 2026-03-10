import React from 'react'
import type { Page } from '@/payload-types'
import type { Payload } from 'payload'
import HeroWrapper from '@/components/Hero/HeroWrapper'
import FlippedM from '@/components/FlippedM/FlippedM'
import PayloadContainer from '@/components/Container/PayloadContainer'
import CardSection from '@/components/CardSection/CardSection'
import PropertySearchInput from '@/components/PropertySearchInput/PropertySearchInput'
import FeaturedProperties from '@/components/FeaturedProperties/FeaturedProperties'
import TestimonialCarousel from '@/components/TestimonialCarousel/TestimonialCarousel'
import SplitSection from '@/components/SplitSection/SplitSection'
import InsightsSection from '@/components/InsightsSection/InsightsSection'
import TrackRecordSection from '@/components/TrackRecordSection/TrackRecordSection'
import PropertySearchWrapper from '@/components/PropertySearch/PropertySearchWrapper'
import AgentCarousel from '@/components/AgentCarousel/AgentCarousel'
import AgentIconsSection from '@/components/AgentIconsSection/AgentIconsSection'
import AgentDecoration from '@/components/AgentDecoration/AgentDecoration'
import AgentDirectory from '@/components/AgentDirectory/AgentDirectory'
import AgentsByCategory from '@/components/AgentsByCategory/AgentsByCategory'
import FAQSection from '@/components/FAQSection/FAQSection'
import FAQSectionFull from '@/components/FAQSectionFull/FAQSectionFull'
import CTAFooter from '@/components/CTAFooter/CTAFooter'
import CardOnBackground from '@/components/CardOnBackground/CardOnBackground'
import Footer from '@/components/Footer/Footer'
import BlogHighlightsBlock from '@/components/BlogHighlightsBlock/BlogHighlightsBlock'
import LocalRootsSection from '@/components/LocalRootsSection/LocalRootsSection'
import StatsSection from '@/components/StatsSection/StatsSection'
import AvailableRoles from '@/components/AvailableRoles/AvailableRoles'
import OfficeLocations from '@/components/OfficeLocations/OfficeLocations'
import AssetTypeCard from '@/components/AssetTypeCard/AssetTypeCard'
import CenteredSectionHeader from '@/components/CenteredSectionHeader/CenteredSectionHeader'
import CustomHtmlBlock from '@/components/CustomHtmlBlock/CustomHtmlBlock'
import ComingSoon from '@/components/ComingSoon/ComingSoon'
import DarkNavbar from '@/components/Navbar/DarkNavbar'
import ContentBlock from '@/components/ContentBlock/ContentBlock'
import BlockWrapper from '@/components/BlockWrapper/BlockWrapper'
import { buildoutApi, isPropertyActive } from '@/utils/buildout-api'
import type { BuildoutProperty, BuildoutBroker } from '@/utils/buildout-api'
import { transformPropertyToCard, type PropertyCardData } from '@/utils/property-transform'
import { getAgentInfoFromBrokers } from '@/utils/broker-utils'
import { getConstantLinksMap, setCachedConstantLinksMap } from '@/utils/linkResolver'
import {
  getCachedSiteSettings,
  getCachedFeaturedPropertiesSets,
  getCachedTestimonialsSets,
  getCachedFeaturedAgentsSets,
  getCachedAgentIconsSets,
  getCachedFeaturedArticles,
  getCachedProvenTrackRecordSets,
  getCachedFAQSets,
  getCachedFAQFullPage,
  getCachedAgentCategories,
  getCachedBlogHighlights,
  getCachedAvailableJobSets,
  getCachedOfficeLocationSets,
} from '@/utils/payload-cache'

// Type for any block from a Page (also compatible with Container blocks)
type PageBlock = Page['blocks'][number]

// Options for renderBlocks to avoid redundant fetches
export interface RenderBlocksOptions {
  /** Pre-fetched site settings to avoid redundant fetches in nested containers */
  siteSettings?: {
    blockSpacing?: {
      defaultSpacing?: 'none' | 'small' | 'medium' | 'large' | 'xlarge'
    }
  }
  /** Pre-fetched constant links map to avoid redundant fetches */
  constantLinksMap?: import('./linkResolver').ConstantLinksMap
}

/**
 * Renders a single block based on its blockType
 * Works with both Page blocks and Container nested blocks
 */
export async function renderBlock(
  block: PageBlock,
  index: number,
  payload?: Payload,
  options?: RenderBlocksOptions
): Promise<React.ReactNode> {
  if (block.blockType === 'hero') {
    return <HeroWrapper key={index} block={block} constantLinksMap={options?.constantLinksMap} />
  }
  if (block.blockType === 'flippedM') {
    return <FlippedM key={index} block={block} />
  }
  if (block.blockType === 'container') {
    return <PayloadContainer key={index} block={block} payload={payload} options={options} />
  }
  if (block.blockType === 'cardSection') {
    return <CardSection key={index} block={block} />
  }
  if (block.blockType === 'propertySearchInput') {
    return <PropertySearchInput key={index} forLeaseOnly={(block as any).forLeaseOnly === true} />
  }
  if (block.blockType === 'featuredProperties') {
    // Fetch properties from the selected set if specified
    let properties: PropertyCardData[] = []

    const setName = (block as any).featuredPropertySetName

    if (setName) {
      try {
        const global = await getCachedFeaturedPropertiesSets()

        // Sets is now an array field, propertyIds is a JSON field
        let sets: Array<{ name: string; propertyIds?: number[] }> = []

        if (global?.sets && Array.isArray(global.sets)) {
          sets = global.sets.map((set: any) => {
            let propertyIds: number[] = []
            if (set.propertyIds) {
              if (Array.isArray(set.propertyIds)) {
                propertyIds = set.propertyIds.filter((id: any): id is number => typeof id === 'number')
              } else if (typeof set.propertyIds === 'string') {
                try {
                  const parsed = JSON.parse(set.propertyIds)
                  if (Array.isArray(parsed)) {
                    propertyIds = parsed.filter((id: any): id is number => typeof id === 'number')
                  }
                } catch (e) {
                  console.error('[renderBlocks] Failed to parse propertyIds JSON:', e)
                }
              }
            }
            return {
              name: set.name,
              propertyIds
            }
          })
        }

        const set = sets.find((s) => s.name === setName)

        if (set?.propertyIds && Array.isArray(set.propertyIds)) {
          const propertyIds = set.propertyIds.filter((id: any): id is number => typeof id === 'number')

          if (propertyIds.length > 0) {
            // Fetch properties and brokers in PARALLEL for better performance
            const [allPropertiesResponse, brokersResponse] = await Promise.all([
              buildoutApi.getAllProperties({ skipCache: false }),
              buildoutApi.getAllBrokers({ skipCache: false }).catch(error => {
                console.error('[renderBlocks] Error fetching brokers:', error)
                return { brokers: [] as BuildoutBroker[] }
              })
            ])

            // Filter to only the properties in the set, maintain order, and exclude inactive
            const featuredProperties: BuildoutProperty[] = propertyIds
              .map((id: number) => allPropertiesResponse.properties.find((p: BuildoutProperty) => p.id === id))
              .filter((p): p is BuildoutProperty => p !== undefined && isPropertyActive(p))

            const brokers = brokersResponse.brokers

            // Transform properties with actual agent names and photos
            properties = featuredProperties.map((prop) => {
              // Get the first broker for this property
              const brokerId = prop.broker_id || (prop.broker_ids && prop.broker_ids[0])
              const { name: agentName, image: agentImage } = getAgentInfoFromBrokers(brokerId, brokers)

              return transformPropertyToCard(prop, agentName, agentImage)
            })
          }
        }
      } catch (error) {
        console.error('[renderBlocks] Error fetching featured properties from set:', error)
      }
    }

    return <FeaturedProperties key={index} block={block} properties={properties} />
  }
  if (block.blockType === 'testimonialCarousel') {
    // Fetch testimonials from the selected set if specified
    let testimonials: Array<{
      quote: string
      author: string
      company?: string
    }> = []

    const setName = (block as any).testimonialSetName

    if (setName) {
      try {
        const global = await getCachedTestimonialsSets()

        // Sets is an array field, testimonials is an array field
        let sets: Array<{ name: string; testimonials?: any[] }> = []

        if (global?.sets && Array.isArray(global.sets)) {
          sets = global.sets as Array<{ name: string; testimonials?: any[] }>
        }

        const set = sets.find((s) => s.name === setName)

        if (set?.testimonials && Array.isArray(set.testimonials)) {
          testimonials = set.testimonials.map((testimonial: any) => ({
            quote: testimonial.quote || '',
            author: testimonial.author || '',
            company: testimonial.company || undefined,
          }))
        }
      } catch (error) {
        console.error('[renderBlocks] Error fetching testimonials set:', error)
      }
    }

    // Create a modified block with the fetched testimonials
    const blockWithTestimonials = {
      ...block,
      testimonials,
    }

    return <TestimonialCarousel key={index} block={blockWithTestimonials} />
  }
  if (block.blockType === 'splitSection') {
    return <SplitSection key={index} block={block} />
  }
  if (block.blockType === 'insightsSection') {
    // Fetch articles from the selected set if specified
    type Article = {
      title: string
      image: string | { id: string; url?: string } | null
      tags: Array<{ tag: string }>
      slug: string
      type?: 'article' | 'market-report' | 'investment-spotlight'
    }

    let articles: Article[] = []

    const setName = (block as any).featuredArticleSetName

    if (setName) {
      try {
        const global = await getCachedFeaturedArticles()

        if (global?.sets && Array.isArray(global.sets)) {
          const set = global.sets.find((s: any) => s.name === setName)

          if (set?.articles && Array.isArray(set.articles)) {
            // Articles are already populated due to depth: 2
            articles = set.articles.map((article: any): Article => {
              // Map blog article to the format expected by InsightsSection
              const image = article.featuredImage
              const categories = Array.isArray(article.categories)
                ? article.categories.map((cat: any) => ({
                    tag: typeof cat === 'object' && cat !== null ? cat.name || cat.slug || '' : String(cat),
                  }))
                : []
              const slug = article.slug || ''
              const type = article.type || 'article'

              return {
                title: article.title || '',
                image: image || null,
                tags: categories,
                slug: slug,
                type: type,
              }
            })
          }
        }
      } catch (error) {
        console.error('[renderBlocks] Error fetching featured articles from set:', error)
      }
    }

    return <InsightsSection key={index} block={block} articles={articles} />
  }
  if (block.blockType === 'trackRecordSection') {
    // Fetch items from the selected set if specified
    let items: Array<{
      image: string
      title: string
      address?: string
      price?: string
      size?: string
      propertyType?: string
      agent?: { name: string; image?: string }
      link?: string
    }> = []

    const setName = (block as any).provenTrackRecordSetName

    if (setName) {
      try {
        const global = await getCachedProvenTrackRecordSets()

        if (global?.sets && Array.isArray(global.sets)) {
          const set = global.sets.find((s: any) => s.name === setName)

          if (set?.items && Array.isArray(set.items)) {
            items = set.items.map((item: any) => {
              const image = item.image
              const imageUrl = typeof image === 'object' && image !== null ? image.url || '' : ''

              const agent = item.agent
              let agentData: { name: string; image?: string } | undefined

              if (agent && typeof agent === 'object') {
                const agentName = agent.fullName || `${agent.firstName || ''} ${agent.lastName || ''}`.trim()
                const agentImage = agent.cardImage || agent.backgroundImage
                const agentImageUrl = typeof agentImage === 'object' && agentImage !== null ? agentImage.url : undefined

                if (agentName) {
                  agentData = {
                    name: agentName,
                    image: agentImageUrl,
                  }
                }
              }

              return {
                image: imageUrl,
                title: item.title || '',
                address: item.address || undefined,
                price: item.price || undefined,
                size: item.size || undefined,
                propertyType: item.propertyType || undefined,
                agent: agentData,
                link: item.link || undefined,
              }
            })
          }
        }
      } catch (error) {
        console.error('[renderBlocks] Error fetching proven track record items from set:', error)
      }
    }

    return <TrackRecordSection key={index} block={block} items={items} />
  }
  if (block.blockType === 'propertySearch') {
    return <PropertySearchWrapper key={index} block={block} />
  }
  if (block.blockType === 'agentCarousel') {
    // Fetch agents from the selected set if specified
    let agents: Array<{
      name: string
      role: string
      location: string
      image?: any
      slug?: string
    }> = []

    const setName = (block as any).featuredAgentSetName

    if (setName) {
      try {
        const global = await getCachedFeaturedAgentsSets()

        // Sets is now an array field, agents are relationship field (populated with depth: 2)
        let sets: Array<{ name: string; agents?: any[] | string[] }> = []

        if (global?.sets && Array.isArray(global.sets)) {
          sets = global.sets as Array<{ name: string; agents?: any[] | string[] }>
        }

        const set = sets.find((s) => s.name === setName)

        if (set?.agents && Array.isArray(set.agents)) {
          // Agents are already populated (objects) or IDs (strings) depending on depth
          const agentList = set.agents

          agents = agentList
            .map((agent: any) => {
              // If it's an ID string, we need to fetch it (shouldn't happen with depth: 2, but handle it)
              if (typeof agent === 'string') {
                return null // Skip IDs, they should be populated
              }

              // Agent is already populated as an object
              // Extract roles, specialties, and locations
              const servingLocations = (agent.servingLocations || [])
                .map((l: any) => (typeof l === 'object' && l !== null && 'name' in l ? l.name : null))
                .filter((name: any): name is string => Boolean(name))

              return {
                name: agent.fullName || `${agent.firstName} ${agent.lastName}`,
                role: agent.displayTitle || 'Agent & Broker',
                location: servingLocations.length > 0 ? servingLocations.join(', ') : '',
                image: agent.cardImage || agent.backgroundImage,
                slug: agent.slug,
              }
            })
            .filter((agent): agent is NonNullable<typeof agent> => agent !== null)
        }
      } catch (error) {
        console.error('[renderBlocks] Error fetching featured agents from set:', error)
      }
    }

    return <AgentCarousel key={index} block={{ ...block, agents } as any} />
  }
  if (block.blockType === 'agentIconsSection') {
    // Fetch agents from the selected set if specified
    let agents: Array<{
      id: string
      firstName: string
      lastName: string
      fullName?: string | null
      slug?: string
      cardImage?: any
    }> = []

    const setName = (block as any).agentIconsSetName

    if (setName) {
      try {
        const global = await getCachedAgentIconsSets()

        // Sets is now an array field, agents are relationship field (populated with depth: 2)
        let sets: Array<{ name: string; agents?: any[] | string[] }> = []

        if (global?.sets && Array.isArray(global.sets)) {
          sets = global.sets as Array<{ name: string; agents?: any[] | string[] }>
        }

        const set = sets.find((s) => s.name === setName)

        if (set?.agents && Array.isArray(set.agents)) {
          // Agents are already populated (objects) or IDs (strings) depending on depth
          const agentList = set.agents

          agents = agentList
            .map((agent: any) => {
              // If it's an ID string, we need to fetch it (shouldn't happen with depth: 2, but handle it)
              if (typeof agent === 'string') {
                return null // Skip IDs, they should be populated
              }

              // Agent is already populated as an object
              return {
                id: agent.id,
                firstName: agent.firstName,
                lastName: agent.lastName,
                fullName: agent.fullName || `${agent.firstName} ${agent.lastName}`,
                slug: agent.slug,
                cardImage: agent.cardImage || agent.backgroundImage,
              }
            })
            .filter((agent): agent is NonNullable<typeof agent> => agent !== null)
        }
      } catch (error) {
        console.error('[renderBlocks] Error fetching agent icons from set:', error)
      }
    }

    return <AgentIconsSection key={index} block={{ ...block, agents } as any} />
  }
  if (block.blockType === 'agentDecoration') {
    // Fetch agents from the selected set if specified
    let agents: Array<{
      id: string
      firstName: string
      lastName: string
      fullName?: string | null
      slug?: string
      cardImage?: any
    }> = []

    const setName = (block as any).agentIconsSetName

    if (setName) {
      try {
        const global = await getCachedAgentIconsSets()

        // Sets is now an array field, agents are relationship field (populated with depth: 2)
        let sets: Array<{ name: string; agents?: any[] | string[] }> = []

        if (global?.sets && Array.isArray(global.sets)) {
          sets = global.sets as Array<{ name: string; agents?: any[] | string[] }>
        }

        const set = sets.find((s) => s.name === setName)

        if (set?.agents && Array.isArray(set.agents)) {
          // Agents are already populated (objects) or IDs (strings) depending on depth
          const agentList = set.agents

          agents = agentList
            .map((agent: any) => {
              // If it's an ID string, we need to fetch it (shouldn't happen with depth: 2, but handle it)
              if (typeof agent === 'string') {
                return null // Skip IDs, they should be populated
              }

              // Agent is already populated as an object
              return {
                id: agent.id,
                firstName: agent.firstName,
                lastName: agent.lastName,
                fullName: agent.fullName || `${agent.firstName} ${agent.lastName}`,
                slug: agent.slug,
                cardImage: agent.cardImage || agent.backgroundImage,
              }
            })
            .filter((agent): agent is NonNullable<typeof agent> => agent !== null)
        }
      } catch (error) {
        console.error('[renderBlocks] Error fetching agent icons from set:', error)
      }
    }

    return <AgentDecoration key={index} block={{ ...block, agents } as any} constantLinksMap={options?.constantLinksMap} />
  }
  if (block.blockType === 'faqSection') {
    // Fetch FAQs from the selected set if specified
    let questions: Array<{
      question: string
      answer: any // RichText field (Lexical)
    }> = []

    const setName = (block as any).faqSetName

    if (setName) {
      try {
        const global = await getCachedFAQSets()

        if (global?.sets && Array.isArray(global.sets)) {
          const set = global.sets.find((s: any) => s.name === setName)

          if (set?.questions && Array.isArray(set.questions)) {
            questions = set.questions.map((faq: any) => ({
              question: faq.question || '',
              answer: faq.answer || null,
            }))
          }
        }
      } catch (error) {
        console.error('[renderBlocks] Error fetching FAQ set:', error)
      }
    }

    return <FAQSection key={index} block={{ ...block, questions } as any} />
  }
  if (block.blockType === 'faqSectionFull') {
    // Fetch FAQs from the FAQFullPage global
    let categories: Array<{
      categoryName: string
      questions: Array<{
        question: string
        answer: any
      }>
    }> = []

    try {
      const global = await getCachedFAQFullPage()

      if (global) {
        if (global.categories && Array.isArray(global.categories)) {
          categories = global.categories.map((cat: any) => ({
            categoryName: cat.categoryName || '',
            questions: (cat.questions || []).map((faq: any) => ({
              question: faq.question || '',
              answer: faq.answer || null,
            })),
          }))
        }
      }
    } catch (error) {
      console.error('[renderBlocks] Error fetching FAQ Full Page global:', error)
    }

    return (
      <FAQSectionFull
        key={index}
        block={{
          ...block,
          categories,
        } as any}
      />
    )
  }
  if (block.blockType === 'agentDirectory') {
    return <AgentDirectory key={index} block={block} />
  }
  if (block.blockType === 'agentsByCategory') {
    // Fetch agent categories from global
    type MappedAgent = {
      id: string
      name: string
      role: string
      image: string | null
      servingLocations: string[]
      serviceTags: string[]
      email: string | null
      phone: string | null
      linkedin: string | null
      slug: string | undefined
    }

    let categories: Array<{
      id: string
      title: string
      backgroundColor: string
      linkText?: string | null
      linkType?: 'none' | 'page' | 'custom' | null
      page?: string | { slug?: string; id?: string } | null
      customUrl?: string | null
      openInNewTab?: boolean | null
      agents: MappedAgent[]
    }> = []
    let heading = 'Expertise That Moves Markets'
    let description = 'Our agents specialize in everything from raw land and infill redevelopment to national net-lease portfolios.'

    if (payload) {
      try {
        const global = await getCachedAgentCategories()

        if (global?.heading) {
          heading = global.heading
        }
        if (global?.description) {
          description = global.description
        }

        if (global?.categories && Array.isArray(global.categories)) {
          // Fetch agents for each category's specialty in parallel
          categories = await Promise.all(
            global.categories.map(async (cat: any, catIndex: number) => {
              const specialtyId = typeof cat.specialty === 'object' ? cat.specialty?.id : cat.specialty
              let agents: MappedAgent[] = []

              if (specialtyId) {
                const { docs: agentDocs } = await payload.find({
                  collection: 'agents',
                  where: {
                    specialties: { contains: specialtyId },
                  },
                  limit: 50,
                  depth: 1,
                  select: {
                    fullName: true,
                    firstName: true,
                    lastName: true,
                    displayTitle: true,
                    cardImage: true,
                    specialties: true,
                    servingLocations: true,
                    email: true,
                    phone: true,
                    linkedin: true,
                    slug: true,
                  },
                })

                agents = agentDocs.map((agent: any) => {
                  const specialties = (agent.specialties || [])
                    .map((s: any) => (typeof s === 'object' && s !== null && 'name' in s ? s.name : null))
                    .filter((name: any): name is string => Boolean(name))

                  const servingLocations = (agent.servingLocations || [])
                    .map((l: any) => (typeof l === 'object' && l !== null && 'name' in l ? l.name : null))
                    .filter((name: any): name is string => Boolean(name))

                  const cardImage = agent.cardImage && typeof agent.cardImage === 'object'
                    ? agent.cardImage.url || null
                    : null

                  return {
                    id: agent.id,
                    name: agent.fullName || `${agent.firstName} ${agent.lastName}`,
                    role: agent.displayTitle || 'Agent & Broker',
                    image: cardImage,
                    servingLocations,
                    serviceTags: specialties,
                    email: agent.email || null,
                    phone: agent.phone || null,
                    linkedin: agent.linkedin || null,
                    slug: agent.slug,
                  }
                })
              }

              return {
                id: cat.id || `category-${catIndex}`,
                title: cat.title || '',
                backgroundColor: cat.backgroundColor || '#F2F7D5',
                linkText: cat.linkText || null,
                linkType: cat.linkType || null,
                page: cat.page || null,
                customUrl: cat.customUrl || null,
                openInNewTab: cat.openInNewTab || null,
                agents,
              }
            })
          )
        }
      } catch (error) {
        console.error('[renderBlocks] Error fetching agent categories:', error)
      }
    }

    return <AgentsByCategory key={index} block={{ ...block, categories, heading, description } as any} />
  }
  if (block.blockType === 'ctaFooter') {
    return <CTAFooter key={index} block={block} constantLinksMap={options?.constantLinksMap} />
  }
  if (block.blockType === 'cardOnBackground') {
    return <CardOnBackground key={index} block={block} />
  }
  if (block.blockType === 'footer') {
    return <Footer key={index} />
  }
  if (block.blockType === 'blogHighlightsBlock') {
    // Fetch BlogHighlights global config and initial data
    if (!payload) {
      console.warn('[renderBlocks] BlogHighlightsBlock requires payload instance')
      return null
    }

    try {
      // Fetch the BlogHighlights global config (cached) and initial data in parallel
      const [blogHighlightsConfig, blogsResponse, categoriesResponse, authorsResponse, allBlogsForYears] = await Promise.all([
        getCachedBlogHighlights(),
        payload.find({
          collection: 'blogs',
          limit: 10,
          sort: '-createdAt',
          depth: 1,
        }),
        payload.find({
          collection: 'blog-categories',
          limit: 100,
          depth: 0,
        }),
        payload.find({
          collection: 'users',
          limit: 100,
          depth: 0,
          select: { firstName: true, lastName: true, email: true },
        }),
        // Only fetch createdAt to extract years — no need for full blog objects
        payload.find({
          collection: 'blogs',
          limit: 1000,
          depth: 0,
          select: { createdAt: true },
        }),
      ])

      // Use postsPerPage from config if different from default
      const postsPerPage = blogHighlightsConfig.exploreByCategory?.postsPerPage || 10
      let blogs = blogsResponse
      if (postsPerPage !== 10) {
        blogs = await payload.find({
          collection: 'blogs',
          limit: postsPerPage,
          sort: '-createdAt',
          depth: 1,
        })
      }

      const years = Array.from(
        new Set(
          allBlogsForYears.docs
            .map((blog) => {
              const date = blog.createdAt
              return date ? new Date(date).getFullYear() : null
            })
            .filter((year): year is number => year !== null)
        )
      ).sort((a, b) => b - a)

      return (
        <BlogHighlightsBlock
          key={index}
          config={blogHighlightsConfig as any}
          initialBlogs={blogs.docs as any}
          allCategories={categoriesResponse.docs as any}
          authors={authorsResponse.docs as any}
          years={years}
        />
      )
    } catch (error) {
      console.error('[renderBlocks] Error fetching BlogHighlights data:', error)
      return null
    }
  }
  if (block.blockType === 'localRootsSection') {
    return <LocalRootsSection key={index} block={block} />
  }
  if (block.blockType === 'statsSection') {
    return <StatsSection key={index} block={block} />
  }
  // Handle availableRoles block (only available in containers, not at page level)
  // Cast to any first since TypeScript narrows to never for non-page-level blocks
  if ((block as any).blockType === 'availableRoles') {
    // Fetch jobs from the selected set if specified
    let jobs: Array<{
      id: string
      title: string
      slug?: string
      department?: string
      location?: string
      employmentType?: string
      reportsTo?: string
      jobDescription?: any
      applyUrl?: string
    }> = []

    const setName = (block as any).availableJobSetName

    if (setName) {
      try {
        const global = await getCachedAvailableJobSets()

        if (global?.sets && Array.isArray(global.sets)) {
          const set = global.sets.find((s: any) => s.name === setName)

          if (set?.jobs && Array.isArray(set.jobs)) {
            jobs = set.jobs
              .map((job: any) => {
                // If it's just an ID string, skip it
                if (typeof job === 'string') {
                  return null
                }

                return {
                  id: job.id,
                  title: job.title || '',
                  slug: job.slug || undefined,
                  department: job.department || undefined,
                  location: job.location || undefined,
                  employmentType: job.employmentType || undefined,
                  reportsTo: job.reportsTo || undefined,
                  jobDescription: job.jobDescription || undefined,
                  applyUrl: job.applyUrl || undefined,
                }
              })
              .filter((job: any): job is NonNullable<typeof job> => job !== null)
          }
        }
      } catch (error) {
        console.error('[renderBlocks] Error fetching available jobs from set:', error)
      }
    }

    return <AvailableRoles key={index} block={{ ...(block as any), jobs }} />
  }
  // Handle officeLocations block
  if ((block as any).blockType === 'officeLocations') {
    // Fetch locations from the selected set if specified
    let locations: Array<{
      image?: any
      header: string
      subheader?: string | null
      office?: string | null
      fax?: string | null
      linkText?: string | null
      linkType?: 'none' | 'page' | 'custom' | null
      page?: string | { slug?: string; id?: string } | null
      customUrl?: string | null
      openInNewTab?: boolean | null
    }> = []

    const setName = (block as any).officeLocationSetName

    if (setName) {
      try {
        const global = await getCachedOfficeLocationSets()

        if (global?.sets && Array.isArray(global.sets)) {
          const set = global.sets.find((s: any) => s.name === setName)

          if (set?.locations && Array.isArray(set.locations)) {
            locations = set.locations.map((loc: any) => ({
              image: loc.image || null,
              header: loc.header || '',
              subheader: loc.subheader || null,
              office: loc.office || null,
              fax: loc.fax || null,
              linkText: loc.linkText || null,
              linkType: loc.linkType || null,
              page: loc.page || null,
              customUrl: loc.customUrl || null,
              openInNewTab: loc.openInNewTab || null,
            }))
          }
        }
      } catch (error) {
        console.error('[renderBlocks] Error fetching office locations from set:', error)
      }
    }

    return <OfficeLocations key={index} block={{ ...(block as any), locations }} />
  }
  if (block.blockType === 'assetTypeCard') {
    return <AssetTypeCard key={index} block={block} />
  }
  if (block.blockType === 'centeredSectionHeader') {
    return <CenteredSectionHeader key={index} block={block} />
  }
  if (block.blockType === 'customHtmlBlock') {
    return <CustomHtmlBlock key={index} block={block} />
  }
  if ((block as any).blockType === 'comingSoon') {
    return <ComingSoon key={index} block={block as any} />
  }
  if ((block as any).blockType === 'darkNavbar') {
    return <DarkNavbar key={index} />
  }
  if ((block as any).blockType === 'contentBlock') {
    return <ContentBlock key={index} block={block as any} />
  }
  return null
}

/**
 * Renders an array of blocks with consistent spacing
 * Works with both Page blocks and Container nested blocks
 */
export async function renderBlocks(
  blocks: Page['blocks'] | null | undefined,
  payload?: Payload,
  options?: RenderBlocksOptions
): Promise<React.ReactNode[]> {
  if (!blocks || !Array.isArray(blocks)) {
    return []
  }

  // Use pre-fetched site settings if available, otherwise fetch (cached)
  let defaultSpacing: 'none' | 'small' | 'medium' | 'large' | 'xlarge' = 'medium'
  let resolvedOptions = options

  if (options?.siteSettings) {
    // Use cached siteSettings (avoids redundant fetches in nested containers)
    const spacing = options.siteSettings.blockSpacing?.defaultSpacing
    if (spacing && ['none', 'small', 'medium', 'large', 'xlarge'].includes(spacing)) {
      defaultSpacing = spacing
    }
  } else {
    // Fetch site settings via cache
    try {
      const siteSettings = await getCachedSiteSettings()
      const spacing = siteSettings?.blockSpacing?.defaultSpacing
      if (spacing && ['none', 'small', 'medium', 'large', 'xlarge'].includes(spacing)) {
        defaultSpacing = spacing as typeof defaultSpacing
      }
      // Cache for nested calls
      resolvedOptions = { siteSettings: { blockSpacing: { defaultSpacing } } }
    } catch (error) {
      console.warn('[renderBlocks] Error fetching site settings, using default spacing:', error)
      resolvedOptions = { siteSettings: { blockSpacing: { defaultSpacing: 'medium' } } }
    }
  }

  // Fetch constant links if not already provided
  let constantLinksMap = options?.constantLinksMap
  if (!constantLinksMap && payload) {
    try {
      constantLinksMap = await getConstantLinksMap(payload)
      // Cache it globally so resolveLinkUrl can use it automatically
      setCachedConstantLinksMap(constantLinksMap)
      // Add to resolved options for nested calls
      resolvedOptions = {
        ...resolvedOptions,
        constantLinksMap,
      }
    } catch (error) {
      console.warn('[renderBlocks] Error fetching constant links:', error)
      constantLinksMap = new Map()
      setCachedConstantLinksMap(constantLinksMap)
    }
  } else if (constantLinksMap) {
    // Cache provided map as well
    setCachedConstantLinksMap(constantLinksMap)
  }

  // Render all blocks in parallel
  const renderedBlocks = await Promise.all(
    blocks.map((block, index) => renderBlock(block, index, payload, resolvedOptions))
  )

  // Wrap blocks with spacing
  return renderedBlocks.map((block, index) => {
    const isFirst = index === 0
    const isLast = index === renderedBlocks.length - 1

    // Some blocks (like Hero, Footer, CTAFooter, and components with internal padding) might not need spacing
    // Check if block is a special case that shouldn't have spacing
    const blockType = blocks[index]?.blockType
    const blockData = blocks[index] as any

    // Check for excludeSpacing option on cardOnBackground
    let cardOnBackgroundExcludeSpacing = false
    if (blockType === 'cardOnBackground') {
      const excludeSpacing = (blockData as any)?.excludeSpacing
      cardOnBackgroundExcludeSpacing = excludeSpacing === true
    }

    const skipSpacing = blockType === 'hero' ||
                        blockType === 'footer' ||
                        blockType === 'ctaFooter' ||
                        blockType === 'insightsSection' ||
                        blockType === 'trackRecordSection' ||
                        blockType === 'faqSection' ||
                        blockType === 'faqSectionFull' ||
                        blockType === 'propertySearchInput' ||
                        (blockType as string) === 'comingSoon' ||
                        cardOnBackgroundExcludeSpacing

    if (skipSpacing) {
      return block
    }

    // Check if this block comes after a Hero block (but not for Container blocks)
    const previousBlockType = index > 0 ? blocks[index - 1]?.blockType : null
    const isAfterHero = previousBlockType === 'hero' && blockType !== 'container'

    return (
      <BlockWrapper
        key={index}
        spacing={defaultSpacing}
        isFirst={isFirst}
        isLast={isLast}
        isAfterHero={isAfterHero}
      >
        {block}
      </BlockWrapper>
    )
  })
}
