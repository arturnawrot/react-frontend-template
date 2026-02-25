import React from 'react'
import type { Page } from '@/payload-types'
import { resolveLink, type ConstantLinksMap } from '@/utils/linkResolver'
import SectionHeading from '@/components/SectionHeading/SectionHeading'
import PrimaryButton, { SecondaryButton } from '@/components/PrimaryButton'

type CTAFooterBlock = Extract<Page['blocks'][number], { blockType: 'ctaFooter' }>

interface CTAFooterProps {
  block: CTAFooterBlock
  constantLinksMap?: ConstantLinksMap
}

export default function CTAFooter({ block, constantLinksMap }: CTAFooterProps) {
  const heading = block.heading || 'Ready to make your next move?'
  const subheading = block.subheading
  const buttons = block.buttons || [
    { label: 'Schedule a Consultation', variant: 'primary' as const },
    { label: 'Get Matched with a Agent', variant: 'secondary' as const },
    { label: 'Search Listings', variant: 'secondary' as const }
  ]

  const renderButton = (button: typeof buttons[0], index: number) => {
    const isPrimary = button.variant === 'primary' || (button.variant === undefined && index === 0)
    const link = resolveLink(button as any, constantLinksMap)

    const ButtonComponent = isPrimary ? PrimaryButton : SecondaryButton

    return (
      <ButtonComponent
        key={index}
        href={link.href || undefined}
        openInNewTab={link.openInNewTab}
        disabled={link.disabled}
        calLink={link.calLink}
        calNamespace={link.calNamespace}
        variant={isPrimary ? 'dark' : undefined}
      >
        {button.label}
      </ButtonComponent>
    )
  }

  return ( 
    <div className="w-full font-sans antialiased">
      <section className="bg-[#dce567] py-24 px-4 flex flex-col items-center justify-center text-center">
        <SectionHeading align="center" className="mb-10 tracking-tight">
          {heading}
        </SectionHeading>
        
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

