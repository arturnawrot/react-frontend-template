import React from 'react'

type SpacingSize = 'none' | 'small' | 'medium' | 'large' | 'xlarge'

interface BlockWrapperProps {
  children: React.ReactNode
  spacing?: SpacingSize
  isFirst?: boolean
  isLast?: boolean
  isAfterHero?: boolean
}

// Map spacing values to Tailwind classes (using margin-bottom for spacing between blocks)
const spacingClasses: Record<SpacingSize, string> = {
  none: '',
  small: 'mb-4 md:mb-6',
  medium: 'mb-8 md:mb-12',
  large: 'mb-12 md:mb-16',
  xlarge: 'mb-16 md:mb-24',
}

// Map spacing values to top margin classes (for blocks after Hero)
const topSpacingClasses: Record<SpacingSize, string> = {
  none: '',
  small: 'mt-4 md:mt-6',
  medium: 'mt-8 md:mt-12',
  large: 'mt-12 md:mt-16',
  xlarge: 'mt-16 md:mt-24',
}

export default function BlockWrapper({ children, spacing = 'medium', isFirst = false, isLast = false, isAfterHero = false }: BlockWrapperProps) {
  // Don't apply bottom spacing to the last block
  const bottomSpacingClass = isLast ? '' : spacingClasses[spacing]
  const topSpacingClass = isAfterHero ? topSpacingClasses[spacing] : ''
  
  // Combine spacing classes
  const combinedSpacingClass = [topSpacingClass, bottomSpacingClass].filter(Boolean).join(' ')
  
  // If no spacing, just return children without wrapper
  if (!combinedSpacingClass) {
    return <>{children}</>
  }
  
  return (
    <div className={combinedSpacingClass}>
      {children}
    </div>
  )
}
