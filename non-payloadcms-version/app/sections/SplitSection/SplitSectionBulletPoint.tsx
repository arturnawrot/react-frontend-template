import React from 'react';

interface SplitSectionBulletPointProps {
  children: React.ReactNode;
  className?: string;
}

const SplitSectionBulletPoint: React.FC<SplitSectionBulletPointProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <li className={`flex items-center gap-3 ${className}`}>
      <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
      {children}
    </li>
  );
};

export default SplitSectionBulletPoint;

