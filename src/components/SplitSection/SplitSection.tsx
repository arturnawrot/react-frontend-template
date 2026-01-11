import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Page } from '@/payload-types'
import Arrow from '../Arrow/Arrow'
import { resolveLinkUrl, shouldOpenInNewTab } from '@/utils/linkResolver'
import { isInternalLink } from '@/utils/link-utils'

type SplitSectionBlock = Extract<Page['blocks'][number], { blockType: 'splitSection' }>

interface SplitSectionProps {
  block: SplitSectionBlock
}

export default function SplitSection({ block }: SplitSectionProps) {
  const image = typeof block.image === 'object' && block.image !== null ? block.image : null
  const imageUrl = image?.url || (typeof block.image === 'string' ? block.image : '')
  const imageAlt = block.imageAlt || 'Section image'
  const isReversed = block.isReversed || false
  const header = block.header || ''
  const paragraph = block.paragraph || ''
  const bulletPoints = block.bulletPoints || []
  const linkText = block.linkText
  const linkHref = resolveLinkUrl(block as any)
  const openInNewTab = shouldOpenInNewTab(block as any)

  return (
    <section className="w-full px-4 sm:px-6 md:px-8">
      <div 
        className={`
          max-w-[1380px] mx-auto 
          flex flex-col gap-8 sm:gap-12 md:gap-16 lg:gap-20 xl:gap-30 items-center 
          ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'}
        `}
      >
        {/* Image Column */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-start">
          <div className="relative overflow-hidden rounded-2xl shadow-lg w-full max-w-[480px] md:max-w-[720px] aspect-[4/3]">
            <Image 
              src={imageUrl} 
              alt={imageAlt} 
              fill
              className="object-cover transform hover:scale-105 transition-transform duration-700 ease-out" 
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Content Column */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-0 sm:px-4 md:px-0 max-w-[480px]">
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1a2e2a] leading-tight">
              {header}
            </h2>
            
            {paragraph && (
              <p 
                className="text-[#1a2e2a]"
                style={{
                  fontFamily: '"GT America Condensed", sans-serif',
                  fontWeight: 400,
                  fontSize: 'var(--xl)',
                  lineHeight: '27px',
                  letterSpacing: '0px',
                }}
              >
                {paragraph}
              </p>
            )}
            
            {bulletPoints.length > 0 && (
              <ul className="space-y-2 text-gray-700 font-medium text-base sm:text-lg">
                {bulletPoints.map((point, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="w-1 h-1 bg-gray-800 rounded-full flex-shrink-0"></span>
                    <span>{point.text}</span>
                  </li>
                ))}
              </ul>
            )}

            {linkText && linkHref && (
              <div className="pt-2 sm:pt-3 md:pt-4">
                {(() => {
                  const isInternal = isInternalLink(linkHref) && !openInNewTab
                  const LinkComponent = isInternal ? Link : 'a'
                  const linkProps = isInternal
                    ? { href: linkHref, className: 'inline-flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-[#1a2e2a] transition-colors border-b border-transparent hover:border-gray-800 pb-0.5' }
                    : {
                        href: linkHref,
                        target: openInNewTab ? '_blank' : undefined,
                        rel: openInNewTab ? 'noopener noreferrer' : undefined,
                        className: 'inline-flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-[#1a2e2a] transition-colors border-b border-transparent hover:border-gray-800 pb-0.5',
                      }
                  return (
                    <LinkComponent {...linkProps}>
                      {linkText}
                      <Arrow direction="right" variant="fill" size={16} />
                    </LinkComponent>
                  )
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

