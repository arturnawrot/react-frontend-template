import React from 'react';

export interface CardOnBackgroundProps {
  heading?: string;
  subheading?: string;
  ctaText?: string;
  backgroundImage?: string;
  onCTAClick?: () => void;
}

const defaultHeading = "Commercial Brokerage With Real Momentum";
const defaultSubheading = "We're growing - and always looking for strong talent. If you're client-first, strategic, and hungry to grow, we want to talk.";
const defaultCTAText = "Explore Careers";
const defaultBackgroundImage = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";

export default function CardOnBackground({
  heading = defaultHeading,
  subheading = defaultSubheading,
  ctaText = defaultCTAText,
  backgroundImage = defaultBackgroundImage,
  onCTAClick,
}: CardOnBackgroundProps) {
  return (
    <section className="relative w-full min-h-[600px] md:min-h-[700px] bg-cover bg-center bg-no-repeat overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-black/20" aria-hidden />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-16 md:py-24 h-full flex items-center justify-end">
        {/* White Card */}
        <div className="w-full md:w-[500px] lg:w-[550px] bg-white rounded-2xl md:rounded-3xl p-8 md:p-10 lg:p-12 shadow-xl">
          {/* Heading */}
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1C2B28] mb-6 leading-tight tracking-tight">
            {heading}
          </h2>

          {/* Subheading */}
          {subheading && (
            <p className="text-[#1C2B28] text-base md:text-lg leading-relaxed mb-8 font-sans">
              {subheading}
            </p>
          )}

          {/* CTA Button */}
          {ctaText && (
            <button
              onClick={onCTAClick}
              className="bg-[#DAE684] hover:bg-[#cdd876] text-[#1C2B28] font-semibold py-3 px-8 rounded-full transition-colors duration-300 text-base md:text-lg w-full md:w-auto"
            >
              {ctaText}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

