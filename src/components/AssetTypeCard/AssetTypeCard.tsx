import React from 'react'
import Image from 'next/image'
import Container from '@/components/Container/Container'
import SectionHeading from '@/components/SectionHeading/SectionHeading'
import ArrowLink from '@/components/ArrowLink/ArrowLink'
import { resolveLink } from '@/utils/linkResolver'

interface AssetTypeCardItem {
  image?: {
    id: string
    url?: string | null
    alt?: string | null
  } | string | null
  header: string
  subheader?: string | null
  linkText?: string | null
  linkType?: 'none' | 'page' | 'custom' | 'constant' | 'cal' | null
  page?: string | { slug?: string; id?: string } | null
  customUrl?: string | null
  constantLink?: string | null
  openInNewTab?: boolean | null
  disabled?: boolean | null
}

interface AssetTypeCardBlock {
  blockType: 'assetTypeCard'
  heading?: string | null
  cards?: AssetTypeCardItem[]
}

interface AssetTypeCardProps {
  block: AssetTypeCardBlock
}

function AssetTypeCardCard({ card }: { card: AssetTypeCardItem }) {
  const imageUrl = typeof card.image === 'object' && card.image !== null
    ? card.image.url || ''
    : ''
  
  const imageAlt = typeof card.image === 'object' && card.image !== null
    ? card.image.alt || card.header
    : card.header

  // Parse subheader for bullet points (split by newline)
  const subheaderLines = card.subheader
    ? card.subheader.split('\n').map(line => line.trim()).filter(Boolean)
    : []
  const hasBullets = subheaderLines.length > 0

  const link = resolveLink(card as any)

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
          {card.header}
        </h3>
        
        {/* Subheader - displayed as bullets */}
        {hasBullets && (
          <ul className="text-sm text-gray-600 mb-5 space-y-1.5 list-disc list-inside">
            {subheaderLines.map((line, idx) => (
              <li key={idx} className="leading-relaxed">{line}</li>
            ))}
          </ul>
        )}
        
        {/* Link with ArrowLink at bottom */}
        {card.linkText && link.href && (
          <div>
            <ArrowLink 
              href={link.href} 
              openInNewTab={link.openInNewTab || false} 
              disabled={link.disabled || false}
            >
              {card.linkText}
            </ArrowLink>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AssetTypeCard({ block }: AssetTypeCardProps) {
  const heading = block.heading
  const cards = block.cards || []

  if (cards.length === 0) {
    return null
  }

  return (
    <section className="w-full py-16 md:py-24">
      <Container>
        {/* Centered Section Heading - only if provided */}
        {heading && (
          <SectionHeading className="mb-16 text-center">
            {heading}
          </SectionHeading>
        )}
        
        {/* 2-per-row Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {cards.map((card, index) => (
            <AssetTypeCardCard key={index} card={card} />
          ))}
        </div>
      </Container>
    </section>
  )
}
