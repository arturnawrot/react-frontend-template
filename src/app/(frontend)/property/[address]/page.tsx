import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'
import config from '@/payload.config'
import type { Metadata } from 'next'
import PropertyDetails from '@/components/PropertyDetails/PropertyDetails'
import Footer from '@/components/Footer/Footer'
import NavbarWrapper from '@/components/Navbar/NavbarWrapper'
import FeaturedProperties from '@/components/FeaturedProperties/FeaturedProperties'
import { buildoutApi, getNearestProperties } from '@/utils/buildout-api'
import type { BuildoutProperty, BuildoutBroker } from '@/utils/buildout-api'
import { addressToSlug } from '@/utils/address-slug'
import { buildSeoMetadata } from '@/utils/getSeoMetadata'
import { transformPropertyToCard } from '@/utils/property-transform'
import { getPropertyTypeLabel } from '@/utils/property-types'
import Container from '@/components/Container/Container'

// Mark as dynamic to prevent build-time prerendering (requires MongoDB connection)
export const dynamic = 'force-dynamic'

interface PropertyPageProps {
  params: Promise<{ address: string }>
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { address: addressSlug } = await params

  const allProperties = await buildoutApi.getAllProperties()
  const property = allProperties.properties.find((p: BuildoutProperty) => {
    const propertyAddress = p.address || p.name || ''
    return addressToSlug(propertyAddress) === addressSlug
  })

  if (!property) {
    return { title: 'Property Not Found' }
  }

  const address = property.address || property.name || 'Property'
  const city = property.city || ''
  const state = property.state || ''
  const location = [city, state].filter(Boolean).join(', ')

  // Build description from property details
  const details: string[] = []
  if (property.building_size_sf) details.push(`${property.building_size_sf.toLocaleString()} SF`)
  if (property.sale_price_dollars) details.push(`$${property.sale_price_dollars.toLocaleString()}`)

  const description = location
    ? `Commercial property in ${location}${details.length ? ` - ${details.join(' | ')}` : ''}`
    : `Commercial property${details.length ? ` - ${details.join(' | ')}` : ''}`

  // Use first property image if available
  const imageUrl = property.photos?.[0]?.url

  return buildSeoMetadata({
    title: `${address} | Meybohm Real Estate`,
    description,
    image: imageUrl,
  })
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { address: addressSlug } = await params

  // Find property by matching address slug
  // We need to search all properties and find the one with matching address slug
  const allProperties = await buildoutApi.getAllProperties()
  
  // Find property where address slug matches
  const property = allProperties.properties.find((p: BuildoutProperty) => {
    const propertyAddress = p.address || p.name || ''
    const propertySlug = addressToSlug(propertyAddress)
    return propertySlug === addressSlug
  })

  if (!property) {
    notFound()
  }

  // Get brokers for this property
  const brokers = await buildoutApi.getAllBrokers()
  const propertyBrokers = brokers.brokers.filter(broker => 
    property.broker_ids?.includes(broker.id)
  )

  // Look up agent slugs for each broker
  const payload = await getPayload({ config })
  const brokerIdToAgentSlug: Record<number, string> = {}
  
  for (const broker of propertyBrokers) {
    try {
      const { docs } = await payload.find({
        collection: 'agents',
        where: {
          buildout_broker_id: {
            equals: String(broker.id),
          },
        },
        limit: 1,
      })
      
      if (docs.length > 0) {
        const agent = docs[0] as { slug: string }
        brokerIdToAgentSlug[broker.id] = agent.slug
      }
    } catch (error) {
      console.error(`Error looking up agent for broker ${broker.id}:`, error)
    }
  }

  // Get nearest properties of the same type (with fallback to all types)
  const nearestResult = await getNearestProperties({
    currentProperty: property,
    limit: 4,
  })

  // Helper to get agent info from broker
  const getAgentInfoFromBrokers = (
    brokerId: number | undefined,
    allBrokers: BuildoutBroker[]
  ): { name: string; image: string | null } => {
    if (!brokerId) return { name: 'Agent', image: null }
    const broker = allBrokers.find((b) => b.id === brokerId)
    if (!broker) return { name: 'Agent', image: null }
    return {
      name: `${broker.first_name} ${broker.last_name}`,
      image: broker.profile_photo_url,
    }
  }

  // Transform nearby properties for the FeaturedProperties component
  const nearbyPropertyCards = nearestResult.properties.map((prop) => {
    const brokerId = prop.broker_id || (prop.broker_ids && prop.broker_ids[0])
    const { name: agentName, image: agentImage } = getAgentInfoFromBrokers(
      brokerId,
      brokers.brokers
    )
    return transformPropertyToCard(prop, agentName, agentImage)
  })

  // Generate heading based on property type
  const propertyTypeLabel = getPropertyTypeLabel(property.property_type_id)
  const nearbyHeading = "Explore More Opportunities Nearby";
  const seeAllLinkText = `See More Listings in ${property.city}, ${property.state}`;
  const seeAllLink = property.city 
    ? `/property-search?search=${encodeURIComponent(property.city)}`
    : '/property-search';

  return (
    <>
        <div className="bg-transparent md:bg-[var(--strong-green)]">
            <NavbarWrapper darkVariant={true} />
        </div>
        <PropertyDetails 
          property={property} 
          brokers={propertyBrokers}
          brokerIdToAgentSlug={brokerIdToAgentSlug}
        />
        {nearbyPropertyCards.length > 0 && (
          <div className="bg-[#dad6cc] py-30">
            <Container>
              <FeaturedProperties
                properties={nearbyPropertyCards}
                heading={nearbyHeading}
                seeAllLink={seeAllLink}
                seeAllLinkText={seeAllLinkText}
              />
            </Container>
          </div>
        )}
        <Footer />
    </>
  )
}

