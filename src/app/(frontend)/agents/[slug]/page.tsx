import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'
import config from '@/payload.config'
import type { Agent, Role, Specialty, ServingLocation, Media } from '@/payload-types'
import type { Metadata } from 'next'
import HeroWrapper from '@/components/Hero/HeroWrapper'
import AboutAgent from '@/components/AboutAgent/AboutAgent'
import FeaturedProperties from '@/components/FeaturedProperties/FeaturedProperties'
import Container from '@/components/Container/Container'
import TrackRecordSection from '@/components/TrackRecordSection/TrackRecordSection'
import CTAFooter from '@/components/CTAFooter/CTAFooter'
import Footer from '@/components/Footer/Footer'
import type { Page } from '@/payload-types'
import { buildoutApi } from '@/utils/buildout-api'
import type { BuildoutProperty } from '@/utils/buildout-api'
import { transformPropertyToCard } from '@/utils/property-transform'
import { getSeoMetadata } from '@/utils/getSeoMetadata'
import { resolvePrefixedLink } from '@/utils/linkResolver'

// Mark as dynamic to prevent build-time prerendering (requires MongoDB connection)
export const dynamic = 'force-dynamic'

interface AgentPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'agents',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })

  const agent = docs[0] as Agent | undefined

  if (!agent) {
    return { title: 'Agent Not Found' }
  }

  const fullName = agent.fullName || `${agent.firstName} ${agent.lastName}`
  const roles = (agent.roles || [])
    .map((r) => (typeof r === 'object' && r !== null && 'name' in r ? (r as Role).name : null))
    .filter(Boolean)
    .join(', ')
  const specialties = (agent.specialties || [])
    .map((s) => (typeof s === 'object' && s !== null && 'name' in s ? (s as Specialty).name : null))
    .filter(Boolean)
    .join(', ')
  const servingLocations = (agent.servingLocations || [])
    .map((l) => (typeof l === 'object' && l !== null && 'name' in l ? (l as ServingLocation).name : null))
    .filter(Boolean)
    .join(', ')

  // Get image URL from agent's card image or background image
  let imageUrl: string | undefined
  if (agent.cardImage && typeof agent.cardImage === 'object' && 'url' in agent.cardImage) {
    imageUrl = (agent.cardImage as Media).url || undefined
  } else if (agent.backgroundImage && typeof agent.backgroundImage === 'object' && 'url' in agent.backgroundImage) {
    imageUrl = (agent.backgroundImage as Media).url || undefined
  }

  return getSeoMetadata({
    pageType: 'agents',
    templateVars: {
      firstName: agent.firstName || '',
      lastName: agent.lastName || '',
      fullName,
      displayTitle: agent.displayTitle || '',
      roles,
      specialties,
      servingLocations,
      email: agent.email || '',
      phone: agent.phone || '',
    },
    docMeta: agent.meta,
    fallbackTitle: `${fullName} | Meybohm Real Estate`,
    fallbackDescription: roles ? `${fullName} - ${roles} at Meybohm Real Estate` : `${fullName} at Meybohm Real Estate`,
    fallbackImage: imageUrl,
  })
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

  // Resolve the agent's consultation link using the linkType system
  const consultationLink = resolvePrefixedLink(agent as any, 'consultation')

  // Create Hero block structure for agent variant
  // Use backgroundImage for the hero background
  const heroBlock = {
    blockType: 'hero' as const,
    variant: 'agent' as const,
    headingSegments: [
      {
        text: agent.fullName || `${agent.firstName} ${agent.lastName}`,
        id: 'agent-name',
      },
    ],
    subheading: agent.displayTitle || 'Agent & Broker',
    ctaPrimaryLabel: 'Schedule A Consultation',
    ctaPrimaryLinkType: (agent as any).consultationLinkType || undefined,
    ctaPrimaryCustomUrl: (agent as any).consultationCustomUrl || undefined,
    ctaPrimaryCalLink: (agent as any).consultationCalLink || undefined,
    ctaPrimaryCalNamespace: (agent as any).consultationCalNamespace || undefined,
    ctaPrimaryOpenInNewTab: (agent as any).consultationOpenInNewTab ?? false,
    agentImage: agent.backgroundImage || undefined,
    agentEmail: agent.email || undefined,
    agentPhone: agent.phone || undefined,
    agentLinkedin: agent.linkedin || undefined,
    id: 'agent-hero',
  } as Extract<Page['blocks'][number], { blockType: 'hero' }>

  // Get first name for CTA footer
  const firstName = agent.firstName || 'Agent'

  // Fetch featured properties - check for global set first, then fall back to manual selection
  let featuredProperties: BuildoutProperty[] = []
  
  // Priority 1: Check if agent uses a global featured properties set
  if (agent.featuredPropertySetName) {
    try {
      const global = await payload.findGlobal({
        slug: 'featuredPropertiesSets',
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
                console.error('[Agent Page] Failed to parse propertyIds JSON:', e)
              }
            }
          }
          return {
            name: set.name,
            propertyIds
          }
        })
      }
      
      const set = sets.find((s) => s.name === agent.featuredPropertySetName)
      
      if (set?.propertyIds && Array.isArray(set.propertyIds)) {
        const propertyIds = set.propertyIds.filter((id: unknown): id is number => typeof id === 'number')
        
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

  // Get agent photo from Buildout if available
  let agentPhoto: string | null = null
  if (agent.buildout_broker_id) {
    try {
      const brokerId = parseInt(agent.buildout_broker_id, 10)
      if (!isNaN(brokerId)) {
        const brokersResponse = await buildoutApi.getAllBrokers({ skipCache: false })
        const broker = brokersResponse.brokers.find(b => b.id === brokerId)
        agentPhoto = broker?.profile_photo_url || null
      }
    } catch (error) {
      console.error('Error fetching broker photo:', error)
    }
  }

  // Transform featured properties with agent name and photo
  const transformedFeaturedProperties = featuredProperties.map((prop) =>
    transformPropertyToCard(
      prop, 
      agent.fullName || `${agent.firstName} ${agent.lastName}`,
      agentPhoto
    )
  )

  // Build property search URL with broker filter
  const propertySearchUrl = agent.buildout_broker_id
    ? `/property-search?brokerId=${agent.buildout_broker_id}`
    : '/property-search'

  // Fetch proven track record items from the "default" set
  let trackRecordItems: Array<{
    image: string
    title: string
    address?: string
    price?: string
    size?: string
    propertyType?: string
    agent?: { name: string; image?: string }
    link?: string
  }> = []

  try {
    const provenTrackRecordGlobal = await payload.findGlobal({
      slug: 'provenTrackRecordSets',
      depth: 2, // Populate relationships (agent, image)
    })

    if (provenTrackRecordGlobal?.sets && Array.isArray(provenTrackRecordGlobal.sets)) {
      // Use "default" set or fall back to first set
      const set = provenTrackRecordGlobal.sets.find((s: any) => s.name === 'default') || provenTrackRecordGlobal.sets[0]

      if (set?.items && Array.isArray(set.items)) {
        trackRecordItems = set.items.map((item: any) => {
          const image = item.image
          const imageUrl = typeof image === 'object' && image !== null ? image.url || '' : ''
          
          const itemAgent = item.agent
          let agentData: { name: string; image?: string } | undefined
          
          if (itemAgent && typeof itemAgent === 'object') {
            const agentName = itemAgent.fullName || `${itemAgent.firstName || ''} ${itemAgent.lastName || ''}`.trim()
            const agentImage = itemAgent.cardImage || itemAgent.backgroundImage
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
    console.error('[Agent Page] Error fetching proven track record items:', error)
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
        consultationLink={consultationLink}
      />
      <div className="tan-linear-background pt-20">
        <Container className="mb-12 md:mb-20">
          <FeaturedProperties
            properties={transformedFeaturedProperties}
            seeAllLink={propertySearchUrl}
            seeAllLinkText="See All Listings By This Agent"
          />
        </Container>
        <TrackRecordSection
          block={{
            blockType: 'trackRecordSection',
            heading: 'Proven Track Record',
            provenTrackRecordSetName: 'default',
          }}
          items={trackRecordItems}
        />
      </div>
      <CTAFooter
        block={{
          blockType: 'ctaFooter',
          heading: `Ready to Talk with ${firstName}?`,
          subheading: 'Get in touch to explore listings, strategies, or your next move.',
          buttons: [
            {
              label: 'Schedule A Consultation',
              variant: 'primary',
              linkType: (agent as any).consultationLinkType || undefined,
              customUrl: (agent as any).consultationCustomUrl || undefined,
              calLink: (agent as any).consultationCalLink || undefined,
              calNamespace: (agent as any).consultationCalNamespace || undefined,
              openInNewTab: (agent as any).consultationOpenInNewTab ?? false,
            },
            // { label: 'Get Matched with a Agent', variant: 'secondary' },
            // { label: 'Search Listings', variant: 'secondary' },
          ],
          id: 'agent-cta-footer',
        }}
      />
      <Footer />
    </>
  )
}

