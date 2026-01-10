import React, { useRef } from 'react';
import ArticleCard from 'non-payloadcms-version/app/components/ArticleCard/ArticleCard';
import Arrow from 'non-payloadcms-version/app/components/Arrow/Arrow';

const InsightsSection = () => {
  const scrollRef = useRef(null);

  // Scroll Handler (Native smooth scroll)
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 420; // Card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const articles = [
    {
      id: 1,
      imageSrc: "https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      title: "Top 5 Growth Corridors in 2025 in the United States",
      tags: ["Market", "Trends"]
    },
    {
      id: 2,
      imageSrc: "https://images.unsplash.com/photo-1574958269340-fa927503f3dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1948&q=80",
      title: "Sustainable Urban Planning: The Bridge to the Future",
      tags: ["Eco", "Planning"]
    },
    {
      id: 3,
      imageSrc: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      title: "Nightlife Economies: Revitalizing Downtown Districts",
      tags: ["Urban", "Retail"]
    },
    {
      id: 4,
      imageSrc: "https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      title: "Modern Architecture Trends in Commercial Real Estate",
      tags: ["Design", "Architecture"]
    },
    {
      id: 5,
      imageSrc: "https://images.unsplash.com/photo-1504384308090-c54be3855833?ixlib=rb-4.0.3&auto=format&fit=crop&w=1587&q=80",
      title: "The Shift in Remote Work and Office Space Demand",
      tags: ["Office", "Future"]
    }
  ];

  return (
    <section className="w-full bg-[#dad6cc] py-20 overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* LEFT SECTION: Fixed Content */}
        <div className="lg:col-span-4 flex flex-col justify-between z-10">
          <div>
            <h1 className="text-5xl md:text-6xl font-serif text-[#1a2e2a] leading-[1.1] mb-8">
              Insights That <br /> Shape Smart <br /> Investments
            </h1>
            
            <a href="#" className="inline-flex items-center gap-2 font-bold uppercase tracking-wider text-xs md:text-sm text-[#1a2e2a] hover:opacity-70 transition-opacity">
              Explore More Insights
              <Arrow direction="right" size={16} />
            </a>
          </div>

          {/* Desktop Arrows (positioned at bottom of left col) */}
          <div className="hidden lg:flex gap-4 mt-12">
            <button 
              onClick={() => scroll('left')}
              className="flex items-center justify-center hover:opacity-70 text-[#1a2e2a] transition-opacity"
            >
              <Arrow direction="left" size="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="flex items-center justify-center hover:opacity-70 text-[#1a2e2a] transition-opacity"
            >
              <Arrow direction="right" size="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* RIGHT SECTION: Overflow Slider */}
        {/* We use a min-height to ensure the absolute child has space */}
        <div className="lg:col-span-8 relative min-h-[450px]">
          
          {/* 
            THE TRICK:
            1. 'absolute left-0': Starts the div exactly at the grid line of col-span-8
            2. 'w-screen': Forces width to be 100vw, extending past the container's right edge
            3. 'overflow-x-auto': Enables scrolling within this specific track
          */}
          <div className="lg:absolute left-0 top-0 w-full lg:w-screen h-full">
            <div 
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto h-full pb-8 pr-6 lg:pr-40 scrollbar-hide snap-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {articles.map((article) => (
                <ArticleCard 
                  key={article.id}
                  {...article}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Mobile Arrows (Visible only on mobile) */}
        <div className="flex lg:hidden justify-center gap-4 col-span-1">
          <button 
            onClick={() => scroll('left')}
            className="flex items-center justify-center hover:opacity-70 text-[#1a2e2a] transition-opacity"
          >
            <Arrow direction="left" size="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="flex items-center justify-center hover:opacity-70 text-[#1a2e2a] transition-opacity"
          >
            <Arrow direction="right" size="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default InsightsSection;