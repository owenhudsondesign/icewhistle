'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Alert, ALERT_TYPES } from '@/types/alert'
import { Crosshair, Loader2 } from 'lucide-react'

interface AlertMapProps {
  alerts: Alert[]
  userLocation?: { lat: number; lng: number } | null
  onMapMove?: (bounds: { north: number; south: number; east: number; west: number }) => void
  onAlertClick?: (alert: Alert) => void
  selectedAlertId?: string | null
  className?: string
  onUserLocationUpdate?: (location: { lat: number; lng: number }) => void
}

export function AlertMap({
  alerts,
  userLocation,
  onMapMove,
  onAlertClick,
  selectedAlertId,
  className = '',
  onUserLocationUpdate
}: AlertMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<Map<string, mapboxgl.Marker>>(new Map())
  const userMarker = useRef<mapboxgl.Marker | null>(null)
  const initialized = useRef(false)
  const [isLocating, setIsLocating] = useState(false)

  // Stable callback refs to avoid re-renders
  const onMapMoveRef = useRef(onMapMove)
  const onAlertClickRef = useRef(onAlertClick)

  useEffect(() => {
    onMapMoveRef.current = onMapMove
    onAlertClickRef.current = onAlertClick
  }, [onMapMove, onAlertClick])

  // Initialize map only once
  useEffect(() => {
    if (!mapContainer.current || initialized.current) return

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) {
      console.error('Mapbox token not found')
      return
    }

    mapboxgl.accessToken = token
    initialized.current = true

    const initialCenter: [number, number] = userLocation
      ? [userLocation.lng, userLocation.lat]
      : [-98.5795, 39.8283]

    const initialZoom = userLocation ? 10 : 3.5

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: initialCenter,
      zoom: initialZoom,
      attributionControl: false,
      preserveDrawingBuffer: true,
      cooperativeGestures: true, // Require two-finger pan on mobile, Ctrl+scroll on desktop
    })

    const mapInstance = map.current

    mapInstance.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')

    // Only report bounds on user-initiated moves, not on load
    let userInteracted = false

    mapInstance.on('dragstart', () => { userInteracted = true })
    mapInstance.on('zoomstart', () => { userInteracted = true })

    mapInstance.on('moveend', () => {
      if (userInteracted && onMapMoveRef.current) {
        const bounds = mapInstance.getBounds()
        if (bounds) {
          onMapMoveRef.current({
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest()
          })
        }
      }
    })

    return () => {
      // Cleanup markers
      markers.current.forEach(marker => marker.remove())
      markers.current.clear()
      userMarker.current?.remove()
      mapInstance.remove()
      map.current = null
      initialized.current = false
    }
  }, []) // Empty deps - only run once

  // Update user location marker
  useEffect(() => {
    if (!map.current || !userLocation) return

    if (userMarker.current) {
      userMarker.current.setLngLat([userLocation.lng, userLocation.lat])
    } else {
      const el = document.createElement('div')
      el.className = 'user-marker'
      el.innerHTML = `
        <div style="
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        "></div>
      `

      userMarker.current = new mapboxgl.Marker({ element: el })
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map.current)
    }
  }, [userLocation])

  // Update alert markers
  useEffect(() => {
    if (!map.current) return

    const currentMarkerIds = new Set(alerts.map(a => a.id))

    // Remove old markers
    markers.current.forEach((marker, id) => {
      if (!currentMarkerIds.has(id)) {
        marker.remove()
        markers.current.delete(id)
      }
    })

    // Add or update markers
    alerts.forEach(alert => {
      const type = ALERT_TYPES[alert.alertType]
      const isSelected = alert.id === selectedAlertId
      const isVerified = alert.verificationCount >= 3

      if (markers.current.has(alert.id)) {
        // Update existing marker position
        markers.current.get(alert.id)?.setLngLat([alert.longitude, alert.latitude])
      } else {
        // Create new marker
        const el = document.createElement('div')
        el.style.cssText = `
          width: ${isSelected ? '24px' : '18px'};
          height: ${isSelected ? '24px' : '18px'};
          background: ${type.markerColor};
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          transition: transform 0.2s;
        `

        if (isVerified) {
          el.style.boxShadow = `0 0 0 3px ${type.markerColor}40, 0 2px 6px rgba(0,0,0,0.3)`
        }

        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.2)'
        })
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)'
        })
        el.addEventListener('click', (e) => {
          e.stopPropagation()
          onAlertClickRef.current?.(alert)
        })

        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setHTML(`
            <div style="padding: 8px; min-width: 150px;">
              <div style="font-weight: 600; color: ${type.markerColor};">${type.label}</div>
              ${alert.address ? `<div style="font-size: 12px; color: #666; margin-top: 4px;">${alert.address}</div>` : ''}
              <div style="font-size: 11px; color: #999; margin-top: 4px;">
                ${isVerified ? '✓ Verified • ' : ''}${alert.verificationCount} confirmations
              </div>
            </div>
          `)

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([alert.longitude, alert.latitude])
          .setPopup(popup)
          .addTo(map.current!)

        markers.current.set(alert.id, marker)
      }
    })
  }, [alerts, selectedAlertId])

  // Fly to selected alert
  useEffect(() => {
    if (!map.current || !selectedAlertId) return

    const alert = alerts.find(a => a.id === selectedAlertId)
    if (alert) {
      map.current.flyTo({
        center: [alert.longitude, alert.latitude],
        zoom: 14,
        duration: 1000
      })

      // Open popup
      const marker = markers.current.get(selectedAlertId)
      marker?.togglePopup()
    }
  }, [selectedAlertId, alerts])

  // Locate me function
  const handleLocateMe = useCallback(async () => {
    if (!map.current || !navigator.geolocation) return

    setIsLocating(true)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        })
      })

      const { latitude, longitude } = position.coords

      // Update user location marker
      if (userMarker.current) {
        userMarker.current.setLngLat([longitude, latitude])
      } else {
        const el = document.createElement('div')
        el.className = 'user-marker'
        el.innerHTML = `
          <div style="
            width: 20px;
            height: 20px;
            background: #3b82f6;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          "></div>
        `

        userMarker.current = new mapboxgl.Marker({ element: el })
          .setLngLat([longitude, latitude])
          .addTo(map.current)
      }

      // Fly to location with ~5 mile radius view (zoom ~11)
      map.current.flyTo({
        center: [longitude, latitude],
        zoom: 11,
        duration: 1500
      })

      // Notify parent of new location
      onUserLocationUpdate?.({ lat: latitude, lng: longitude })
    } catch (err) {
      console.error('Error getting location:', err)
      alert('Could not get your location. Please check your browser settings.')
    } finally {
      setIsLocating(false)
    }
  }, [onUserLocationUpdate])

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-2xl" />

      {/* Locate Me Button */}
      <button
        onClick={handleLocateMe}
        disabled={isLocating}
        className="absolute top-3 right-14 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        aria-label="Find my location"
      >
        {isLocating ? (
          <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
        ) : (
          <Crosshair className="h-5 w-5 text-blue-500" />
        )}
      </button>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg p-2 text-xs">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span className="text-white/80">Presence</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-600"></span>
            <span className="text-white/80">Checkpoint</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            <span className="text-white/80">Vehicle</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
            <span className="text-white/80">Transit</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-500"></span>
            <span className="text-white/80">Other</span>
          </div>
        </div>
      </div>
    </div>
  )
}
