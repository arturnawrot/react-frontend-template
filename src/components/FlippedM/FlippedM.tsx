import React from 'react'
import type { Page } from '@/payload-types'
import styles from './FlippedM.module.scss'

type FlippedMBlock = Extract<Page['blocks'][number], { blockType: 'flippedM' }>

type BulletPoint = {
  title: string
  description: string
  linkText: string
  linkHref: string
}

type FlippedMProps = {
  block: FlippedMBlock
}

const BulletPointComponent = ({
  title,
  description,
  linkText,
  linkHref,
  isLast = false,
  isActive = false,
}: BulletPoint & { isLast?: boolean; isActive?: boolean }) => {
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
        <a href={linkHref} className={linkClasses}>
          {linkText} &rarr;
        </a>
      </div>
    </div>
  )
}

const ProcessSection = ({
  heading,
  subheading,
  bulletPoints,
  image,
  ctaText,
  ctaHref,
}: {
  heading: React.ReactNode
  subheading?: string | null
  bulletPoints: BulletPoint[]
  image: string
  ctaText?: string | null
  ctaHref?: string | null
}) => {
  return (
    <div className="relative w-full flex flex-col py-12 md:py-20 min-h-[1600px] max-w-[1500px] mx-auto md:px-15">
      {/* SVG Background */}
      <div className="absolute inset-0 md:left-1/2 pointer-events-none">
        <img
          src="/svg/flipped-m.svg"
          alt=""
          className="absolute top-0 left-[-15%] w-auto h-auto z-0 overflow-hidden"
          style={{ maxWidth: 'none', maxHeight: 'none' }}
        />
      </div>

      {/* Heading & Subheading */}
      <div className="relative z-40 mx-auto md:mx-0 max-w-md px-5 md:px-0 mt-10 md:mt-0">
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
                <a href={ctaHref || '#'} className="sale-button inline-block">
                  {ctaText}
                </a>
              </div>
            )}
          </div>

          {/* Right Column - Image */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-full max-w-2xl">
              <img
                src={image}
                alt=""
                className="w-full h-auto object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FlippedM({ block }: FlippedMProps) {
  // Get image URL - handle both string and Media object
  const imageUrl =
    typeof block.image === 'string'
      ? block.image
      : block.image && typeof block.image === 'object' && 'url' in block.image
        ? block.image.url || '/img/amazon_fc.png'
        : '/img/amazon_fc.png' // fallback

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

  return (
    <div className="overflow-hidden">
      <ProcessSection
        heading={heading}
        subheading={block.subheading}
        bulletPoints={block.bulletPoints || []}
        image={imageUrl}
        ctaText={block.ctaText}
        ctaHref={block.ctaHref}
      />
    </div>
  )
}

