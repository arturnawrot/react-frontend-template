'use client'
import React, { useState, useEffect, useRef, useCallback, ReactNode, useMemo } from 'react'

export interface CarouselConfig {
  cardWidth: number | [number, number, number]
  gap: number
  transitionDuration?: number
  autoplay?: boolean
  autoplayInterval?: number
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
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  config: CarouselConfig
  trackClassName?: string
  wrapperClassName?: string
  wrapperStyle?: React.CSSProperties
  renderBefore?: (props: CarouselRenderProps) => ReactNode
  renderAfter?: (props: CarouselRenderProps) => ReactNode
  renderLayout?: (props: CarouselTrackElement) => ReactNode
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

  // --- STATE ---
  // Define initialIndex (Start in the middle set)
  const initialIndex = items.length 

  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isPaused, setIsPaused] = useState(false)
  
  // Refs for animation/logic to avoid React Render Cycle interference
  const trackRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const isAnimating = useRef(false)
  const startX = useRef(0)
  const currentDragOffset = useRef(0)
  
  // Physics refs
  const lastX = useRef(0)
  const lastTime = useRef(0)
  const velocity = useRef(0)

  // 1. CREATE ROBUST CLONES
  // We explicitly create 3 sets. 
  // We MUST ensure keys are unique across sets so React doesn't destroy/recreate DOM nodes.
  const extendedItems = useMemo(() => {
    return [
      ...items.map(i => ({ ...i, __clone_id: 'left' })),
      ...items.map(i => ({ ...i, __clone_id: 'center' })),
      ...items.map(i => ({ ...i, __clone_id: 'right' }))
    ]
  }, [items])

  const getCardWidth = useCallback(() => {
    if (typeof window === 'undefined') return Array.isArray(cardWidth) ? cardWidth[2] : cardWidth
    if (Array.isArray(cardWidth)) {
      if (window.innerWidth >= 1024) return cardWidth[2]
      if (window.innerWidth >= 768) return cardWidth[1]
      return cardWidth[0]
    }
    return cardWidth
  }, [cardWidth])

  // Helper: Get pixel position for a specific logical index
  const getOffsetForIndex = useCallback((index: number) => {
    const width = getCardWidth()
    return index * (width + gap)
  }, [gap, getCardWidth])

  // --- MOVEMENT ENGINE ---

  // Immediate DOM manipulation (bypassing React render for speed)
  const setTrackPosition = useCallback((position: number, transition = false, duration = 0) => {
    if (!trackRef.current) return
    trackRef.current.style.transition = transition 
      ? `transform ${duration}ms cubic-bezier(0.25, 1, 0.5, 1)` 
      : 'none'
    trackRef.current.style.transform = `translateX(-${position}px)`
  }, [])

  // 2. SILENT RESET (The Infinite Loop Magic)
  // This ONLY runs when the animation STOPS.
  const checkInfiniteLoop = useCallback(() => {
    const totalReal = items.length
    if (totalReal === 0) return

    // If we landed in the LEFT CLONE set
    if (currentIndex < totalReal) {
      // Jump to CENTER set
      const newIndex = currentIndex + totalReal
      setCurrentIndex(newIndex)
      setTrackPosition(getOffsetForIndex(newIndex), false) // Instant jump
    }
    // If we landed in the RIGHT CLONE set
    else if (currentIndex >= totalReal * 2) {
      // Jump to CENTER set
      const newIndex = currentIndex - totalReal
      setCurrentIndex(newIndex)
      setTrackPosition(getOffsetForIndex(newIndex), false) // Instant jump
    }
  }, [currentIndex, getOffsetForIndex, items.length, setTrackPosition])

  // On mount/resize/index-change, align the track 
  // (Unless we are currently dragging/animating)
  useEffect(() => {
    if (!isDragging.current && !isAnimating.current) {
      setTrackPosition(getOffsetForIndex(currentIndex))
    }
  }, [currentIndex, getOffsetForIndex, setTrackPosition])

  // Cleanup after transition
  const handleTransitionEnd = () => {
    isAnimating.current = false
    checkInfiniteLoop() // <--- THIS is where the "teleport" happens safely
  }

  // --- CONTROLS ---

  const handleNext = useCallback(() => {
    if (isAnimating.current || isDragging.current) return
    isAnimating.current = true
    const nextIndex = currentIndex + 1
    setCurrentIndex(nextIndex)
    setTrackPosition(getOffsetForIndex(nextIndex), true, transitionDuration)
  }, [currentIndex, getOffsetForIndex, transitionDuration, setTrackPosition])

  const handlePrev = useCallback(() => {
    if (isAnimating.current || isDragging.current) return
    isAnimating.current = true
    const prevIndex = currentIndex - 1
    setCurrentIndex(prevIndex)
    setTrackPosition(getOffsetForIndex(prevIndex), true, transitionDuration)
  }, [currentIndex, getOffsetForIndex, transitionDuration, setTrackPosition])

  // Autoplay
  useEffect(() => {
    if (!autoplay || isPaused || isDragging.current) return
    const timer = setInterval(handleNext, autoplayInterval)
    return () => clearInterval(timer)
  }, [autoplay, autoplayInterval, handleNext, isPaused])

  // --- DRAG PHYSICS ---

  const handleDragStart = (clientX: number) => {
    // Immediate pause
    setIsPaused(true)
    isDragging.current = true
    isAnimating.current = false // Cancel any ongoing smooth slides
    
    // Setup physics
    startX.current = clientX
    lastX.current = clientX
    lastTime.current = Date.now()
    velocity.current = 0
    currentDragOffset.current = 0

    if (trackRef.current) {
      trackRef.current.style.cursor = 'grabbing'
      // Snapshot current visual position to avoid jumping if we grabbed mid-transition
      setTrackPosition(getOffsetForIndex(currentIndex))
    }
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging.current) return

    const now = Date.now()
    const dx = clientX - lastX.current
    const dt = now - lastTime.current

    // Update position
    const totalDelta = startX.current - clientX
    currentDragOffset.current = totalDelta
    
    // Calculate Velocity (pixels/ms)
    if (dt > 0) {
      velocity.current = dx / dt
    }

    lastX.current = clientX
    lastTime.current = now

    // Move track directly (1:1 movement)
    const baseOffset = getOffsetForIndex(currentIndex)
    setTrackPosition(baseOffset + totalDelta, false)
  }

  const handleDragEnd = () => {
    if (!isDragging.current) return
    isDragging.current = false
    
    if (trackRef.current) trackRef.current.style.cursor = 'grab'

    // 1. Calculate Momentum
    const itemWidth = getCardWidth() + gap
    // If holding still for 100ms, kill velocity
    if (Date.now() - lastTime.current > 100) velocity.current = 0

    // Momentum multiplier (300 is a natural feeling friction)
    const momentum = -velocity.current * 300 
    const draggedDistance = currentDragOffset.current
    const projectedPixels = draggedDistance + momentum
    
    // 2. Snap to nearest card index
    let slidesToScroll = Math.round(projectedPixels / itemWidth)
    
    // Cap scroll speed (optional, prevents scrolling 100 items at once)
    const maxScroll = Math.floor(items.length / 2)
    slidesToScroll = Math.max(-maxScroll, Math.min(maxScroll, slidesToScroll))

    // 3. Determine new index (ALLOW LANDING ON CLONES)
    const newIndex = currentIndex + slidesToScroll
    
    // 4. Animate to landing
    isAnimating.current = true
    setCurrentIndex(newIndex) // React state updates, but doesn't move DOM yet because of if(!animating) check
    
    // Calculate a nice duration based on how far we are throwing
    // Short flick = fast. Long throw = slower ease out.
    const scrollDistance = Math.abs(slidesToScroll * itemWidth)
    const dynamicDuration = Math.min(transitionDuration + (scrollDistance * 0.5), 800)
    
    setTrackPosition(getOffsetForIndex(newIndex), true, dynamicDuration)

    // Autoplay resume
    if (autoplay) setTimeout(() => setIsPaused(false), pauseDuration)
  }

  // Event Wrappers
  const onMouseDown = (e: React.MouseEvent) => { e.preventDefault(); handleDragStart(e.clientX) }
  const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX)
  const onMouseUp = () => handleDragEnd()
  const onMouseLeave = () => { if (isDragging.current) handleDragEnd() }
  const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX)
  const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX)
  const onTouchEnd = () => handleDragEnd()

  if (items.length === 0) return null

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
          // Initial Render Position
          transform: `translateX(-${getOffsetForIndex(initialIndex)}px)`, 
        }}
        onTransitionEnd={handleTransitionEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {extendedItems.map((item: any, index) => {
          // Generate a strictly unique key based on position + id
          // item.id + which clone set (0, 1, or 2)
          const uniqueKey = getItemKey 
            ? `${getItemKey(item, index)}-${item.__clone_id}`
            : `${index}-${item.__clone_id}`

          return (
            <div key={uniqueKey} className="shrink-0">
              {renderItem(item, index % items.length)}
            </div>
          )
        })}
      </div>
    </div>
  )

  if (renderLayout) return <>{renderLayout({ trackElement, renderProps })}</>

  return (
    <>
      {renderBefore?.(renderProps)}
      {trackElement}
      {renderAfter?.(renderProps)}
    </>
  )
}

// Hook
export function useCarouselControls() {
  const [isPaused, setIsPaused] = useState(false)
  const pauseAndResume = useCallback((duration: number = 5000) => {
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), duration)
  }, [])
  return { isPaused, setIsPaused, pauseAndResume }
}