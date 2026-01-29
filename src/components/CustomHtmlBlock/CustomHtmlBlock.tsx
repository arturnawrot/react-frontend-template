import { CustomHtml } from '../CustomHtml/CustomHtml'
import type { Page } from '@/payload-types'
import Container from '../Container/Container'
import FormCard from '../FormCard/FormCard'
import SectionHeading from '../SectionHeading/SectionHeading'
import ResponsiveText from '../ResponsiveText/ResponsiveText'
import Image from 'next/image'

type CustomHtmlBlockProps = {
  block: Extract<Page['blocks'][number], { blockType: 'customHtmlBlock' }>
}

export default function CustomHtmlBlock({ block }: CustomHtmlBlockProps) {
  const customHtml = typeof block.customHtml === 'object' && block.customHtml !== null
    ? block.customHtml
    : null

  if (!customHtml || !customHtml.html) {
    return null
  }

  const variant = block.variant || 'default'
  const isWithImage = variant === 'withImage'

  const image = typeof block.image === 'object' && block.image !== null ? block.image : null
  const imageUrl = image?.url || (typeof block.image === 'string' ? block.image : '')
  const imageAlt = block.imageAlt || 'Section image'

  const justifyContentMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
  } as const

  const justifyContent = justifyContentMap[block.justifyContent || 'start']
  const hasHeading = block.heading

  // Form Card Content
  const formCardContent = (
    <FormCard>
      <div className="flex flex-col space-y-4 md:space-y-6">
        {hasHeading && (
          <div className="w-full">
            <SectionHeading className="text-center">
              <ResponsiveText
                desktop="--display4"
                mobile="--display4"
                fontWeight={300}
                desktopLineHeight="--display4"
                align="center"
                letterSpacing="0px"
                as="span"
                color="var(--strong-green)"
              >
                {block.heading} 
              </ResponsiveText>
            </SectionHeading>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent,
            width: '100%',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ width: '100%', maxWidth: '100%' }}>
            <CustomHtml html={customHtml.html} />
          </div>
        </div>
      </div>
    </FormCard>
  )

  if (!isWithImage) {
    return (
      <Container>
        {formCardContent}
      </Container>
    )
  }

  return (
    <Container>
      <div className="flex flex-col md:flex-row items-center justify-center w-full py-12 md:py-20">
        
        {/* 
           Image Column - Left (Background Layer)
           Matches ~540x400 sizing logic:
           1. w-5/12: Narrower column (approx 41%)
           2. aspect-[4/3]: Forces the "shorter" landscape ratio (540/400 = 1.35)
           3. z-0: Sits behind
        */}
        {imageUrl && (
          <div className="w-full md:w-5/12 relative z-0 flex justify-center md:justify-start pointer-events-none select-none">
            <div className="relative overflow-hidden rounded-2xl shadow-lg w-full max-w-[540px] aspect-[4/3]">
              <Image 
                src={imageUrl} 
                alt={imageAlt} 
                fill
                className="object-cover" 
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
        )}

        {/* 
           Form Column - Right (Foreground Layer)
           Matches ~900x600 sizing logic:
           1. w-8/12: Wider column (approx 66%) to dominate visual weight.
           2. -ml-24/40: Overlaps onto the image significantly.
           3. z-10: Sits on top.
        */}
        <div className="w-full md:w-8/12 relative z-10 flex justify-center md:justify-end -mt-12 md:mt-0 md:-ml-24 lg:-ml-40">
          <div className="w-full shadow-2xl rounded-xl bg-white">
             {formCardContent}
          </div>
        </div>
      </div>
    </Container>
  )
}