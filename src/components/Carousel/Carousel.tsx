'use client'
import React, { useState, useEffect, useRef, useCallback, ReactNode } from 'react'

export interface CarouselConfig {
  /** Card width at different breakpoints: [mobile, md, lg] or single value */
  cardWidth: number | [number, number, number]
  /** Gap between cards in pixels */
  gap: number
  /** Transition duration in ms */
  transitionDuration?: number
  /** Enable autoplay */
  autoplay?: boolean
  /** Autoplay interval in ms */
  autoplayInterval?: number
  /** Pause autoplay duration after manual interaction */
  pauseDuration?: number
}

export interface CarouselRenderProps {
  handleNext: () => void
  handlePrev: () => void
  isPaused: boolean
  setIsPaused: (paused: boolean) => void
}

export interface CarouselTrackElement {
  trackElement: ReactNode
  renderProps: CarouselRenderProps
}

interface CarouselProps<T> {
  /** Array of items to display */
  items: T[]
  /** Render function for each item */
  renderItem: (item: T, index: number) => ReactNode
  /** Configuration options */
  config: CarouselConfig
  /** Optional className for the track container */
  trackClassName?: string
  /** Optional className for the wrapper (the overflow:hidden container) */
  wrapperClassName?: string
  /** Optional style for the wrapper */
  wrapperStyle?: React.CSSProperties
  /** Content to render before the carousel track */
  renderBefore?: (props: CarouselRenderProps) => ReactNode
  /** Content to render after the carousel track */
  renderAfter?: (props: CarouselRenderProps) => ReactNode
  /** Custom layout render - receives track element and props for full layout control */
  renderLayout?: (props: CarouselTrackElement) => ReactNode
  /** Unique key for item (for React key prop) */
  getItemKey?: (item: T, index: number) => string | number
}

export default function Carousel<T>({
  items,
  renderItem,
  config,
  trackClassName = '',
  wrapperClassName = '',
  wrapperStyle,
  renderBefore,
  renderAfter,
  renderLayout,
  getItemKey,
}: CarouselProps<T>) {
  const {
    cardWidth,
    gap,
    transitionDuration = 500,
    autoplay = false,
    autoplayInterval = 3000,
    pauseDuration = 5000,
  } = config

  // Start at the beginning of the middle set
  const initialIndex = items.length > 0 ? items.length : 0
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  // Touch/swipe state
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)
  const isDragging = useRef<boolean>(false)
  const dragStartX = useRef<number>(0)
  const dragOffset = useRef<number>(0)

  // Replicate list 3 times to create a buffer for infinite scrolling
  const extendedItems = [...items, ...items, ...items]

  // Reset to initial index if items change
  useEffect(() => {
    if (items.length > 0) {
      setCurrentIndex(items.length)
    }
  }, [items.length])

  // Get current card width based on viewport
  const getCardWidth = useCallback(() => {
    if (typeof window === 'undefined') {
      return Array.isArray(cardWidth) ? cardWidth[2] : cardWidth
    }
    if (Array.isArray(cardWidth)) {
      if (window.innerWidth >= 1024) return cardWidth[2]
      if (window.innerWidth >= 768) return cardWidth[1]
      return cardWidth[0]
    }
    return cardWidth
  }, [cardWidth])

  const getTransform = useCallback(() => {
    const width = getCardWidth()
    const shift = currentIndex * (width + gap) - dragOffset.current
    return `translateX(-${shift}px)`
  }, [currentIndex, gap, getCardWidth])

  const handleNext = useCallback(() => {
    if (isTransitioning || items.length === 0) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev + 1)
  }, [isTransitioning, items.length])

  const handlePrev = useCallback(() => {
    if (isTransitioning || items.length === 0) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev - 1)
  }, [isTransitioning, items.length])

  // Autoplay Effect
  useEffect(() => {
    if (!autoplay || isPaused || items.length === 0) return

    const timer = setInterval(() => {
      handleNext()
    }, autoplayInterval)

    return () => clearInterval(timer)
  }, [autoplay, autoplayInterval, handleNext, isPaused, items.length])

  // Infinite Loop Logic
  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false)

    const totalReal = items.length
    if (totalReal === 0) return

    if (trackRef.current) {
      const width = getCardWidth()
      
      // If we've scrolled past the middle set into the 3rd set (Clone)
      if (currentIndex >= totalReal * 2) {
        trackRef.current.style.transition = 'none'
        const newIndex = currentIndex - totalReal
        setCurrentIndex(newIndex)
        trackRef.current.style.transform = `translateX(-${newIndex * (width + gap)}px)`

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (trackRef.current) {
              trackRef.current.style.transition = ''
            }
          })
        })
      }

      // If we've scrolled backwards into the 1st set (Clone)
      else if (currentIndex < totalReal) {
        trackRef.current.style.transition = 'none'
        const newIndex = currentIndex + totalReal
        setCurrentIndex(newIndex)
        trackRef.current.style.transform = `translateX(-${newIndex * (width + gap)}px)`

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (trackRef.current) {
              trackRef.current.style.transition = ''
            }
          })
        })
      }
    }
  }, [currentIndex, gap, getCardWidth, items.length])

  // Update transform on window resize
  useEffect(() => {
    const handleResize = () => {
      if (trackRef.current && !isTransitioning) {
        const width = getCardWidth()
        trackRef.current.style.transform = `translateX(-${currentIndex * (width + gap)}px)`
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentIndex, gap, getCardWidth, isTransitioning])

  // Touch/Swipe handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isTransitioning) return
    touchStartX.current = e.touches[0].clientX
    isDragging.current = true
    dragStartX.current = e.touches[0].clientX
    dragOffset.current = 0
    
    if (trackRef.current) {
      trackRef.current.style.transition = 'none'
    }
  }, [isTransitioning])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || isTransitioning) return
    
    touchEndX.current = e.touches[0].clientX
    dragOffset.current = dragStartX.current - e.touches[0].clientX
    
    if (trackRef.current) {
      const width = getCardWidth()
      const shift = currentIndex * (width + gap) + dragOffset.current
      trackRef.current.style.transform = `translateX(-${shift}px)`
    }
  }, [currentIndex, gap, getCardWidth, isTransitioning])

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false

    const width = getCardWidth()
    const threshold = width / 3 // Swipe threshold: 1/3 of card width
    const swipeDistance = touchStartX.current - touchEndX.current

    if (trackRef.current) {
      trackRef.current.style.transition = `transform ${transitionDuration}ms ease-in-out`
    }

    if (Math.abs(swipeDistance) > threshold) {
      if (swipeDistance > 0) {
        handleNext()
      } else {
        handlePrev()
      }
    } else {
      // Snap back to current position
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(-${currentIndex * (width + gap)}px)`
      }
    }

    dragOffset.current = 0
    touchStartX.current = 0
    touchEndX.current = 0

    // Pause autoplay after interaction
    if (autoplay) {
      setIsPaused(true)
      setTimeout(() => setIsPaused(false), pauseDuration)
    }
  }, [autoplay, currentIndex, gap, getCardWidth, handleNext, handlePrev, pauseDuration, transitionDuration])

  // Mouse drag handlers (for desktop)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isTransitioning) return
    e.preventDefault()
    touchStartX.current = e.clientX
    isDragging.current = true
    dragStartX.current = e.clientX
    dragOffset.current = 0
    
    if (trackRef.current) {
      trackRef.current.style.transition = 'none'
      trackRef.current.style.cursor = 'grabbing'
    }
  }, [isTransitioning])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || isTransitioning) return
    
    touchEndX.current = e.clientX
    dragOffset.current = dragStartX.current - e.clientX
    
    if (trackRef.current) {
      const width = getCardWidth()
      const shift = currentIndex * (width + gap) + dragOffset.current
      trackRef.current.style.transform = `translateX(-${shift}px)`
    }
  }, [currentIndex, gap, getCardWidth, isTransitioning])

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false

    const width = getCardWidth()
    const threshold = width / 3
    const swipeDistance = touchStartX.current - touchEndX.current

    if (trackRef.current) {
      trackRef.current.style.transition = `transform ${transitionDuration}ms ease-in-out`
      trackRef.current.style.cursor = 'grab'
    }

    if (Math.abs(swipeDistance) > threshold) {
      if (swipeDistance > 0) {
        handleNext()
      } else {
        handlePrev()
      }
    } else {
      // Snap back to current position
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(-${currentIndex * (width + gap)}px)`
      }
    }

    dragOffset.current = 0
    touchStartX.current = 0
    touchEndX.current = 0

    // Pause autoplay after interaction
    if (autoplay) {
      setIsPaused(true)
      setTimeout(() => setIsPaused(false), pauseDuration)
    }
  }, [autoplay, currentIndex, gap, getCardWidth, handleNext, handlePrev, pauseDuration, transitionDuration])

  const handleMouseLeave = useCallback(() => {
    if (isDragging.current) {
      handleMouseUp()
    }
  }, [handleMouseUp])

  if (items.length === 0) {
    return null
  }

  const renderProps: CarouselRenderProps = {
    handleNext,
    handlePrev,
    isPaused,
    setIsPaused,
  }

  const trackElement = (
    <div className={`relative overflow-hidden ${wrapperClassName}`} style={wrapperStyle}>
      <div
        ref={trackRef}
        className={`flex will-change-transform cursor-grab select-none ${trackClassName}`}
        style={{
          gap: `${gap}px`,
          transform: getTransform(),
          transition: isTransitioning ? `transform ${transitionDuration}ms ease-in-out` : 'none',
        }}
        onTransitionEnd={handleTransitionEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {extendedItems.map((item, index) => (
          <div key={getItemKey ? getItemKey(item, index) : index} className="shrink-0">
            {renderItem(item, index % items.length)}
          </div>
        ))}
      </div>
    </div>
  )

  // If renderLayout is provided, use it for full layout control
  if (renderLayout) {
    return <>{renderLayout({ trackElement, renderProps })}</>
  }

  // Default sequential layout
  return (
    <>
      {renderBefore?.(renderProps)}
      {trackElement}
      {renderAfter?.(renderProps)}
    </>
  )
}

// Export a hook for components that need more control
export function useCarouselControls() {
  const [isPaused, setIsPaused] = useState(false)

  const pauseAndResume = useCallback((duration: number = 5000) => {
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), duration)
  }, [])

  return { isPaused, setIsPaused, pauseAndResume }
}
