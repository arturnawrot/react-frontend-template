import React from 'react';

const SplitSection = ({ 
  imageSrc, 
  imageAlt = "Section image", 
  isReversed = false, 
  children 
}) => {
  return (
    <section className="w-full bg-[#fdfcf8] py-16 px-2">
      <div 
        className={`
          max-w-7xl mx-auto 
          flex flex-col gap-12 items-center 
          ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'}
        `}
      >
        {/* Image Column */}
        <div className="w-full md:w-1/2">
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <img 
              src={imageSrc} 
              alt={imageAlt} 
              className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700 ease-out" 
            />
          </div>
        </div>

        {/* Content Column (Passable Elements) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          {children}
        </div>
      </div>
    </section>
  );
};

export default SplitSection;