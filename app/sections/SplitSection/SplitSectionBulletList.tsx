import React from 'react';

interface SplitSectionBulletListProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'tight' | 'normal';
}

const SplitSectionBulletList: React.FC<SplitSectionBulletListProps> = ({ 
  children, 
  className = '',
  spacing = 'normal'
}) => {
  const spacingClass = spacing === 'tight' ? 'space-y-2' : 'space-y-3';
  
  return (
    <ul className={`${spacingClass} text-gray-700 font-medium ${className}`}>
      {children}
    </ul>
  );
};

export default SplitSectionBulletList;

