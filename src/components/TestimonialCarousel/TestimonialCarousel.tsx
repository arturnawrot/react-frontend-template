'use client'
import React, { useState } from 'react'
import type { Page } from '@/payload-types'
import Arrow from '../Arrow/Arrow'
import styles from './TestimonialCarousel.module.scss'

type TestimonialCarouselBlock = Extract<Page['blocks'][number], { blockType: 'testimonialCarousel' }> & {
  testimonials?: Array<{
    quote: string
    author: string
    company?: string
  }>
}

interface TestimonialCarouselProps {
  block: TestimonialCarouselBlock
}

export default function TestimonialCarousel({ block }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Use testimonials from the block (fetched from global set in renderBlocks)
  const testimonials = block.testimonials || []

  // Handle empty testimonials
  if (testimonials.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.emptyState}>
            <p className={styles.preHeader}>Testimonials</p>
            <p className={styles.emptyMessage}>No testimonials available. Please select a testimonial set.</p>
          </div>
        </div>
      </div>
    )
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.preHeader}>Testimonials</p>
        </div>

        <div className={styles.carouselWrapper}>
          <div 
            className={styles.carouselTrack}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className={styles.slide}>
                <div className={styles.slideContent}>
                  <p className={styles.quote}>
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <p className={styles.author}>
                    -{testimonial.author}{testimonial.company ? ` | ${testimonial.company}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.controls}>
          <button
            onClick={prevSlide}
            className={styles.navButton}
            aria-label="Previous testimonial"
          >
            <Arrow direction="up" variant="triangle" size={12} />
          </button>

          <div className={styles.dots}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`${styles.dot} ${index === currentIndex ? styles.active : styles.inactive}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className={styles.navButton}
            aria-label="Next testimonial"
          >
            <Arrow direction="down" variant="triangle" size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}

