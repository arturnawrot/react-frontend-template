'use client' // Necessary for useState/useEffect hooks

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Page, Media } from '@/payload-types'
import styles from './FlippedM.module.scss'
import { resolveLink, type ResolvedLink } from '@/utils/linkResolver'
import { isInternalLink } from '@/utils/link-utils'
import Container from '@/components/Container/Container'
import SectionHeading from '@/components/SectionHeading/SectionHeading'
import PrimaryButton from '@/components/PrimaryButton'

type FlippedMBlock = Extract<Page['blocks'][number], { blockType: 'flippedM' }>

type BulletPoint = {
  title: string
  description: string
  image?: string | Media | null // Image is now per bullet point
  linkText?: string | null
  linkHref?: string | null
  openInNewTab?: boolean
}

type FlippedMProps = {
  block: FlippedMBlock
}

const BulletPointComponent = ({
  title,
  description,
  linkText,
  linkHref,
  openInNewTab,
  isLast = false,
  isActive = false,
  setRef, // New prop to pass ref back to parent
}: BulletPoint & { 
  isLast?: boolean; 
  isActive?: boolean; 
  setRef?: (el: HTMLDivElement | null) => void 
}) => {
  const headingClasses = [
    styles.bulletPointHeading,
    'text-2xl',
    'font-bold',
    'mb-2',
    'transition-colors duration-500', // Smooth transition
    !isActive && 'text-gray-300', // Muted color (Tailwind equivalent)
    !isActive && styles.bulletPointHeadingMuted,
  ]
    .filter(Boolean)
    .join(' ')

  const descriptionClasses = [
    styles.bulletPointsubheading,
    'mb-4',
    'transition-colors duration-500', // Smooth transition
    !isActive && 'text-gray-300',
    !isActive && styles.bulletPointsubheadingMuted,
  ]
    .filter(Boolean)
    .join(' ')

  const linkClasses = [
    styles.bulletPointLink,
    'transition-opacity duration-500',
    isActive ? 'opacity-100' : 'opacity-50 pointer-events-none', // Disable interaction if not active? Optional.
    !isActive && styles.bulletPointLinkMuted,
  ]
    .filter(Boolean)
    .join(' ')

  const dotClasses = [
    styles.bulletPointDot,
    'transition-all duration-500',
    isActive ? styles.bulletPointDotActive : styles.bulletPointDotMuted,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex" ref={setRef}>
      {/* Left column: dot + line */}
      <div className="flex flex-col items-center mr-6">
        {/* Dot */}
        <div className={dotClasses}></div>

        {/* Line */}
        {!isLast && (
          <div className={`${styles.bulletPointLineWrapper} h-full`}>
            {isActive && (
              <div 
                className={`${styles.bulletPointLineBlackSegment} transition-all duration-500`} 
                style={{ height: '99%' }} // Animated length based on scroll could go here
              />
            )}
            <div className={styles.bulletPointLineMuted} />
          </div>
        )}
      </div>

      {/* Right column: text */}
      <div className={`${!isLast ? 'pb-24' : 'pb-10'} md:ml-8 max-w-[400px]`}>
        <h2
          className={headingClasses}
          style={{ transform: 'translateY(-4px)' }}
        >
          {title}
        </h2>
        <p className={descriptionClasses}>{description}</p>
        {linkText && linkText.trim() && linkHref && (() => {
          const isInternal = isInternalLink(linkHref) && !openInNewTab
          const LinkComponent = isInternal ? Link : 'a'
          const linkProps = isInternal
            ? { href: linkHref, className: linkClasses }
            : {
                href: linkHref,
                target: openInNewTab ? '_blank' : undefined,
                rel: openInNewTab ? 'noopener noreferrer' : undefined,
                className: linkClasses,
              }
          return (
            <LinkComponent {...linkProps}>
              {linkText} &rarr;
            </LinkComponent>
          )
        })()}
      </div>
    </div>
  )
}

const ProcessSection = ({
  heading,
  subheading,
  bulletPoints,
  ctaText,
  ctaLink,
}: {
  heading: React.ReactNode
  subheading?: string | null
  bulletPoints: BulletPoint[]
  ctaText?: string | null
  ctaLink?: ResolvedLink
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const options = {
      root: null,
      // Slightly relaxed margin to catch elements earlier/smoother
      rootMargin: '-50% 0px -50% 0px', 
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      // 1. Filter to find only elements currently inside our active zone
      const visibleEntries = entries.filter((entry) => entry.isIntersecting)

      if (visibleEntries.length > 0) {
        // 2. Reduce to find the entry closest to the middle of the viewport
        const bestCandidate = visibleEntries.reduce((prev, current) => {
          const viewportCenter = window.innerHeight / 2
          
          // Calculate distance of the previous best candidate's center to viewport center
          const prevRect = prev.boundingClientRect
          const prevCenter = prevRect.top + prevRect.height / 2
          const prevDiff = Math.abs(viewportCenter - prevCenter)

          // Calculate distance of the current candidate's center to viewport center
          const currentRect = current.boundingClientRect
          const currentCenter = currentRect.top + currentRect.height / 2
          const currentDiff = Math.abs(viewportCenter - currentCenter)

          // Return the one closer to the center
          return currentDiff < prevDiff ? current : prev
        })

        // 3. Set the active index based on the winner
        const index = itemRefs.current.indexOf(bestCandidate.target as HTMLDivElement)
        if (index !== -1) {
          setActiveIndex(index)
        }
      }
    }, options)

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      itemRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [bulletPoints])

  return (
    <Container className="relative w-full flex flex-col">
      {/* SVG Background */}
      <div className="absolute inset-0 md:left-1/2 pointer-events-none z-10">
        <Image
          src="/svg/flipped-m.svg"
          alt=""
          width={1200}
          height={1600}
          className="absolute top-0 left-[-15%] w-auto h-auto"
          style={{ maxWidth: 'none', maxHeight: 'none' }}
        />
      </div>

      {/* Heading & Subheading */}
      <div className="relative z-40 mx-auto md:mx-0 max-w-md px-5 md:px-0 mt-20 mb-12">
        <SectionHeading>
          {heading}
        </SectionHeading>
        {subheading && (
          <p className={`${styles.subheading} text-base md:text-lg mt-4 max-w-[400px]`}>
            {subheading}
          </p>
        )}
      </div>

      {/* Content Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left Column - Bullets (Scrollable) */}
          <div className="max-w-[450px] mx-auto md:mx-0 order-2 md:order-1">
            {bulletPoints.map((bp, index) => (
              <BulletPointComponent
                key={index}
                {...bp}
                isLast={index === bulletPoints.length - 1}
                isActive={index === activeIndex}
                setRef={(el) => (itemRefs.current[index] = el)}
              />
            ))}
            
            {ctaText && ctaLink?.href && (
              <div className="mt-10 mb-20 md:ml-14">
                <PrimaryButton link={ctaLink} className="font-bold inline-block">
                  {ctaText}
                </PrimaryButton>
              </div>
            )}
          </div>

          {/* Right Column - Images (Sticky) */}
          <div className="hidden md:block order-1 md:order-2 h-full">
            <div className="sticky top-1/3 min-h-[500px] w-full flex justify-center items-start">
              
              {bulletPoints.map((bp, index) => {
                // Resolve Image URL
                let imageUrl = '/img/amazon_fc.png' // fallback
                let imageWidth = 636
                let imageHeight = 636

                if (typeof bp.image === 'string') {
                    imageUrl = bp.image
                } else if (bp.image && typeof bp.image === 'object' && 'url' in bp.image) {
                    imageUrl = bp.image.url || '/img/amazon_fc.png'
                    imageWidth = bp.image.width || 636
                    imageHeight = bp.image.height || 636
                }

                return (
                  <div
                    key={index}
                    className={`absolute transition-opacity duration-500 ease-in-out ${
                      index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  >
                    <Image
                      src={imageUrl}
                      alt={bp.title || ''}
                      width={imageWidth}
                      height={imageHeight}
                      className="object-contain rounded-xl shadow-lg"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </Container>
  )
}

export default function FlippedM({ block }: FlippedMProps) {
  // Render heading
  const heading = block.heading ? (
    <span>
      {block.heading.split('\n').map((line, index, array) => (
        <React.Fragment key={index}>
          {line}
          {index < array.length - 1 && <br />}
        </React.Fragment>
      ))}
    </span>
  ) : (
    <span>
      Built on more than <br />
      transactions.
    </span>
  )

  // Transform bullet points - resolve links for each
  const bulletPoints = (block.bulletPoints || []).map((bp: any) => {
    const bpLink = resolveLink(bp)
    return {
      ...bp,
      linkHref: bpLink.href,
      openInNewTab: bpLink.openInNewTab,
    }
  })

  // Resolve CTA link
  const ctaLink = resolveLink(block as any)

  return (
    <div>
      <ProcessSection
        heading={heading}
        subheading={block.subheading}
        bulletPoints={bulletPoints}
        ctaText={block.ctaText}
        ctaLink={ctaLink}
      />
    </div>
  )
}