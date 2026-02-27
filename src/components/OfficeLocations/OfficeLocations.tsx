import React from 'react'
import Image from 'next/image'
import Container from '@/components/Container/Container'
import SectionHeading from '@/components/SectionHeading/SectionHeading'
import { resolveLink } from '@/utils/linkResolver'
import { NavbarLink } from '@/components/NavbarLink/NavbarLink'

interface OfficeLocation {
  image?: {
    id: string
    url?: string
    alt?: string
  } | string | null
  header: string
  subheader?: string | null
  office?: string | null
  fax?: string | null
  linkText?: string | null
  linkType?: 'none' | 'page' | 'custom' | null
  page?: string | { slug?: string; id?: string } | null
  customUrl?: string | null
  openInNewTab?: boolean | null
}

interface OfficeLocationsBlock {
  blockType: 'officeLocations'
  officeLocationSetName?: string | null
  heading?: string | null
  locations?: OfficeLocation[]
}

interface OfficeLocationsProps {
  block: OfficeLocationsBlock
}

function OfficeLocationCard({ location }: { location: OfficeLocation }) {
  const imageUrl = typeof location.image === 'object' && location.image !== null
    ? location.image.url || ''
    : ''
  
  const imageAlt = typeof location.image === 'object' && location.image !== null
    ? location.image.alt || location.header
    : location.header

  const link = resolveLink(location as any)

  // Parse subheader for bullet points (split by newline or • character)
  const subheaderLines = location.subheader
    ? location.subheader.split(/\n|•/).map(line => line.trim()).filter(Boolean)
    : []
  const hasBullets = subheaderLines.length > 1 || (location.subheader?.includes('•') || location.subheader?.includes('\n'))

  return (
    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
      {/* Image */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}
      
      {/* Content Card - flat, inside the image */}
      <div className="absolute left-4 md:left-6 bottom-4 md:bottom-6 bg-white rounded-lg p-5 md:p-6 max-w-[280px] md:max-w-[320px]">
        {/* Header */}
        <h3 className="font-[Copernicus_New_Cond_Trial,serif] font-light text-[32px] md:text-[40px] leading-[1.1] text-[var(--strong-green)] mb-4">
          {location.header}
        </h3>
        
        {/* Subheader - supports bullet points */}
        {location.subheader && (
          hasBullets ? (
            <ul className="text-sm text-gray-600 mb-5 space-y-1.5 list-disc list-inside">
              {subheaderLines.map((line, idx) => (
                <li key={idx} className="leading-relaxed">{line}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              {location.subheader}
            </p>
          )
        )}
        
        {/* Office & Fax (only show if present) */}
        {(location.office || location.fax) && (
          <div className="flex gap-8 mb-5">
            {location.office && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">OFFICE</p>
                <p className="text-sm text-gray-700">{location.office}</p>
              </div>
            )}
            {location.fax && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">FAX</p>
                <p className="text-sm text-gray-700">{location.fax}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Link */}
        {location.linkText && (
          <NavbarLink
            link={link}
            className="text-sm font-medium text-[var(--strong-green)] hover:underline inline-flex items-center gap-1"
          >
            {location.linkText}
            <span aria-hidden="true">→</span>
          </NavbarLink>
        )}
      </div>
    </div>
  )
}

export default function OfficeLocations({ block }: OfficeLocationsProps) {
  const heading = block.heading || 'Office Locations'
  const locations = block.locations || []

  if (locations.length === 0) {
    return (
      <section className="w-full py-16 md:py-24">
        <Container>
          <div className="text-center">
            <p className="text-gray-500">No office locations available. Please select an Office Location set.</p>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="w-full py-16 md:py-24">
      <Container>
        {/* Centered Section Heading */}
        <SectionHeading className="mb-16 text-center">
          {heading}
        </SectionHeading>
        
        {/* 2-per-row Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {locations.map((location, index) => (
            <OfficeLocationCard key={index} location={location} />
          ))}
        </div>
      </Container>
    </section>
  )
}
