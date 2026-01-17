'use client'
import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { isPropertySaved, togglePropertySaved } from '@/utils/saved-properties'
import { addressToSlug } from '@/utils/address-slug'
import { useAgentSlugMap } from '@/hooks/useAgentSlugMap'
import styles from './PropertyCard.module.scss'

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
    agentImage?: string | null
    agentSlug?: string | null
    brokerId?: number | null
    badges?: Array<{ text: string; color: string }>
  }
  variant?: 'vertical' | 'horizontal'
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, variant = 'vertical' }) => {
  const isVertical = variant === 'vertical'
  const [isSaved, setIsSaved] = useState(false)
  const agentSlugMap = useAgentSlugMap()

  // Get agent slug from brokerId if available, otherwise use provided agentSlug
  const agentSlug = useMemo(() => {
    if (property.agentSlug) {
      return property.agentSlug
    }
    if (property.brokerId && agentSlugMap.has(property.brokerId)) {
      return agentSlugMap.get(property.brokerId) || null
    }
    return null
  }, [property.agentSlug, property.brokerId, agentSlugMap])

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
    <div className={`bg-white rounded-xl shadow-sm border-black/10 border hover:shadow-md transition-shadow flex overflow-hidden group ${isVertical ? 'flex-col h-[300px]' : 'flex-row h-[127px]'}`}>
      
      {/* Card Image */}
      <div className={`relative flex-shrink-0 overflow-visible ${isVertical ? 'h-40 w-full' : 'w-1/3 h-[127px]'}`}>
        <div className={`w-full h-full overflow-hidden relative ${isVertical ? 'rounded-t-xl' : 'rounded-l-xl'}`}>
          <Image 
            src={property.image} 
            alt="Property" 
            fill
            className="object-cover transform group-hover:scale-105 transition-transform duration-500"
            sizes="33vw"
          />
        </div>
        {property.badges && property.badges.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-20">
            {property.badges.map((badge, bIdx) => (
              <span key={bIdx} className={styles.label}>
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
      <div className={`flex flex-col w-full min-h-0 flex-1 min-w-0 justify-between ${isVertical ? 'p-3' : 'py-2 px-4'}`}>
        {/* Group 1: Title + Address */}
        <div className="flex-shrink-0 min-w-0">
          <Link 
            href={`/property/${addressToSlug(property.address)}`}
            className={`${styles.title} hover:text-stone-700 transition-colors truncate block min-w-0`}
            title={property.address}
          >
            {property.address}
          </Link>
          <span className={styles.address}>{property.cityStateZip}</span>
        </div>

        {/* Group 2: Additional Info + Agent */}
        <div className="flex-shrink-0 min-w-0">
          <div className={`${styles.additionalInfo} flex items-center gap-x-2 overflow-hidden`}>
            <span className="whitespace-nowrap">{property.price}</span>
            {property.sqft && (
              <>
                <span className={`${styles.divider} text-stone-300 flex-shrink-0`}>|</span>
                <span className="whitespace-nowrap">{property.sqft}</span>
              </>
            )}
            <span className={`${styles.divider} text-stone-300 flex-shrink-0`}>|</span>
            <span className="truncate whitespace-nowrap min-w-0">{property.type}</span>
          </div>
          {(() => {
            const agentLabelContent = (
              <>
                <div className="w-4 h-4 rounded-full bg-stone-200 overflow-hidden flex-shrink-0 relative">
                  <Image 
                    src={property.agentImage || 'https://i.pravatar.cc/100?img=5'} 
                    alt={property.agent} 
                    fill
                    className="object-cover" 
                    sizes="16px"
                  />
                </div>
                <span className="truncate">{property.agent}</span>
              </>
            )
            const labelClassName = `${styles.agentLabel} inline-flex items-center gap-1.5 py-1 px-2 rounded-full hover:bg-stone-200 transition-colors mt-1`
            
            return agentSlug ? (
              <Link 
                href={`/agents/${agentSlug}`}
                onClick={(e) => e.stopPropagation()}
                className={labelClassName}
                title={property.agent}
              >
                {agentLabelContent}
              </Link>
            ) : (
              <span className={labelClassName} title={property.agent}>
                {agentLabelContent}
              </span>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

export default PropertyCard

