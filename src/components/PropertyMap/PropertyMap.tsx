'use client'
import React, { useState, useEffect, useRef } from 'react'
import type { PropertyCardData } from '@/utils/property-transform'
import { filterValidCoordinates } from '@/utils/property-utils'
import PropertyCard from '../PropertyCard/PropertyCard'

interface LeafletBounds {
  north: number
  south: number
  east: number
  west: number
}

interface LeafletMapInstance {
  getContainer: () => HTMLElement
  latLngToContainerPoint: (latlng: { lat: number; lng: number }) => { x: number; y: number }
}

interface LeafletMarkerEvent {
  target: {
    _map: LeafletMapInstance
  }
  latlng: { lat: number; lng: number }
}

interface PropertyMapProps {
  properties: PropertyCardData[]
  onBoundsChange?: (bounds: LeafletBounds, visible: PropertyCardData[]) => void
  mapType?: 'map' | 'satellite'
  onMapTypeChange?: (type: 'map' | 'satellite') => void
  center?: [number, number]
  zoom?: number
}

// Internal map component that uses Leaflet (only rendered on client)
function LeafletMap({
  properties,
  onBoundsChange,
  mapType = 'map',
  center: propCenter,
  zoom: propZoom,
}: PropertyMapProps) {
  const [mounted, setMounted] = useState(false)
  const [hoveredProperty, setHoveredProperty] = useState<PropertyCardData | null>(null)
  const [cardPosition, setCardPosition] = useState<{ x: number; y: number } | null>(null)
  const [MapContainer, setMapContainer] = useState<any>(null)
  const [TileLayer, setTileLayer] = useState<any>(null)
  const [Marker, setMarker] = useState<any>(null)
  const [L, setL] = useState<any>(null)
  const useMapHookRef = useRef<any>(null)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isHoveringMarkerRef = useRef(false)
  const isHoveringCardRef = useRef(false)
  const isInGracePeriodRef = useRef(false)
  const lastHoveredPropertyRef = useRef<PropertyCardData | null>(null)
  const lastCardPositionRef = useRef<{ x: number; y: number } | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [mapReady, setMapReady] = useState(false)

  // Load Leaflet CSS and libraries only on client
  useEffect(() => {
    // Add Leaflet CSS via link tag to avoid webpack/HMR issues
    // This approach avoids the module factory error
    if (typeof document !== 'undefined') {
      const linkId = 'leaflet-css'
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link')
        link.id = linkId
        link.rel = 'stylesheet'
        // Use CDN to avoid webpack processing the CSS file
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
        link.crossOrigin = ''
        document.head.appendChild(link)
      }
    }

    Promise.all([
      import('react-leaflet'),
      import('leaflet'),
    ]).then(([reactLeaflet, leaflet]) => {
      const L = leaflet.default
      
      // Fix for default marker icons in Next.js
      delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      setMapContainer(reactLeaflet.MapContainer)
      setTileLayer(reactLeaflet.TileLayer)
      setMarker(reactLeaflet.Marker)
      useMapHookRef.current = reactLeaflet.useMap // Store the hook function in ref
      setL(L)
      setMounted(true)
    })
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [])

  // Aggressive periodic check to ensure card hides when not hovering
  // This is the primary mechanism since mouseout events may not fire reliably
  useEffect(() => {
    if (!mounted) return

    const checkInterval = setInterval(() => {
      // If card is visible but we're not hovering marker or card, hide it immediately
      // This check runs continuously and will catch any case where refs are false
      // BUT respect the grace period to allow moving from pin to card
      if (hoveredProperty && !isHoveringMarkerRef.current && !isHoveringCardRef.current && !isInGracePeriodRef.current) {
        setHoveredProperty(null)
        setCardPosition(null)
      }
    }, 30) // Check every 30ms - very aggressive

    return () => {
      clearInterval(checkInterval)
    }
  }, [mounted, hoveredProperty])

  // Document-level mousemove to detect when mouse is not over marker/card
  useEffect(() => {
    if (!mounted || !hoveredProperty) return

    const handleMouseMove = (e: MouseEvent) => {
      // Check if mouse is over the card
      const cardElement = document.elementFromPoint(e.clientX, e.clientY)
      const isOverCard = cardElement?.closest('[data-property-card]') !== null
      
      // Check if mouse is over any marker (check for leaflet marker elements)
      const isOverMarker = cardElement?.closest('.leaflet-marker-icon') !== null ||
                          cardElement?.closest('.custom-marker') !== null
      
      const wasOverMarker = isHoveringMarkerRef.current
      
      // Update refs based on actual mouse position
      if (isOverCard) {
        isHoveringCardRef.current = true
        isHoveringMarkerRef.current = false
        isInGracePeriodRef.current = false // Arrived at card, no need for grace
      } else if (isOverMarker) {
        isHoveringMarkerRef.current = true
        isHoveringCardRef.current = false
        isInGracePeriodRef.current = false // On marker, no need for grace
      } else {
        // Just left the marker - start grace period
        if (wasOverMarker && !isInGracePeriodRef.current) {
          isInGracePeriodRef.current = true
          
          // Clear any existing timeout and start new one
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current)
          }
          hideTimeoutRef.current = setTimeout(() => {
            isInGracePeriodRef.current = false
            hideTimeoutRef.current = null
          }, 500) // Grace period delay
        }
        
        isHoveringMarkerRef.current = false
        isHoveringCardRef.current = false
      }
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [mounted, hoveredProperty])


  // Filter properties with valid coordinates and remove duplicates by ID
  const validProperties = filterValidCoordinates(properties)
  // Deduplicate by ID - keep first occurrence
  const uniqueProperties = validProperties.filter(
    (property, index, self) => 
      index === self.findIndex((p) => p.id === property.id)
  )

  // Use provided center/zoom or calculate from uniqueProperties or use default
  const center: [number, number] = propCenter || (uniqueProperties.length > 0
    ? [
        uniqueProperties.reduce((sum, p) => sum + (p.latitude || 0), 0) / uniqueProperties.length,
        uniqueProperties.reduce((sum, p) => sum + (p.longitude || 0), 0) / uniqueProperties.length,
      ]
    : [33.5, -81.7]) // Default to Aiken, SC area
  
  const zoom = propZoom || 11

  const handleMarkerHover = (property: PropertyCardData, event: LeafletMarkerEvent) => {
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    
    isHoveringMarkerRef.current = true
    
    // Get the marker element position relative to the map container
    const map = event.target._map
    const container = map.getContainer()
    const containerRect = container.getBoundingClientRect()
    const point = map.latLngToContainerPoint(event.latlng)
    
    // Position card above the pin (relative to viewport)
    const newPosition = {
      x: containerRect.left + point.x,
      y: containerRect.top + point.y - 10, // 10px above the pin
    }
    
    // Store in refs for potential restoration
    lastHoveredPropertyRef.current = property
    lastCardPositionRef.current = newPosition
    
    setHoveredProperty(property)
    setCardPosition(newPosition)
  }

  const handleMarkerLeave = (_e?: unknown) => {
    // Immediately set marker ref to false
    isHoveringMarkerRef.current = false
    
    // Start grace period to allow moving to card
    isInGracePeriodRef.current = true
    
    // Clear any existing timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
    }
    
    hideTimeoutRef.current = setTimeout(() => {
      // End grace period
      isInGracePeriodRef.current = false
      
      // Hide if still not hovering card or marker
      if (!isHoveringCardRef.current && !isHoveringMarkerRef.current) {
        setHoveredProperty(null)
        setCardPosition(null)
      }
      hideTimeoutRef.current = null
    }, 500) // Pin hover delay - time to move from pin to card
  }

  const handleCardEnter = () => {
    isHoveringCardRef.current = true
    isInGracePeriodRef.current = false // No longer need grace period
    
    // Clear any pending hide timeout when mouse enters card
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    
    // If card was hidden but we're hovering, restore it
    if (!hoveredProperty && lastHoveredPropertyRef.current && lastCardPositionRef.current) {
      setHoveredProperty(lastHoveredPropertyRef.current)
      setCardPosition(lastCardPositionRef.current)
    }
  }

  const handleCardLeave = () => {
    isHoveringCardRef.current = false
    isInGracePeriodRef.current = false
    
    // Immediately hide when leaving card
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    setHoveredProperty(null)
    setCardPosition(null)
  }

  // Add mouse leave detection on the map container
  useEffect(() => {
    if (!mounted || !mapContainerRef.current) return

    const container = mapContainerRef.current
    const handleMouseLeave = () => {
      // When mouse leaves the entire map container, hide the card
      isHoveringMarkerRef.current = false
      isHoveringCardRef.current = false
      isInGracePeriodRef.current = false
      setHoveredProperty(null)
      setCardPosition(null)
    }

    container.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [mounted])

  if (!mounted || !MapContainer || !TileLayer || !Marker || !L || !useMapHookRef.current) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-stone-600">Loading map...</p>
      </div>
    )
  }

  // Create small icon function
  const createSmallIcon = () => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 12px;
        height: 12px;
        background-color: #3B82F6;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
      "></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    })
  }

  // MapBoundsHandler component - must be defined here to access useMapHookRef
  // This component will only be rendered when the hook is available (checked in early return)
  const MapBoundsHandler = ({ 
    properties, 
    onBoundsChange 
  }: { 
    properties: PropertyCardData[]
    onBoundsChange?: (bounds: LeafletBounds, visible: PropertyCardData[]) => void 
  }) => {
    // Call useMap hook directly - this is valid because MapBoundsHandler is a component
    // and the hook is called unconditionally at the top level
    // useMapHookRef.current is guaranteed to exist when this component renders (due to early return check above)
    const useMap = useMapHookRef.current!
    const map = useMap()
    
    // Use refs to store latest values to avoid re-running effect when they change
    const propertiesRef = useRef(properties)
    const onBoundsChangeRef = useRef(onBoundsChange)
    
    // Update refs when props change
    useEffect(() => {
      propertiesRef.current = properties
      onBoundsChangeRef.current = onBoundsChange
    }, [properties, onBoundsChange])

    useEffect(() => {
      if (!map) return
      
      const updateBounds = () => {
        const bounds = map.getBounds()
        const visible = propertiesRef.current.filter(prop => {
          if (!prop.latitude || !prop.longitude) return false
          return bounds.contains([prop.latitude, prop.longitude])
        })
        
        if (onBoundsChangeRef.current) {
          const leafletBounds: LeafletBounds = {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
          }
          onBoundsChangeRef.current(leafletBounds, visible)
        }
      }

      map.on('moveend', updateBounds)
      map.on('zoomend', updateBounds)
      updateBounds() // Initial call

      return () => {
        map.off('moveend', updateBounds)
        map.off('zoomend', updateBounds)
      }
    }, [map]) // Only depend on map instance, not properties or callback

    return null
  }

  // PropertyMarker component
  function PropertyMarker({ 
    property, 
    onHover, 
    onLeave 
  }: { 
    property: PropertyCardData
    onHover: (property: PropertyCardData, event: LeafletMarkerEvent) => void
    onLeave: () => void
  }) {
    const icon = createSmallIcon()

    return (
      <Marker
        position={[property.latitude, property.longitude]}
        icon={icon}
        eventHandlers={{
          mouseover: (e: LeafletMarkerEvent) => {
            onHover(property, e)
          },
          mouseout: () => {
            onLeave()
          },
          click: () => {
            // Also trigger on click to ensure we can hide
          },
        }}
      />
    )
  }

  // Component to handle map initialization
  function MapInitializer() {
    const useMap = useMapHookRef.current!
    const map = useMap()
    
    useEffect(() => {
      if (!map) return
      
      let intervalId: NodeJS.Timeout | null = null
      let isCancelled = false
      
      // Check if map panes are ready (required for TileLayer)
      const checkPanesReady = () => {
        try {
          const container = map.getContainer()
          const panes = map.getPanes()
          // TileLayer needs tilePane to exist
          return !!(container && panes && panes.tilePane)
        } catch {
          return false
        }
      }
      
      const setReadyIfPanes = () => {
        if (isCancelled) return
        if (checkPanesReady()) {
          setMapReady(true)
          if (intervalId) {
            clearInterval(intervalId)
            intervalId = null
          }
        }
      }
      
      // Try immediately
      if (checkPanesReady()) {
        setMapReady(true)
        return
      }
      
      // Wait for map to be fully initialized, then verify panes
      map.whenReady(() => {
        if (isCancelled) return
        if (checkPanesReady()) {
          setMapReady(true)
        } else {
          // Poll briefly if panes aren't ready yet
          intervalId = setInterval(setReadyIfPanes, 10)
          // Safety timeout to stop polling
          setTimeout(() => {
            if (intervalId) {
              clearInterval(intervalId)
              intervalId = null
            }
          }, 1000)
        }
      })
      
      return () => {
        isCancelled = true
        if (intervalId) {
          clearInterval(intervalId)
        }
        setMapReady(false)
      }
    }, [map])
    
    return null
  }

  return (
    <div className="relative w-full h-full" ref={mapContainerRef}>
      <MapContainer
        center={center}
        zoom={zoom}
        key={`${center[0]}-${center[1]}-${zoom}`} // Force re-render when center/zoom changes
        style={{ height: '100%', width: '100%' }}
        className="rounded-3xl"
      >
        <MapInitializer />
        
        {mapReady && (
          <>
            <TileLayer
              url={
                mapType === 'satellite'
                  ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                  : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              }
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {uniqueProperties.map((property) => (
              <PropertyMarker
                key={property.id}
                property={property}
                onHover={handleMarkerHover}
                onLeave={handleMarkerLeave}
              />
            ))}

            <MapBoundsHandler properties={uniqueProperties} onBoundsChange={onBoundsChange} />
          </>
        )}
      </MapContainer>

      {/* Property Card Overlay - Fixed position relative to viewport */}
      {hoveredProperty && cardPosition && (
        <div
          data-property-card
          className="fixed z-[1000]"
          style={{
            left: `${cardPosition.x}px`,
            top: `${cardPosition.y}px`,
            transform: 'translate(-50%, -100%)', // Center above the pin
            marginTop: '-8px', // Additional spacing from pin
          }}
          onMouseEnter={handleCardEnter}
          onMouseLeave={handleCardLeave}
        >
          <div className="w-[300px] max-w-[90vw]">
            <PropertyCard property={hoveredProperty} variant="vertical" />
          </div>
        </div>
      )}
    </div>
  )
}

// Main component - ensures it only renders on client
export default function PropertyMap(props: PropertyMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-stone-600">Loading map...</p>
      </div>
    )
  }

  return <LeafletMap {...props} />
}
