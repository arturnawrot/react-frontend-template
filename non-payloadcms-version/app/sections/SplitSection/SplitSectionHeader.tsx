import React from 'react';

interface SplitSectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const SplitSectionHeader: React.FC<SplitSectionHeaderProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <h2 className={`text-4xl md:text-5xl font-serif text-[#1a2e2a] leading-tight ${className}`}>
      {children}
    </h2>
  );
};

export default SplitSectionHeader;

