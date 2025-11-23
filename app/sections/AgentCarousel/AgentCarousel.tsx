import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import styles from "./AgentCarousel.module.scss";

const agents = [
  {
    name: "Jane Smith",
    role: "Agent",
    location: "Augusta",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
  },
  {
    name: "Jordan Collier",
    role: "Agent & Broker",
    location: "Augusta",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop"
  },
  {
    name: "Brian Sweeting",
    role: "Agent & Broker",
    location: "Augusta",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop"
  },
  {
    name: "Sarah Jenkins",
    role: "Agent",
    location: "Savannah",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop"
  }
];

const ArrowIcon = ({ direction }) => (
  <svg 
    className="w-6 h-6" 
    fill="currentColor" 
    viewBox="0 0 20 20"
  >
    {direction === 'left' ? (
      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
    ) : (
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    )}
  </svg>
);

const AgentsSlider = () => {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      // Scroll by the width of a card + gap (approx 340px + 24px)
      const scrollAmount = 364; 
      sliderRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full bg-white py-12 md:py-20 overflow-hidden">
      
      {/* Hide Scrollbar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="max-w-[1600px] w-full mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* LEFT SECTION: Text Content */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8 lg:pr-8">
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">
            Meet Our Agents
          </h3>

          <h1 className="text-5xl md:text-6xl font-serif-display text-[#1a2e28] leading-tight">
            Experience that Performs
          </h1>

          <p className="text-gray-600 leading-relaxed text-lg">
            We're proud to bring a wealth of knowledge and relational capital to every deal and partnership, knowing that trust is a long-term investment.
          </p>

          <a href="#" className="group inline-flex items-center font-medium text-[#1a2e28] hover:opacity-70 transition-opacity mt-2">
            Find an Agent
            <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>

          {/* Desktop Arrows */}
          <div className="hidden lg:flex gap-4 mt-8">
            <button 
              onClick={() => scroll(-1)} 
              className="w-10 h-10 flex items-center justify-center transition-colors hover:text-gray-500 text-[#1a2e28]"
              aria-label="Previous"
            >
              <ArrowIcon direction="left" />
            </button>
            <button 
              onClick={() => scroll(1)} 
              className="w-10 h-10 flex items-center justify-center transition-colors hover:text-gray-500 text-[#1a2e28]"
              aria-label="Next"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
        </div>

        {/* RIGHT SECTION: Slider */}
        <div className="lg:col-span-8 w-full relative">
          <div 
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 snap-x snap-mandatory w-full"
          >
            {agents.map((agent, index) => (
              <div 
                key={index}
                className="min-w-[280px] md:min-w-[340px] h-[450px] md:h-[500px] relative rounded-2xl overflow-hidden snap-start shrink-0 group cursor-pointer"
              >
                <img 
                  src={agent.image} 
                  alt={agent.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f1a] via-transparent to-transparent opacity-90" />
                
                {/* Card Text */}
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{agent.name}</h3>
                  <p className="text-sm text-gray-200 tracking-wide uppercase text-[11px]">
                    {agent.role} <span className="mx-1 opacity-60">|</span> {agent.location}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Arrows (Bottom) */}
          <div className="flex lg:hidden justify-between mt-4 px-2">
            <button 
              onClick={() => scroll(-1)} 
              className="w-10 h-10 flex items-center justify-center text-[#1a2e28]"
              aria-label="Previous"
            >
              <ArrowIcon direction="left" />
            </button>
            <button 
              onClick={() => scroll(1)} 
              className="w-10 h-10 flex items-center justify-center text-[#1a2e28]"
              aria-label="Next"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AgentsSlider;