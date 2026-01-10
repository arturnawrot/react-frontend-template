import React from 'react';

const AgentCard = ({ src, alt, className }) => (
  <div className={`relative overflow-hidden rounded-3xl aspect-square shadow-sm shrink-0 
    /* SIZING LOGIC: */
    w-36 h-36           /* Mobile: Standard size */
    lg:w-25 lg:h-25     /* Laptop: Smaller to prevent overlap */
    xl:w-35 xl:h-35     /* Desktop: Full size */
    ${className}`}>
    <img 
      src={src} 
      alt={alt} 
      className="w-full h-full object-cover"
    />
  </div>
);

const AgentDecoration = () => {
  const agents = [
    { id: 1, src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop" },
    { id: 2, src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop" },
    { id: 3, src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop" },
    { id: 4, src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop" },
    { id: 5, src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop" },
    { id: 6, src: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop" },
    { id: 7, src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
    { id: 8, src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop" },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-white py-16 lg:py-24">
      
      <div className="flex flex-col items-center justify-center relative w-full z-10">
        
        {/* --- Text & Button Section --- */}
        {/* FIX: Changed max-w-3xl to max-w-lg on laptops (lg) so it doesn't hit images. 
            Restored to max-w-3xl on big screens (xl) */}
        <div className="flex flex-col items-center text-center px-6 mx-auto mb-12 lg:mb-0 
                        max-w-lg xl:max-w-3xl transition-all duration-300">
          
          {/* Responsive Font Sizes: Smaller on laptop (lg), Larger on desktop (xl) */}
          <h2 className="font-serif text-[#1a3b32] mb-8 tracking-tight
                         text-[2.75rem] leading-[1] 
                         lg:text-5xl lg:leading-tight 
                         xl:text-6xl xl:leading-[1]">
            Find the Right <br />
            Partner for Your <br />
            Property Goals
          </h2>
          
          <button className="bg-[#dce775] hover:bg-[#d2dd6e] text-[#1a3b32] font-bold py-4 px-10 rounded-full transition-colors duration-300 text-lg w-full md:w-auto shadow-sm">
            Browse All Agents
          </button>
        </div>

        {/* --- MOBILE: Image Grid --- */}
        <div className="flex lg:hidden flex-col gap-4 w-full mt-4">
            <div className="flex justify-center gap-4 min-w-[120%] -ml-[10%]">
                {agents.slice(0, 5).map((agent) => (
                    <AgentCard key={agent.id} src={agent.src} alt="Agent" />
                ))}
            </div>
            <div className="flex justify-center gap-4">
                {agents.slice(2, 6).map((agent) => (
                    <AgentCard key={agent.id} src={agent.src} alt="Agent" />
                ))}
            </div>
        </div>

        {/* --- DESKTOP: Left Side Images --- */}
        <div className="hidden lg:flex flex-col gap-6 absolute left-0 top-1/2 -translate-y-1/2 
                        xl:left-[-5%] 2xl:left-0 transition-all duration-300">
          <div className="flex gap-2 translate-x-[-40px]">
            {agents.slice(0, 3).map((agent) => (
              <AgentCard key={agent.id} src={agent.src} alt="Agent" />
            ))}
          </div>
          <div className="flex gap-2 translate-x-[-80px]">
            {agents.slice(2, 6).map((agent) => (
              <AgentCard key={agent.id} src={agent.src} alt="Agent" />
            ))}
          </div>
        </div>

        {/* --- DESKTOP: Right Side Images --- */}
        <div className="hidden lg:flex flex-col gap-6 absolute right-0 top-1/2 -translate-y-1/2 
                        xl:right-[-5%] 2xl:right-0 transition-all duration-300">
          <div className="flex gap-2 translate-x-[170px]">
            {agents.slice(2, 5).map((agent) => (
              <AgentCard key={agent.id} src={agent.src} alt="Agent" />
            ))}
          </div>
          <div className="flex gap-2 translate-x-[80px]">
            {agents.slice(4, 8).map((agent) => (
              <AgentCard key={agent.id} src={agent.src} alt="Agent" />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AgentDecoration;