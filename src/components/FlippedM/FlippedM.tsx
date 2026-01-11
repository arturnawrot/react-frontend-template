import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Page } from '@/payload-types'
import styles from './FlippedM.module.scss'
import { resolveLinkUrl, shouldOpenInNewTab } from '@/utils/linkResolver'
import { isInternalLink } from '@/utils/link-utils'

type FlippedMBlock = Extract<Page['blocks'][number], { blockType: 'flippedM' }>

type BulletPoint = {
  title: string
  description: string
  linkText?: string | null
  linkHref?: string | null
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
}: BulletPoint & { openInNewTab?: boolean; isLast?: boolean; isActive?: boolean }) => {
  const headingClasses = [
    styles.bulletPointHeading,
    'text-2xl',
    'font-bold',
    'mb-2',
    !isActive && styles.bulletPointHeadingMuted,
  ]
    .filter(Boolean)
    .join(' ')

  const descriptionClasses = [
    styles.bulletPointsubheading,
    'mb-4',
    !isActive && styles.bulletPointsubheadingMuted,
  ]
    .filter(Boolean)
    .join(' ')

  const linkClasses = [
    styles.bulletPointLink,
    isActive ? '' : styles.bulletPointLinkMuted,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex">
      {/* Left column: dot + line */}
      <div className="flex flex-col items-center mr-6">
        {/* Dot */}
        <div
          className={[
            styles.bulletPointDot,
            isActive ? styles.bulletPointDotActive : styles.bulletPointDotMuted,
          ]
            .filter(Boolean)
            .join(' ')}
        ></div>

        {/* Line */}
        {!isLast && (
          <div className={styles.bulletPointLineWrapper}>
            {isActive && <div className={styles.bulletPointLineBlackSegment} />}
            <div className={styles.bulletPointLineMuted} />
          </div>
        )}
      </div>

      {/* Right column: text */}
      <div className={`${!isLast ? 'pb-10' : ''} md:ml-8`}>
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
  image,
  imageWidth,
  imageHeight,
  ctaText,
  ctaHref,
  ctaOpenInNewTab,
}: {
  heading: React.ReactNode
  subheading?: string | null
  bulletPoints: BulletPoint[]
  image: string
  imageWidth?: number | null
  imageHeight?: number | null
  ctaText?: string | null
  ctaHref?: string | null
  ctaOpenInNewTab?: boolean
}) => {
  return (
    <div className="relative w-full flex flex-col max-w-[1500px] mx-auto md:px-15">
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
      <div className="relative z-40 mx-auto md:mx-0 max-w-md px-5 md:px-0 mt-20">
        <h2 className={`${styles.heading}`}>
          {heading}
        </h2>
        {subheading && (
          <p
            className={`${styles.subheading} text-base md:text-lg mt-4 max-w-[400px]`}
          >
            {subheading}
          </p>
        )}
      </div>

      {/* Content Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-0 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-2 items-start">
          {/* Left Column - Bullets */}
          <div className="max-w-[450px] mx-auto md:mx-0 max-w-md">
            {bulletPoints.map((service, index) => (
              <BulletPointComponent
                key={index}
                title={service.title}
                description={service.description}
                linkText={service.linkText}
                linkHref={service.linkHref}
                isLast={index === bulletPoints.length - 1}
                isActive={index === 0} // only first one is "normal"
              />
            ))}
            {ctaText && (
              <div className="mt-30">
                {ctaHref ? (() => {
                  const isInternal = isInternalLink(ctaHref) && !ctaOpenInNewTab
                  const LinkComponent = isInternal ? Link : 'a'
                  const linkProps = isInternal
                    ? { href: ctaHref, className: 'sale-button inline-block' }
                    : {
                        href: ctaHref,
                        target: ctaOpenInNewTab ? '_blank' : undefined,
                        rel: ctaOpenInNewTab ? 'noopener noreferrer' : undefined,
                        className: 'sale-button inline-block',
                      }
                  return <LinkComponent {...linkProps}>{ctaText}</LinkComponent>
                })() : (
                  <span className="sale-button inline-block">
                    {ctaText}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Image */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative max-w-2xl w-fit h-fit">
              <Image
                src={image}
                alt=""
                width={imageWidth || 636}
                height={imageHeight || 636}
                className="object-contain rounded-xl"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FlippedM({ block }: FlippedMProps) {
  // Get image URL and dimensions - handle both string and Media object
  let imageUrl = '/img/amazon_fc.png' // fallback
  let imageWidth: number | null | undefined = undefined
  let imageHeight: number | null | undefined = undefined

  if (typeof block.image === 'string') {
    imageUrl = block.image
  } else if (block.image && typeof block.image === 'object' && 'url' in block.image) {
    imageUrl = block.image.url || '/img/amazon_fc.png'
    imageWidth = block.image.width
    imageHeight = block.image.height
  }

  // Render heading - split by newlines and add <br /> tags
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

  // Transform bullet points to include resolved URLs and openInNewTab
  const bulletPoints = (block.bulletPoints || []).map((bp: any) => ({
    ...bp,
    linkHref: resolveLinkUrl(bp),
    openInNewTab: shouldOpenInNewTab(bp),
  }))

  // Resolve CTA href and openInNewTab
  const ctaHref = resolveLinkUrl({
    linkType: (block as any).linkType,
    page: (block as any).page,
    customUrl: (block as any).customUrl,
    ctaHref: (block as any).ctaHref, // Legacy support
  })
  const ctaOpenInNewTab = shouldOpenInNewTab({
    linkType: (block as any).linkType,
    openInNewTab: (block as any).openInNewTab,
  })

  return (
    <div>
      <ProcessSection
        heading={heading}
        subheading={block.subheading}
        bulletPoints={bulletPoints}
        image={imageUrl}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
        ctaText={block.ctaText}
        ctaHref={ctaHref}
        ctaOpenInNewTab={ctaOpenInNewTab}
      />
    </div>
  )
}
