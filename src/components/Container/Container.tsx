import React from 'react'
import type { Page } from '@/payload-types'
import Hero from '@/components/Hero'
import FlippedM from '@/components/FlippedM/FlippedM'

type ContainerBlock = Extract<Page['blocks'][number], { blockType: 'container' }>

type ContainerProps = {
  block: ContainerBlock
}

// Helper function to get CSS class name and CSS code from CSS style relationship
const getCSSStyle = (
  cssStyle: ContainerBlock['cssStyle']
): { cssClass: string | undefined; css: string | undefined } => {
  if (!cssStyle) return { cssClass: undefined, css: undefined }

  // Handle both string ID and populated CSSStyle object
  if (typeof cssStyle === 'string') {
    // If it's just an ID, we can't get the class name here
    // This shouldn't happen if depth is set correctly, but handle it gracefully
    return { cssClass: undefined, css: undefined }
  }

  // If it's a populated CSSStyle object
  if (typeof cssStyle === 'object' && 'cssClass' in cssStyle) {
    return {
      cssClass: cssStyle.cssClass || undefined,
      css: cssStyle.css || undefined,
    }
  }

  return { cssClass: undefined, css: undefined }
}

// Recursive component to render nested blocks (including nested containers)
const renderBlock = (
  nestedBlock: ContainerBlock['blocks'][number],
  index: number
): React.ReactNode => {
  if (nestedBlock.blockType === 'hero') {
    return <Hero key={index} block={nestedBlock} />
  }
  if (nestedBlock.blockType === 'flippedM') {
    return <FlippedM key={index} block={nestedBlock} />
  }
  if (nestedBlock.blockType === 'container') {
    return <Container key={index} block={nestedBlock} />
  }
  return null
}

export default function Container({ block }: ContainerProps) {
  const { cssClass, css } = getCSSStyle(block.cssStyle)

  return (
    <>
      {/* Inject custom CSS if provided */}
      {css && (
        <style
          dangerouslySetInnerHTML={{
            __html: css,
          }}
        />
      )}
      <div className={cssClass || undefined}>
        {block.blocks?.map((nestedBlock, index) => renderBlock(nestedBlock, index))}
      </div>
    </>
  )
}

