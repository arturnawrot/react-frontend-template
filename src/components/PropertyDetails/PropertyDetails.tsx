'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { 
  Heart, 
  Download, 
  Mail, 
  Phone, 
  Linkedin, 
  Instagram,
  Facebook,
  X,
  Maximize2,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Arrow from '../Arrow/Arrow'
import type { BuildoutProperty, BuildoutBroker } from '@/utils/buildout-api'
import { transformPropertyToCard } from '@/utils/property-transform'
import { getPropertyTypeLabel } from '@/utils/property-types'

// Dynamically import PropertyMap with SSR disabled
const PropertyMap = dynamic(() => import('../PropertyMap/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-stone-600">Loading map...</p>
    </div>
  ),
})

interface PropertyDetailsProps {
  property: BuildoutProperty
  brokers?: BuildoutBroker[]
  brokerIdToAgentSlug?: Record<number, string>
}

// Simple AgentCard component for PropertyDetails
const AgentCard = ({ 
  name, 
  role, 
  license, 
  image, 
  email,
  phone,
  linkedin,
  agentSlug
}: {
  name: string
  role: string
  license?: string
  image?: string
  email?: string
  phone?: string
  linkedin?: string
  agentSlug?: string
}) => {
  return (
    <div className="flex gap-4 mb-6">
      <div className="w-24 h-24 bg-gray-300 rounded-sm flex-shrink-0 overflow-hidden relative">
        {image && <Image src={image} alt={name} fill className="object-cover" sizes="96px" />}
      </div>
      
      <div className="flex flex-col justify-start">
        <h3 className="font-sans font-semibold text-lg text-gray-900">{name}</h3>
        <p className="text-xs text-gray-800 font-medium">{role}</p>
        
        <div className="flex items-center justify-between w-full mt-1">
          {agentSlug ? (
            <Link 
              href={`/agents/${agentSlug}`}
              className="text-xs text-gray-600 hover:text-black flex items-center gap-1 font-medium group"
            >
              View Agent Profile 
              <Arrow direction="right" size="w-3 h-3" className="transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
              View Agent Profile 
              <Arrow direction="right" size="w-3 h-3" />
            </span>
          )}
          {license && <span className="text-[10px] text-gray-500 uppercase tracking-wide ml-4">{license}</span>}
        </div>

        <div className="flex gap-4 mt-3">
          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-black">
              <Mail className="w-4 h-4" /> Email
            </a>
          )}
          {phone && (
            <a href={`tel:${phone}`} className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-black">
              <Phone className="w-4 h-4" /> Phone
            </a>
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-black">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, brokers = [], brokerIdToAgentSlug = {} }) => {
  const limeGreen = "bg-[#dce676]"
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [imageTransition, setImageTransition] = useState(false)
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)
  const fullscreenThumbnailContainerRef = useRef<HTMLDivElement>(null)
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([])
  
  // Drag to scroll state
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const dragStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const clickedThumbnailRef = useRef<number | null>(null)

  // Get property images
  const images = property.photos && property.photos.length > 0 
    ? property.photos.map(photo => photo.formats?.large || photo.url || photo.original_file_url)
    : []

  // Format address
  const address = property.address || property.name || 'Property'
  const cityStateZip = [property.city, property.state, property.zip].filter(Boolean).join(', ')

  // Format price
  let price = 'Price on Request'
  if (property.sale_price_dollars) {
    price = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(property.sale_price_dollars)
  }

  // Format square footage
  const sqft = property.building_size_sf
    ? `${property.building_size_sf.toLocaleString()} SF`
    : 'N/A'

  // Get property type
  const propertyType = property.property_type_label_override || getPropertyTypeLabel(property.property_type_id)

  // Get building class
  const buildingClass = property.building_class || 'N/A'

  // Get year built
  const yearBuilt = property.year_built?.toString() || 'N/A'

  // Get brokers for this property
  const propertyBrokers = property.broker_ids && brokers.length > 0
    ? brokers.filter(broker => property.broker_ids?.includes(broker.id))
    : []

  // Get highlights from sale_bullets or lease_bullets
  const highlights = property.sale_bullets?.length 
    ? property.sale_bullets 
    : property.lease_bullets || []

  // Get description
  const description = property.sale_description || property.lease_description || property.sale_listing_web_description || property.lease_listing_web_description || ''

  // Get PDF URL
  const pdfUrl = property.sale_pdf_url || property.lease_pdf_url || ''

  // Navigation handlers with smooth transition
  const handlePreviousImage = useCallback(() => {
    if (images.length > 0) {
      setImageTransition(true)
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
        setTimeout(() => setImageTransition(false), 50)
      }, 150)
    }
  }, [images.length])

  const handleNextImage = useCallback(() => {
    if (images.length > 0) {
      setImageTransition(true)
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
        setTimeout(() => setImageTransition(false), 50)
      }, 150)
    }
  }, [images.length])

  // Scroll thumbnail into view when image changes (works for both regular and fullscreen)
  useEffect(() => {
    const container = isFullscreen 
      ? fullscreenThumbnailContainerRef.current 
      : thumbnailContainerRef.current
    
    if (thumbnailRefs.current[currentImageIndex] && container) {
      const thumbnail = thumbnailRefs.current[currentImageIndex]
      
      if (thumbnail) {
        const containerRect = container.getBoundingClientRect()
        const thumbnailRect = thumbnail.getBoundingClientRect()
        
        // Check if thumbnail is outside visible area
        if (thumbnailRect.left < containerRect.left) {
          container.scrollTo({
            left: container.scrollLeft + (thumbnailRect.left - containerRect.left) - 16,
            behavior: 'smooth'
          })
        } else if (thumbnailRect.right > containerRect.right) {
          container.scrollTo({
            left: container.scrollLeft + (thumbnailRect.right - containerRect.right) + 16,
            behavior: 'smooth'
          })
        }
      }
    }
  }, [currentImageIndex, images.length, isFullscreen])

  // Prevent page scrolling when fullscreen gallery is open
  useEffect(() => {
    if (isFullscreen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    } else {
      // Restore body scroll
      document.body.style.overflow = ''
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = ''
    }
  }, [isFullscreen])

  // Keyboard navigation for fullscreen
  useEffect(() => {
    if (!isFullscreen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false)
      } else if (e.key === 'ArrowLeft') {
        handlePreviousImage()
      } else if (e.key === 'ArrowRight') {
        handleNextImage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, handlePreviousImage, handleNextImage])

  const openFullscreen = () => {
    setIsFullscreen(true)
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
  }

  // Drag to scroll handlers for thumbnail gallery
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!thumbnailContainerRef.current) return
    const container = thumbnailContainerRef.current
    setIsDragging(true)
    setStartX(e.pageX - container.offsetLeft)
    setScrollLeft(container.scrollLeft)
    dragStartRef.current = { 
      x: e.pageX, 
      y: e.pageY,
      time: Date.now()
    }
    clickedThumbnailRef.current = null
    
    // Find which thumbnail was clicked
    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const thumbnails = container.querySelectorAll('[data-thumbnail-index]')
    thumbnails.forEach((thumb, idx) => {
      const thumbRect = thumb.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      const relativeLeft = thumbRect.left - containerRect.left + container.scrollLeft
      if (x + container.scrollLeft >= relativeLeft && x + container.scrollLeft < relativeLeft + thumbRect.width) {
        clickedThumbnailRef.current = idx
      }
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !thumbnailContainerRef.current || !dragStartRef.current) return
    
    const container = thumbnailContainerRef.current
    const x = e.pageX - container.offsetLeft
    const walk = (x - startX) * 1.5 // Scroll speed multiplier
    
    // Check if user has moved enough to consider it a drag (not a click)
    const deltaX = Math.abs(e.pageX - dragStartRef.current.x)
    const deltaY = Math.abs(e.pageY - dragStartRef.current.y)
    
    // If moved more than 5px, it's a drag
    if (deltaX > 5 || deltaY > 5) {
      e.preventDefault()
      container.scrollLeft = scrollLeft - walk
      clickedThumbnailRef.current = null // Cancel click if dragging
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    setIsDragging(false)
    
    // Check if it was a click (not a drag)
    if (dragStartRef.current) {
      const deltaX = Math.abs(e.pageX - dragStartRef.current.x)
      const deltaY = Math.abs(e.pageY - dragStartRef.current.y)
      const deltaTime = Date.now() - dragStartRef.current.time
      
      // If moved less than 5px and took less than 300ms, it's a click
      if (deltaX < 5 && deltaY < 5 && deltaTime < 300 && clickedThumbnailRef.current !== null) {
        setCurrentImageIndex(clickedThumbnailRef.current)
      }
    }
    
    dragStartRef.current = null
    clickedThumbnailRef.current = null
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    dragStartRef.current = null
    clickedThumbnailRef.current = null
  }

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!thumbnailContainerRef.current) return
    const container = thumbnailContainerRef.current
    setIsDragging(true)
    const touch = e.touches[0]
    setStartX(touch.pageX - container.offsetLeft)
    setScrollLeft(container.scrollLeft)
    dragStartRef.current = { 
      x: touch.pageX, 
      y: touch.pageY,
      time: Date.now()
    }
    clickedThumbnailRef.current = null
    
    // Find which thumbnail was touched
    const rect = container.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const thumbnails = container.querySelectorAll('[data-thumbnail-index]')
    thumbnails.forEach((thumb, idx) => {
      const thumbRect = thumb.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      const relativeLeft = thumbRect.left - containerRect.left + container.scrollLeft
      if (x + container.scrollLeft >= relativeLeft && x + container.scrollLeft < relativeLeft + thumbRect.width) {
        clickedThumbnailRef.current = idx
      }
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !thumbnailContainerRef.current || !dragStartRef.current) return
    
    const container = thumbnailContainerRef.current
    const touch = e.touches[0]
    const x = touch.pageX - container.offsetLeft
    const walk = (x - startX) * 1.5
    
    // Check if user has moved enough to consider it a drag
    const deltaX = Math.abs(touch.pageX - dragStartRef.current.x)
    const deltaY = Math.abs(touch.pageY - dragStartRef.current.y)
    
    if (deltaX > 5 || deltaY > 5) {
      container.scrollLeft = scrollLeft - walk
      clickedThumbnailRef.current = null // Cancel click if dragging
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    setIsDragging(false)
    
    // Check if it was a tap (not a drag)
    if (dragStartRef.current && e.changedTouches[0]) {
      const touch = e.changedTouches[0]
      const deltaX = Math.abs(touch.pageX - dragStartRef.current.x)
      const deltaY = Math.abs(touch.pageY - dragStartRef.current.y)
      const deltaTime = Date.now() - dragStartRef.current.time
      
      // If moved less than 5px and took less than 300ms, it's a tap
      if (deltaX < 5 && deltaY < 5 && deltaTime < 300 && clickedThumbnailRef.current !== null) {
        setCurrentImageIndex(clickedThumbnailRef.current)
      }
    }
    
    dragStartRef.current = null
    clickedThumbnailRef.current = null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans text-gray-800">
      
      {/* Top Navigation */}
      <div className="mb-6">
        <Link 
          href="/property-search" 
          className="flex items-center text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-black"
        >
          <Arrow direction="left" variant="chevron" size="w-4 h-4" className="mr-1" /> Back to Search
        </Link>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-1">{address}</h1>
          {cityStateZip && (
            <p className="text-lg text-gray-900 font-medium">{cityStateZip}</p>
          )}
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <h2 className="text-3xl font-bold text-gray-900">{price}</h2>
          <p className="text-sm font-semibold text-gray-900">Sale Price</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN (Images & Details) */}
        <div className="lg:col-span-2">
          
          {/* Main Image */}
          {images.length > 0 && (
            <div className="relative w-full aspect-video bg-gray-200 rounded-sm overflow-hidden mb-4 group cursor-pointer" onClick={openFullscreen}>
              <Image 
                src={images[currentImageIndex]} 
                alt={`Property ${currentImageIndex + 1}`} 
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              
              {/* Overlays */}
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                {property.sale && property.sale_listing_published && (
                  <span className={`${limeGreen} text-black text-xs font-bold px-3 py-1 rounded-full`}>
                    For Sale
                  </span>
                )}
                {property.lease && property.lease_listing_published && (
                  <span className={`${limeGreen} text-black text-xs font-bold px-3 py-1 rounded-full`}>
                    For Lease
                  </span>
                )}
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePreviousImage()
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-1 rounded-full text-white z-10"
                  >
                    <Arrow direction="left" variant="chevron" size="w-6 h-6" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleNextImage()
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-1 rounded-full text-white z-10"
                  >
                    <Arrow direction="right" variant="chevron" size="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Fullscreen Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  openFullscreen()
                }}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white z-10"
                aria-label="View fullscreen"
              >
                <Maximize2 className="w-5 h-5" />
              </button>

              {/* Favorite Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  setIsSaved(!isSaved)
                }}
                className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 z-10"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
              </button>
            </div>
          )}

          {/* Thumbnails - Scrollable with drag */}
          {images.length > 1 && (
            <div 
              ref={thumbnailContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`flex gap-4 mb-12 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 select-none ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              style={{ 
                scrollbarWidth: 'thin',
                WebkitUserSelect: 'none',
                userSelect: 'none'
              }}
            >
              {images.map((img, idx) => (
                <div 
                  key={idx}
                  data-thumbnail-index={idx}
                  ref={(el) => { thumbnailRefs.current[idx] = el }}
                  className={`relative flex-shrink-0 aspect-video bg-gray-200 rounded-sm overflow-hidden hover:opacity-80 transition-opacity ${
                    currentImageIndex === idx ? 'ring-2 ring-gray-400' : ''
                  }`}
                  style={{ width: 'calc(25% - 12px)', minWidth: '120px', pointerEvents: isDragging ? 'none' : 'auto' }}
                >
                  <Image 
                    src={img} 
                    alt={`Thumbnail ${idx + 1}`} 
                    fill
                    className="object-cover pointer-events-none"
                    draggable={false}
                    sizes="(max-width: 1024px) 25vw, 16vw"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Property Details Table */}
          <div className="mb-10">
            <h2 className="font-serif text-3xl text-gray-800 mb-6">Property Details</h2>
            <div className="border-t border-gray-300">
              <div className="flex justify-between py-4 border-b border-gray-300">
                <span className="font-bold text-gray-800">Sale Price.</span>
                <span className="text-gray-600">{price}</span>
              </div>
              {yearBuilt !== 'N/A' && (
                <div className="flex justify-between py-4 border-b border-gray-300">
                  <span className="font-bold text-gray-800">Year Built.</span>
                  <span className="text-gray-600">{yearBuilt}</span>
                </div>
              )}
              <div className="flex justify-between py-4 border-b border-gray-300">
                <span className="font-bold text-gray-800">Property Type.</span>
                <span className="text-gray-600">{propertyType}</span>
              </div>
              {buildingClass !== 'N/A' && (
                <div className="flex justify-between py-4 border-b border-gray-300">
                  <span className="font-bold text-gray-800">Building Class</span>
                  <span className="text-gray-600">{buildingClass}</span>
                </div>
              )}
              {sqft !== 'N/A' && (
                <div className="flex justify-between py-4 border-b border-gray-300">
                  <span className="font-bold text-gray-800">Building Size</span>
                  <span className="text-gray-600">{sqft}</span>
                </div>
              )}
            </div>
          </div>

          {/* Highlights */}
          {highlights.length > 0 && (
            <div className="mb-10">
              <h2 className="font-serif text-3xl text-gray-800 mb-4">Highlights</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {highlights.map((highlight, idx) => (
                  <li key={idx}>{highlight}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="mb-10">
              <h2 className="font-serif text-3xl text-gray-800 mb-4">Property Description</h2>
              <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                {description}
              </p>
            </div>
          )}

          {/* Map Section */}
          {property.latitude && property.longitude && (
            <div className="mb-10">
              <h2 className="font-serif text-3xl text-gray-800 mb-4">Location</h2>
              <div className="w-full h-[400px] rounded-sm overflow-hidden">
                <PropertyMap
                  properties={[
                    transformPropertyToCard(
                      property,
                      propertyBrokers.length > 0
                        ? `${propertyBrokers[0].first_name} ${propertyBrokers[0].last_name}`
                        : 'Agent',
                      propertyBrokers.length > 0
                        ? propertyBrokers[0].profile_photo_url || null
                        : null
                    ),
                  ]}
                  center={[property.latitude, property.longitude]}
                  zoom={15}
                />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (Sidebar) */}
        <div className="lg:col-span-1">
          
          {/* Download Brochure */}
          {pdfUrl && (
            <a 
              href={pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 border border-black rounded-full py-3 px-4 font-bold text-sm hover:bg-gray-50 mb-10"
            >
              <Download className="w-4 h-4" /> Download Brochure PDF
            </a>
          )}

          {/* Agent Cards */}
          {propertyBrokers.length > 0 && (
            <div className="mb-10">
              {propertyBrokers.map((broker) => {
                const agentSlug = brokerIdToAgentSlug[broker.id]
                return (
                  <AgentCard 
                    key={broker.id}
                    name={`${broker.first_name} ${broker.last_name}`}
                    role={broker.job_title || 'Agent & Broker'}
                    license={broker.licenses && broker.licenses.length > 0 
                      ? `${broker.licenses[0].state} #${broker.licenses[0].number}`
                      : undefined}
                    image={broker.profile_photo_url || undefined}
                    email={broker.email}
                    phone={broker.phone_number || broker.cell_phone}
                    linkedin={broker.linked_in_url || undefined}
                    agentSlug={agentSlug}
                  />
                )
              })}
            </div>
          )}

          {/* Contact Form */}
          <div className="mb-8">
            <h3 className="text-2xl font-serif text-gray-900 mb-2">Interested in This Property.</h3>
            <p className="text-gray-700 font-medium mb-4">Request More Info</p>

            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); }}>
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-gray-400"
              />
              <input 
                type="tel" 
                placeholder="Phone" 
                className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-gray-400"
              />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-gray-400"
              />
              <input 
                type="text" 
                placeholder="Transaction Coordinator" 
                className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-gray-400"
              />
              <textarea 
                placeholder="Message" 
                rows={4}
                className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-gray-400 resize-none"
              ></textarea>
              
              <p className="text-[10px] text-gray-500 mt-2">Terms of Use & Privacy Policy</p>

              <button 
                type="submit" 
                className={`w-full ${limeGreen} text-black font-bold py-3 rounded-full mt-4 hover:opacity-90 transition-opacity`}
              >
                Submit
              </button>
            </form>
          </div>

          {/* Social Share */}
          <div className="flex items-center justify-between mt-8">
            <span className="text-sm font-medium text-gray-900">Share</span>
            <div className="flex gap-4 text-gray-800">
              <Linkedin className="w-6 h-6 cursor-pointer hover:text-black" />
              <Instagram className="w-6 h-6 cursor-pointer hover:text-black" />
              <Facebook className="w-6 h-6 cursor-pointer hover:text-black" />
              <Mail className="w-6 h-6 cursor-pointer hover:text-black" />
            </div>
          </div>

        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {isFullscreen && images.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeFullscreen}
        >
          {/* Close Button */}
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white z-10"
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm z-10">
            {currentImageIndex + 1} / {images.length}
          </div>

          {/* Main Image */}
          <div 
            className="relative w-full h-full flex items-center justify-center px-8 pt-8"
            style={{ paddingBottom: '140px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-w-[90vw] max-h-[calc(100vh-140px)]">
              <Image 
                key={currentImageIndex}
                src={images[currentImageIndex]} 
                alt={`Property ${currentImageIndex + 1}`} 
                fill
                className={`object-contain transition-opacity duration-300 ${
                  imageTransition ? 'opacity-0' : 'opacity-100'
                }`}
                sizes="100vw"
              />
            </div>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePreviousImage()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white z-10"
                aria-label="Previous image"
              >
                <Arrow direction="left" variant="chevron" size="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNextImage()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white z-10"
                aria-label="Next image"
              >
                <Arrow direction="right" variant="chevron" size="w-8 h-8" />
              </button>
            </>
          )}

          {/* Thumbnail Strip at Bottom */}
          {images.length > 1 && (
            <div 
              ref={fullscreenThumbnailContainerRef}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-4 py-2 z-10 scrollbar-gallery"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent',
              }}
            >
              {images.map((img, idx) => (
                <div
                  key={idx}
                  ref={(el) => {
                    thumbnailRefs.current[idx] = el
                  }}
                  data-thumbnail-index={idx}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (idx !== currentImageIndex) {
                      setImageTransition(true)
                      setTimeout(() => {
                        setCurrentImageIndex(idx)
                        setTimeout(() => setImageTransition(false), 50)
                      }, 150)
                    }
                  }}
                  className={`relative flex-shrink-0 w-20 h-20 bg-gray-200 rounded-sm overflow-hidden cursor-pointer hover:opacity-80 transition-opacity ${
                    currentImageIndex === idx ? 'ring-2 ring-white' : 'opacity-60'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" sizes="80px" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PropertyDetails

