import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import type { Page } from '@/payload-types'
import styles from './CardSection.module.scss'

type CardSectionBlock = Extract<Page['blocks'][number], { blockType: 'cardSection' }>

type CardSectionProps = {
  block: CardSectionBlock
}

// Helper function to parse FontAwesome icon class string to icon array format
// Converts "fa-regular fa-handshake" to ['far', 'handshake']
// Converts "fa-solid fa-handshake" to ['fas', 'handshake']
// Converts "fa-brands fa-facebook" to ['fab', 'facebook']
function parseIconString(iconString: string): IconProp | null {
  if (!iconString) return null

  const parts = iconString.trim().split(/\s+/)
  if (parts.length < 2) return null

  // Map style prefixes
  const styleMap: Record<string, string> = {
    'fa-solid': 'fas',
    'fa-regular': 'far',
    'fa-brands': 'fab',
  }

  // Find the style prefix (fa-solid, fa-regular, fa-brands)
  const stylePrefix = parts.find((part) => 
    part === 'fa-solid' || part === 'fa-regular' || part === 'fa-brands'
  )
  
  if (!stylePrefix || !styleMap[stylePrefix]) return null

  // Find the icon name (fa-handshake, fa-facebook, etc.) and remove 'fa-' prefix
  const iconPart = parts.find((part) => 
    part.startsWith('fa-') && part !== stylePrefix
  )
  
  if (!iconPart) return null

  const iconName = iconPart.replace(/^fa-/, '')
  if (!iconName) return null

  return [styleMap[stylePrefix] as 'fas' | 'far' | 'fab', iconName] as IconProp
}

export default function CardSection({ block }: CardSectionProps) {
  const title = block.title || 'Relationships Built for the Long Game'
  const description = block.description || 'In every transaction and relationship we hold true to our guiding principles.'
  const buttonText = block.buttonText || 'What Makes Us Different'
  const buttonLink = block.buttonLink || '#'
  const cards = block.cards || []

  return (
    <div className="relative z-10">
      <div className="max-w-[1380px] mx-auto px-4 py-20">
        <div className="bg-white rounded-4xl border border-gray-200 shadow-xl shadow-black/20 py-20 px-15">
          <div className="text-center">
            <h2 className="display2">{title}</h2>
            <p className="description my-10">{description}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-12">
            {cards.map((card, index) => {
              const iconArray = parseIconString(card.icon)
              return (
                <div key={index} className="text-center w-full md:w-[30%] md:max-w-[400px]">
                  <span className={styles.cardColumnIcon}>
                    {iconArray ? (
                      <FontAwesomeIcon icon={iconArray} />
                    ) : (
                      <i className={card.icon} />
                    )}
                  </span>
                  <h3 className={`${styles.cardColumnTitle} mt-5`}>{card.title}</h3>
                  <p className={`${styles.cardColumnDescription} mt-5`}>{card.description}</p>
                </div>
              )
            })}
          </div>

          {buttonText && (
            <div className="text-center mt-15">
              <a href={buttonLink} className="sale-button">
                {buttonText}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

