import React from 'react'
import styles from './ResponsiveText.module.scss'

type TextAlign = 'left' | 'center' | 'right'

/**
 * Font size can be specified as:
 * - CSS variable: '--display2', '--headline2', '--xxl', etc.
 * - Pixel value: '48px', '32px', etc.
 */
type FontSize = `--${string}` | `${number}px`

/**
 * Font weight can be specified as:
 * - Number: 300, 400, 500, 700, etc.
 * - String: 'normal', 'bold', 'lighter', etc.
 */
type FontWeight = number | 'normal' | 'bold' | 'lighter' | 'bolder'

/**
 * Resolves a FontSize to a CSS value
 */
function resolveFontSize(size: FontSize): string {
  if (size.startsWith('--')) {
    return `var(${size})`
  }
  return size // px value
}

export interface ResponsiveTextProps {
  children: React.ReactNode
  /** HTML element to render (default: 'p') */
  as?: React.ElementType
  /** Font size for desktop - CSS var or px value */
  desktop?: FontSize
  /** Font size for mobile - CSS var or px value */
  mobile?: FontSize
  /** Line height for desktop (optional, defaults to font size) */
  desktopLineHeight?: FontSize
  /** Line height for mobile (optional, defaults to font size) */
  mobileLineHeight?: FontSize
  /** Font family (e.g., 'GT America Condensed', 'Copernicus New Cond Trial') */
  fontFamily?: string
  /** Font weight for desktop (e.g., 300, 400, 700, 'normal', 'bold') */
  fontWeight?: FontWeight
  /** Font weight for mobile only (if different from desktop) */
  fontWeightMobile?: FontWeight
  /** Text color (e.g., '#000', 'var(--strong-green)', 'red') */
  color?: string
  /** Text alignment */
  align?: TextAlign
  /** Additional CSS class names */
  className?: string
  /** Additional inline styles */
  style?: React.CSSProperties
}

/**
 * Universal responsive text component with configurable typography.
 * 
 * @example
 * // Using CSS variables
 * <ResponsiveText desktop="--display2" mobile="--display4">Heading</ResponsiveText>
 * 
 * @example
 * // Using pixel values with font family
 * <ResponsiveText desktop="32px" mobile="24px" fontFamily="GT America Condensed" fontWeight={400}>Text</ResponsiveText>
 * 
 * @example
 * // Different font weight on mobile
 * <ResponsiveText desktop="32px" mobile="24px" fontWeight={300} fontWeightMobile={400}>Text</ResponsiveText>
 */
export default function ResponsiveText({
  children,
  as: Component = 'p',
  desktop = '--display4',
  mobile = '--display4',
  desktopLineHeight,
  mobileLineHeight,
  fontFamily,
  fontWeight,
  fontWeightMobile,
  color,
  align = 'left',
  className = '',
  style = {},
}: ResponsiveTextProps) {
  const alignClass = 
    align === 'center' ? 'text-center' :
    align === 'right' ? 'text-right' :
    'text-left'

  // Determine if we need responsive font weight
  const hasResponsiveFontWeight = fontWeightMobile !== undefined

  const cssVars = {
    '--rt-desktop-size': resolveFontSize(desktop),
    '--rt-mobile-size': resolveFontSize(mobile),
    '--rt-desktop-lh': desktopLineHeight ? resolveFontSize(desktopLineHeight) : resolveFontSize(desktop),
    '--rt-mobile-lh': mobileLineHeight ? resolveFontSize(mobileLineHeight) : resolveFontSize(mobile),
    ...(fontFamily && { fontFamily }),
    // If responsive font weight, use CSS vars; otherwise use direct fontWeight
    ...(hasResponsiveFontWeight && { '--rt-desktop-fw': fontWeight ?? 'inherit' }),
    ...(hasResponsiveFontWeight && { '--rt-mobile-fw': fontWeightMobile }),
    ...(!hasResponsiveFontWeight && fontWeight !== undefined && { fontWeight }),
    ...(color && { color }),
    ...style,
  } as React.CSSProperties

  const responsiveFwClass = hasResponsiveFontWeight ? styles.responsiveFontWeight : ''

  return (
    <Component 
      className={`${styles.responsiveText} ${responsiveFwClass} ${alignClass} ${className}`.trim()}
      style={cssVars}
    >
      {children}
    </Component>
  )
}
