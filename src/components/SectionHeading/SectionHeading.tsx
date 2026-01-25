import React from 'react'
import styles from './SectionHeading.module.scss'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type TextAlign = 'left' | 'center' | 'right'
type FontSize = `--${string}` | `${number}px`

function resolveFontSize(size: FontSize): string {
  if (size.startsWith('--')) {
    return `var(${size})`
  }
  return size
}

interface SectionHeadingProps {
  children: React.ReactNode
  /** HTML heading element to render (default: 'h2') */
  as?: HeadingLevel
  /** Text alignment (default: 'left') */
  align?: TextAlign
  /** Font size for desktop (default: '--display2') */
  desktop?: FontSize
  /** Font size for mobile (default: '--display4') */
  mobile?: FontSize
  /** Max width constraint (e.g., '600px', '80%', '40ch') */
  maxWidth?: string
  /** Additional CSS class names */
  className?: string
}

/**
 * Section heading component with responsive typography.
 * Uses Copernicus New Cond Trial font with configurable responsive sizing.
 * 
 * Default: --display2 on desktop, --display4 on mobile
 */
export default function SectionHeading({
  children,
  as: Component = 'h2',
  desktop = '--display2',
  mobile = '--display4',
  maxWidth = '',
  className = '',
}: SectionHeadingProps) {

  const cssVars = {
    '--heading-desktop': resolveFontSize(desktop),
    '--heading-mobile': resolveFontSize(mobile),
    maxWidth,
  } as React.CSSProperties

  return (
    <Component 
      className={`${styles.heading} ${className}`.trim()}
      style={cssVars}
    >
      {children}
    </Component>
  )
}
