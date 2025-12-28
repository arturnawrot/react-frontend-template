'use client'
import React, { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { isPropertySaved, togglePropertySaved } from '@/utils/saved-properties'

interface PropertyCardProps {
  property: {
    id?: number
    image: string
    address: string
    cityStateZip: string
    price: string
    sqft: string
    type: string
    agent: string
    badges?: Array<{ text: string; color: string }>
  }
  variant?: 'vertical' | 'horizontal'
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, variant = 'vertical' }) => {
  const isVertical = variant === 'vertical'
  const [isSaved, setIsSaved] = useState(false)

  // Check if property is saved on mount and when property.id changes
  useEffect(() => {
    if (property.id) {
      setIsSaved(isPropertySaved(property.id))
    }
  }, [property.id])

  const handleHeartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (property.id) {
      const newSavedState = togglePropertySaved(property.id)
      setIsSaved(newSavedState)
    }
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border-black/10 border hover:shadow-md transition-shadow flex overflow-hidden group ${isVertical ? 'flex-col h-[280px]' : 'flex-col sm:flex-row h-[140px]'}`}>
      
      {/* Card Image */}
      <div className={`relative flex-shrink-0 ${isVertical ? 'h-48 w-full' : 'w-full sm:w-[240px] h-[140px] sm:h-[140px]'}`}>
        <img 
          src={property.image} 
          alt="Property" 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        {property.badges && property.badges.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {property.badges.map((badge, bIdx) => (
              <span key={bIdx} className={`text-[10px] font-bold px-2 py-1 rounded-sm text-stone-900 ${badge.color}`}>
                {badge.text}
              </span>
            ))}
          </div>
        )}
        <button 
          onClick={handleHeartClick}
          className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-stone-50 transition-colors z-10"
          aria-label={isSaved ? 'Remove from saved properties' : 'Save property'}
        >
          <Heart 
            size={14} 
            className={isSaved ? 'text-red-500 fill-red-500' : 'text-stone-800'} 
          />
        </button>
      </div>

      {/* Card Details */}
      <div className={`flex flex-col justify-center w-full ${isVertical ? 'p-3' : 'py-2 px-4'}`}>
        <h3 className={`font-bold text-stone-900 mb-1 leading-tight ${isVertical ? 'text-lg' : 'text-xl font-serif'}`}>
            {property.address}
        </h3>
        <p className="text-stone-500 text-xs mb-2">{property.cityStateZip}</p>
        
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-stone-700 mb-3">
          <span>{property.price}</span>
          <span className="text-stone-300">|</span>
          <span>{property.sqft}</span>
          <span className="text-stone-300">|</span>
          <span>{property.type}</span>
        </div>

        <div className={`flex items-center gap-2 mt-auto pt-2 ${isVertical ? 'border-t border-stone-100' : ''}`}>
          <div className="w-5 h-5 rounded-full bg-stone-200 overflow-hidden">
             <img src="https://i.pravatar.cc/100?img=5" alt="Agent" className="w-full h-full object-cover" />
          </div>
          <span className="text-[10px] font-bold bg-stone-100 px-2 py-1 rounded-full text-stone-600">
            {property.agent}
          </span>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard

