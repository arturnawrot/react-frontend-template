import React from 'react'
import type { Page } from '@/payload-types'
import styles from './CardSection.module.scss'
import { resolveLink, resolvePrefixedLink } from '@/utils/linkResolver'
import Container from '@/components/Container/Container'
import SectionHeading from '@/components/SectionHeading/SectionHeading'
import CardWrapper from '@/components/CardWrapper'
import PrimaryButton from '@/components/PrimaryButton'
import ArrowLink from '@/components/ArrowLink/ArrowLink'

type CardSectionBlock = Extract<Page['blocks'][number], { blockType: 'cardSection' }>

type CardSectionProps = {
  block: CardSectionBlock
}

export default function CardSection({ block }: CardSectionProps) {
  const variant = (block as any).variant || 'icons'
  const title = block.title || 'Relationships Built for the Long Game'
  const description = block.description || ''
  const buttonText = block.buttonText
  const buttonLink = resolveLink(block as any)
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
            const hasIcon = !isBulletPointsVariant && card.icon
            const textAlignClass = 
              cardTextAlign === 'center' ? 'text-center' :
              cardTextAlign === 'right' ? 'text-right' :
              'text-left'
            
            // Width classes based on variant
            const widthClass = isBulletPointsVariant 
              ? 'w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]' 
              : 'w-full md:w-[30%] md:max-w-[400px]'

            // Resolve card link with prefixed fields
            const cardLinkText = (card as any).linkText
            const cardLink = resolvePrefixedLink(card as Record<string, unknown>, 'card')

            return (
              <div key={index} className={`${textAlignClass} ${widthClass}`}>
                {isBulletPointsVariant ? (
                  <span className={styles.bulletPoint} />
                ) : (
                  <span className={styles.cardColumnIcon}>
                    {hasIcon && <i className={card.icon!} />}
                  </span>
                )}
                <h3 className={`${isBulletPointsVariant ? styles.bulletPointTitle : styles.cardColumnTitle} mt-5`}>{card.title}</h3>
                {card.description && (
                  <p className={`${isBulletPointsVariant ? styles.bulletPointDescription : styles.cardColumnDescription} mt-5`}>{card.description}</p>
                )}
                {card.bulletPoints && card.bulletPoints.length > 0 && (
                  <div className="mt-5">
                    <ul className={`${styles.bulletList} mt-5 space-y-2`}>
                      {card.bulletPoints.map((bulletPoint, bulletIndex) => (
                        <li key={bulletIndex} className={styles.bulletItem}>
                          <span className={styles.bulletDot}></span>
                          <span>{bulletPoint.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {cardLinkText && cardLink.href && (
                  <div className="mt-5">
                    <ArrowLink link={cardLink}>
                      {cardLinkText}
                    </ArrowLink>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {buttonText && (
          <div className="text-center mt-15">
            <PrimaryButton link={buttonLink} className="font-bold">
              {buttonText}
            </PrimaryButton>
          </div>
        )}
      </CardWrapper>
    </Container>
  )
}

