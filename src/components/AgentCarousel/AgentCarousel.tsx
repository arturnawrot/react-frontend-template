'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Page, Media } from '@/payload-types'
import Arrow from '../Arrow/Arrow'
import { resolveLinkUrl, shouldOpenInNewTab } from '@/utils/linkResolver'
import { isInternalLink } from '@/utils/link-utils'
import { CONTAINER_MAX_WIDTH_CLASS, CONTAINER_PADDING_X } from '@/utils/constants'

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

export default function AgentCarousel({ block }: AgentCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  const agents = block.agents || []
  
  // Replicate list 3 times to create a buffer for infinite scrolling
  const extendedAgents = [...agents, ...agents, ...agents]
  
  // Start at the beginning of the middle set
  const initialIndex = agents.length > 0 ? agents.length : 0
  if (currentIndex === 0 && agents.length > 0) {
    setCurrentIndex(initialIndex)
  }

  // Configuration
  const CARD_WIDTH = 340
  const GAP = 24
  const TRANSITION_DURATION = 500

  const getTransform = () => {
    const shift = currentIndex * (CARD_WIDTH + GAP)
    return `translateX(-${shift}px)`
  }

  const handleNext = useCallback(() => {
    if (isTransitioning || agents.length === 0) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev + 1)
  }, [isTransitioning, agents.length])

  const handlePrev = useCallback(() => {
    if (isTransitioning || agents.length === 0) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev - 1)
  }, [isTransitioning, agents.length])

  // Autoplay Effect
  useEffect(() => {
    if (isPaused || agents.length === 0) return
    
    const timer = setInterval(() => {
      handleNext()
    }, 3000)

    return () => clearInterval(timer)
  }, [handleNext, isPaused, agents.length])

  // Infinite Loop Logic
  const handleTransitionEnd = () => {
    setIsTransitioning(false)

    const totalReal = agents.length
    if (totalReal === 0) return
    
    if (trackRef.current) {
      // If we've scrolled past the middle set into the 3rd set (Clone)
      if (currentIndex >= totalReal * 2) {
        trackRef.current.style.transition = 'none'
        const newIndex = currentIndex - totalReal
        setCurrentIndex(newIndex)
        trackRef.current.style.transform = `translateX(-${newIndex * (CARD_WIDTH + GAP)}px)`
        
        requestAnimationFrame(() => {
           requestAnimationFrame(() => {
              if (trackRef.current) {
                trackRef.current.style.transition = ''
              }
           })
        })
      } 
      
      // If we've scrolled backwards into the 1st set (Clone)
      else if (currentIndex < totalReal) {
        trackRef.current.style.transition = 'none'
        const newIndex = currentIndex + totalReal
        setCurrentIndex(newIndex)
        trackRef.current.style.transform = `translateX(-${newIndex * (CARD_WIDTH + GAP)}px)`
        
        requestAnimationFrame(() => {
           requestAnimationFrame(() => {
              if (trackRef.current) {
                trackRef.current.style.transition = ''
              }
           })
        })
      }
    }
  }

  const preHeading = block.preHeading || 'Meet Our Agents'
  const heading = block.heading || 'Experience that Performs'
  const description = block.description || "We're proud to bring a wealth of knowledge and relational capital to every deal and partnership."
  const linkText = block.linkText || 'Find an Agent'
  const linkHref = resolveLinkUrl(block as any)
  const openInNewTab = shouldOpenInNewTab(block as any)

  if (agents.length === 0) {
    return null
  }

  return (
    <div className="w-full overflow-x-hidden">
      
      <div className={`${CONTAINER_MAX_WIDTH_CLASS} w-full mx-auto ${CONTAINER_PADDING_X} grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center`}>
        
        {/* LEFT SECTION: Content */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8 lg:pr-8 z-10">
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">
            {preHeading}
          </h3>

          <h1 className="text-5xl md:text-6xl font-serif-display text-[#1a2e28] leading-tight">
            {heading}
          </h1>

          <p className="text-gray-600 leading-relaxed text-lg">
            {description}
          </p>

          {linkText && linkHref && (() => {
            const isInternal = isInternalLink(linkHref) && !openInNewTab
            const LinkComponent = isInternal ? Link : 'a'
            const linkProps = isInternal
              ? { href: linkHref, className: 'group inline-flex items-center font-medium text-[#1a2e28] hover:opacity-70 transition-opacity mt-2' }
              : {
                  href: linkHref,
                  target: openInNewTab ? '_blank' : undefined,
                  rel: openInNewTab ? 'noopener noreferrer' : undefined,
                  className: 'group inline-flex items-center font-medium text-[#1a2e28] hover:opacity-70 transition-opacity mt-2',
                }
            return (
              <LinkComponent {...linkProps}>
                {linkText}
                <Arrow direction="right" size="w-4 h-4" className="ml-2 transition-transform group-hover:translate-x-1" />
              </LinkComponent>
            )
          })()}

          {/* Desktop Arrows */}
          <div className="hidden lg:flex gap-4 mt-8">
            <button 
              onClick={() => {
                setIsPaused(true)
                handlePrev()
                setTimeout(() => setIsPaused(false), 5000)
              }}
              className="flex items-center justify-center transition-colors hover:opacity-70 text-[#1a2e28]"
            >
              <Arrow direction="left" variant="fill" size="w-6 h-6" />
            </button>
            <button 
              onClick={() => {
                setIsPaused(true)
                handleNext()
                setTimeout(() => setIsPaused(false), 5000)
              }}
              className="flex items-center justify-center transition-colors hover:opacity-70 text-[#1a2e28]"
            >
              <Arrow direction="right" variant="fill" size="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* RIGHT SECTION: Infinite Slider */}
        <div className="lg:col-span-8 relative h-[450px] md:h-[500px]">
          <div className="absolute left-0 top-0 h-full w-screen overflow-hidden">
            <div 
              ref={trackRef}
              className="flex gap-6 h-full will-change-transform"
              style={{ 
                transform: getTransform(),
                transition: isTransitioning ? `transform ${TRANSITION_DURATION}ms ease-in-out` : 'none'
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedAgents.map((agent, index) => {
                const image = typeof agent.image === 'object' && agent.image !== null ? agent.image : null
                const imageUrl = image?.url || ''
                const agentSlug = agent.slug
                const agentHref = agentSlug ? `/agents/${agentSlug}` : '#'
                
                return (
                  <Link
                    key={index}
                    href={agentHref}
                    className="w-[280px] md:w-[340px] h-full relative rounded-2xl overflow-hidden shrink-0 group cursor-pointer block"
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
              })}
            </div>
          </div>
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
            <Arrow direction="left" variant="fill" size="w-6 h-6" />
          </button>
          <button 
            onClick={() => {
              setIsPaused(true)
              handleNext()
              setTimeout(() => setIsPaused(false), 5000)
            }}
            className="flex items-center justify-center hover:opacity-70 text-[#1a2e28] transition-opacity"
          >
            <Arrow direction="right" variant="fill" size="w-6 h-6" />
          </button>
        </div>

      </div>
    </div>
  )
}

