import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'
import config from '@/payload.config'
import type { Agent } from '@/payload-types'
import HeroWrapper from '@/components/Hero/HeroWrapper'
import AboutAgent from '@/components/AboutAgent/AboutAgent'
import FeaturedPropertiesAgent from '@/components/FeaturedPropertiesAgent/FeaturedPropertiesAgent'
import TrackRecord from '@/components/TrackRecord/TrackRecord'
import CTAFooter from '@/components/CTAFooter/CTAFooter'
import Footer from '@/components/Footer/Footer'
import type { Page } from '@/payload-types'
import { buildoutApi } from '@/utils/buildout-api'
import type { BuildoutProperty } from '@/utils/buildout-api'

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
    depth: 2, // Populate image relationship
    limit: 1,
  })

  const agent = docs[0] as Agent | undefined

  if (!agent) {
    notFound()
  }

  // Extract arrays from agent data
  const roles = agent.roles?.map((r) => r.role).filter(Boolean) || []
  const specialties = agent.specialties?.map((s) => s.specialty).filter(Boolean) || []
  const servingLocations = agent.servingLocations?.map((l) => l.location).filter(Boolean) || []

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

  // Fetch featured properties if agent has featured property IDs and broker ID
  let featuredProperties: BuildoutProperty[] = []
  
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
        // Fetch all properties for this broker (we'll filter to featured ones)
        const propertiesResponse = await buildoutApi.getPropertiesByBrokerId(brokerId, {
          limit: 100, // Get enough to find featured ones
          skipCache: false,
        })
        
        // Filter to only featured property IDs and maintain order
        featuredProperties = featuredIds
          .map((id) => propertiesResponse.properties.find((p) => p.id === id))
          .filter((p): p is BuildoutProperty => p !== undefined)
      }
    } catch (error) {
      console.error('Error fetching featured properties:', error)
      // Continue without featured properties if there's an error
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
        <FeaturedPropertiesAgent properties={featuredProperties} agentName={agent.fullName || `${agent.firstName} ${agent.lastName}`} />
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

