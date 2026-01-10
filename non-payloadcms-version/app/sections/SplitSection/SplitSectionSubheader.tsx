import React from 'react';

interface SplitSectionSubheaderProps {
  children: React.ReactNode;
  className?: string;
}

const SplitSectionSubheader: React.FC<SplitSectionSubheaderProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <p className={className}>
      {children}
    </p>
  );
};

export default SplitSectionSubheader;

