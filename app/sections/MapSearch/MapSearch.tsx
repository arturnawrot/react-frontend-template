import React from 'react';
import { List, Grid, Share2, Heart } from 'lucide-react';
import PropertyCard from '~/components/PropertyCard/PropertyCard';
import MapBackground from '~/components/MapBackground/MapBackground';

const MapSearch = () => {
  // Mock data
  const properties = Array(4).fill({
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

  return (
    <div className="p-4 md:p-8 font-sans text-stone-800 bg-stone-50 min-h-screen">
      
      {/* --- 1. Header Section (Restored) --- */}
      <div className="max-w-[1400px] mx-auto mb-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1C2B28] mb-4 tracking-tight">
              Local Insight. National Scale.
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed max-w-2xl">
              Headquartered in the Southeast, our brokers and partners support commercial activity across state lines and sector boundaries.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button className="whitespace-nowrap px-8 py-3 rounded-full border border-stone-800 hover:bg-stone-800 hover:text-white transition-colors font-medium text-sm tracking-wide">
              Explore Properties by Market
            </button>
          </div>
        </div>
      </div>

      {/* --- 2. Main Content (Equal Height Split) --- */}
      <div className="max-w-[1400px] mx-auto">
        
        {/* 
            Flex Container with items-stretch:
            This ensures the Map Column (Left) grows to match the Property List (Right) height.
        */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          
          {/* 
              LEFT COLUMN: Map
              - relative parent
              - absolute inset-0 child
              This combination fills the height provided by the sibling column.
          */}
          <div className="w-full lg:w-1/2 relative min-h-[500px] lg:min-h-0">
            <div className="absolute inset-0 bg-[#E5F0EC] rounded-3xl overflow-hidden border border-stone-200 shadow-inner">
               <MapBackground />
               
               {/* Map Controls */}
               <div className="absolute top-4 left-4 flex bg-white rounded-md shadow-md z-10 overflow-hidden">
                  <button className="px-4 py-2 font-bold text-sm bg-white hover:bg-gray-50">Map</button>
                  <button className="px-4 py-2 font-medium text-sm text-gray-500 bg-white border-l hover:bg-gray-50">Satellite</button>
               </div>
               
               {/* Zoom Controls */}
               <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-10">
                  <button className="w-8 h-8 bg-white rounded shadow flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50">+</button>
                  <button className="w-8 h-8 bg-white rounded shadow flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50">-</button>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Property List */}
          <div className="flex flex-col w-full lg:w-1/2">
            
            {/* List Toolbar */}
            <div className="flex flex-wrap gap-2 justify-between items-center mb-4 pb-2">
              <h2 className="text-lg font-medium text-stone-800">
                99 Properties For Sale in or near Aiken
              </h2>
              <div className="flex gap-2 items-center">
                 <div className="hidden sm:flex bg-white rounded border border-stone-200 p-1">
                   <button className="p-1 hover:bg-stone-100 rounded text-stone-600"><List size={18} /></button>
                   <button className="p-1 hover:bg-stone-100 rounded text-stone-400"><Grid size={18} /></button>
                 </div>
                 <button className="text-xs font-medium bg-stone-100 px-3 py-1.5 rounded hover:bg-stone-200 text-stone-600">Last Updated</button>
                 <button className="p-1.5 hover:bg-stone-100 rounded text-stone-600 border border-transparent hover:border-stone-200"><Share2 size={16} /></button>
              </div>
            </div>

            {/* Cards Stack */}
            <div className="flex flex-col gap-4">
              {properties.map((prop, idx) => (
                <PropertyCard key={idx} property={prop} variant="horizontal" />
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSearch;