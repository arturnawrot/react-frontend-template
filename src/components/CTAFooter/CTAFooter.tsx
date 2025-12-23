import React from 'react'
import type { Page } from '@/payload-types'

type CTAFooterBlock = Extract<Page['blocks'][number], { blockType: 'ctaFooter' }>

interface CTAFooterProps {
  block: CTAFooterBlock
}

export default function CTAFooter({ block }: CTAFooterProps) {
  const heading = block.heading || 'Ready to make your next move?'
  const subheading = block.subheading
  const buttons = block.buttons || [
    { label: 'Schedule a Consultation', variant: 'primary' as const },
    { label: 'Get Matched with a Agent', variant: 'secondary' as const },
    { label: 'Search Listings', variant: 'secondary' as const }
  ]

  const renderButton = (button: typeof buttons[0], index: number) => {
    const isPrimary = button.variant === 'primary' || (button.variant === undefined && index === 0)
    const baseClasses = "px-8 py-3 rounded-full font-medium border border-[#1b2e28] transition outline-none"
    const primaryClasses = "bg-[#1b2e28] text-white hover:bg-opacity-90"
    const secondaryClasses = "bg-transparent text-[#1b2e28] hover:bg-[#1b2e28] hover:text-white"
    const className = `${baseClasses} ${isPrimary ? primaryClasses : secondaryClasses}`

    if (button.href) {
      return (
        <a 
          key={index} 
          href={button.href}
          className={className}
        >
          {button.label}
        </a>
      )
    }

    return (
      <button 
        key={index}
        className={className}
      >
        {button.label}
      </button>
    )
  }

  return ( 
    <div className="w-full font-sans antialiased">
      <section className="bg-[#dce567] py-24 px-4 flex flex-col items-center justify-center text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1b2e28] mb-10 tracking-tight">
          {heading}
        </h2>
        
        {subheading && (
          <p className="text-xl md:text-2xl font-serif text-[#1b2e28] mb-10">
            {subheading}
          </p>
        )}
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {buttons.map((button, index) => renderButton(button, index))}
        </div>
      </section>
    </div>
  )
}

