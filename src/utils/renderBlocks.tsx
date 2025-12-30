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
import { transformBuildoutProperty } from '@/utils/transform-buildout-property'

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

            // Transform properties
            properties = featuredProperties.map((prop) =>
              transformBuildoutProperty(prop, 'Featured Properties')
            )

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
    return <InsightsSection key={index} block={block} />
  }
  if (block.blockType === 'trackRecordSection') {
    return <TrackRecordSection key={index} block={block} />
  }
  if (block.blockType === 'propertySearch') {
    return <PropertySearchWrapper key={index} block={block} />
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
export async function renderBlocks(
  blocks: Page['blocks'] | null | undefined,
  payload?: Payload
): Promise<React.ReactNode[]> {
  if (!blocks || !Array.isArray(blocks)) {
    return []
  }
  return Promise.all(blocks.map((block, index) => renderBlock(block, index, payload)))
}

