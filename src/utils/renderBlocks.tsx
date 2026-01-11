import React from 'react'
import type { Page } from '@/payload-types'
import type { Payload } from 'payload'
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
import PropertySearchWrapper from '@/components/PropertySearch/PropertySearchWrapper'
import AgentCarousel from '@/components/AgentCarousel/AgentCarousel'
import CTAFooter from '@/components/CTAFooter/CTAFooter'
import Footer from '@/components/Footer/Footer'
import { buildoutApi } from '@/utils/buildout-api'
import type { BuildoutProperty, BuildoutBroker } from '@/utils/buildout-api'
import { transformPropertyToCard, type PropertyCardData } from '@/utils/property-transform'
import { getAgentInfoFromBrokers } from '@/utils/broker-utils'

// Type for any block from a Page (also compatible with Container blocks)
type PageBlock = Page['blocks'][number]

/**
 * Renders a single block based on its blockType
 * Works with both Page blocks and Container nested blocks
 */
export async function renderBlock(
  block: PageBlock,
  index: number,
  payload?: Payload
): Promise<React.ReactNode> {
  if (block.blockType === 'hero') {
    return <HeroWrapper key={index} block={block} />
  }
  if (block.blockType === 'flippedM') {
    return <FlippedM key={index} block={block} />
  }
  if (block.blockType === 'container') {
    return <Container key={index} block={block} payload={payload} />
  }
  if (block.blockType === 'cardSection') {
    return <CardSection key={index} block={block} />
  }
  if (block.blockType === 'propertySearchInput') {
    return <PropertySearchInput key={index} />
  }
  if (block.blockType === 'featuredProperties') {
    // Fetch properties from the selected set if specified
    let properties: PropertyCardData[] = []

    const setName = (block as any).featuredPropertySetName
    console.log('[renderBlocks] FeaturedProperties block:', {
      setName,
      hasPayload: !!payload,
      blockType: block.blockType,
    })

    if (setName && payload) {
      try {
        console.log('[renderBlocks] Fetching global set for:', setName)
        const global = await payload.findGlobal({
          slug: 'featuredPropertiesSets',
        })

        console.log('[renderBlocks] Global fetched:', {
          hasGlobal: !!global,
          globalKeys: global ? Object.keys(global) : [],
          setsType: typeof global?.sets,
          setsIsArray: Array.isArray(global?.sets),
          setsCount: global?.sets ? (Array.isArray(global.sets) ? global.sets.length : 0) : 0,
          setsRaw: JSON.stringify(global?.sets, null, 2),
        })

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
        
        console.log('[renderBlocks] Processed sets:', sets.map(s => ({ 
          name: s.name, 
          propertyIdsCount: s.propertyIds?.length || 0,
          propertyIds: s.propertyIds 
        })))
        
        const set = sets.find((s) => s.name === setName)

        console.log('[renderBlocks] Set found:', {
          setName,
          hasSet: !!set,
          setRaw: set,
          propertyIdsType: typeof set?.propertyIds,
          propertyIdsIsArray: Array.isArray(set?.propertyIds),
          propertyIdsCount: set?.propertyIds?.length || 0,
          propertyIdsRaw: set?.propertyIds,
        })

        if (set?.propertyIds && Array.isArray(set.propertyIds)) {
          const propertyIds = set.propertyIds.filter((id: any): id is number => typeof id === 'number')

          console.log('[renderBlocks] Filtered property IDs:', propertyIds)

          if (propertyIds.length > 0) {
            // Fetch all properties to find the ones in the set
            console.log('[renderBlocks] Fetching properties from Buildout API...')
            const allPropertiesResponse = await buildoutApi.getAllProperties({
              skipCache: false,
              limit: 10000,
            })

            console.log('[renderBlocks] Properties fetched:', {
              totalProperties: allPropertiesResponse.properties.length,
            })

            // Filter to only the properties in the set and maintain order
            const featuredProperties: BuildoutProperty[] = propertyIds
              .map((id: number) => allPropertiesResponse.properties.find((p: BuildoutProperty) => p.id === id))
              .filter((p): p is BuildoutProperty => p !== undefined)

            console.log('[renderBlocks] Featured properties found:', featuredProperties.length)

            // Fetch brokers to get agent names and photos
            let brokers: BuildoutBroker[] = []
            try {
              const brokersResponse = await buildoutApi.getAllBrokers({ skipCache: false })
              brokers = brokersResponse.brokers
            } catch (error) {
              console.error('[renderBlocks] Error fetching brokers:', error)
            }

            // Transform properties with actual agent names and photos
            properties = featuredProperties.map((prop) => {
              // Get the first broker for this property
              const brokerId = prop.broker_id || (prop.broker_ids && prop.broker_ids[0])
              const { name: agentName, image: agentImage } = getAgentInfoFromBrokers(brokerId, brokers)
              
              return transformPropertyToCard(prop, agentName, agentImage)
            })

            console.log('[renderBlocks] Properties transformed:', properties.length)
          } else {
            console.warn('[renderBlocks] No valid property IDs in set')
          }
        } else {
          console.warn('[renderBlocks] Set not found or has no propertyIds:', {
            setName,
            hasSet: !!set,
            hasPropertyIds: !!set?.propertyIds,
          })
        }
      } catch (error) {
        console.error('[renderBlocks] Error fetching featured properties from set:', error)
      }
    } else {
      console.warn('[renderBlocks] No set name or payload:', {
        setName,
        hasPayload: !!payload,
      })
    }

    console.log('[renderBlocks] Rendering FeaturedProperties with', properties.length, 'properties')

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
    console.log('[renderBlocks] TestimonialCarousel block:', {
      setName,
      hasPayload: !!payload,
      blockType: block.blockType,
    })

    if (setName && payload) {
      try {
        const global = await payload.findGlobal({
          slug: 'testimonialsSets',
          depth: 0,
        })

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
    }
    
    let articles: Article[] = []

    const setName = (block as any).featuredArticleSetName

    if (setName && payload) {
      try {
        const global = await payload.findGlobal({
          slug: 'featuredArticles',
          depth: 2, // Populate relationships
        })

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

              return {
                title: article.title || '',
                image: image || null,
                tags: categories,
                slug: slug,
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

    if (setName && payload) {
      try {
        const global = await payload.findGlobal({
          slug: 'provenTrackRecordSets',
          depth: 2, // Populate relationships (agent, image)
        })

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
    console.log('[renderBlocks] AgentCarousel block:', {
      setName,
      hasPayload: !!payload,
      blockType: block.blockType,
    })

    if (setName && payload) {
      try {
        const global = await payload.findGlobal({
          slug: 'featuredAgentsSets',
          depth: 2, // Populate agent relationships
        })

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
              const roles = (agent.roles || [])
                .map((r: any) => (typeof r === 'object' && r !== null && 'name' in r ? r.name : null))
                .filter((name: any): name is string => Boolean(name))
              
              const servingLocations = (agent.servingLocations || [])
                .map((l: any) => (typeof l === 'object' && l !== null && 'name' in l ? l.name : null))
                .filter((name: any): name is string => Boolean(name))

              return {
                name: agent.fullName || `${agent.firstName} ${agent.lastName}`,
                role: roles.length > 0 ? roles.join(' & ') : 'Agent & Broker',
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
export async function renderBlocks(
  blocks: Page['blocks'] | null | undefined,
  payload?: Payload
): Promise<React.ReactNode[]> {
  if (!blocks || !Array.isArray(blocks)) {
    return []
  }
  return Promise.all(blocks.map((block, index) => renderBlock(block, index, payload)))
}

