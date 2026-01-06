import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'
import config from '@/payload.config'
import type { Agent, Role, Specialty, ServingLocation } from '@/payload-types'
import HeroWrapper from '@/components/Hero/HeroWrapper'
import AboutAgent from '@/components/AboutAgent/AboutAgent'
import FeaturedProperties from '@/components/FeaturedProperties/FeaturedProperties'
import TrackRecord from '@/components/TrackRecord/TrackRecord'
import CTAFooter from '@/components/CTAFooter/CTAFooter'
import Footer from '@/components/Footer/Footer'
import type { Page } from '@/payload-types'
import { buildoutApi } from '@/utils/buildout-api'
import type { BuildoutProperty } from '@/utils/buildout-api'
import { transformBuildoutProperty } from '@/utils/transform-buildout-property'

// Mark as dynamic to prevent build-time prerendering (requires MongoDB connection)
export const dynamic = 'force-dynamic'

interface AgentPageProps {
  params: Promise<{ slug: string }>
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { slug } = await params

  const payload = await getPayload({ config })

  // Fetch the agent by slug
  const { docs } = await payload.find({
    collection: 'agents',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2, // Populate image and relationship fields
    limit: 1,
  })

  const agent = docs[0] as Agent | undefined

  if (!agent) {
    notFound()
  }

  // Extract arrays from agent data
  // Handle roles - now relationships with 'name' field
  const roles = (agent.roles || [])
    .map((r) => {
      // If it's a populated relationship object (Role), use the name
      if (typeof r === 'object' && r !== null && 'name' in r) {
        return (r as Role).name
      }
      // If it's just an ID string, return null (shouldn't happen with depth: 2)
      return null
    })
    .filter((name): name is string => Boolean(name))
  
  // Handle specialties - now relationships with 'name' field
  const specialties = (agent.specialties || [])
    .map((s) => {
      // If it's a populated relationship object (Specialty), use the name
      if (typeof s === 'object' && s !== null && 'name' in s) {
        return (s as Specialty).name
      }
      // If it's just an ID string, return null (shouldn't happen with depth: 2)
      return null
    })
    .filter((name): name is string => Boolean(name))
  
  // Handle servingLocations - now relationships with 'name' field
  const servingLocations = (agent.servingLocations || [])
    .map((l) => {
      // If it's a populated relationship object (ServingLocation), use the name
      if (typeof l === 'object' && l !== null && 'name' in l) {
        return (l as ServingLocation).name
      }
      // If it's just an ID string, return null (shouldn't happen with depth: 2)
      return null
    })
    .filter((name): name is string => Boolean(name))

  // Create Hero block structure for agent variant
  // Use backgroundImage for the hero background
  const heroBlock: Extract<Page['blocks'][number], { blockType: 'hero' }> = {
    blockType: 'hero',
    variant: 'agent',
    headingSegments: [
      {
        text: agent.fullName || `${agent.firstName} ${agent.lastName}`,
        id: 'agent-name',
      },
    ],
    subheading: roles.length > 0 ? roles.join(' & ') : 'Agent & Broker',
    ctaPrimaryLabel: 'Schedule A Consultation',
    agentImage: agent.backgroundImage || undefined, // Use backgroundImage for hero background
    agentEmail: agent.email || undefined,
    agentPhone: agent.phone || undefined,
    agentLinkedin: agent.linkedin || undefined,
    id: 'agent-hero',
  }

  // Get first name for CTA footer
  const firstName = agent.firstName || 'Agent'

  // Fetch featured properties - check for global set first, then fall back to manual selection
  let featuredProperties: BuildoutProperty[] = []
  
  // Priority 1: Check if agent uses a global featured properties set
  if ((agent as any).featuredPropertySetName) {
    try {
      const global = await payload.findGlobal({
        slug: 'featuredPropertiesSets',
      })

      // Handle JSON field - it might be a string that needs parsing, or already an array
      let sets: Array<{ name: string; propertyIds: number[] }> = []
      
      if (global?.sets) {
        if (typeof global.sets === 'string') {
          // If it's a string, parse it
          try {
            sets = JSON.parse(global.sets)
          } catch (e) {
            console.error('[Agent Page] Failed to parse sets JSON string:', e)
          }
        } else if (Array.isArray(global.sets)) {
          // If it's already an array, use it directly
          sets = global.sets as Array<{ name: string; propertyIds: number[] }>
        }
      }
      
      const set = sets.find((s) => s.name === (agent as any).featuredPropertySetName)
      
      if (set?.propertyIds && Array.isArray(set.propertyIds)) {
        const propertyIds = set.propertyIds.filter((id: any): id is number => typeof id === 'number')
        
        if (propertyIds.length > 0) {
          // Fetch all properties to find the ones in the set
          const allPropertiesResponse = await buildoutApi.getAllProperties({
            skipCache: false,
            limit: 10000,
          })
          
          // Filter to only the properties in the set and maintain order
          featuredProperties = propertyIds
            .map((id: number) => allPropertiesResponse.properties.find((p: BuildoutProperty) => p.id === id))
            .filter((p): p is BuildoutProperty => p !== undefined)
        }
      }
    } catch (error) {
      console.error('Error fetching featured properties from global set:', error)
      // Continue to fall back to manual selection
    }
  }
  
  // Priority 2: Fall back to manually selected featured properties if no global set or set was empty
  if (featuredProperties.length === 0) {
    // Handle featuredPropertyIds - it's a JSON field that can be null, number[], or corrupted
    const featuredIds: number[] = (() => {
      if (!agent.featuredPropertyIds) return []
      if (typeof agent.featuredPropertyIds === 'number') {
        // Corrupted value - ignore it
        console.warn('Agent featuredPropertyIds is corrupted (number instead of array), ignoring')
        return []
      }
      if (Array.isArray(agent.featuredPropertyIds)) {
        return agent.featuredPropertyIds.filter((id): id is number => typeof id === 'number')
      }
      return []
    })()
    
    if (featuredIds.length > 0 && agent.buildout_broker_id) {
      try {
        const brokerId = parseInt(agent.buildout_broker_id, 10)
        if (!isNaN(brokerId)) {
          // Fetch ALL properties for this broker to ensure we find featured ones
          // Use a very high limit since searchProperties defaults to 20
          // The searchProperties method filters from cache, so this is efficient
          const propertiesResponse = await buildoutApi.getPropertiesByBrokerId(brokerId, {
            limit: 10000, // High limit to get all properties for the broker
            skipCache: false,
          })
          
          // Filter to only featured property IDs and maintain order
          featuredProperties = featuredIds
            .map((id) => propertiesResponse.properties.find((p) => p.id === id))
            .filter((p): p is BuildoutProperty => p !== undefined)
          
          // If we didn't find all featured properties in broker's list, try searching all properties
          // This handles cases where properties might have been reassigned or broker_id changed
          if (featuredProperties.length < featuredIds.length) {
            const missingIds = featuredIds.filter(
              (id) => !featuredProperties.some((p) => p.id === id)
            )
            
            if (missingIds.length > 0) {
              try {
                // Search all properties for the missing IDs
                const allPropertiesResponse = await buildoutApi.getAllProperties({
                  skipCache: false,
                  limit: 10000,
                })
                
                const missingProperties = missingIds
                  .map((id) => allPropertiesResponse.properties.find((p) => p.id === id))
                  .filter((p): p is BuildoutProperty => p !== undefined)
                
                // Add missing properties to the featured list (maintain order)
                featuredProperties = featuredIds
                  .map((id) => 
                    featuredProperties.find((p) => p.id === id) || 
                    missingProperties.find((p) => p.id === id)
                  )
                  .filter((p): p is BuildoutProperty => p !== undefined)
              } catch (error) {
                console.error('Error fetching missing featured properties from all properties:', error)
              }
            }
          }
          
          // Debug logging
          if (featuredProperties.length === 0 && featuredIds.length > 0) {
            console.warn(`[Agent Page] No featured properties found for agent ${agent.slug}:`, {
              featuredIds,
              totalPropertiesForBroker: propertiesResponse.count,
              brokerId,
            })
          } else if (featuredProperties.length < featuredIds.length) {
            console.warn(`[Agent Page] Only found ${featuredProperties.length} of ${featuredIds.length} featured properties for agent ${agent.slug}`)
          }
        }
      } catch (error) {
        console.error('Error fetching featured properties:', error)
        // Continue without featured properties if there's an error
      }
    } else {
      // Debug logging for missing data
      if (!agent.buildout_broker_id) {
        console.warn(`[Agent Page] Agent ${agent.slug} missing buildout_broker_id`)
      }
      if (featuredIds.length === 0) {
        console.warn(`[Agent Page] Agent ${agent.slug} has no featured property IDs`)
      }
    }
  }

  return (
    <>
      <HeroWrapper block={heroBlock} />
      <AboutAgent
        agentFirstName={agent.firstName || 'Agent'}
        paragraphs={[]} // Will be populated from rich text
        serving={servingLocations}
        specialties={specialties}
        roles={roles}
        email={agent.email || undefined}
        phone={agent.phone || undefined}
        linkedin={agent.linkedin || undefined}
        about={agent.about || null}
      />
      <div className="tan-linear-background">
        <FeaturedProperties
          properties={featuredProperties.map((prop) =>
            transformBuildoutProperty(prop, agent.fullName || `${agent.firstName} ${agent.lastName}`)
          )}
        />
        <TrackRecord />
      </div>
      <CTAFooter
        block={{
          blockType: 'ctaFooter',
          heading: `Ready to Talk with ${firstName}?`,
          subheading: 'Get in touch to explore listings, strategies, or your next move.',
          buttons: [
            { label: 'Schedule A Consultation', variant: 'primary' },
            { label: 'Get Matched with a Agent', variant: 'secondary' },
            { label: 'Search Listings', variant: 'secondary' },
          ],
          id: 'agent-cta-footer',
        }}
      />
      <Footer />
    </>
  )
}

