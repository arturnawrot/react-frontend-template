import React from 'react';

interface SplitSectionProps {
  imageSrc: string;
  imageAlt?: string;
  isReversed?: boolean;
  children: React.ReactNode;
}

const SplitSection: React.FC<SplitSectionProps> = ({ 
  imageSrc, 
  imageAlt = "Section image", 
  isReversed = false, 
  children 
}) => {
  return (
    <section className="w-full py-16 px-2">
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

export { default as SplitSectionHeader } from './SplitSectionHeader';
export { default as SplitSectionSubheader } from './SplitSectionSubheader';
export { default as SplitSectionBulletPoint } from './SplitSectionBulletPoint';
export { default as SplitSectionBulletList } from './SplitSectionBulletList';
export { default as SplitSectionLink } from './SplitSectionLink';
export { default as SplitSectionContent } from './SplitSectionContent';

export default SplitSection;