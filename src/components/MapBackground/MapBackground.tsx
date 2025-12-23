'use client'
import React from 'react'

interface MapBackgroundProps {
  className?: string
}

const MapBackground: React.FC<MapBackgroundProps> = ({ className = "" }) => {
  return (
    <div className={`w-full h-full relative bg-[#D6EFE5] overflow-hidden ${className}`}>
      <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none">
        <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />
        <path d="M-50 100 Q 400 600 800 200 T 1600 500" stroke="white" strokeWidth="6" fill="none" />
        <path d="M400 0 L 600 1200" stroke="white" strokeWidth="6" fill="none" />
        <path d="M1200 0 Q 1000 600 200 1000" stroke="white" strokeWidth="6" fill="none" />
      </svg>
      
      {/* Abstract Pins */}
      {[
        { top: '20%', left: '40%', val: 4 },
        { top: '45%', left: '60%', val: 2 },
        { top: '60%', left: '75%', val: 10 },
        { top: '30%', left: '80%', val: 2 },
        { top: '80%', left: '50%', val: 5 },
      ].map((pin, i) => (
        <div key={i} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ top: pin.top, left: pin.left }}>
          <div className="w-8 h-8 bg-[#3B82F6] rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform cursor-pointer">
            {pin.val}
          </div>
        </div>
      ))}
    </div>
  )
}

export default MapBackground

