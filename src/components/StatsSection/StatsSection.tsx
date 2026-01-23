import React from 'react'
import type { Page } from '@/payload-types'
import Container from '@/components/Container/Container'

type StatsSectionBlock = Extract<Page['blocks'][number], { blockType: 'statsSection' }>

interface StatsSectionProps {
  block: StatsSectionBlock
}

export default function StatsSection({ block }: StatsSectionProps) {
  const items = block.items || []
  const heading = block.heading
  const hasFewerItems = items.length <= 3

  return (
    <Container className="py-16 md:py-24">
      {heading && (
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1E3A2F] text-center mb-12">
          {heading}
        </h2>
      )}
      <div className="flex flex-col lg:flex-row lg:justify-center">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className={`
              flex flex-col items-center text-center py-8 lg:py-0
              ${hasFewerItems ? 'px-6 lg:px-12' : 'px-4 lg:px-6'}
              ${index < items.length - 1 ? 'border-b lg:border-b-0 lg:border-r border-black/20' : ''}
            `}
          >
            <span className={`
              font-serif text-[#1E3A2F] leading-tight mb-3
              ${hasFewerItems ? 'text-5xl md:text-6xl lg:text-[72px]' : 'text-4xl md:text-5xl lg:text-[56px]'}
            `}>
              {item.value}
            </span>
            <p className={`
              text-[#1E3A2F] font-sans leading-relaxed
              ${hasFewerItems ? 'text-base md:text-lg max-w-[220px]' : 'text-sm md:text-base max-w-[200px]'}
            `}>
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </Container>
  )
}
