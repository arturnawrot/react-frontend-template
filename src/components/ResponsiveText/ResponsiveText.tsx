import React from 'react'
import styles from './ResponsiveText.module.scss'

type TextAlign = 'left' | 'center' | 'right'

/**
 * Breakpoint at which desktop styles apply (Tailwind breakpoints)
 * - sm: 640px
 * - md: 768px (default)
 * - lg: 1024px
 * - xl: 1280px
 * - 2xl: 1536px
 */
type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

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
  /** Breakpoint at which desktop styles apply (default: 'md' = 768px) */
  breakpoint?: Breakpoint
  /** Max width constraint (e.g., '600px', '80%', '40ch') */
  maxWidth?: string
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
 * 
 * @example
 * // With max width constraint
 * <ResponsiveText desktop="--headline2" mobile="--headline4" maxWidth="600px">Constrained text</ResponsiveText>
 * 
 * @example
 * // Custom breakpoint (desktop starts at lg = 1024px)
 * <ResponsiveText desktop="--display2" mobile="--display4" breakpoint="lg">Heading</ResponsiveText>
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
  align,
  breakpoint = 'md',
  maxWidth,
  className = '',
  style = {},
}: ResponsiveTextProps) {
  const alignClass = 
    align === 'center' ? 'text-center' :
    align === 'right' ? 'text-right' :
    align === 'left' ? 'text-left' :
    ''

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
    // max-width requires block/inline-block display to work on inline elements like span
    ...(maxWidth && { display: 'block', maxWidth }),
    ...style,
  } as React.CSSProperties

  // Get the appropriate breakpoint class
  const breakpointClass = styles[`breakpoint_${breakpoint}`] || styles.breakpoint_md
  const responsiveFwClass = hasResponsiveFontWeight ? styles[`responsiveFontWeight_${breakpoint}`] || styles.responsiveFontWeight_md : ''

  return (
    <Component 
      className={`${styles.responsiveText} ${breakpointClass} ${responsiveFwClass} ${alignClass} ${className}`.trim()}
      style={cssVars}
    >
      {children}
    </Component>
  )
}
