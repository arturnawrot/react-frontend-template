import React from 'react'
import Image from 'next/image'
import type { Page } from '@/payload-types'
import { resolveLinkUrl, shouldOpenInNewTab } from '@/utils/linkResolver'
import Container from '@/components/Container/Container'
import SectionHeading from '@/components/SectionHeading/SectionHeading'
import PrimaryButton from '@/components/PrimaryButton'
import ArrowLink from '@/components/ArrowLink/ArrowLink'
import LexicalRenderer from '@/components/LexicalRenderer/LexicalRenderer'
import styles from './SplitSection.module.scss'

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
  const richText = (block as any).richText || null
  const bulletPoints = block.bulletPoints || []
  const buttonText = (block as any).buttonText
  const buttonHref = resolveLinkUrl({
    ...(block as any),
    linkType: (block as any).buttonLinkType,
    page: (block as any).buttonPage,
    customUrl: (block as any).buttonCustomUrl,
    constantLink: (block as any).buttonConstantLink,
    openInNewTab: (block as any).buttonOpenInNewTab,
  })
  const buttonOpenInNewTab = shouldOpenInNewTab({
    linkType: (block as any).buttonLinkType,
    openInNewTab: (block as any).buttonOpenInNewTab,
  })
  
  const linkText = block.linkText
  const linkHref = resolveLinkUrl(block as any)
  const openInNewTab = shouldOpenInNewTab(block as any)

  return (
    <Container 
      className={`
        flex flex-col gap-8 sm:gap-12 md:gap-16 lg:gap-20 xl:gap-30 
        ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'}
        md:justify-between md:items-center w-full
      `}
    >
      {/* Image Column */}
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div className="relative overflow-hidden rounded-2xl shadow-lg w-full max-w-[480px] md:max-w-[720px] aspect-[4/3] max-h-[540px]">
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
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-0 sm:px-4 md:px-0">
        <div className="w-full max-w-[480px] md:max-w-none space-y-4 sm:space-y-5 md:space-y-6">
          <SectionHeading>
            {header}
          </SectionHeading>
          
          {paragraph && (
            <p className={styles.content}>
              {paragraph}
            </p>
          )}
          
          {richText && (
            <div className={styles.content}>
              <LexicalRenderer content={richText} />
            </div>
          )}
          
          {bulletPoints.length > 0 && (
            <ul className={`${styles.bulletList} space-y-2`}>
              {bulletPoints.map((point, index) => (
                <li key={index} className={styles.bulletItem}>
                  <span className={styles.bulletDot}></span>
                  <span>{point.text}</span>
                </li>
              ))}
            </ul>
          )}

          {(buttonText && buttonHref) || (linkText && linkHref) ? (
            <div className="pt-2 sm:pt-3 md:pt-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              {buttonText && buttonHref && (
                <PrimaryButton
                  href={buttonHref}
                  openInNewTab={buttonOpenInNewTab}
                  fullWidth
                >
                  {buttonText}
                </PrimaryButton>
              )}
              {linkText && linkHref && (
                <div className="w-full md:w-auto">
                  <ArrowLink href={linkHref} openInNewTab={openInNewTab}>
                    {linkText}
                  </ArrowLink>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </Container>
  )
}

