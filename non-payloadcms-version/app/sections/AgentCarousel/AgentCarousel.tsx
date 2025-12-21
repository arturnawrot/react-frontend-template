import React, { useState, useEffect, useRef, useCallback } from 'react';
import Arrow from 'non-payloadcms-version/app/components/Arrow/Arrow';

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

// Replicate list 3 times to create a buffer for infinite scrolling
// Set 1: Buffer for Prev
// Set 2: The Main View
// Set 3: Buffer for Next
const extendedAgents = [...agents, ...agents, ...agents];

const AgentCarousel = () => {
  // Start at the beginning of the middle set
  const [currentIndex, setCurrentIndex] = useState(agents.length);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);

  // Configuration
  const CARD_WIDTH = 340; // Base width
  const GAP = 24;         // Gap between cards
  const TRANSITION_DURATION = 500; // ms

  // Calculate shift based on index
  // We use a CSS variable for the shift to keep the render clean, or inline style
  const getTransform = () => {
    const shift = currentIndex * (CARD_WIDTH + GAP);
    return `translateX(-${shift}px)`;
  };

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [isTransitioning]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [isTransitioning]);

  // Autoplay Effect
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(timer);
  }, [handleNext, isPaused]);

  // Infinite Loop Logic (The Snap Back)
  // This runs every time the transition ends to check if we need to teleport
  const handleTransitionEnd = () => {
    setIsTransitioning(false);

    const totalReal = agents.length;
    
    // If we've scrolled past the middle set into the 3rd set (Clone)
    if (currentIndex >= totalReal * 2) {
      // Snap back to the start of the middle set
      // Disable transition temporarily is handled by removing the class in render based on state? 
      // Actually, we must force a reflow or simply switch index with transition: 'none'
      trackRef.current.style.transition = 'none';
      const newIndex = currentIndex - totalReal;
      setCurrentIndex(newIndex);
      // Force layout update
      trackRef.current.style.transform = `translateX(-${newIndex * (CARD_WIDTH + GAP)}px)`;
      
      // Re-enable transition after a tiny delay
      requestAnimationFrame(() => {
         requestAnimationFrame(() => {
            trackRef.current.style.transition = '';
         });
      });
    } 
    
    // If we've scrolled backwards into the 1st set (Clone)
    else if (currentIndex < totalReal) {
      trackRef.current.style.transition = 'none';
      const newIndex = currentIndex + totalReal;
      setCurrentIndex(newIndex);
      trackRef.current.style.transform = `translateX(-${newIndex * (CARD_WIDTH + GAP)}px)`;
      
      requestAnimationFrame(() => {
         requestAnimationFrame(() => {
            trackRef.current.style.transition = '';
         });
      });
    }
  };

  return (
    <div className="w-full py-12 md:py-20 overflow-x-hidden">
      
      <div className="max-w-[1600px] w-full mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* LEFT SECTION: Content */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8 lg:pr-8 z-10">
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">
            Meet Our Agents
          </h3>

          <h1 className="text-5xl md:text-6xl font-serif-display text-[#1a2e28] leading-tight">
            Experience that Performs
          </h1>

          <p className="text-gray-600 leading-relaxed text-lg">
            We're proud to bring a wealth of knowledge and relational capital to every deal and partnership.
          </p>

          <a href="#" className="group inline-flex items-center font-medium text-[#1a2e28] hover:opacity-70 transition-opacity mt-2">
            Find an Agent
            <Arrow direction="right" size="w-4 h-4" className="ml-2 transition-transform group-hover:translate-x-1" />
          </a>

          {/* Desktop Arrows */}
          <div className="hidden lg:flex gap-4 mt-8">
            <button 
              onClick={() => {
                setIsPaused(true);
                handlePrev();
                // Resume autoplay after 5 seconds of inactivity
                setTimeout(() => setIsPaused(false), 5000);
              }}
              className="flex items-center justify-center transition-colors hover:opacity-70 text-[#1a2e28]"
            >
              <Arrow direction="left" variant="fill" size="w-6 h-6" />
            </button>
            <button 
              onClick={() => {
                setIsPaused(true);
                handleNext();
                setTimeout(() => setIsPaused(false), 5000);
              }}
              className="flex items-center justify-center transition-colors hover:opacity-70 text-[#1a2e28]"
            >
              <Arrow direction="right" variant="fill" size="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* RIGHT SECTION: Infinite Slider */}
        <div className="lg:col-span-8 relative h-[450px] md:h-[500px]">
          
          {/* 
              Position absolute with w-screen allows the track to extend to the right edge 
              of the viewport while starting aligned with this column.
          */}
          <div className="absolute left-0 top-0 h-full w-screen overflow-hidden">
            <div 
              ref={trackRef}
              className="flex gap-6 h-full will-change-transform"
              style={{ 
                transform: getTransform(),
                transition: isTransitioning ? `transform ${TRANSITION_DURATION}ms ease-in-out` : 'none'
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedAgents.map((agent, index) => (
                <div 
                  key={index}
                  className="w-[280px] md:w-[340px] h-full relative rounded-2xl overflow-hidden shrink-0 group cursor-pointer"
                >
                  <img 
                    src={agent.image} 
                    alt={agent.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f1a] via-transparent to-transparent opacity-90" />
                  
                  <div className="absolute bottom-0 left-0 p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-bold mb-1">{agent.name}</h3>
                    <p className="text-sm text-gray-200 tracking-wide uppercase text-[11px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                      {agent.role} <span className="mx-1 opacity-60">|</span> {agent.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Arrows */}
        <div className="flex lg:hidden justify-center gap-4 mt-8 col-span-1 w-full">
          <button 
            onClick={() => {
              setIsPaused(true);
              handlePrev();
              setTimeout(() => setIsPaused(false), 5000);
            }}
            className="flex items-center justify-center hover:opacity-70 text-[#1a2e28] transition-opacity"
          >
            <Arrow direction="left" variant="fill" size="w-6 h-6" />
          </button>
          <button 
            onClick={() => {
              setIsPaused(true);
              handleNext();
              setTimeout(() => setIsPaused(false), 5000);
            }}
            className="flex items-center justify-center hover:opacity-70 text-[#1a2e28] transition-opacity"
          >
            <Arrow direction="right" variant="fill" size="w-6 h-6" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default AgentCarousel;