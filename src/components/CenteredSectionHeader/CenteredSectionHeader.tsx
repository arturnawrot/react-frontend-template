import React from 'react'
import type { Page } from '@/payload-types'
import Container from '@/components/Container/Container'
import SectionHeading from '@/components/SectionHeading/SectionHeading'
import ResponsiveText from '@/components/ResponsiveText/ResponsiveText'

type CenteredSectionHeaderBlock = Extract<Page['blocks'][number], { blockType: 'centeredSectionHeader' }>

interface CenteredSectionHeaderProps {
  block: CenteredSectionHeaderBlock
}

export default function CenteredSectionHeader({ block }: CenteredSectionHeaderProps) {
  const heading = block.heading || ''
  const subheading = block.subheading || ''

  return (
    <Container className="py-12 md:py-16 lg:py-20">
      <div className="max-w-[900px] mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
            {heading && (
            <div className="w-full">
                <SectionHeading className="text-center">
                {heading}
                </SectionHeading>
            </div>
            )}
            
            {subheading && (
            <ResponsiveText
                desktop="--xxl"
                mobile="--xl"
                fontFamily="GT America Condensed"
                fontWeight={400}
                desktopLineHeight="30px"
                mobileLineHeight="27px"
                align="center"
                letterSpacing="0px"
                color="var(--strong-green)"
            >
                {subheading}
            </ResponsiveText>
            )}
        </div>
      </div>
    </Container>
  )
}
