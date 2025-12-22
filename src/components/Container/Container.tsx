import React from 'react'
import type { Page } from '@/payload-types'
import { renderBlocks } from '@/utils/renderBlocks'

type ContainerBlock = Extract<Page['blocks'][number], { blockType: 'container' }>

type ContainerProps = {
  block: ContainerBlock
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

export default function Container({ block }: ContainerProps) {
  const { cssClasses, cssCode } = getCSSStyles(block.cssStyles)
  const combinedClasses = cssClasses.length > 0 ? cssClasses.join(' ') : undefined

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
      <div className={combinedClasses || undefined}>
        {renderBlocks(block.blocks)}
      </div>
    </div>
  )
}

