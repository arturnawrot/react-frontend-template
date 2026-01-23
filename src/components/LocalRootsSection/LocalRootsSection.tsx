import React from 'react'
import type { Page } from '@/payload-types'
import Container from '@/components/Container/Container'
import SectionHeading from '@/components/SectionHeading/SectionHeading'

type LocalRootsSectionBlock = Extract<Page['blocks'][number], { blockType: 'localRootsSection' }>

interface LocalRootsSectionProps {
  block: LocalRootsSectionBlock
}

export default function LocalRootsSection({ block }: LocalRootsSectionProps) {
  const heading = block.heading || 'Local Roots with a National Reach'
  const items = block.items || []
  const variant = block.variant || 'dark'
  
  const isLight = variant === 'light'
  const textColor = isLight ? 'text-[#FAF9F7]' : 'text-black'
  const headingColor = isLight ? '!text-[#FAF9F7]' : '!text-black'
  const dividerColor = isLight ? 'divide-[#FAF9F7]/20' : 'divide-black/20'

  return (
    <Container className="py-16 md:py-24">
      <div className="flex flex-col lg:flex-row lg:gap-16 xl:gap-24">
        {/* Left Column - Heading */}
        <div className="lg:w-2/5 mb-10 lg:mb-0">
          <SectionHeading className={headingColor}>
            {heading}
          </SectionHeading>
        </div>

        {/* Right Column - Items List */}
        <div className="lg:w-3/5">
          <ul className={`divide-y ${dividerColor}`}>
            {items.map((item, index) => (
              <li 
                key={item.id || index} 
                className="py-6 first:pt-0 last:pb-0"
              >
                <p className={`${textColor} text-lg md:text-xl font-sans`}>
                  {item.title}
                  {item.description && (
                    <span> {item.description}</span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  )
}
