'use client'
import React, { useState } from 'react'
import type { Page } from '@/payload-types'
import Arrow from '../Arrow/Arrow'

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
      <div className="max-w-[1050px] mx-auto px-4">
        <div className="mx-auto p-8">
          <div className="text-center mb-8">
            <p className="text-sm tracking-widest text-gray-500 uppercase mb-4">
              Testimonials
            </p>
            <p className="text-gray-500">No testimonials available. Please select a testimonial set.</p>
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
    <div className="max-w-[1050px] mx-auto px-0 md:px-4 overflow-visible">
      <div className="mx-auto px-4 py-8 md:p-8">
        <div className="text-center mb-8">
          <p className="text-sm tracking-widest text-gray-500 uppercase mb-4">
            Testimonials
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4">
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-serif text-[#1a2e2a] mb-8">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <p className="text-lg text-gray-600">
                    -{testimonial.author}{testimonial.company ? ` | ${testimonial.company}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-12">
          <button
            onClick={prevSlide}
            className="p-2 hover:opacity-70 transition-opacity"
            aria-label="Previous testimonial"
          >
            <Arrow direction="left" variant="chevron" size="w-6 h-6" className="text-gray-700" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 h-3 bg-gray-900 rounded-full'
                    : 'w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="p-2 hover:opacity-70 transition-opacity"
            aria-label="Next testimonial"
          >
            <Arrow direction="right" variant="chevron" size="w-6 h-6" className="text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  )
}

