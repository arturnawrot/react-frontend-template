'use client'

import React, { useState } from 'react'
import { Menu, X, Mail, Phone, Linkedin } from 'lucide-react'
import Navbar from './Navbar/Navbar'
import CollapsingMenuMobile from './CollapsingMenuMobile/CollapsingMenuMobile'
import type { Page } from '@/payload-types'
import styles from './Hero.module.scss'

type HeroBlock = Extract<Page['blocks'][number], { blockType: 'hero' }>

type HeadingSegment = {
  text: string
  color?: string
  breakOnMobile?: boolean
  breakOnDesktop?: boolean
}

type HeroProps = {
  block: HeroBlock
}

// Reusable Heading Component
const HeroHeader = ({
  segments,
  className,
  align = 'center',
  useJustifyCenter = false,
}: {
  segments: HeadingSegment[]
  className?: string
  align?: 'center' | 'start'
  useJustifyCenter?: boolean
}) => {
  const containerAlign =
    align === 'center'
      ? 'items-center text-left md:text-center'
      : 'items-start text-left'

  return (
    <h1 className={`${className} flex justify-center md:block w-full md:w-auto max-w-full`} style={{ width: 'fit-content', maxWidth: '100%' }}>
      <div
        className={`inline-block md:inline w-full md:w-auto max-w-full ${containerAlign} ${useJustifyCenter ? 'justify-center' : ''}`}
      >
        {segments.map((segment, idx) => {
          const prevSegment = idx > 0 ? segments[idx - 1] : null
          const shouldAddMobileSpace = idx > 0 && !prevSegment?.breakOnMobile
          const shouldAddDesktopSpace = idx > 0 && !prevSegment?.breakOnDesktop

          return (
            <React.Fragment key={idx}>
              {shouldAddMobileSpace && (
                <span className="lg:hidden"> </span>
              )}
              {shouldAddDesktopSpace && (
                <span className="hidden lg:inline"> </span>
              )}
              <span
                className="whitespace-normal lg:whitespace-nowrap break-words inline-block"
                style={segment.color ? { color: segment.color } : undefined}
              >
                {segment.text}
              </span>
              {segment.breakOnMobile && <br className="lg:hidden" />}
              {segment.breakOnDesktop && <br className="hidden lg:block" />}
            </React.Fragment>
          )
        })}
      </div>
    </h1>
  )
}

// Reusable Action Buttons
const ActionButtons = ({
  primaryLabel,
  primaryLink,
  secondaryLabel,
  secondaryLink,
  onPrimary,
  onSecondary,
  primaryClass,
  secondaryClass,
}: {
  primaryLabel?: string
  primaryLink?: string
  secondaryLabel?: string
  secondaryLink?: string
  onPrimary?: () => void
  onSecondary?: () => void
  primaryClass: string
  secondaryClass: string
}) => {
  if (!primaryLabel && !secondaryLabel) return null

  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-4">
      {primaryLabel && (
        onPrimary ? (
          <button onClick={onPrimary} className={primaryClass}>
            {primaryLabel}
          </button>
        ) : (
          <a href={primaryLink || '#'} className={primaryClass}>
            {primaryLabel}
          </a>
        )
      )}
      {secondaryLabel && (
        onSecondary ? (
          <button onClick={onSecondary} className={secondaryClass}>
            {secondaryLabel}
          </button>
        ) : (
          <a href={secondaryLink || '#'} className={secondaryClass}>
            {secondaryLabel}
          </a>
        )
      )}
    </div>
  )
}

// Agent Contact Links
const AgentContactInfo = ({
  email,
  phone,
  linkedin,
}: {
  email?: string
  phone?: string
  linkedin?: string
}) => {
  if (!email && !phone && !linkedin) return null

  const linkClass =
    'flex items-center gap-2 text-sm font-sans text-white hover:opacity-70 transition-opacity'

  return (
    <div className="flex flex-row gap-6 mb-8 flex-wrap">
      {email && (
        <a href={`mailto:${email}`} className={linkClass}>
          <Mail className="w-4 h-4" /> Email
        </a>
      )}
      {phone && (
        <a href={`tel:${phone}`} className={linkClass}>
          <Phone className="w-4 h-4" /> Phone
        </a>
      )}
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <Linkedin className="w-4 h-4" /> LinkedIn
        </a>
      )}
    </div>
  )
}

/**
 * Centralizes the logic for default text/images based on variant.
 */
const resolveHeroContent = (block: HeroBlock) => {
  const variant = block.variant || 'default'
  const isFullWidthColor = variant === 'full-width-color'
  const isSplit = variant === 'split'
  const isAgent = variant === 'agent'

  // 1. Resolve Background
  const defaultBg = '/img/hero_section_background.png'
  const backgroundImageUrl =
    typeof block.backgroundImage === 'object' && block.backgroundImage?.url
      ? block.backgroundImage.url
      : typeof block.backgroundImage === 'string'
        ? block.backgroundImage
        : undefined
  const agentImageUrl =
    typeof block.agentImage === 'object' && block.agentImage?.url
      ? block.agentImage.url
      : typeof block.agentImage === 'string'
        ? block.agentImage
        : undefined

  const finalImage = isAgent
    ? agentImageUrl || defaultBg
    : isFullWidthColor
      ? undefined
      : backgroundImageUrl || defaultBg

  // 2. Resolve Headings
  let segments: HeadingSegment[] = []
  if (block.headingSegments && block.headingSegments.length > 0) {
    segments = block.headingSegments.map((seg) => ({
      text: seg.text || '',
      color: seg.color || undefined,
      breakOnMobile: seg.breakOnMobile || false,
      breakOnDesktop: seg.breakOnDesktop || false,
    }))
  } else {
    // Default segments based on variant
    if (isFullWidthColor)
      segments = [
        { text: 'Buy With Insight.' },
        { text: 'Invest With Confidence.', color: '#DAE684' },
      ]
    else if (isSplit)
      segments = [
        { text: 'We Represent Buyers' },
        { text: 'Think Strategically', color: '#DAE684' },
      ]
    else if (isAgent) segments = [{ text: 'Agent Name' }]
    else
      segments = [
        { text: 'Smart Moves.' },
        { text: 'Strong Futures.', color: '#DAE684' },
      ]
  }

  // 3. Resolve Subheading
  let sub = block.subheading
  if (!sub) {
    if (isFullWidthColor)
      sub =
        "Approach every deal confidently, knowing you're backed by analytical excellence, investment foresight, and personal care."
    else if (isSplit)
      sub =
        'From investment acquisitions to site selection, we find opportunities that align with your best interests.'
    else if (isAgent) sub = 'Agent & Broker'
    else
      sub =
        'Advisory-led commercial real estate solutions across the Southeast. Rooted in partnership. Driven by performance. Informed by perspective.'
  }

  // 4. Resolve CTA Labels
  const primaryCta =
    block.ctaPrimaryLabel ??
    (isFullWidthColor
      ? 'Start Your Property Search'
      : isSplit
        ? 'Start the Conversation'
        : isAgent
          ? 'Schedule A Consultation'
          : undefined)

  const secondaryCta =
    block.ctaSecondaryLabel ?? (isFullWidthColor ? 'Schedule a Consultation' : undefined)

  return {
    segments,
    subheading: sub,
    primaryCta,
    primaryCtaLink: block.ctaPrimaryLink || undefined,
    secondaryCta,
    secondaryCtaLink: block.ctaSecondaryLink || undefined,
    finalImage,
    isFullWidthColor,
    isSplit,
    isAgent,
    agentEmail: block.agentEmail || undefined,
    agentPhone: block.agentPhone || undefined,
    agentLinkedin: block.agentLinkedin || undefined,
  }
}

/**
 * Split View ('split', 'agent')
 * Left side text, Right side image.
 */
const SideBySideLayout = (
  props: HeroProps & ReturnType<typeof resolveHeroContent> & { menuOpen: boolean; setMenuOpen: (v: boolean) => void },
) => {
  const {
    block,
    isAgent,
    segments,
    subheading,
    primaryCta,
    primaryCtaLink,
    secondaryCta,
    secondaryCtaLink,
    finalImage,
    agentEmail,
    agentPhone,
    agentLinkedin,
    menuOpen,
    setMenuOpen,
  } = props

  const containerBg = 'bg-[var(--strong-green)]'

  // Styling configuration - same for both split and agent variants
  const headingClass = `${styles.splitHeading} text-left mb-4 z-10 relative leading-tight`
  const subClass = `${styles.splitSubheading} text-white/90 font-light w-full md:max-w-xl text-left leading-relaxed`
  const btnPrimaryClass = `bg-[#DAE684] text-[#0F231D] font-semibold hover:bg-[#cdd876] transition-colors rounded-full px-8 py-3 text-base w-full md:w-auto text-center`
  const btnSecondaryClass = `border border-white text-white font-semibold hover:bg-white/10 transition-colors rounded-full px-8 py-3 text-base w-full md:w-auto text-center`

  return (
    <div className={`relative w-full ${containerBg}`}>
      <div className="absolute inset-x-0 top-0 z-30">
        <Navbar />
      </div>

      <div className="relative w-full flex flex-col md:flex-row">
        {/* Left Content */}
        <div
          className={`relative w-full md:w-1/2 ${containerBg} text-white px-6 sm:px-10 md:px-14 lg:px-16 pt-[120px] pb-16 md:py-16 flex justify-center`}
        >
          <div className="flex flex-col gap-6 justify-center w-full max-w-xl md:mt-[150px] md:mb-[80px]">
            <div className="w-full max-w-[400px] md:max-w-none md:w-auto">
              <HeroHeader segments={segments} className={headingClass} align="start" />

              {subheading && <p className={subClass}>{subheading}</p>}
            </div>

            {isAgent && (
              <AgentContactInfo
                email={agentEmail}
                phone={agentPhone}
                linkedin={agentLinkedin}
              />
            )}

            <ActionButtons
              primaryLabel={primaryCta}
              primaryLink={primaryCtaLink}
              secondaryLabel={secondaryCta}
              secondaryLink={secondaryCtaLink}
              primaryClass={btnPrimaryClass}
              secondaryClass={btnSecondaryClass}
            />
          </div>
        </div>

        {/* Right Image */}
        <div
          className={`relative w-full md:w-1/2 h-[50vh] md:h-auto bg-cover bg-center min-h-[400px]`}
          style={{ backgroundImage: `url('${finalImage}')` }}
        >
          <div className={`absolute inset-0 bg-black/20 md:bg-black/5`} aria-hidden />

          {/* Mobile Menu Trigger */}
          <div className="md:hidden absolute inset-0 flex items-center justify-center z-20">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="bg-[#DAE684] hover:bg-[#cdd876] text-[#0F231D] w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
              aria-label="Open Menu"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Centered View ('Default', 'Full-Width-Color')
 */
const CenteredLayout = (
  props: HeroProps & ReturnType<typeof resolveHeroContent> & { menuOpen: boolean; setMenuOpen: (v: boolean) => void },
) => {
  const {
    isFullWidthColor,
    segments,
    subheading,
    primaryCta,
    primaryCtaLink,
    secondaryCta,
    secondaryCtaLink,
    finalImage,
    menuOpen,
    setMenuOpen,
  } = props

  // Styling configuration
  const wrapperClass = `
    relative w-full
    ${isFullWidthColor ? 'bg-[var(--strong-green)]' : 'bg-cover bg-center bg-no-repeat md:h-[700px] md:min-h-[700px]'}
  `

  const headingClass = isFullWidthColor
    ? `${styles.meybohmHeading} text-center mb-6`
    : `text-white text-4xl md:text-7xl font-bold mb-6 ${styles.heroHeading} md:w-full`

  const subClass = isFullWidthColor
    ? `${styles.meybohmSubheading} text-center`
    : `${styles.heroSubheading} w-full md:max-w-[1200px] max-w-[800px]`

  const btnPrimaryClass = `sale-button px-6 py-3 text-base w-full sm:w-auto shadow-md`
  const btnSecondaryClass = `px-6 py-3 rounded-full border border-white/70 text-white w-full sm:w-auto hover:bg-white/10 transition text-base`

  return (
    <>
      <div
        className={wrapperClass}
        style={finalImage ? { backgroundImage: `url('${finalImage}')` } : undefined}
      >
        {!isFullWidthColor && <div className="absolute inset-0 bg-black/40" />}

        <div className="relative z-10 flex flex-col h-full pb-10">
          <Navbar />

          <div
            className={`md:flex-1 md:flex md:flex-col md:items-center md:justify-center px-6 text-left md:text-center flex flex-col items-center ${isFullWidthColor ? 'gap-6' : ''}`}
          >
            <div className="mt-25 md:mt-0 lg:max-w-none md:w-auto flex flex-col items-center md:items-center">
              <div className="md:w-auto md:flex flex-col items-center md:items-center">
                <HeroHeader
                  segments={segments}
                  className={headingClass}
                  align="center"
                  useJustifyCenter={!isFullWidthColor}
                />

                {subheading && (
                  <p className={`${subClass} text-left md:text-center max-w-[200px] md:w-auto md:max-w-[1200px]`}>{subheading}</p>
                )}
              </div>
            </div>

            <ActionButtons
              primaryLabel={primaryCta}
              primaryLink={primaryCtaLink}
              secondaryLabel={secondaryCta}
              secondaryLink={secondaryCtaLink}
              primaryClass={btnPrimaryClass}
              secondaryClass={btnSecondaryClass}
            />
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex justify-center px-6 pt-25">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="bg-[#DAE684] hover:bg-[#cdd876] text-[#0F231D] w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
              aria-label="Open Menu"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Hero({ block }: HeroProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  // Prepare data (content, styling flags)
  const content = resolveHeroContent(block)

  // Determine Layout Strategy
  const isSideBySide = content.isSplit || content.isAgent

  return (
    <div
      className="relative w-full overflow-x-hidden"
      style={{ backgroundColor: 'var(--strong-green)' }}
    >
      {isSideBySide ? (
        <SideBySideLayout
          block={block}
          {...content}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
      ) : (
        <CenteredLayout
          block={block}
          {...content}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
      )}

      <CollapsingMenuMobile open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}

