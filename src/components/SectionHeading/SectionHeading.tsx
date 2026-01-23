import React from 'react'
import styles from './SectionHeading.module.scss'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

type TextAlign = 'left' | 'center' | 'right'

interface SectionHeadingProps {
  children: React.ReactNode
  /** HTML heading element to render (default: 'h2') */
  as?: HeadingLevel
  /** Text alignment (default: 'left') */
  align?: TextAlign
  /** Additional CSS class names */
  className?: string
}

/**
 * Unified section heading component with responsive typography.
 * Uses Copernicus New Cond Trial font with responsive sizing:
 * - Mobile: var(--display4) = 48px
 * - Desktop (768px+): var(--display2) = 64px
 */
export default function SectionHeading({
  children,
  as: Component = 'h2',
  align = 'left',
  className = '',
}: SectionHeadingProps) {
  const alignClass = 
    align === 'center' ? 'text-center' :
    align === 'right' ? 'text-right' :
    'text-left'

  return (
    <Component className={`${styles.heading} ${alignClass} ${className}`.trim()}>
      {children}
    </Component>
  )
}
