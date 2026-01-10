'use client'
import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Page } from '@/payload-types'
import Arrow from '../Arrow/Arrow'

type TrackRecordSectionBlock = Extract<Page['blocks'][number], { blockType: 'trackRecordSection' }>

interface TrackRecordItem {
  image: string
  title: string
  address?: string
  price?: string
  size?: string
  propertyType?: string
  agent?: { name: string; image?: string }
  link?: string
}

interface TrackRecordSectionProps {
  block: TrackRecordSectionBlock
  items?: TrackRecordItem[]
}

// Sub-Component: PropertyCard
const PropertyCard = ({ 
  image, 
  title, 
  details, 
  agent,
  link
}: { 
  image: string
  title: string
  details?: { address?: string; price?: string; size?: string; propertyType?: string }
  agent?: { name?: string; image?: string }
  link?: string
}) => {
  const hasDetails = details && (details.address || details.price)

  const cardContent = (
    <div className="relative w-[300px] md:w-[420px] h-[450px] md:h-[540px] shrink-0 snap-start group cursor-pointer overflow-hidden rounded-[2rem]">
      
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image 
          src={image} 
          alt={title} 
          fill
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110" 
          sizes="(max-width: 768px) 300px, 420px"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
      </div>

      {/* Info Box */}
      <div 
        className={`
          absolute left-6 bottom-6 bg-white rounded-2xl p-6 shadow-xl z-10
          transition-all duration-300
          ${hasDetails ? 'w-[calc(100%-3rem)]' : 'w-auto pr-8'}
        `}
      >
        <h3 className="text-3xl md:text-4xl font-serif text-[#1a2e2a] leading-none tracking-tight">
          {title}
        </h3>

        {hasDetails && (
          <div className="mt-5 animate-fadeIn">
            <div className="mb-5">
              {details.address && (
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">
                  {details.address}
                </h4>
              )}
              <p className="text-xs text-gray-500 font-medium">
                {details.price} {details.size && <span className="mx-1 text-gray-300">|</span>} {details.size} {details.propertyType && <span className="mx-1 text-gray-300">|</span>} {details.propertyType}
              </p>
            </div>

            {agent && agent.name && (
              <div className="inline-flex items-center gap-3 bg-gray-100/80 rounded-full py-1.5 pl-1.5 pr-4 border border-gray-100">
                {agent.image && (
                  <div className="w-8 h-8 rounded-full relative overflow-hidden">
                    <Image src={agent.image} alt={agent.name} fill className="object-cover" sizes="32px" />
                  </div>
                )}
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-800">
                  {agent.name}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  if (link) {
    return (
      <Link href={link} className="block">
        {cardContent}
      </Link>
    )
  }

  return cardContent
}

export default function TrackRecordSection({ block, items = [] }: TrackRecordSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 460
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const heading = block.heading || 'Proven Track Record'

  return (
    <section className="w-full py-24">
      {/* Header Container */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-16">
        <div className="flex flex-col md:flex-row items-center justify-between relative">
          
          {/* Title Centered */}
          <div className="w-full text-center md:absolute md:left-1/2 md:-translate-x-1/2">
            <h2 className="text-5xl md:text-6xl font-serif text-[#1a2e2a]">
              {heading}
            </h2>
          </div>

          {/* Arrows Right */}
          <div className="hidden md:flex gap-4 ml-auto z-10">
            <button 
              onClick={() => scroll('left')}
              className="flex items-center justify-center hover:opacity-70 text-[#1a2e2a] transition-opacity"
            >
              <Arrow direction="up" variant="triangle" size={12} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="flex items-center justify-center hover:opacity-70 text-[#1a2e2a] transition-opacity"
            >
              <Arrow direction="down" variant="triangle" size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Full Width Slider */}
      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto w-full pb-12 scrollbar-hide snap-x"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          paddingLeft: 'max(1.5rem, calc((100vw - 1600px) / 2 + 3rem))',
          paddingRight: 'max(1.5rem, calc((100vw - 1600px) / 2 + 3rem))'
        }}
      >
        {items.map((item, index) => (
          <PropertyCard 
            key={index}
            image={item.image}
            title={item.title}
            details={item.address || item.price || item.size || item.propertyType ? {
              address: item.address,
              price: item.price,
              size: item.size,
              propertyType: item.propertyType,
            } : undefined}
            agent={item.agent}
            link={item.link}
          />
        ))}
      </div>

      {/* Mobile Arrows (Bottom Center) */}
      <div className="flex md:hidden justify-center gap-4 px-6">
        <button 
          onClick={() => scroll('left')}
          className="flex items-center justify-center hover:opacity-70 text-[#1a2e2a] transition-opacity"
        >
          <Arrow direction="up" variant="triangle" size={12} />
        </button>
        <button 
          onClick={() => scroll('right')}
          className="flex items-center justify-center hover:opacity-70 text-[#1a2e2a] transition-opacity"
        >
          <Arrow direction="down" variant="triangle" size={12} />
        </button>
      </div>

    </section>
  )
}

