import React from 'react'
import type { Page } from '@/payload-types'
import type { Payload } from 'payload'
import { renderBlocks, type RenderBlocksOptions } from '@/utils/renderBlocks'

type ContainerBlock = Extract<Page['blocks'][number], { blockType: 'container' }>

type ContainerProps = {
  block: ContainerBlock
  payload?: Payload
  options?: RenderBlocksOptions
}

// Helper function to get CSS class names and CSS code from CSS styles array
const getCSSStyles = (
  cssStyles: ContainerBlock['cssStyles']
): { cssClasses: string[]; cssCode: string[] } => {
  if (!cssStyles || !Array.isArray(cssStyles) || cssStyles.length === 0) {
    return { cssClasses: [], cssCode: [] }
  }

  const cssClasses: string[] = []
  const cssCode: string[] = []

  cssStyles.forEach((cssStyle) => {
    // Handle both string ID and populated CSSStyle object
    if (typeof cssStyle === 'string') {
      // If it's just an ID, we can't get the class name here
      // This shouldn't happen if depth is set correctly, but handle it gracefully
      return
    }

    // If it's a populated CSSStyle object
    if (typeof cssStyle === 'object' && 'cssClass' in cssStyle) {
      if (cssStyle.cssClass) {
        cssClasses.push(cssStyle.cssClass)
      }
      if (cssStyle.css) {
        cssCode.push(cssStyle.css)
      }
    }
  })

  return { cssClasses, cssCode }
}

export default async function PayloadContainer({ block, payload, options }: ContainerProps) {
  const { cssClasses, cssCode } = getCSSStyles(block.cssStyles)
  const combinedClasses = cssClasses.length > 0 ? cssClasses.join(' ') : undefined

  // Cast to any to handle nested container blocks (like availableRoles) which have different types
  // Pass options through to avoid redundant siteSettings fetches
  const blocks = await renderBlocks(block.blocks as any, payload, options)

  // Build spacing classes based on extraPadding and extraMargin selections
  const spacingClasses: string[] = []
  if (block.extraPadding?.includes('top')) {
    spacingClasses.push('pt-12 md:pt-20')
  }
  if (block.extraPadding?.includes('bottom')) {
    spacingClasses.push('pb-12 md:pb-20')
  }
  if (block.extraPadding?.includes('top-negative')) {
    spacingClasses.push('-mt-12 md:-mt-20')
  }
  if (block.extraPadding?.includes('bottom-negative')) {
    spacingClasses.push('-mb-12 md:-mb-20')
  }
  if (block.extraMargin?.includes('top')) {
    spacingClasses.push('mt-12 md:mt-20')
  }
  if (block.extraMargin?.includes('bottom')) {
    spacingClasses.push('mb-12 md:mb-20')
  }
  if (block.extraMargin?.includes('top-negative')) {
    spacingClasses.push('-mt-12 md:-mt-20')
  }
  if (block.extraMargin?.includes('bottom-negative')) {
    spacingClasses.push('-mb-12 md:-mb-20')
  }
  const spacingClass = spacingClasses.join(' ')

  return (
    <div className="relative">
      {/* Inject custom CSS if provided */}
      {cssCode.length > 0 && (
        <style
          dangerouslySetInnerHTML={{
            __html: cssCode.join('\n'),
          }}
        />
      )}
      <div
        id={block.id || undefined}
        className={[spacingClass, combinedClasses].filter(Boolean).join(' ') || undefined}
      >
        {blocks}
      </div>
    </div>
  )
}

