import React from 'react';

interface SplitSectionContentProps {
  children: React.ReactNode;
  className?: string;
}

const SplitSectionContent: React.FC<SplitSectionContentProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`space-y-6 md:pl-8 ${className}`}>
      {children}
    </div>
  );
};

export default SplitSectionContent;

