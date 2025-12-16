import React from 'react';
import { Search, ChevronDown, List, Grid, Share2, RotateCcw } from 'lucide-react';
import PropertyCard from '~/components/PropertyCard/PropertyCard';
import MapBackground from '~/components/MapBackground/MapBackground';

type PropertySearchAdvancedProps = {
  /** Optional background to match the hero; when provided, the top block stays this color */
  backgroundColor?: string;
  /** How far the hero-matched background should extend into the content area */
  backgroundExtendPx?: number;
  /** Layout variant: 'with-map' shows 2 columns with map, 'grid-only' shows single column with 4 properties per row */
  variant?: 'with-map' | 'grid-only';
};

const PropertySearchAdvanced = ({ backgroundColor, backgroundExtendPx = 200, variant = 'with-map', properties = null }: PropertySearchAdvancedProps) => {
  // Mock data - Add more items to test the height stretching if desired

  const mockProperties = Array(4).fill({
    id: 1,
    address: "105 Lancaster St SW",
    cityStateZip: "Aiken, SC 29801",
    price: "$700,000",
    sqft: "4,961 SF",
    type: "Office Space",
    agent: "Jane Smith",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    badges: [
      { text: "For Sale", color: "bg-[#CDDC39]" },
      { text: "Price Reduction - 25k, July 1st", color: "bg-[#D4E157]" }
    ]
  });

  properties = properties || mockProperties;

  return (
    <div
      className="min-h-screen font-sans text-stone-800"
      style={
        backgroundColor
          ? {
              background: `linear-gradient(${backgroundColor} 0px, ${backgroundColor} ${backgroundExtendPx}px, #ffffff ${backgroundExtendPx}px, #ffffff 100%)`,
            }
          : undefined
      }
    >
      {/* Top block shares the hero background when provided */}
      <div className="px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          {/* --- Filter Section --- */}
          <div className="py-6">
            <div className="flex flex-col xl:flex-row gap-4 items-center justify-between w-full">
              
              {/* Search Input */}
              <div className="relative w-full xl:w-96">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Search size={18} className="text-stone-500" />
                 </div>
                 <input 
                   type="text" 
                   className="block w-full pl-10 pr-4 py-3 border-none rounded bg-[#EBEBE8] text-stone-900 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-[#CDDC39] text-sm font-medium" 
                   placeholder="Search" 
                 />
              </div>

              {/* Filter Dropdowns */}
              <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                 {['Brokers', 'Property Type', 'Price Range', 'Sale or Lease', 'Cap Rate'].map((filter) => (
                   <button key={filter} className="flex items-center justify-between gap-2 bg-[#A8B2AD] hover:bg-[#EBEBE8] text-[#1C2B28] px-4 py-3 rounded text-sm font-semibold transition-colors min-w-[120px]">
                     {filter} <ChevronDown size={14} className="opacity-70" />
                   </button>
                 ))}
                 
                 <button className="whitespace-nowrap bg-transparent border border-stone-500 hover:border-white text-stone-400 hover:text-white px-6 py-3 rounded text-sm font-medium ml-auto xl:ml-2 transition-colors">
                   Reset Filters
                 </button>
              </div>
            </div>
          </div>

          {/* --- Toolbar + Heading --- */}
          <div>
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-stone-700 text-white">
                99 Properties For Sale in or near Aiken, SC, USA
              </h2>
              <div className="flex gap-2 items-center">
                 <div className="hidden sm:flex bg-white rounded border border-stone-300 p-1">
                   <button className="p-1.5 hover:bg-stone-100 rounded text-stone-600"><List size={18} /></button>
                   <button className="p-1.5 bg-stone-100 rounded text-stone-800 shadow-sm"><Grid size={18} /></button>
                 </div>
                 <button className="flex items-center gap-1 text-xs font-bold bg-stone-100 px-3 py-2 rounded-md hover:bg-stone-200 text-stone-600 border border-stone-200">
                    <RotateCcw size={12}/> Last Updated
                 </button>
                 <button className="p-2 hover:bg-stone-100 rounded-full text-stone-600 border border-stone-200"><Share2 size={16} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content Section --- */}
      <div className="px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto py-6">
          
          {variant === 'with-map' ? (
            /* 
                Main Flex Container with Map
                items-stretch: Ensures the map column grows to match the grid column height
            */
            <div className="flex flex-col lg:flex-row gap-6 items-stretch">
              
              {/* Left Column: Property Grid (Determines Height) */}
              <div className="w-full lg:w-1/2 flex flex-col">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
                  {properties.map((prop, idx) => (
                    <PropertyCard key={idx} property={prop} variant="vertical" />
                  ))}
                </div>
              </div>

              {/* Right Column: Map (Fills Height) */}
              <div className="w-full lg:w-1/2 relative min-h-[600px] lg:min-h-0">
                 {/* 
                     The container is relative. 
                     The internal div is absolute inset-0 to fill the parent's stretched height.
                     rounded-3xl + overflow-hidden clips the MapBackground.
                 */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-sm border border-stone-200">
                  <MapBackground />
                  
                  {/* Map Controls */}
                  <div className="absolute top-4 left-4 flex bg-white rounded-md shadow-md z-10 overflow-hidden text-sm font-bold text-stone-700">
                    <button className="px-4 py-2 bg-white hover:bg-stone-50">Map</button>
                    <button className="px-4 py-2 bg-white border-l hover:bg-stone-50 text-stone-500 font-normal">Satellite</button>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Grid-only variant: Single column with 4 properties per row */
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {properties.map((prop, idx) => (
                  <PropertyCard key={idx} property={prop} variant="vertical" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertySearchAdvanced;

