import React from 'react'
import type { Page } from '@/payload-types'
import { resolveLink } from '@/utils/linkResolver'
import SectionHeading from '@/components/SectionHeading/SectionHeading'
import PrimaryButton from '@/components/PrimaryButton'

type CardOnBackgroundBlock = Extract<Page['blocks'][number], { blockType: 'cardOnBackground' }>

interface CardOnBackgroundProps {
  block: CardOnBackgroundBlock
}

const defaultHeading = "Commercial Brokerage With Real Momentum"
const defaultSubheading = "We're growing - and always looking for strong talent. If you're client-first, strategic, and hungry to grow, we want to talk."
const defaultCTAText = "Explore Careers"
const defaultBackgroundImage = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"

export default function CardOnBackground({ block }: CardOnBackgroundProps) {
  const heading = block.heading || defaultHeading
  const subheading = block.subheading || defaultSubheading
  const ctaText = block.ctaText || defaultCTAText

  // Handle background image - can be upload object or string URL
  const backgroundImage = 
    typeof block.backgroundImage === 'object' && block.backgroundImage !== null && block.backgroundImage?.url
      ? block.backgroundImage.url
      : typeof block.backgroundImage === 'string'
        ? block.backgroundImage
        : defaultBackgroundImage

  // Handle CTA link
  const link = resolveLink(block as any)
  const hasLink = link.href && block.linkType !== 'none'

  return (
    <section className="relative w-full min-h-[600px] md:min-h-[700px] overflow-hidden bg-gray-200">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-16 md:py-24 h-full flex items-center justify-end">
        {/* White Card */}
        <div className="w-full md:w-[500px] lg:w-[550px] bg-white rounded-2xl md:rounded-3xl p-8 md:p-10 lg:p-12 shadow-xl">
          {/* Heading */}
          <SectionHeading className="mb-6 tracking-tight">
            {heading}
          </SectionHeading>

          {/* Subheading */}
          {subheading && (
            <p className="text-[#1C2B28] text-base md:text-lg leading-relaxed mb-8 font-sans">
              {subheading}
            </p>
          )}

          {/* CTA Button */}
          {ctaText && (
            <PrimaryButton link={link} className="text-base md:text-lg rounded-full" fullWidth>
              {ctaText}
            </PrimaryButton>
          )}
        </div>
      </div>
    </section>
  )
}
