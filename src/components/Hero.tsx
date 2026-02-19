'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Linkedin } from 'lucide-react'
import Navbar from './Navbar/Navbar'
import type { NavbarLinkWithDropdown } from '@/utils/navbar'
import CollapsingMenuMobile from './CollapsingMenuMobile/CollapsingMenuMobile'
import PrimaryButton from './PrimaryButton/PrimaryButton'
import SecondaryButton from './PrimaryButton/SecondaryButton'
import type { Page } from '@/payload-types'
import styles from './Hero.module.scss'
import { resolvePrefixedLink, type ConstantLinksMap, type ResolvedLink } from '@/utils/linkResolver'
import { isInternalLink } from '@/utils/link-utils'
import FormCard from './FormCard/FormCard'
// Import the new component (adjust path as needed)
import { CustomHtml } from '@/components/CustomHtml/CustomHtml'
import CopyableContactLink from '@/components/CopyableContactLink'

type HeroBlock = Extract<Page['blocks'][number], { blockType: 'hero' }>

type HeadingSegment = {
  text: string
  color?: string
  breakOnMobile?: boolean
  breakOnDesktop?: boolean
}

type HeroProps = {
  block: HeroBlock
  upperLinks?: NavbarLinkWithDropdown[]
  mainLinks?: NavbarLinkWithDropdown[]
  dropdownQuote?: import('@/utils/navbar').DropdownQuote
  constantLinksMap?: ConstantLinksMap
}

// Reusable Heading Component
const HeroHeader = ({
  segments,
  className,
  align = 'center',
  useJustifyCenter = false,
  allowWrap = false,
  rowBreakpoint = 'md',
  responsiveMobileLeft = false,
}: {
  segments: HeadingSegment[]
  className?: string
  align?: 'center' | 'start'
  useJustifyCenter?: boolean
  allowWrap?: boolean
  rowBreakpoint?: 'md' | 'min-[816px]'
  responsiveMobileLeft?: boolean
}) => {
  
  let containerAlign = ''
  if (responsiveMobileLeft) {
    containerAlign = 'items-start text-left md:items-center md:text-center'
  } else {
    containerAlign = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  }

  let justifyClass = ''
  if (useJustifyCenter) {
    if (responsiveMobileLeft) {
      justifyClass = 'justify-start md:justify-center'
    } else {
      justifyClass = 'justify-center'
    }
  }

  const desktopPrefix = rowBreakpoint === 'min-[816px]' ? 'min-[816px]:' : 'md:'

  return (
    <h1 className={className}>
      <div
        className={`
          flex flex-row flex-wrap gap-y-0.5 gap-x-3 w-full
          ${containerAlign}
          ${justifyClass}
        `}
      >
        {segments.map((segment, idx) => {
          const isUnbreakable = !(allowWrap || segment.breakOnMobile || segment.breakOnDesktop)
          const hasBreak = segment.breakOnMobile || segment.breakOnDesktop
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
  primaryClassName,
  secondaryClassName,
  align = 'center',
}: {
  primaryLabel?: string
  primaryLink?: ResolvedLink
  secondaryLabel?: string
  secondaryLink?: ResolvedLink
  onPrimary?: () => void
  onSecondary?: () => void
  primaryClassName?: string
  secondaryClassName?: string
  align?: 'center' | 'start'
}) => {
  const hasPrimary = primaryLabel && (onPrimary || primaryLink?.href)
  const hasSecondary = secondaryLabel && (onSecondary || secondaryLink?.href)
  
  if (!hasPrimary && !hasSecondary) return null

  const justifyClass = align === 'start' ? 'md:justify-start' : 'md:justify-center'

  return (
    <div className={`mt-6 flex flex-col md:flex-row md:flex-wrap ${justifyClass} gap-3 md:gap-4 w-full`}>
      {hasPrimary && (
        <PrimaryButton
          href={primaryLink?.href ?? null}
          onClick={onPrimary}
          openInNewTab={primaryLink?.openInNewTab}
          className={primaryClassName}
          fullWidth
          disabled={primaryLink?.disabled}
        >
          {primaryLabel}
        </PrimaryButton>
      )}
      {hasSecondary && (
        <SecondaryButton
          href={secondaryLink?.href ?? null}
          onClick={onSecondary}
          openInNewTab={secondaryLink?.openInNewTab}
          className={secondaryClassName}
          fullWidth
          disabled={secondaryLink?.disabled}
        >
          {secondaryLabel}
        </SecondaryButton>
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
        <CopyableContactLink
          type="email"
          value={email}
          className={linkClass}
          tooltipBgClass="bg-white"
          tooltipTextClass="text-[#1a2e2a]"
        />
      )}
      {phone && (
        <CopyableContactLink
          type="phone"
          value={phone}
          className={linkClass}
          tooltipBgClass="bg-white"
          tooltipTextClass="text-[#1a2e2a]"
        />
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

const resolveHeroContent = (block: HeroBlock, constantLinksMap?: ConstantLinksMap) => {
  const variant = block.variant || 'default'
  const isFullWidthColor = variant === 'full-width-color'
  const isSplit = variant === 'split'
  const isAgent = variant === 'agent'
  const isBlog = variant === 'blog'

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

  let segments: HeadingSegment[] = []
  if (block.headingSegments && block.headingSegments.length > 0) {
    segments = block.headingSegments.map((seg) => ({
      text: seg.text || '',
      color: seg.color || undefined,
      breakOnMobile: seg.breakOnMobile || false,
      breakOnDesktop: seg.breakOnDesktop || false,
    }))
  }

  let sub = block.subheading
  if (!sub) {
    if (isFullWidthColor)
      sub = "Approach every deal confidently, knowing you're backed by analytical excellence, investment foresight, and personal care."
    else if (isSplit)
      sub = 'From investment acquisitions to site selection, we find opportunities that align with your best interests.'
    else if (isAgent) sub = 'Agent & Broker'
    else if (isBlog) sub = 'Explore market reports and investment spotlights designed to guide confident decisions.'
    else
      sub = 'Advisory-led commercial real estate solutions across the Southeast. Rooted in partnership. Driven by performance. Informed by perspective.'
  }

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

  // Unified link resolution - one call returns href, openInNewTab, and disabled
  const primaryCtaLinkData = resolvePrefixedLink(block as Record<string, unknown>, 'ctaPrimary', constantLinksMap)
  const secondaryCtaLinkData = resolvePrefixedLink(block as Record<string, unknown>, 'ctaSecondary', constantLinksMap)

  let splitCustomHTML: string | undefined = undefined
  if (isSplit && (block as any).splitCustomHTML) {
    const customHTML = (block as any).splitCustomHTML
    if (typeof customHTML === 'object' && customHTML !== null && customHTML.html) {
      splitCustomHTML = customHTML.html
    }
  }

  return {
    segments,
    subheading: sub,
    primaryCta,
    primaryCtaLink: primaryCtaLinkData,
    secondaryCta,
    secondaryCtaLink: secondaryCtaLinkData,
    finalImage,
    backgroundVideoUrl,
    isFullWidthColor,
    isSplit,
    isAgent,
    isBlog,
    agentEmail: block.agentEmail || undefined,
    agentPhone: block.agentPhone || undefined,
    agentLinkedin: block.agentLinkedin || undefined,
    splitCustomHTML,
    blogAuthor: block.blogAuthor
      ? typeof block.blogAuthor === 'object' && block.blogAuthor !== null
        ? (block.blogAuthor as any).username || (block.blogAuthor as any).email || (block.blogAuthor as any).name || 'Unknown Author'
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
    dropdownQuote,
  } = props

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
        <Navbar upperLinks={upperLinks} mainLinks={mainLinks} dropdownQuote={dropdownQuote} />
      </div>

      <div className="container mx-auto px-6 pt-[120px] pb-16 md:py-20 md:pt-[220px]">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 flex flex-col justify-center w-full min-w-0 order-1 lg:order-1">
            <div className="mb-6 text-xs font-bold tracking-[0.15em] uppercase text-white/60">
              Home <span className="mx-2">›</span> Insights & Research <span className="mx-2">›</span> Article
            </div>
            <div className="mb-8 w-full">
               <HeroHeader 
                  segments={segments} 
                  className="text-5xl lg:text-7xl font-serif leading-[1.1] mb-6 text-left w-full" 
                  align="start"
                  allowWrap={true}
                />
            </div>
            {subheading && (
              <p className="text-xl text-white/90 font-light leading-relaxed mb-12">
                {subheading}
              </p>
            )}
            <div className="mt-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-t border-white/10 pt-8 lg:border-none lg:pt-0">
              <div className="flex flex-col gap-1">
                {blogAuthor && <span className="font-bold text-base">{blogAuthor}</span>}
                {formattedDate && <span className="text-white/60 text-sm">{formattedDate}</span>}
              </div>
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
          <div className="relative w-full max-w-lg lg:max-w-xl aspect-square shrink-0 order-2 lg:order-2">
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center rounded-3xl overflow-hidden shadow-2xl"
              style={{ backgroundImage: `url('${finalImage}')` }}
            >
              <div className="absolute inset-0 bg-[#1C2F2980]" aria-hidden />
            </div>
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
    secondaryCta,
    secondaryCtaLink,
    finalImage,
    agentEmail,
    agentPhone,
    agentLinkedin,
    splitCustomHTML,
    menuOpen,
    setMenuOpen,
    upperLinks,
    mainLinks,
    dropdownQuote,
  } = props

  const containerBg = 'bg-[var(--strong-green)]'
  const headingClass = `${styles.splitHeading} text-left mb-4 z-10 relative leading-tight`
  const subClass = `${styles.splitSubheading} text-white/90 font-light w-full md:max-w-xl text-left leading-relaxed`
  const btnPrimaryClass = '!bg-[#DAE684] !text-[#0F231D] hover:!bg-[#cdd876]'
  const btnSecondaryClass = '!border-white !bg-[var(--strong-green)] !text-white hover:!bg-white/10'

  return (
    <div className={`relative w-full ${containerBg}`}>
      <div className="absolute inset-x-0 top-0 z-30">
        <Navbar upperLinks={upperLinks} mainLinks={mainLinks} dropdownQuote={dropdownQuote} />
      </div>

      <div className="relative w-full flex flex-col md:flex-row">
        {/* Left Content */}
        <div
          className={`
            relative w-full md:w-1/2 ${containerBg} text-white 
            px-6 sm:px-10 md:px-14 lg:px-16 
            pt-[120px] pb-16 
            md:pt-60 md:pb-40
            flex flex-col justify-start items-center
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
              primaryLink={primaryCtaLink}
              secondaryLabel={secondaryCta}
              secondaryLink={secondaryCtaLink}
              primaryClassName={btnPrimaryClass}
              secondaryClassName={btnSecondaryClass}
              align="start"
            />
          </div>
        </div>

        {/* Right Column */}
        <div
          className={`
            relative w-full md:w-1/2 
            px-6 sm:px-10 md:px-14 lg:px-16 
            pt-[120px] pb-16 
            md:pt-40
            flex flex-col justify-center items-center
            bg-cover bg-center min-h-[400px]
          `}
          style={{ backgroundImage: `url('${finalImage}')` }}
        >
          {!isAgent && <div className="absolute inset-0 bg-[#1C2F2980]" aria-hidden />}

          {/* Custom HTML Content */}
          {splitCustomHTML && (
            <FormCard className="relative w-full max-w-2xl z-10">
              {/* Use the new imported component */}
              <CustomHtml html={splitCustomHTML} />
            </FormCard>
          )}

          {/* Mobile Menu Trigger */}
          <div className="md:hidden absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="z-20 bg-[#DAE684] hover:bg-[#cdd876] text-[#0F231D] w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
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
    backgroundVideoUrl,
    menuOpen,
    setMenuOpen,
    upperLinks,
    mainLinks,
    dropdownQuote,
  } = props

  const [videoReady, setVideoReady] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!isFullWidthColor && backgroundVideoUrl && !videoError && videoRef.current) {
      const video = videoRef.current
      
      const handleLoadedData = () => setVideoReady(true)
      const handleCanPlayThrough = () => setVideoReady(true)
      const handleError = () => {
        setVideoError(true)
        setVideoReady(false)
      }

      const canPlayMp4 = video.canPlayType('video/mp4')
      const canPlayWebm = video.canPlayType('video/webm')
      
      if (canPlayMp4 === '' && canPlayWebm === '') {
        setVideoError(true)
      } else {
        video.addEventListener('loadeddata', handleLoadedData, { once: true })
        video.addEventListener('canplaythrough', handleCanPlayThrough, { once: true })
        video.addEventListener('error', handleError)
        video.load()
      }

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData)
        video.removeEventListener('canplaythrough', handleCanPlayThrough)
        video.removeEventListener('error', handleError)
      }
    }
  }, [isFullWidthColor, backgroundVideoUrl, videoError])

  const wrapperClass = 'relative w-full overflow-hidden bg-[var(--strong-green)]'
  const headingClass = isFullWidthColor
    ? `${styles.meybohmHeading} text-left md:text-center w-full mt-0 md:mt-30 max-w-none`
    : `text-white text-4xl md:text-7xl font-bold ${styles.heroHeading} w-full max-w-[400px] md:max-w-none text-left md:text-center`
  const subClass = isFullWidthColor
    ? `${styles.meybohmSubheading} max-w-4xl mx-auto text-left md:text-center`
    : `${styles.heroSubheading} w-full text-left md:text-center max-w-[1200px] max-[1150px]:max-w-[800px] max-[768px]:max-w-[400px]`

  const btnPrimaryClass = 'shadow-md'
  const btnSecondaryClass = '!border-white/70 !bg-[var(--strong-green)] !text-white hover:!bg-white/10'

  return (
    <>
      <div className={wrapperClass}>
        {finalImage && ((isFullWidthColor || !backgroundVideoUrl) || !videoReady) && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${finalImage}')` }}
          />
        )}

        {!isFullWidthColor && backgroundVideoUrl && !videoError && (
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

        {!isFullWidthColor && <div className="absolute inset-0 bg-[#1C2F2980]" />}

        <div className="relative z-10 flex flex-col h-full pb-10 w-full">
          <Navbar upperLinks={upperLinks} mainLinks={mainLinks} dropdownQuote={dropdownQuote} />

          <div className={`${!isFullWidthColor ? 'md:py-50' : ''} mt-10 md:mt-0 md:flex-1 md:flex md:flex-col md:items-center md:justify-center px-6 flex flex-col items-start md:items-center text-left md:text-center gap-6 mx-auto max-w-md md:max-w-none`}>
            <HeroHeader 
              segments={segments} 
              className={headingClass} 
              align="center" 
              useJustifyCenter={true} 
              rowBreakpoint="md"
              responsiveMobileLeft={true}
            />

            {subheading && <p className={subClass}>{subheading}</p>}

            <ActionButtons
              primaryLabel={primaryCta}
              primaryLink={primaryCtaLink}
              secondaryLabel={secondaryCta}
              secondaryLink={secondaryCtaLink}
              primaryClassName={btnPrimaryClass}
              secondaryClassName={btnSecondaryClass}
              align="center"
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

export default function Hero({ block, upperLinks = [], mainLinks = [], dropdownQuote, constantLinksMap }: HeroProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const content = resolveHeroContent(block, constantLinksMap)
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
          dropdownQuote={dropdownQuote}
        />
      ) : isSideBySide ? (
        <SideBySideLayout
          block={block}
          {...content}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          upperLinks={upperLinks}
          mainLinks={mainLinks}
          dropdownQuote={dropdownQuote}
        />
      ) : (
        <CenteredLayout
          block={block}
          {...content}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          upperLinks={upperLinks}
          mainLinks={mainLinks}
          dropdownQuote={dropdownQuote}
        />
      )}
      <CollapsingMenuMobile open={menuOpen} onClose={() => setMenuOpen(false)} mainLinks={mainLinks} />
    </div>
  )
}