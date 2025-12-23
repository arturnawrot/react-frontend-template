import React from 'react'

interface ArrowProps {
  direction?: 'left' | 'right' | 'up' | 'down'
  size?: number | string // number for pixel size, string for Tailwind classes like "w-4 h-4"
  className?: string
  variant?: 'arrow' | 'chevron' | 'triangle' | 'fill' // 'arrow' for stroke arrows, 'fill' for filled arrows, 'chevron' for chevrons, 'triangle' for triangle arrows
}

const Arrow: React.FC<ArrowProps> = ({ 
  direction = 'right', 
  size,
  className = '',
  variant = 'arrow'
}: ArrowProps) => {
  // Default size handling
  let sizeClass = ''
  let sizeStyle: React.CSSProperties = {}

  if (typeof size === 'number') {
    sizeStyle = { width: `${size}px`, height: `${size}px` }
  } else if (typeof size === 'string') {
    sizeClass = size
  } else {
    // Default size if not specified
    sizeStyle = { width: '16px', height: '16px' }
  }

  const combinedClassName = sizeClass ? `${sizeClass} ${className}`.trim() : className

  // Triangle variant (used in TrackRecord)
  if (variant === 'triangle') {
    const rotationMap: Record<'left' | 'right' | 'up' | 'down', string> = {
      up: 'rotate-90',
      down: '-rotate-90',
      left: 'rotate-180',
      right: 'rotate-0'
    }

    return (
      <svg 
        width="12" 
        height="12" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={`${rotationMap[direction as keyof typeof rotationMap]} ${combinedClassName}`}
        style={sizeStyle}
      >
        <path d="M12 24L0 0h24L12 24z" />
      </svg>
    )
  }

  // Chevron variant (used in PropertyDetails)
  if (variant === 'chevron') {
    const chevronPaths: Record<'left' | 'right' | 'up' | 'down', React.ReactElement> = {
      left: <path key="left" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />,
      right: <path key="right" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />,
      up: <path key="up" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />,
      down: <path key="down" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
    }

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={combinedClassName}
        style={sizeStyle}
      >
        {chevronPaths[direction as keyof typeof chevronPaths]}
      </svg>
    )
  }

  // Fill variant (used in AgentCarousel, ArticleCard, buy.tsx)
  if (variant === 'fill') {
    if (direction === 'left') {
      // Fill-based left arrow (AgentCarousel style)
      return (
        <svg 
          className={combinedClassName}
          fill="currentColor" 
          viewBox="0 0 20 20"
          style={sizeStyle}
        >
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )
    }
    
    if (direction === 'right') {
      // Fill-based right arrow (AgentCarousel, ArticleCard, buy.tsx style)
      // Use Bootstrap-style for 16px, AgentCarousel style for larger
      if (typeof size === 'number' && size === 16) {
        return (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 16 16" 
            fill="currentColor" 
            className={combinedClassName}
            style={sizeStyle}
          >
            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
          </svg>
        )
      }
      
      // AgentCarousel style (larger)
      return (
        <svg 
          className={combinedClassName}
          fill="currentColor" 
          viewBox="0 0 20 20"
          style={sizeStyle}
        >
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      )
    }
  }

  // Default arrow variant (stroke-based, used in InsightsSection)
  const arrowPaths: Record<'left' | 'right' | 'up' | 'down', React.ReactElement> = {
    left: <path key="left" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />,
    right: <path key="right" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />,
    up: <path key="up" strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />,
    down: <path key="down" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  }

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={2} 
      stroke="currentColor" 
      className={combinedClassName}
      style={sizeStyle}
    >
      {arrowPaths[direction as keyof typeof arrowPaths]}
    </svg>
  )
}

export default Arrow

