import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'
import config from '@/payload.config'
import PropertyDetails from '@/components/PropertyDetails/PropertyDetails'
import FeaturedProperties from '@/components/FeaturedProperties/FeaturedProperties'
import Footer from '@/components/Footer/Footer'
import NavbarWrapper from '@/components/Navbar/NavbarWrapper'
import { buildoutApi } from '@/utils/buildout-api'
import type { BuildoutProperty } from '@/utils/buildout-api'
import { addressToSlug } from '@/utils/address-slug'
import { transformBuildoutProperty } from '@/utils/transform-buildout-property'

// Mark as dynamic to prevent build-time prerendering (requires MongoDB connection)
export const dynamic = 'force-dynamic'

interface PropertyPageProps {
  params: Promise<{ address: string }>
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

  // Get agent name for featured properties
  const primaryBroker = propertyBrokers.length > 0 
    ? `${propertyBrokers[0].first_name} ${propertyBrokers[0].last_name}`
    : 'Agent'

  // Get featured properties (exclude current property)
  const featuredProperties = allProperties.properties
    .filter((p: BuildoutProperty) => p.id !== property.id)
    .slice(0, 4)
    .map((p: BuildoutProperty) => transformBuildoutProperty(p, primaryBroker))

  return (
    <>
        <div className="bg-transparent md:bg-[var(--strong-green)]">
            <NavbarWrapper darkVariant={true} />
        </div>
        <PropertyDetails property={property} brokers={propertyBrokers} />
        {/* <div className="bg-[#D7D1C4]">
            <FeaturedProperties properties={featuredProperties} />
        </div> */}
        <Footer />
    </>
  )
}

