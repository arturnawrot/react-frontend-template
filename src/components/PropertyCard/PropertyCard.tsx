'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { isPropertySaved, togglePropertySaved } from '@/utils/saved-properties'
import { addressToSlug } from '@/utils/address-slug'

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
    <div className={`bg-white rounded-xl shadow-sm border-black/10 border hover:shadow-md transition-shadow flex overflow-hidden group ${isVertical ? 'flex-col h-[300px]' : 'flex-col sm:flex-row h-[127px]'}`}>
      
      {/* Card Image */}
      <div className={`relative flex-shrink-0 overflow-visible ${isVertical ? 'h-40 w-full' : 'w-full sm:w-[240px] h-[127px] sm:h-[127px]'}`}>
        <div className="w-full h-full overflow-hidden rounded-t-xl sm:rounded-l-xl sm:rounded-t-none">
          <img 
            src={property.image} 
            alt="Property" 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        {property.badges && property.badges.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-20">
            {property.badges.map((badge, bIdx) => (
              <span key={bIdx} className={`text-[10px] font-bold px-2 py-1 rounded-sm text-stone-900 ${badge.color}`}>
                {badge.text}
              </span>
            ))}
          </div>
        )}
        <button 
          onClick={handleHeartClick}
          className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-stone-50 transition-colors z-20"
          aria-label={isSaved ? 'Remove from saved properties' : 'Save property'}
        >
          <Heart 
            size={14} 
            className={isSaved ? 'text-red-500 fill-red-500' : 'text-stone-800'} 
          />
        </button>
      </div>

      {/* Card Details */}
      <div className={`flex flex-col w-full min-h-0 flex-1 ${isVertical ? 'p-3 justify-between' : 'py-2 px-4 justify-center'}`}>
        <div className="flex-shrink-0">
          <Link 
            href={`/property/${addressToSlug(property.address)}`}
            className={`font-bold text-stone-900 mb-1 leading-tight hover:text-stone-700 transition-colors truncate block ${isVertical ? 'text-lg' : 'text-xl font-serif'}`}
            title={property.address}
          >
            {property.address}
          </Link>
          <p className="text-stone-500 text-xs mb-2">{property.cityStateZip}</p>
          
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-stone-700 mb-2">
            <span>{property.price}</span>
            <span className="text-stone-300">|</span>
            <span>{property.sqft}</span>
            <span className="text-stone-300">|</span>
            <span>{property.type}</span>
          </div>
        </div>

        <div className={`flex items-center gap-2 flex-shrink-0 ${isVertical ? 'pt-2 mt-1 border-t border-stone-100' : 'pt-1'}`}>
          <div className="w-5 h-5 rounded-full bg-stone-200 overflow-hidden flex-shrink-0">
             <img src="https://i.pravatar.cc/100?img=5" alt="Agent" className="w-full h-full object-cover" />
          </div>
          <span className="text-[10px] font-bold bg-stone-100 px-2.5 py-1.5 rounded-full text-stone-600 truncate min-w-0" title={property.agent}>
            {property.agent}
          </span>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard

