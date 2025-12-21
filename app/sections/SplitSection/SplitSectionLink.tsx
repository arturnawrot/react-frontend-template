import React from 'react';
import Arrow from '~/components/Arrow/Arrow';

interface SplitSectionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const SplitSectionLink: React.FC<SplitSectionLinkProps> = ({ 
  href, 
  children, 
  className = '' 
}) => {
  return (
    <div className={`pt-4 ${className}`}>
      <a 
        href={href} 
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-[#1a2e2a] transition-colors border-b border-transparent hover:border-gray-800 pb-0.5"
      >
        {children}
        <Arrow direction="right" variant="fill" size={16} />
      </a>
    </div>
  );
};

export default SplitSectionLink;

