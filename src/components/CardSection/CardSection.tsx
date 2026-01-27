import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import type { Page } from '@/payload-types'
import styles from './CardSection.module.scss'
import { resolveLinkUrl, shouldOpenInNewTab } from '@/utils/linkResolver'
import Container from '@/components/Container/Container'
import SectionHeading from '@/components/SectionHeading/SectionHeading'
import CardWrapper from '@/components/CardWrapper'
import PrimaryButton from '@/components/PrimaryButton'

type CardSectionBlock = Extract<Page['blocks'][number], { blockType: 'cardSection' }>

type CardSectionProps = {
  block: CardSectionBlock
}

// Helper function to parse FontAwesome icon class string
// Returns either an IconProp for React component or the original string for HTML class names
// Supports both free and Pro styles:
// - "fa-regular fa-handshake" -> ['far', 'handshake'] (if in library) or original string (Pro)
// - "fa-solid fa-handshake" -> ['fas', 'handshake']
// - "fa-brands fa-facebook" -> ['fab', 'facebook']
// - "fa-light fa-star" -> original string (Pro - uses HTML class)
// - "fa-thin fa-heart" -> original string (Pro - uses HTML class)
// - "fa-duotone fa-user" -> original string (Pro - uses HTML class)
function parseIconString(iconString: string): IconProp | string | null {
  if (!iconString) return null

  const parts = iconString.trim().split(/\s+/)
  if (parts.length < 2) return null

  // Map style prefixes (including Pro styles)
  const styleMap: Record<string, string> = {
    'fa-solid': 'fas',
    'fa-regular': 'far',
    'fa-brands': 'fab',
    'fa-light': 'fal',      // Pro
    'fa-thin': 'fat',        // Pro
    'fa-duotone': 'fad',     // Pro
  }

  // Find the style prefix
  const stylePrefix = parts.find((part) => styleMap[part])
  
  if (!stylePrefix || !styleMap[stylePrefix]) return null

  // Find the icon name (fa-handshake, fa-facebook, etc.) and remove 'fa-' prefix
  const iconPart = parts.find((part) => 
    part.startsWith('fa-') && part !== stylePrefix
  )
  
  if (!iconPart) return null

  const iconName = iconPart.replace(/^fa-/, '')
  if (!iconName) return null

  const styleKey = styleMap[stylePrefix] as 'fas' | 'far' | 'fab' | 'fal' | 'fat' | 'fad'
  
  // Pro-only styles (light, thin, duotone) are not in the React library
  // Use HTML class names which the Font Awesome Pro kit handles
  const proOnlyStyles = ['fal', 'fat', 'fad']
  if (proOnlyStyles.includes(styleKey)) {
    return iconString // Return original string for Pro-only styles
  }

  // For regular/solid/brands styles, try to find in React library first
  // This works for free icons that are in the library
  if (typeof window !== 'undefined') {
    const iconDef = findIconDefinition({ prefix: styleKey as any, iconName: iconName as any })
    if (iconDef) {
      return iconDef
    }
  }

  // If not found in React library, it might be a Pro icon
  // Fall back to HTML class names (Font Awesome Pro kit handles all icons via classes)
  // This covers Pro icons in regular/solid styles like "fa-regular fa-chart-line-up"
  return iconString
}

export default function CardSection({ block }: CardSectionProps) {
  const variant = (block as any).variant || 'icons'
  const title = block.title || 'Relationships Built for the Long Game'
  const description = block.description || ''
  const buttonText = block.buttonText
  const buttonLink = resolveLinkUrl(block as any)
  const openInNewTab = shouldOpenInNewTab(block as any)
  const cards = block.cards || []
  const cardTextAlign = block.cardTextAlign || 'left'

  const isBulletPointsVariant = variant === 'bulletPoints'

  return (
    <Container className="relative z-10">
      <CardWrapper className="py-20 px-15">
        <div className={`text-center ${!description ? 'mb-15' : ''}`}>
          <SectionHeading align="center">{title}</SectionHeading>
          {description && <p className="description my-10">{description}</p>}
        </div>

        <div className={`flex flex-wrap justify-center ${isBulletPointsVariant ? 'gap-8' : 'gap-12'}`}>
          {cards.map((card, index) => {
            const iconArray = !isBulletPointsVariant && card.icon ? parseIconString(card.icon) : null
            const textAlignClass = 
              cardTextAlign === 'center' ? 'text-center' :
              cardTextAlign === 'right' ? 'text-right' :
              'text-left'
            
            // Width classes based on variant
            const widthClass = isBulletPointsVariant 
              ? 'w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]' 
              : 'w-full md:w-[30%] md:max-w-[400px]'

            return (
              <div key={index} className={`${textAlignClass} ${widthClass}`}>
                {isBulletPointsVariant ? (
                  <span className={styles.bulletPoint} />
                ) : (
                  <span className={styles.cardColumnIcon}>
                    {iconArray ? (
                      typeof iconArray === 'string' ? (
                        // Pro icons: use HTML class names (handled by Font Awesome Pro kit)
                        <i className={iconArray} />
                      ) : (
                        // Free icons: use React component
                        <FontAwesomeIcon icon={iconArray} />
                      )
                    ) : (
                      card.icon && <i className={card.icon} />
                    )}
                  </span>
                )}
                <h3 className={`${isBulletPointsVariant ? styles.bulletPointTitle : styles.cardColumnTitle} mt-5`}>{card.title}</h3>
                {card.description && (
                  <p className={`${isBulletPointsVariant ? styles.bulletPointDescription : styles.cardColumnDescription} mt-5`}>{card.description}</p>
                )}
              </div>
            )
          })}
        </div>

        {buttonText && (
          <div className="text-center mt-15">
            <PrimaryButton
              href={buttonLink || undefined}
              openInNewTab={openInNewTab}
              className="font-bold"
            >
              {buttonText}
            </PrimaryButton>
          </div>
        )}
      </CardWrapper>
    </Container>
  )
}

