import React, { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import AgentCard from '~/components/AgentCard/AgentCard';

// Mock agent data
const agents = [
  {
    id: 1,
    name: "Jordan Collier",
    role: "Agent & Broker",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
    servingLocations: ["Augusta", "Savannah", "Statesboro"],
    serviceTags: ["Land", "Industrial"],
    email: "jordan.collier@example.com",
    phone: "(555) 123-4567",
    linkedin: "https://linkedin.com/in/jordancollier"
  },
  {
    id: 2,
    name: "Jordan Collier",
    role: "Agent & Broker",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
    servingLocations: ["Augusta", "Savannah", "Statesboro"],
    serviceTags: ["Land", "Industrial"],
    email: "jordan.collier@example.com",
    phone: "(555) 123-4567",
    linkedin: "https://linkedin.com/in/jordancollier"
  },
  {
    id: 3,
    name: "Jordan Collier",
    role: "Agent & Broker",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
    servingLocations: ["Augusta", "Savannah", "Statesboro"],
    serviceTags: ["Land", "Industrial"],
    email: "jordan.collier@example.com",
    phone: "(555) 123-4567",
    linkedin: "https://linkedin.com/in/jordancollier"
  },
  {
    id: 4,
    name: "Jordan Collier",
    role: "Agent & Broker",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
    servingLocations: ["Augusta", "Savannah", "Statesboro"],
    serviceTags: ["Land", "Industrial"],
    email: "jordan.collier@example.com",
    phone: "(555) 123-4567",
    linkedin: "https://linkedin.com/in/jordancollier"
  },
  {
    id: 5,
    name: "Jordan Collier",
    role: "Agent & Broker",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
    servingLocations: ["Augusta", "Savannah", "Statesboro"],
    serviceTags: ["Land", "Industrial"],
    email: "jordan.collier@example.com",
    phone: "(555) 123-4567",
    linkedin: "https://linkedin.com/in/jordancollier"
  },
  {
    id: 6,
    name: "Jordan Collier",
    role: "Agent & Broker",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
    servingLocations: ["Augusta", "Savannah", "Statesboro"],
    serviceTags: ["Land", "Industrial"],
    email: "jordan.collier@example.com",
    phone: "(555) 123-4567",
    linkedin: "https://linkedin.com/in/jordancollier"
  },
  {
    id: 7,
    name: "Jordan Collier",
    role: "Agent & Broker",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
    servingLocations: ["Augusta", "Savannah", "Statesboro"],
    serviceTags: ["Land", "Industrial"],
    email: "jordan.collier@example.com",
    phone: "(555) 123-4567",
    linkedin: "https://linkedin.com/in/jordancollier"
  },
  {
    id: 8,
    name: "Jordan Collier",
    role: "Agent & Broker",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
    servingLocations: ["Augusta", "Savannah", "Statesboro"],
    serviceTags: ["Land", "Industrial"],
    email: "jordan.collier@example.com",
    phone: "(555) 123-4567",
    linkedin: "https://linkedin.com/in/jordancollier"
  }
];

const AgentDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Region');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Specialty');
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
    <div className="w-full py-12 md:py-16 px-4 md:px-8 bg-white">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-serif text-[#1C2B28] font-light">
            Agent Directory
          </h1>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border-none rounded bg-[#EBEBE8] text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#CDDC39] text-sm font-medium"
                placeholder="Q Search"
              />
            </div>

            {/* Region Dropdown */}
            <button className="flex items-center justify-between gap-2 bg-[#EBEBE8] hover:bg-[#D4D4D1] text-gray-700 px-4 py-3 rounded text-sm font-semibold transition-colors min-w-[120px]">
              {selectedRegion}
              <ChevronDown size={14} className="opacity-70" />
            </button>

            {/* Specialty Dropdown */}
            <button className="flex items-center justify-between gap-2 bg-[#EBEBE8] hover:bg-[#D4D4D1] text-gray-700 px-4 py-3 rounded text-sm font-semibold transition-colors min-w-[120px]">
              {selectedSpecialty}
              <ChevronDown size={14} className="opacity-70" />
            </button>
          </div>
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              name={agent.name}
              role={agent.role}
              image={agent.image}
              variant={isMobile ? "horizontal" : "vertical"}
              servingLocations={agent.servingLocations}
              serviceTags={agent.serviceTags}
              email={agent.email}
              phone={agent.phone}
              linkedin={agent.linkedin}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentDirectory;

