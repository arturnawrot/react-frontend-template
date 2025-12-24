'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import type { PropertyCardData } from '@/utils/property-transform'

interface PropertyMapProps {
  properties: PropertyCardData[]
  onBoundsChange?: (bounds: any, visibleProperties: PropertyCardData[]) => void
  mapType?: 'map' | 'satellite'
  onMapTypeChange?: (type: 'map' | 'satellite') => void
}


const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  onBoundsChange,
  mapType = 'map',
  onMapTypeChange,
}) => {
  const [isClient, setIsClient] = useState(false)
  const [mapComponents, setMapComponents] = useState<any>(null)
  const mapRef = useRef<any>(null)
  const [zoom, setZoom] = useState(6)

  // Load leaflet and react-leaflet only on client
  useEffect(() => {
    if (typeof window === 'undefined') return

    const loadMap = async () => {
      try {
        // Import leaflet
        const L = await import('leaflet' as any)
        // Fix for default marker icons in Next.js
        delete (L.default.Icon.Default.prototype as any)._getIconUrl
        L.default.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        })

        // Import react-leaflet
        const reactLeaflet = await import('react-leaflet' as any)
        
        // Import CSS
        await import('leaflet/dist/leaflet.css' as any)

        setMapComponents({
          L: L.default,
          MapContainer: reactLeaflet.MapContainer,
          TileLayer: reactLeaflet.TileLayer,
          Marker: reactLeaflet.Marker,
          useMap: reactLeaflet.useMap,
          useMapEvents: reactLeaflet.useMapEvents,
        })
        setIsClient(true)
      } catch (error) {
        console.error('Error loading map components:', error)
      }
    }

    loadMap()
  }, [])

  // Calculate center from properties
  const center: [number, number] =
    properties.length > 0
      ? [
          properties.reduce((sum, p) => sum + p.latitude, 0) / properties.length,
          properties.reduce((sum, p) => sum + p.longitude, 0) / properties.length,
        ]
      : [33.749, -84.388] // Default to Atlanta, GA

  // Create custom property icon
  const createPropertyIcon = () => {
    if (!mapComponents?.L) return null
    return mapComponents.L.divIcon({
      className: 'custom-property-icon',
      html: `<div class="property-marker"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    })
  }

  // MapEventHandler component
  const MapEventHandler = ({ onBoundsChange, properties, onZoomChange }: {
    onBoundsChange?: (bounds: any, visibleProperties: PropertyCardData[]) => void
    properties: PropertyCardData[]
    onZoomChange?: (zoom: number) => void
  }) => {
    if (!mapComponents?.useMap || !mapComponents?.useMapEvents) return null
    
    const map = mapComponents.useMap()

    const updateVisibleProperties = React.useCallback(() => {
      if (!map) return
      const bounds = map.getBounds()
      const visibleProperties = properties.filter((prop) => {
        return bounds.contains([prop.latitude, prop.longitude])
      })
      onBoundsChange?.(bounds, visibleProperties)
    }, [map, properties, onBoundsChange])

    mapComponents.useMapEvents({
      moveend: updateVisibleProperties,
      zoomend: () => {
        if (!map) return
        const zoom = map.getZoom()
        onZoomChange?.(zoom)
        updateVisibleProperties()
      },
    })

    // Initial bounds check and update when properties change
    useEffect(() => {
      if (!map) return
      // Wait for map to be ready
      const timer = setTimeout(() => {
        updateVisibleProperties()
      }, 100)
      
      return () => clearTimeout(timer)
    }, [map, updateVisibleProperties])

    return null
  }

  if (!isClient || !mapComponents) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-stone-600">Loading map...</p>
      </div>
    )
  }

  const { MapContainer, TileLayer, Marker } = mapComponents

  return (
    <div className="relative w-full h-full" style={{ height: '100%', minHeight: '600px' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(map: any) => {
          mapRef.current = map
          setZoom(map.getZoom())
        }}
      >
        <TileLayer
          url={
            mapType === 'satellite'
              ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render individual property markers */}
        {properties.map((property) => {
          const propertyIcon = createPropertyIcon()
          
          if (!propertyIcon) return null
          
          return (
            <Marker
              key={`property-${property.id}`}
              position={[property.latitude, property.longitude]}
              icon={propertyIcon}
            />
          )
        })}

        <MapEventHandler 
          onBoundsChange={onBoundsChange} 
          properties={properties}
          onZoomChange={setZoom}
        />
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute top-4 left-4 flex bg-white rounded-md shadow-md z-[1000] overflow-hidden">
        <button
          onClick={() => onMapTypeChange?.('map')}
          className={`px-4 py-2 font-bold text-sm ${
            mapType === 'map' ? 'bg-white' : 'text-gray-500 bg-white hover:bg-gray-50'
          }`}
        >
          Map
        </button>
        <button
          onClick={() => onMapTypeChange?.('satellite')}
          className={`px-4 py-2 font-medium text-sm border-l ${
            mapType === 'satellite' ? 'bg-white' : 'text-gray-500 bg-white hover:bg-gray-50'
          }`}
        >
          Satellite
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-[1000]">
        <button
          onClick={() => {
            mapRef.current?.zoomIn()
          }}
          className="w-8 h-8 bg-white rounded shadow flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50"
        >
          +
        </button>
        <button
          onClick={() => {
            mapRef.current?.zoomOut()
          }}
          className="w-8 h-8 bg-white rounded shadow flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50"
        >
          -
        </button>
      </div>

      <style jsx global>{`
        .custom-property-icon {
          background: transparent;
          border: none;
        }
        .property-marker {
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          transition: transform 0.2s;
        }
        .property-marker:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  )
}

export default PropertyMap
