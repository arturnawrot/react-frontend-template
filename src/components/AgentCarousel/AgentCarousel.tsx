'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Page, Media } from '@/payload-types'
import Arrow from '../Arrow/Arrow'
import { resolveLinkUrl, shouldOpenInNewTab } from '@/utils/linkResolver'
import { isInternalLink } from '@/utils/link-utils'
import Container from '@/components/Container/Container'
import { Carousel, CarouselTrackElement } from '../Carousel'
import styles from './AgentCarousel.module.scss'

type AgentCarouselBlock = Extract<Page['blocks'][number], { blockType: 'agentCarousel' }>

interface Agent {
  name: string
  role: string
  location: string
  image?: Media | string | null
  slug?: string
}

interface AgentCarouselProps {
  block: AgentCarouselBlock & {
    agents?: Agent[] // Added by renderBlocks.tsx when fetching from featuredAgentSetName
  }
}

// Agent Card Component
const AgentCard = ({ agent }: { agent: Agent }) => {
  const image = typeof agent.image === 'object' && agent.image !== null ? agent.image : null
  const imageUrl = image?.url || ''
  const agentSlug = agent.slug
  const agentHref = agentSlug ? `/agents/${agentSlug}` : '#'

  return (
    <Link
      href={agentHref}
      className="w-[280px] md:w-[340px] h-[450px] md:h-[500px] relative rounded-2xl overflow-hidden shrink-0 group cursor-pointer block"
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={agent.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 280px, 340px"
          quality={80}
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f1a] via-transparent to-transparent opacity-90" />

      <div className="absolute bottom-0 left-0 p-6 text-white">
        <h3 className="text-2xl font-bold mb-1">{agent.name}</h3>
        <p className="text-sm text-gray-200 tracking-wide uppercase text-[11px]">
          {agent.role} <span className="mx-1 opacity-60">|</span> {agent.location}
        </p>
      </div>
    </Link>
  )
}

export default function AgentCarousel({ block }: AgentCarouselProps) {
  const agents = block.agents || []

  const preHeading = block.preHeading || 'Meet Our Agents'
  const heading = block.heading || 'Experience that Performs'
  const description = block.description || "We're proud to bring a wealth of knowledge and relational capital to every deal and partnership."
  const linkText = block.linkText || 'Find an Agent'
  const linkHref = resolveLinkUrl(block as any)
  const openInNewTab = shouldOpenInNewTab(block as any)

  if (agents.length === 0) {
    return null
  }

  const renderItem = (agent: Agent) => <AgentCard agent={agent} />

  const renderLayout = ({ trackElement, renderProps }: CarouselTrackElement) => {
    const { handleNext, handlePrev, setIsPaused } = renderProps

    return (
      <Container className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* LEFT SECTION: Content */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8 lg:pr-8 z-10">
          <h3 className={`${styles.preHeading} text-gray-500`}>
            {preHeading}
          </h3>

          <h1 className={`${styles.heading} text-[#1a2e28]`}>
            {heading}
          </h1>

          <p className={`${styles.description} text-gray-600`}>
            {description}
          </p>

          {linkText && linkHref && (() => {
            const isInternal = isInternalLink(linkHref) && !openInNewTab
            const LinkComponent = isInternal ? Link : 'a'
            const linkClassName = `${styles.link} group inline-flex items-center text-[#1a2e28] hover:opacity-70 transition-opacity mt-2`
            const linkProps = isInternal
              ? { href: linkHref, className: linkClassName }
              : {
                  href: linkHref,
                  target: openInNewTab ? '_blank' : undefined,
                  rel: openInNewTab ? 'noopener noreferrer' : undefined,
                  className: linkClassName,
                }
            return (
              <LinkComponent {...linkProps}>
                {linkText}
                <Arrow direction="right" size="w-4 h-4" className="ml-2 transition-transform group-hover:translate-x-1" />
              </LinkComponent>
            )
          })()}

          {/* Desktop Arrows */}
          <div className="hidden lg:flex gap-4 mt-8 justify-end">
            <button 
              onClick={() => {
                setIsPaused(true)
                handlePrev()
                setTimeout(() => setIsPaused(false), 5000)
              }}
              className="flex items-center justify-center hover:opacity-70 text-[#1a2e28] transition-opacity"
            >
              <Arrow direction="up" variant="triangle" size={12} />
            </button>
            <button 
              onClick={() => {
                setIsPaused(true)
                handleNext()
                setTimeout(() => setIsPaused(false), 5000)
              }}
              className="flex items-center justify-center hover:opacity-70 text-[#1a2e28] transition-opacity"
            >
              <Arrow direction="down" variant="triangle" size={12} />
            </button>
          </div>
        </div>

        {/* RIGHT SECTION: Infinite Slider */}
        <div className="lg:col-span-8 relative h-[450px] md:h-[500px] -mx-5 lg:mx-0">
          {trackElement}
        </div>

        {/* Mobile Arrows */}
        <div className="flex lg:hidden justify-center gap-4 mt-8 col-span-1 w-full">
          <button 
            onClick={() => {
              setIsPaused(true)
              handlePrev()
              setTimeout(() => setIsPaused(false), 5000)
            }}
            className="flex items-center justify-center hover:opacity-70 text-[#1a2e28] transition-opacity"
          >
            <Arrow direction="up" variant="triangle" size={12} />
          </button>
          <button 
            onClick={() => {
              setIsPaused(true)
              handleNext()
              setTimeout(() => setIsPaused(false), 5000)
            }}
            className="flex items-center justify-center hover:opacity-70 text-[#1a2e28] transition-opacity"
          >
            <Arrow direction="down" variant="triangle" size={12} />
          </button>
        </div>
      </Container>
    )
  }

  return (
    <div className="w-full overflow-x-hidden">
      <Carousel
        items={agents}
        renderItem={renderItem}
        config={{
          cardWidth: [280, 340, 340],
          gap: 24,
          autoplay: true,
          autoplayInterval: 3000,
          pauseDuration: 5000,
        }}
        trackClassName="h-full"
        wrapperClassName="absolute left-0 top-0 h-full w-screen"
        renderLayout={renderLayout}
      />
    </div>
  )
}
