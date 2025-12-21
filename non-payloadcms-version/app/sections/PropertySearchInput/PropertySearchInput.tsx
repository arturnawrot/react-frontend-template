import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

const PropertySearch = () => {
  return (
    <div className="relative w-full font-sans">
      {/* Main Content Container */}
      <div className="relative max-w-[1200px] mx-auto px-4 py-8 md:py-24">
        
        {/* Beige Card */}
        <div className="bg-[#DCD7CC] rounded-[2.5rem] shadow-xl px-6 py-12 md:px-12 md:py-16 text-center">
            
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-serif text-[#1C2B28] mb-10 tracking-tight leading-tight">
            Search Commercial Properties for Sale
          </h2>

          {/* Search Bar (Pill Shape) */}
          <div className="bg-white rounded-[2rem] p-2 shadow-sm flex flex-col lg:flex-row lg:items-center divide-y lg:divide-y-0 lg:divide-x divide-stone-200 max-w-5xl mx-auto">
              
              {/* Field 1: Location */}
              <div className="flex-grow px-4 md:px-6 py-3 text-left group cursor-text relative">
                  <label className="block text-[10px] font-bold tracking-[0.15em] text-stone-500 uppercase mb-1">
                    Location
                  </label>
                  <input 
                      type="text" 
                      placeholder="Search by address, city, state, or zip" 
                      className="w-full text-stone-700 placeholder-stone-400 focus:outline-none bg-transparent text-sm md:text-base truncate pr-2"
                  />
              </div>

              {/* Field 2: Property Type */}
              <div className="flex-shrink-0 px-4 md:px-6 py-3 text-left cursor-pointer hover:bg-stone-50 transition-colors lg:w-[200px]">
                  <label className="block text-[10px] font-bold tracking-[0.15em] text-stone-500 uppercase mb-1">
                    Property Type
                  </label>
                  <div className="flex items-center justify-between">
                      <span className="text-stone-400 text-sm md:text-base">Select Property Type</span>
                      <ChevronDown size={14} className="text-stone-400" />
                  </div>
              </div>

              {/* Field 3: Price Range */}
               <div className="flex-shrink-0 px-4 md:px-6 py-3 text-left cursor-pointer hover:bg-stone-50 transition-colors lg:w-[180px]">
                  <label className="block text-[10px] font-bold tracking-[0.15em] text-stone-500 uppercase mb-1">
                    Price Range
                  </label>
                   <div className="flex items-center justify-between">
                      <span className="text-stone-400 text-sm md:text-base">Select Type</span>
                      <ChevronDown size={14} className="text-stone-400" />
                  </div>
              </div>

               {/* Field 4: Square Footage & Button */}
               <div className="flex-shrink-0 pl-4 md:pl-6 pr-2 py-2 text-left flex flex-col lg:flex-row lg:items-center justify-between lg:w-[320px]">
                  <div className="flex-grow cursor-pointer hover:bg-stone-50 transition-colors rounded p-1 -ml-1">
                      <label className="block text-[10px] font-bold tracking-[0.15em] text-stone-500 uppercase mb-1">
                        Square Footage
                      </label>
                       <div className="flex items-center justify-between lg:justify-start lg:gap-2">
                          <span className="text-stone-400 text-sm md:text-base">Select Type</span>
                          <ChevronDown size={14} className="text-stone-400 lg:hidden" />
                      </div>
                  </div>
                  
                   {/* Search Button */}
                   <button className="mt-4 lg:mt-0 bg-[#CDDC39] hover:bg-[#c3d135] text-[#1C2B28] rounded-full px-6 py-3 lg:py-3.5 flex items-center justify-center gap-2 font-medium transition-transform active:scale-95 shadow-sm min-w-fit">
                      Search <Search size={18} strokeWidth={2.5} />
                  </button>
              </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertySearch;