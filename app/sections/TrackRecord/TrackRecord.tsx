import React, { useRef } from 'react';

// --- Sub-Component: PropertyCard ---
const PropertyCard = ({ image, title, details, agent }) => {
  const hasDetails = details && (details.address || details.price);

  return (
    <div className="relative w-[300px] md:w-[420px] h-[450px] md:h-[540px] shrink-0 snap-start group cursor-pointer overflow-hidden rounded-[2rem]">
      
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
      </div>

      {/* Info Box */}
      <div 
        className={`
          absolute left-6 bottom-6 bg-white rounded-2xl p-6 shadow-xl z-10
          transition-all duration-300
          ${hasDetails ? 'w-[calc(100%-3rem)]' : 'w-auto pr-8'}
        `}
      >
        <h3 className="text-3xl md:text-4xl font-serif text-[#1a2e2a] leading-none tracking-tight">
          {title}
        </h3>

        {hasDetails && (
          <div className="mt-5 animate-fadeIn">
            <div className="mb-5">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">
                {details.address}
              </h4>
              <p className="text-xs text-gray-500 font-medium">
                {details.price} <span className="mx-1 text-gray-300">|</span> {details.size} <span className="mx-1 text-gray-300">|</span> {details.type}
              </p>
            </div>

            {agent && (
              <div className="inline-flex items-center gap-3 bg-gray-100/80 rounded-full py-1.5 pl-1.5 pr-4 border border-gray-100">
                <img src={agent.image} alt={agent.name} className="w-8 h-8 rounded-full object-cover" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-800">
                  {agent.name}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Component ---
const TrackRecordSection = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 460;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const properties = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      title: "Closed in 45 Days",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      title: "Closed in 45 Days",
      details: { address: "105 Lancaster St SW", price: "$700,000", size: "4,961 SF", type: "Office Space" },
      agent: { name: "Jane Smith", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" }
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      title: "Closed in 45 Days",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      title: "Closed in 90 Days",
      details: { address: "220 Business Park Dr", price: "$1,450,000", size: "12,500 SF", type: "Industrial" },
      agent: { name: "Mike Ross", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" }
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1587&q=80",
      title: "Closed in 30 Days",
    },
  ];

  return (
    <section className="w-full bg-[#fdfcf8] py-24">
      {/* 
        Container Logic:
        We don't put a container around the whole section because the slider needs to be full width.
        We put a container around the Header only.
      */}
      
      {/* Header Container */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-16">
        <div className="flex flex-col md:flex-row items-center justify-between relative">
          
          {/* Title Centered */}
          <div className="w-full text-center md:absolute md:left-1/2 md:-translate-x-1/2">
            <h2 className="text-5xl md:text-6xl font-serif text-[#1a2e2a]">
              Proven Track Record
            </h2>
          </div>

          {/* Arrows Right */}
          <div className="hidden md:flex gap-4 ml-auto z-10">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 hover:bg-[#1a2e2a] hover:border-[#1a2e2a] hover:text-white text-[#1a2e2a] transition-all duration-300"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="transform rotate-90">
                <path d="M12 24L0 0h24L12 24z" />
              </svg>
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 hover:bg-[#1a2e2a] hover:border-[#1a2e2a] hover:text-white text-[#1a2e2a] transition-all duration-300"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="transform -rotate-90">
                <path d="M12 24L0 0h24L12 24z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 
        Full Width Slider 
        This div is w-full (screen width).
        The padding logic ensures the first card aligns with the header above,
        regardless of screen size.
      */}
      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto w-full pb-12 scrollbar-hide snap-x"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          // Mobile: 24px (1.5rem) padding
          // Desktop: Calculate distance from edge to the 1600px container start
          paddingLeft: 'max(1.5rem, calc((100vw - 1600px) / 2 + 3rem))',
          paddingRight: 'max(1.5rem, calc((100vw - 1600px) / 2 + 3rem))'
        }}
      >
        {properties.map((prop) => (
          <PropertyCard 
            key={prop.id}
            image={prop.image}
            title={prop.title}
            details={prop.details}
            agent={prop.agent}
          />
        ))}
      </div>

      {/* Mobile Arrows (Bottom Center) */}
      <div className="flex md:hidden justify-center gap-4 px-6">
        <button 
          onClick={() => scroll('left')}
          className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 bg-white text-[#1a2e2a]"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="transform rotate-90">
            <path d="M12 24L0 0h24L12 24z" />
          </svg>
        </button>
        <button 
          onClick={() => scroll('right')}
          className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 bg-white text-[#1a2e2a]"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="transform -rotate-90">
            <path d="M12 24L0 0h24L12 24z" />
          </svg>
        </button>
      </div>

    </section>
  );
};

export default TrackRecordSection;