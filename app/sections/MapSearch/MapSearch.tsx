import React from 'react';
import { List, Grid, Heart, Share2 } from 'lucide-react';

const MapSearch = () => {
  // Mock data - exactly 4 cards as requested to define height
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
    <div className="p-4 md:p-8 font-sans text-stone-800">
      
      {/* --- ROW 1: Full Width Header & Subheader --- */}
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

      {/* --- ROW 2: Content Grid (Map + Listings) --- */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* --- LEFT COLUMN: Map Placeholder (Hidden on Mobile, Stretches on Desktop) --- */}
        <div className="hidden lg:block w-full h-full min-h-[500px]">
          <div className="relative w-full h-full bg-[#E5F0EC] rounded-3xl overflow-hidden border border-stone-200 shadow-inner">
            
            {/* Map Controls */}
            <div className="absolute top-4 left-4 flex bg-white rounded-md shadow-md z-10 overflow-hidden">
              <button className="px-4 py-2 font-bold text-sm bg-white hover:bg-gray-50">Map</button>
              <button className="px-4 py-2 font-medium text-sm text-gray-500 bg-white border-l hover:bg-gray-50">Satellite</button>
            </div>

            {/* Map Zoom Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-10">
               <button className="w-8 h-8 bg-white rounded shadow flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50">+</button>
               <button className="w-8 h-8 bg-white rounded shadow flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50">-</button>
            </div>

            {/* Boilerplate Map Content */}
            <div className="w-full h-full relative">
              {/* Abstract Map Background */}
              <svg className="w-full h-full bg-[#D6EFE5]" preserveAspectRatio="none">
                <defs>
                   <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                   </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />
                
                {/* Simulated Roads/Rivers */}
                <path d="M-50 100 Q 200 300 500 100 T 1000 400" stroke="white" strokeWidth="4" fill="none" />
                <path d="M200 0 L 300 800" stroke="white" strokeWidth="4" fill="none" />
                <path d="M600 0 Q 500 400 0 600" stroke="white" strokeWidth="4" fill="none" />
              </svg>
              
              {/* Pins */}
              <div className="absolute top-[20%] left-[30%]">
                <div className="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">4</div>
              </div>
              <div className="absolute top-[50%] left-[50%]">
                <div className="w-10 h-10 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">10</div>
              </div>
               <div className="absolute top-[70%] right-[20%]">
                <div className="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">2</div>
              </div>
              
               {/* Location Labels */}
               <span className="absolute top-[25%] left-[28%] translate-x-4 font-semibold text-stone-600 text-sm shadow-white drop-shadow-md">Columbus</span>
               <span className="absolute top-[52%] left-[52%] translate-x-4 font-semibold text-stone-600 text-sm shadow-white drop-shadow-md">Savannah</span>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Property List (Natural Height, No Scroll) --- */}
        <div className="flex flex-col h-full w-full">
          
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

          {/* Cards Stack (No Overflow, Natural Height) */}
          <div className="flex flex-col gap-4">
            {properties.map((prop, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-3 shadow-sm border border-stone-100 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4">
                
                {/* Card Image */}
                <div className="relative w-full sm:w-[240px] h-52 sm:h-auto flex-shrink-0 rounded-xl overflow-hidden group">
                  <img 
                    src={prop.image} 
                    alt="Property" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {prop.badges.map((badge, bIdx) => (
                      <span key={bIdx} className={`text-[10px] font-bold px-2 py-1 rounded-md text-stone-800 ${badge.color}`}>
                        {badge.text}
                      </span>
                    ))}
                  </div>
                  <button className="absolute bottom-3 right-3 bg-white p-1.5 rounded-full shadow-md hover:bg-stone-50 transition-colors">
                    <Heart size={14} className="text-stone-800" />
                  </button>
                </div>

                {/* Card Details */}
                <div className="flex flex-col justify-center w-full py-1 pr-2">
                  <h3 className="text-xl sm:text-2xl font-serif text-stone-900 mb-1 leading-tight">{prop.address}</h3>
                  <p className="text-stone-500 text-sm mb-3">{prop.cityStateZip}</p>
                  
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-stone-800 mb-4">
                    <span>{prop.price}</span>
                    <span className="text-stone-300 hidden sm:inline">|</span>
                    <span>{prop.sqft}</span>
                    <span className="text-stone-300 hidden sm:inline">|</span>
                    <span>{prop.type}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-auto pt-2">
                    <div className="w-6 h-6 rounded-full bg-stone-200 overflow-hidden flex items-center justify-center">
                        <img src="https://i.pravatar.cc/100?img=5" alt="Agent" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-semibold bg-stone-100 px-3 py-1 rounded-full text-stone-600">
                      {prop.agent}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MapSearch;