import React from 'react'
import type { Page } from '@/payload-types'
import type { Media } from '@/payload-types'
import Arrow from '../Arrow/Arrow'

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
  const bulletPoints = block.bulletPoints || []
  const linkText = block.linkText
  const linkHref = block.linkHref || '#'

  return (
    <section className="w-full py-16 px-2">
      <div 
        className={`
          max-w-7xl mx-auto 
          flex flex-col gap-12 items-center 
          ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'}
        `}
      >
        {/* Image Column */}
        <div className="w-full md:w-1/2">
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <img 
              src={imageUrl} 
              alt={imageAlt} 
              className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700 ease-out" 
            />
          </div>
        </div>

        {/* Content Column */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="space-y-6 md:pl-8">
            <h2 className="text-4xl md:text-5xl font-serif text-[#1a2e2a] leading-tight">
              {header}
            </h2>
            
            {bulletPoints.length > 0 && (
              <ul className="space-y-2 text-gray-700 font-medium">
                {bulletPoints.map((point, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
                    {point.text}
                  </li>
                ))}
              </ul>
            )}

            {linkText && (
              <div className="pt-4">
                <a 
                  href={linkHref} 
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-[#1a2e2a] transition-colors border-b border-transparent hover:border-gray-800 pb-0.5"
                >
                  {linkText}
                  <Arrow direction="right" variant="fill" size={16} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

