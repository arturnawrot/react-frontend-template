import React from 'react'
import type { Page } from '@/payload-types'
import Container from '@/components/Container/Container'
import SectionHeading from '@/components/SectionHeading/SectionHeading'
import ResponsiveText from '@/components/ResponsiveText'

type LocalRootsSectionBlock = Extract<Page['blocks'][number], { blockType: 'localRootsSection' }>

interface LocalRootsSectionProps {
  block: LocalRootsSectionBlock
}

export default function LocalRootsSection({ block }: LocalRootsSectionProps) {
  const heading = block.heading || 'Local Roots with a National Reach'
  const items = block.items || []
  const variant = block.variant || 'dark'
  const useCardStyle = block.useCardStyle ?? false
  const headingAlignment = block.headingAlignment || 'top'
  
  const isLight = variant === 'light'
  // When card style is enabled, always use dark text colors regardless of variant
  const textColor = useCardStyle ? 'var(--strong-green)' : (isLight ? 'text-[#FAF9F7]' : 'var(--strong-green)')
  const headingColor = useCardStyle ? '!text-black' : (isLight ? '!text-[#FAF9F7]' : '!text-black')
  const dividerColor = useCardStyle ? 'divide-[rgba(2,3,3,1)]' : (isLight ? 'divide-[#FAF9F7]/20' : 'divide-black/20')

  // Mobile: items-center, Desktop: use headingAlignment setting
  const headingAlignmentClass = headingAlignment === 'center' ? 'items-center' : 'items-center lg:items-start'
  const cardStyles = useCardStyle ? 'bg-white rounded-4xl border border-gray-100 shadow-md shadow-black/20 py-20 px-8 md:px-15' : ''

  return (
    <Container className="py-16 md:py-24 text-center md:text-left">
      <div className={cardStyles}>
        <div className={`flex flex-col lg:flex-row lg:gap-16 xl:gap-24 ${headingAlignmentClass} ${useCardStyle ? 'max-w-5xl mx-auto' : ''}`}>
          {/* Left Column - Heading */}
          <div className="lg:w-2/5">
            <SectionHeading>
              <ResponsiveText desktop="--display3" mobile="--display4" className={headingColor} as="span">
                {heading}
              </ResponsiveText>
            </SectionHeading>
          </div>

          {/* Right Column - Items List */}
          <div className="lg:w-3/5 mt-10 lg:mt-0">
            <ul className={`divide-y ${dividerColor}`}>
              {items.map((item, index) => (
                <li 
                  key={item.id || index} 
                  className="py-6 first:pt-0 last:pb-0 text-center md:text-left"
                >
                  <ResponsiveText 
                    as="span"
                    desktop="--headline2" 
                    mobile="24px" 
                    color={textColor}
                    fontFamily="GT America Condensed"
                    fontWeight={500}
                  >
                    {item.sentence}
                  </ResponsiveText>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Container>
  )
}
