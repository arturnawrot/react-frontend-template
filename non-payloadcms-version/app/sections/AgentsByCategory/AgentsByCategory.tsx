import React, { useState, useEffect } from 'react';
import AgentCard from 'non-payloadcms-version/app/components/AgentCard/AgentCard';
import Arrow from 'non-payloadcms-version/app/components/Arrow/Arrow';

const categories = [
  {
    id: 'land',
    title: 'Land / Infill',
    color: 'bg-[#F2F7D5]', // Lightest
    linkText: 'See All Land/Infill Agents'
  },
  {
    id: 'industrial',
    title: 'Industrial / Flex',
    color: 'bg-[#EBF3B6]',
    linkText: 'See All Industrial Agents'
  },
  {
    id: 'retail',
    title: 'Retail / Strip Centers',
    color: 'bg-[#E3EE95]',
    linkText: 'See All Retail Agents'
  },
  {
    id: 'office',
    title: 'Office',
    color: 'bg-[#DCE973]',
    linkText: 'See All Office Agents'
  },
  {
    id: 'multi',
    title: 'Multi-Site Expansion',
    color: 'bg-[#D4E451]', // Darkest (Lime)
    linkText: 'See All Expansion Agents'
  }
];

const mockAgentData = {
  name: "Jordan Collier",
  role: "Agent & Broker",
  image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  servingLocations: ["Augusta", "Savannah", "Statesboro"],
  serviceTags: ["Service Tag", "Service Tag", "Service Tag"],
  email: "jordan@example.com",
  phone: "555-555-5555",
  linkedin: "https://linkedin.com",
};

const AgentsByCategory = () => {
  const [activeId, setActiveId] = useState('land');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="w-full bg-[#FAF9F6]">
      {/* Top Header Section */}
      <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20">
        <h2 className="font-serif text-4xl md:text-5xl text-[#1C2B28] mb-4">
          Expertise That Moves Markets
        </h2>
        <p className="text-[#1C2B28] font-medium text-lg max-w-2xl leading-relaxed">
          Our agents specialize in everything from raw land and infill redevelopment to national net-lease portfolios.
        </p>
      </div>

      {/* Accordion Categories */}
      <div className="flex flex-col">
        {categories.map((cat) => {
          const isOpen = activeId === cat.id;

          return (
            <div 
              key={cat.id} 
              className={`${cat.color} transition-colors duration-300`}
            >
              <div 
                className={`max-w-[1400px] mx-auto px-6 ${isOpen ? 'py-16' : 'py-8 cursor-pointer group'}`}
                onClick={() => !isOpen && setActiveId(cat.id)}
              >
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                  
                  {/* Left Column: Title & Link */}
                  <div className={`flex-shrink-0 lg:w-1/4 ${isOpen ? '' : 'flex items-center'}`}>
                    <h3 className={`font-serif text-3xl md:text-4xl text-[#1C2B28] transition-opacity ${!isOpen && 'group-hover:opacity-70'}`}>
                      {cat.title}
                    </h3>
                    
                    {/* Only show link if open */}
                    {isOpen && (
                      <div className="mt-6 md:mt-12">
                        <a href="#" className="inline-flex items-center gap-2 text-xs font-bold text-[#1C2B28] uppercase tracking-wide hover:opacity-70 transition-opacity">
                          {cat.linkText}
                          <Arrow direction="right" size="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Agent Grid (Only if open) */}
                  {isOpen && (
                    <div className="flex-grow">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {/* Rendering 3 identical cards for demonstration */}
                        {[1, 2, 3].map((item) => (
                          <div key={item} className="w-full">
                            <AgentCard 
                              variant={isMobile ? "horizontal" : "vertical"}
                              {...mockAgentData}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AgentsByCategory;