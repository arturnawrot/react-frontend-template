import { useState } from 'react';
import styles from '../../../.react-router/types/non-payloadcms-version/app/sections/TestimonialCarousel/TestimonialCarousel.module.scss';
import Arrow from 'non-payloadcms-version/app/components/Arrow/Arrow';

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote: "...The Meybohm team helped us expand into three cities and we couldn't trust anyone else.",
      author: "John",
      company: "Company Name"
    },
    {
      quote: "Working with Meybohm transformed our business. Their expertise and dedication were unmatched.",
      author: "Sarah",
      company: "Tech Solutions Inc"
    },
    {
      quote: "The professionalism and attention to detail from the Meybohm team exceeded all our expectations.",
      author: "Michael",
      company: "Growth Partners LLC"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="max-w-[1050px] mx-auto px-4 py-20">
      <div className="mx-auto p-8">
        <div className="text-center mb-8">
          <p className={`${styles.preHeader} text-sm tracking-widest text-gray-500 uppercase mb-4`}>
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
                  <p className={`${styles.header} mb-8`}>
                    "{testimonial.quote}"
                  </p>
                  <p className={`${styles.author}`}>
                    -{testimonial.author} | {testimonial.company}
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
  );
}