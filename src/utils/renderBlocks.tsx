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
import type { BuildoutProperty } from '@/utils/buildout-api'
import { transformPropertyToCard } from '@/utils/property-transform'
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
    let properties: Array<{
      id: number
      address: string
      cityStateZip: string
      price: string
      sqft: string
      type: string
      agent: string
      image: string
      badges?: Array<{ text: string; color: string }>
    }> = []

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

        // Handle JSON field - it might be a string that needs parsing, or already an array
        let sets: Array<{ name: string; propertyIds: number[] }> = []
        
        if (global?.sets) {
          if (typeof global.sets === 'string') {
            // If it's a string, parse it
            try {
              sets = JSON.parse(global.sets)
            } catch (e) {
              console.error('[renderBlocks] Failed to parse sets JSON string:', e)
            }
          } else if (Array.isArray(global.sets)) {
            // If it's already an array, use it directly
            sets = global.sets as Array<{ name: string; propertyIds: number[] }>
          }
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
            let brokers: Array<{ id: number; first_name: string; last_name: string; profile_photo_url: string | null }> = []
            try {
              const brokersResponse = await buildoutApi.getAllBrokers({ skipCache: false })
              brokers = brokersResponse.brokers.map(b => ({
                id: b.id,
                first_name: b.first_name,
                last_name: b.last_name,
                profile_photo_url: b.profile_photo_url,
              }))
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
    return <TestimonialCarousel key={index} block={block} />
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
    return <TrackRecordSection key={index} block={block} />
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

        // Handle JSON field - it might be a string that needs parsing, or already an array
        let sets: Array<{ name: string; agentIds: string[] }> = []
        
        if (global?.sets) {
          if (typeof global.sets === 'string') {
            // If it's a string, parse it
            try {
              sets = JSON.parse(global.sets)
            } catch (e) {
              console.error('[renderBlocks] Failed to parse sets JSON string:', e)
            }
          } else if (Array.isArray(global.sets)) {
            // If it's already an array, use it directly
            sets = global.sets as Array<{ name: string; agentIds: string[] }>
          }
        }
        
        const set = sets.find((s) => s.name === setName)
        
        if (set?.agentIds && Array.isArray(set.agentIds)) {
          // Fetch agents by IDs
          const agentResults = await Promise.all(
            set.agentIds.map((agentId) =>
              payload.findByID({
                collection: 'agents',
                id: agentId,
                depth: 2, // Populate relationships and images
              }).catch(() => null)
            )
          )

          agents = agentResults
            .filter((agent): agent is any => agent !== null)
            .map((agent: any) => {
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

