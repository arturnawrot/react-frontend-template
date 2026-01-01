'use client'
import React, { useState } from 'react'
import { 
  Heart, 
  Download, 
  Mail, 
  Phone, 
  Linkedin, 
  Instagram,
  Facebook,
} from 'lucide-react'
import Link from 'next/link'
import Arrow from '../Arrow/Arrow'
import type { BuildoutProperty, BuildoutBroker } from '@/utils/buildout-api'

interface PropertyDetailsProps {
  property: BuildoutProperty
  brokers?: BuildoutBroker[]
}

// Simple AgentCard component for PropertyDetails
const AgentCard = ({ 
  name, 
  role, 
  license, 
  image, 
  email,
  phone,
  linkedin
}: {
  name: string
  role: string
  license?: string
  image?: string
  email?: string
  phone?: string
  linkedin?: string
}) => {
  return (
    <div className="flex gap-4 mb-6">
      <div className="w-24 h-24 bg-gray-300 rounded-sm flex-shrink-0 overflow-hidden">
        {image && <img src={image} alt={name} className="w-full h-full object-cover" />}
      </div>
      
      <div className="flex flex-col justify-start">
        <h3 className="font-sans font-semibold text-lg text-gray-900">{name}</h3>
        <p className="text-xs text-gray-800 font-medium">{role}</p>
        
        <div className="flex items-center justify-between w-full mt-1">
          <a href="#" className="text-xs text-gray-600 hover:text-black flex items-center gap-1 font-medium group">
            View Agent Profile 
            <Arrow direction="right" size="w-3 h-3" className="transition-transform group-hover:translate-x-1" />
          </a>
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

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, brokers = [] }) => {
  const limeGreen = "bg-[#dce676]"
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isSaved, setIsSaved] = useState(false)

  // Get property images
  const images = property.photos && property.photos.length > 0 
    ? property.photos.map(photo => photo.formats?.large || photo.url || photo.original_file_url)
    : []

  // Format address
  const address = property.address || property.name || 'Property'
  const cityStateZip = [property.city, property.state, property.zip].filter(Boolean).join(', ')
  const fullAddress = cityStateZip ? `${address} | ${cityStateZip}` : address

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
  const propertyType = property.property_type_label_override || 'Property'

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

  // Navigation handlers
  const handlePreviousImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }
  }

  const handleNextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }
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
          <p className="text-lg text-gray-900 font-medium">{fullAddress}</p>
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
            <div className="relative w-full aspect-video bg-gray-200 rounded-sm overflow-hidden mb-4 group">
              <img 
                src={images[currentImageIndex]} 
                alt={`Property ${currentImageIndex + 1}`} 
                className="w-full h-full object-cover"
              />
              
              {/* Overlays */}
              <div className="absolute top-4 left-4 flex gap-2">
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
                    onClick={handlePreviousImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-1 rounded-full text-white"
                  >
                    <Arrow direction="left" variant="chevron" size="w-6 h-6" />
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-1 rounded-full text-white"
                  >
                    <Arrow direction="right" variant="chevron" size="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Favorite Button */}
              <button 
                onClick={() => setIsSaved(!isSaved)}
                className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
              </button>
            </div>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4 mb-12">
              {images.slice(0, 4).map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`aspect-video bg-gray-200 rounded-sm overflow-hidden cursor-pointer hover:opacity-80 ${currentImageIndex === idx ? 'ring-2 ring-gray-400' : ''}`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
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
              {propertyBrokers.map((broker) => (
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
                />
              ))}
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
          <div className="flex items-center gap-6 mt-8">
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
    </div>
  )
}

export default PropertyDetails

