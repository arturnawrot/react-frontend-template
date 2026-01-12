'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Mail, Phone, Linkedin } from 'lucide-react'
import Navbar, { type NavbarLink } from './Navbar/Navbar'
import CollapsingMenuMobile from './CollapsingMenuMobile/CollapsingMenuMobile'
import type { Page } from '@/payload-types'
import styles from './Hero.module.scss'
import { resolveLinkUrl, shouldOpenInNewTab } from '@/utils/linkResolver'
import { isInternalLink } from '@/utils/link-utils'

type HeroBlock = Extract<Page['blocks'][number], { blockType: 'hero' }>

type HeadingSegment = {
  text: string
  color?: string
  breakOnMobile?: boolean
  breakOnDesktop?: boolean
}

type HeroProps = {
  block: HeroBlock
  upperLinks?: NavbarLink[]
  mainLinks?: NavbarLink[]
}

// Reusable Heading Component
const HeroHeader = ({
  segments,
  className,
  align = 'center',
  useJustifyCenter = false,
  allowWrap = false,
  rowBreakpoint = 'md',
  responsiveMobileLeft = false, // New prop to handle mobile-left/desktop-center logic
}: {
  segments: HeadingSegment[]
  className?: string
  align?: 'center' | 'start'
  useJustifyCenter?: boolean
  allowWrap?: boolean
  rowBreakpoint?: 'md' | 'min-[816px]'
  responsiveMobileLeft?: boolean
}) => {
  
  // Calculate Alignment Classes
  let containerAlign = ''
  if (responsiveMobileLeft) {
    // Mobile: Start/Left, Desktop: Center/Center
    containerAlign = 'items-start text-left md:items-center md:text-center'
  } else {
    // Standard behavior based on align prop
    containerAlign = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  }

  // Calculate Justify Classes
  let justifyClass = ''
  if (useJustifyCenter) {
    if (responsiveMobileLeft) {
      // Mobile: Start, Desktop: Center
      justifyClass = 'justify-start md:justify-center'
    } else {
      // Always Center
      justifyClass = 'justify-center'
    }
  }

  // Define when the "break element" should appear (independent logic)
  const desktopPrefix = rowBreakpoint === 'min-[816px]' ? 'min-[816px]:' : 'md:'

  return (
    <h1 className={className}>
      <div
        className={`
          flex flex-row flex-wrap gap-y-2 gap-x-3 w-full
          ${containerAlign}
          ${justifyClass}
        `}
      >
        {segments.map((segment, idx) => {
          const isUnbreakable = !(allowWrap || segment.breakOnMobile || segment.breakOnDesktop)
          
          // Determine visibility of the invisible break element
          const hasBreak = segment.breakOnMobile || segment.breakOnDesktop

          // Construct class string:
          // 1. Mobile status (block if breakOnMobile, hidden otherwise)
          // 2. Desktop status (overrides mobile via md: prefix)
          const breakElementClass = `
            w-full h-0 basis-full
            ${segment.breakOnMobile ? 'block' : 'hidden'}
            ${desktopPrefix}${segment.breakOnDesktop ? 'block' : 'hidden'}
          `

          return (
            <React.Fragment key={idx}>
              <span
                className={isUnbreakable ? styles.unbreakable : ''}
                style={{
                  ...(segment.color ? { color: segment.color } : {}),
                  ...(allowWrap
                    ? {
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'normal',
                      }
                    : {}),
                }}
              >
                {segment.text}
              </span>
              
              {/* Conditional Invisible Line Break */}
              {hasBreak && (
                <div className={breakElementClass} aria-hidden="true" />
              )}
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
  primaryOpenInNewTab,
  secondaryOpenInNewTab,
  align = 'center',
}: {
  primaryLabel?: string
  primaryLink?: string
  secondaryLabel?: string
  secondaryLink?: string
  onPrimary?: () => void
  onSecondary?: () => void
  primaryClass: string
  secondaryClass: string
  primaryOpenInNewTab?: boolean
  secondaryOpenInNewTab?: boolean
  align?: 'center' | 'start'
}) => {
  if (!primaryLabel && !secondaryLabel) return null

  const justifyClass = align === 'start' ? 'md:justify-start' : 'md:justify-center'

  return (
    <div className={`mt-6 flex flex-col md:flex-row ${justifyClass} gap-3 md:gap-4 w-full`}>
      {primaryLabel && (
        onPrimary ? (
          <button onClick={onPrimary} className={primaryClass}>
            {primaryLabel}
          </button>
        ) : primaryLink ? (
          (() => {
            const isInternal = isInternalLink(primaryLink) && !primaryOpenInNewTab
            const LinkComponent = isInternal ? Link : 'a'
            const linkProps = isInternal
              ? { href: primaryLink, className: primaryClass }
              : {
                  href: primaryLink,
                  target: primaryOpenInNewTab ? '_blank' : undefined,
                  rel: primaryOpenInNewTab ? 'noopener noreferrer' : undefined,
                  className: primaryClass,
                }
            return <LinkComponent {...linkProps}>{primaryLabel}</LinkComponent>
          })()
        ) : (
          <span className={primaryClass}>
            {primaryLabel}
          </span>
        )
      )}
      {secondaryLabel && (
        onSecondary ? (
          <button onClick={onSecondary} className={secondaryClass}>
            {secondaryLabel}
          </button>
        ) : secondaryLink ? (
          (() => {
            const isInternal = isInternalLink(secondaryLink) && !secondaryOpenInNewTab
            const LinkComponent = isInternal ? Link : 'a'
            const linkProps = isInternal
              ? { href: secondaryLink, className: secondaryClass }
              : {
                  href: secondaryLink,
                  target: secondaryOpenInNewTab ? '_blank' : undefined,
                  rel: secondaryOpenInNewTab ? 'noopener noreferrer' : undefined,
                  className: secondaryClass,
                }
            return <LinkComponent {...linkProps}>{secondaryLabel}</LinkComponent>
          })()
        ) : (
          <span className={secondaryClass}>
            {secondaryLabel}
          </span>
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
  const isBlog = variant === 'blog'

  // 1. Resolve Background
  const defaultBg = '/img/hero_section_background.png'
  const backgroundImageUrl =
    typeof block.backgroundImage === 'object' && block.backgroundImage?.url
      ? block.backgroundImage.url
      : typeof block.backgroundImage === 'string'
        ? block.backgroundImage
        : undefined
  const backgroundVideoUrl =
    typeof block.backgroundVideo === 'object' && block.backgroundVideo?.url
      ? block.backgroundVideo.url
      : typeof block.backgroundVideo === 'string'
        ? block.backgroundVideo
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
  }
  // DEFAULTS REMOVED

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
    else if (isBlog) sub = 'Explore market reports and investment spotlights designed to guide confident decisions.'
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

  // Resolve CTA links using the new linkType structure
  const primaryCtaLink = resolveLinkUrl({
    linkType: (block as any).ctaPrimaryLinkType,
    page: (block as any).ctaPrimaryPage,
    customUrl: (block as any).ctaPrimaryCustomUrl,
    ctaPrimaryLink: (block as any).ctaPrimaryLink, // Legacy support
  })

  const secondaryCtaLink = resolveLinkUrl({
    linkType: (block as any).ctaSecondaryLinkType,
    page: (block as any).ctaSecondaryPage,
    customUrl: (block as any).ctaSecondaryCustomUrl,
    ctaSecondaryLink: (block as any).ctaSecondaryLink, // Legacy support
  })

  const primaryCtaOpenInNewTab = shouldOpenInNewTab({
    ctaPrimaryLinkType: (block as any).ctaPrimaryLinkType,
    ctaPrimaryOpenInNewTab: (block as any).ctaPrimaryOpenInNewTab,
  })

  const secondaryCtaOpenInNewTab = shouldOpenInNewTab({
    ctaSecondaryLinkType: (block as any).ctaSecondaryLinkType,
    ctaSecondaryOpenInNewTab: (block as any).ctaSecondaryOpenInNewTab,
  })

  return {
    segments,
    subheading: sub,
    primaryCta,
    primaryCtaLink: primaryCtaLink !== '#' ? primaryCtaLink : undefined,
    primaryCtaOpenInNewTab,
    secondaryCta,
    secondaryCtaLink: secondaryCtaLink !== '#' ? secondaryCtaLink : undefined,
    secondaryCtaOpenInNewTab,
    finalImage,
    backgroundVideoUrl,
    isFullWidthColor,
    isSplit,
    isAgent,
    isBlog,
    agentEmail: block.agentEmail || undefined,
    agentPhone: block.agentPhone || undefined,
    agentLinkedin: block.agentLinkedin || undefined,
    // Blog specific
    blogAuthor: block.blogAuthor
      ? typeof block.blogAuthor === 'object' && block.blogAuthor !== null
        ? (block.blogAuthor as any).email || (block.blogAuthor as any).name || 'Unknown Author'
        : block.blogAuthor
      : undefined,
    blogDate: block.blogDate,
    blogCategories: block.blogCategories
      ? Array.isArray(block.blogCategories)
        ? block.blogCategories.map((cat: any) =>
            typeof cat === 'object' && cat !== null ? cat.name || cat : cat
          )
        : []
      : [],
  }
}

/**
 * Blog Layout
 * Matches the specific screenshot design: Left Text, Right Rounded Image, Breadcrumbs, Tags
 */
const BlogLayout = (
  props: HeroProps & ReturnType<typeof resolveHeroContent> & { menuOpen: boolean; setMenuOpen: (v: boolean) => void },
) => {
  const {
    segments,
    subheading,
    finalImage,
    blogAuthor,
    blogDate,
    blogCategories,
    menuOpen,
    setMenuOpen,
    upperLinks,
    mainLinks,
  } = props

  // Format date if present - using deterministic formatting to avoid hydration mismatch
  const formattedDate = blogDate
    ? (() => {
        const date = new Date(blogDate)
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ]
        const month = months[date.getUTCMonth()]
        const day = date.getUTCDate()
        const year = date.getUTCFullYear()
        return `${month} ${day}, ${year}`
      })()
    : ''

  return (
    <div className="relative w-full bg-[var(--strong-green)] text-white overflow-hidden min-h-screen lg:min-h-0">
      <div className="absolute inset-x-0 top-0 z-30">
        <Navbar upperLinks={upperLinks} mainLinks={mainLinks} />
      </div>

      <div className="container mx-auto px-6 pt-[120px] pb-16 md:py-20 md:pt-[220px]">
        {/* Center items vertically so left and right columns are aligned */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left: Text Content */}
          <div className="flex-1 flex flex-col justify-center w-full min-w-0 order-1 lg:order-1">
            {/* Breadcrumbs */}
            <div className="mb-6 text-xs font-bold tracking-[0.15em] uppercase text-white/60">
              Home <span className="mx-2">›</span> Insights & Research <span className="mx-2">›</span> Article
            </div>

            {/* Heading */}
            <div className="mb-8 w-full">
               <HeroHeader 
                  segments={segments} 
                  className="text-5xl lg:text-7xl font-serif leading-[1.1] mb-6 text-left w-full" 
                  align="start"
                  allowWrap={true}
                />
            </div>

            {/* Subheading */}
            {subheading && (
              <p className="text-xl text-white/90 font-light leading-relaxed mb-12">
                {subheading}
              </p>
            )}

            {/* Footer Metadata Row */}
            <div className="mt-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-t border-white/10 pt-8 lg:border-none lg:pt-0">
              {/* Author & Date */}
              <div className="flex flex-col gap-1">
                {blogAuthor && <span className="font-bold text-base">{blogAuthor}</span>}
                {formattedDate && <span className="text-white/60 text-sm">{formattedDate}</span>}
              </div>

              {/* Tags */}
              {blogCategories && blogCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blogCategories.map((category, i) => {
                    const categoryName = typeof category === 'object' && category !== null
                      ? (category as any).name || String(category)
                      : String(category)
                    return (
                      <span 
                        key={i} 
                        className="px-4 py-1.5 bg-[#F2F4E6] text-[#0F231D] text-xs font-bold uppercase tracking-wide rounded-md"
                      >
                        {categoryName}
                      </span>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right: Image - Fixed Square Size */}
          <div className="relative w-full max-w-lg lg:max-w-xl aspect-square shrink-0 order-2 lg:order-2">
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center rounded-3xl overflow-hidden shadow-2xl"
              style={{ backgroundImage: `url('${finalImage}')` }}
            >
              <div className="absolute inset-0 bg-black/10" aria-hidden />
            </div>

            {/* Mobile Menu Trigger (Centered in the square image on mobile) */}
            <div className="lg:hidden absolute inset-0 flex items-center justify-center z-20">
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
    </div>
  )
}

/**
 * Split View ('split', 'agent')
 * Left side text, Right side image.
 */
const SideBySideLayout = (
  props: HeroProps & ReturnType<typeof resolveHeroContent> & { menuOpen: boolean; setMenuOpen: (v: boolean) => void },
) => {
  const {
    isAgent,
    segments,
    subheading,
    primaryCta,
    primaryCtaLink,
    primaryCtaOpenInNewTab,
    secondaryCta,
    secondaryCtaLink,
    secondaryCtaOpenInNewTab,
    finalImage,
    agentEmail,
    agentPhone,
    agentLinkedin,
    menuOpen,
    setMenuOpen,
    upperLinks,
    mainLinks,
  } = props

  const containerBg = 'bg-[var(--strong-green)]'

  // Styling configuration - same for both split and agent variants
  const headingClass = `${styles.splitHeading} text-left mb-4 z-10 relative leading-tight`
  const subClass = `${styles.splitSubheading} text-white/90 font-light w-full md:max-w-xl text-left leading-relaxed`
  const btnPrimaryClass = 'bg-[#DAE684] text-[#0F231D] font-semibold hover:bg-[#cdd876] transition-colors rounded-full px-8 py-3 text-base w-full md:w-auto text-center'
  const btnSecondaryClass = 'border border-white bg-[var(--strong-green)] text-white font-semibold hover:bg-white/10 transition-colors rounded-full px-8 py-3 text-base w-full md:w-auto flex items-center justify-center'

  return (
    <div className={`relative w-full ${containerBg}`}>
      <div className="absolute inset-x-0 top-0 z-30">
        <Navbar upperLinks={upperLinks} mainLinks={mainLinks} />
      </div>

      <div className="relative w-full flex flex-col md:flex-row">
        {/* Left Content */}
        <div
          className={`
            relative w-full md:w-1/2 ${containerBg} text-white 
            px-6 sm:px-10 md:px-14 lg:px-16 
            pt-[120px] pb-16 
            md:pt-60 md:pb-40
            flex flex-col justify-center items-center
          `}
        >
          <div className="w-full max-w-2xl flex flex-col gap-6">
            <div className="w-full">
              <HeroHeader segments={segments} className={headingClass} align="start" allowWrap={isAgent} />

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
              primaryLink={primaryCtaLink ?? undefined}
              primaryOpenInNewTab={primaryCtaOpenInNewTab}
              secondaryLabel={secondaryCta}
              secondaryLink={secondaryCtaLink ?? undefined}
              secondaryOpenInNewTab={secondaryCtaOpenInNewTab}
              primaryClass={btnPrimaryClass}
              secondaryClass={btnSecondaryClass}
              align="start"
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
    primaryCtaOpenInNewTab,
    secondaryCta,
    secondaryCtaLink,
    secondaryCtaOpenInNewTab,
    finalImage,
    backgroundVideoUrl,
    menuOpen,
    setMenuOpen,
    upperLinks,
    mainLinks,
  } = props

  const [videoReady, setVideoReady] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  // Check if video should be used (only for default variant, not full-width-color)
  const useVideo = !isFullWidthColor && backgroundVideoUrl && !videoError

  // Handle video load - use loadeddata event for faster, more reliable detection
  React.useEffect(() => {
    if (useVideo && videoRef.current) {
      const video = videoRef.current
      
      const handleLoadedData = () => {
        // Video has loaded enough data to start playing
        setVideoReady(true)
      }

      const handleCanPlayThrough = () => {
        // Video can play through without buffering
        setVideoReady(true)
      }

      const handleError = () => {
        setVideoError(true)
        setVideoReady(false)
      }

      // Check if video element is supported (canPlayType returns '' if not supported)
      const canPlayMp4 = video.canPlayType('video/mp4')
      const canPlayWebm = video.canPlayType('video/webm')
      
      if (canPlayMp4 === '' && canPlayWebm === '') {
        // Browser doesn't support video formats
        setVideoError(true)
      } else {
        // Use loadeddata for faster initial display, canplaythrough as backup
        video.addEventListener('loadeddata', handleLoadedData, { once: true })
        video.addEventListener('canplaythrough', handleCanPlayThrough, { once: true })
        video.addEventListener('error', handleError)
        
        // Try to load the video
        video.load()
      }

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData)
        video.removeEventListener('canplaythrough', handleCanPlayThrough)
        video.removeEventListener('error', handleError)
      }
    }
  }, [useVideo])

  // Styling configuration
  const wrapperClass = `
    relative w-full overflow-hidden
    ${isFullWidthColor ? 'bg-[var(--strong-green)]' : 'md:h-[700px] md:min-h-[700px]'}
  `

  // Default variant: centered on mobile and desktop
  // FullWidth variant: left on mobile, center on desktop
  const headingClass = isFullWidthColor
    ? `${styles.meybohmHeading} text-left md:text-center mb-6 mt-0 md:mt-30 w-full max-w-none`
    : `text-white text-4xl md:text-7xl font-bold mb-6 ${styles.heroHeading} w-full text-center`

  // Default variant: centered on mobile and desktop
  // FullWidth variant: left on mobile, center on desktop
  const subClass = isFullWidthColor
    ? `${styles.meybohmSubheading} max-w-4xl mx-auto text-left md:text-center`
    : `${styles.heroSubheading} w-full text-center max-w-[1200px] max-[1150px]:max-w-[800px] max-[768px]:max-w-[400px]`

  const btnPrimaryClass = 'sale-button px-6 py-3 text-base w-full md:w-auto shadow-md block md:inline-block text-center'
  const btnSecondaryClass = 'px-6 py-3 rounded-full border border-white/70 bg-[var(--strong-green)] text-white w-full md:w-auto hover:bg-white/10 transition text-base flex items-center justify-center'

  return (
    <>
      <div className={wrapperClass}>
        {/* Background Image - shown until video is ready or as fallback */}
        {finalImage && (!useVideo || !videoReady) && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${finalImage}')` }}
          />
        )}

        {/* Background Video - always rendered but hidden until ready */}
        {useVideo && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover ${
              videoReady ? 'opacity-100' : 'opacity-0'
            }`}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source src={backgroundVideoUrl} type="video/mp4" />
            <source src={backgroundVideoUrl} type="video/webm" />
          </video>
        )}

        {!isFullWidthColor && <div className="absolute inset-0 bg-black/40" />}

        <div className="relative z-10 flex flex-col h-full pb-10">
          <Navbar upperLinks={upperLinks} mainLinks={mainLinks} />

          <div className={`mt-10 md:mt-0 md:flex-1 md:flex md:flex-col md:items-center md:justify-center px-6 flex flex-col ${isFullWidthColor ? 'items-start md:items-center text-left md:text-center gap-6' : 'items-center text-center'}`}>
            
            {/* 
              UPDATED: 
              1. Default variant: centered on mobile and desktop
              2. FullWidth variant: left on mobile, center on desktop
            */}
            <HeroHeader 
              segments={segments} 
              className={headingClass} 
              align="center" 
              useJustifyCenter={true} 
              rowBreakpoint={isFullWidthColor ? 'md' : 'md'}
              responsiveMobileLeft={isFullWidthColor}
            />

            {subheading && <p className={subClass}>{subheading}</p>}

            <ActionButtons
              primaryLabel={primaryCta}
              primaryLink={primaryCtaLink ?? undefined}
              primaryOpenInNewTab={primaryCtaOpenInNewTab}
              secondaryLabel={secondaryCta}
              secondaryLink={secondaryCtaLink ?? undefined}
              secondaryOpenInNewTab={secondaryCtaOpenInNewTab}
              primaryClass={btnPrimaryClass}
              secondaryClass={btnSecondaryClass}
            />
          </div>

          <div className="md:hidden flex justify-center mt-8 px-6">
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

export default function Hero({ block, upperLinks = [], mainLinks = [] }: HeroProps) {
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
      {content.isBlog ? (
        <BlogLayout 
          block={block}
          {...content}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          upperLinks={upperLinks}
          mainLinks={mainLinks}
        />
      ) : isSideBySide ? (
        <SideBySideLayout
          block={block}
          {...content}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          upperLinks={upperLinks}
          mainLinks={mainLinks}
        />
      ) : (
        <CenteredLayout
          block={block}
          {...content}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          upperLinks={upperLinks}
          mainLinks={mainLinks}
        />
      )}

      <CollapsingMenuMobile open={menuOpen} onClose={() => setMenuOpen(false)} mainLinks={mainLinks} />
    </div>
  )
}