'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Alert, ALERT_TYPES, CLEAR_VOTES_REQUIRED } from '@/types/alert'
import { Crosshair, Loader2, Maximize2, Minimize2 } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'

// CSS for marker animations
const markerStyles = `
  .maplibregl-popup-close-button {
    font-size: 20px;
    padding: 4px 8px;
    color: #666;
  }
  .maplibregl-popup-close-button:hover {
    color: #333;
    background: rgba(0,0,0,0.05);
  }
  .user-accuracy-circle {
    background: rgba(59, 130, 246, 0.15);
    border: 2px solid rgba(59, 130, 246, 0.4);
    border-radius: 50%;
    pointer-events: none;
  }
  .map-loading-skeleton {
    background: linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .cluster-marker {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: white;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    transition: transform 0.15s ease-out;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  }
  .cluster-marker:hover {
    transform: scale(1.15);
  }
  .alert-marker-el {
    cursor: pointer;
    transition: transform 0.15s ease-out;
  }
  .alert-marker-el:hover {
    transform: scale(1.3);
    z-index: 10 !important;
  }
  @keyframes pulse-ring {
    0% { box-shadow: 0 0 0 0 var(--pulse-color, rgba(220,38,38,0.4)); }
    70% { box-shadow: 0 0 0 10px transparent; }
    100% { box-shadow: 0 0 0 0 transparent; }
  }
  .verified-pulse {
    animation: pulse-ring 2s infinite;
  }
`

// Escape HTML to prevent XSS in popups
function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const mapTranslations = {
  en: {
    presence: 'Presence',
    checkpoint: 'Checkpoint',
    vehicle: 'Vehicle',
    transit: 'Transit',
    other: 'Other',
    confirmReport: 'Confirm',
    confirming: 'Confirming...',
    confirmed: '✓ Confirmed',
    confirmations: 'confirmations',
    verified: '✓ Verified',
    locationError: 'Could not get your location. Please check your browser settings.',
    theyveLeft: "They've Left",
    updating: 'Updating...',
    cleared: '✓ Cleared',
    confirmVote: 'Confirm this report is accurate?',
    confirmClear: 'Confirm they have left this location?',
    loading: 'Loading map...',
    fullscreen: 'Toggle fullscreen',
    alerts: 'alerts',
  },
  es: {
    presence: 'Presencia',
    checkpoint: 'Control',
    vehicle: 'Vehículo',
    transit: 'Tránsito',
    other: 'Otro',
    confirmReport: 'Confirmar',
    confirming: 'Confirmando...',
    confirmed: '✓ Confirmado',
    confirmations: 'confirmaciones',
    verified: '✓ Verificado',
    locationError: 'No se pudo obtener tu ubicación. Verifica la configuración de tu navegador.',
    theyveLeft: 'Ya Se Fueron',
    updating: 'Actualizando...',
    cleared: '✓ Despejado',
    confirmVote: '¿Confirmar que este reporte es preciso?',
    confirmClear: '¿Confirmar que ya se fueron de este lugar?',
    loading: 'Cargando mapa...',
    fullscreen: 'Pantalla completa',
    alerts: 'alertas',
  },
  pt: {
    presence: 'Presença',
    checkpoint: 'Posto',
    vehicle: 'Veículo',
    transit: 'Trânsito',
    other: 'Outro',
    confirmReport: 'Confirmar',
    confirming: 'Confirmando...',
    confirmed: '✓ Confirmado',
    confirmations: 'confirmações',
    verified: '✓ Verificado',
    locationError: 'Não foi possível obter sua localização. Verifique as configurações do navegador.',
    theyveLeft: 'Eles Foram Embora',
    updating: 'Atualizando...',
    cleared: '✓ Liberado',
    confirmVote: 'Confirmar que este relatório está correto?',
    confirmClear: 'Confirmar que eles saíram deste local?',
    loading: 'Carregando mapa...',
    fullscreen: 'Tela cheia',
    alerts: 'alertas',
  },
}

interface AlertMapProps {
  alerts: Alert[]
  userLocation?: { lat: number; lng: number } | null
  onMapMove?: (bounds: { north: number; south: number; east: number; west: number }) => void
  onAlertClick?: (alert: Alert) => void
  onVerifyAlert?: (alertId: string) => Promise<void>
  onMarkAllClear?: (alertId: string) => Promise<void>
  selectedAlertId?: string | null
  className?: string
  onUserLocationUpdate?: (location: { lat: number; lng: number }) => void
}

// Convert alerts to GeoJSON
function alertsToGeoJSON(alerts: Alert[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: alerts.map(alert => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [alert.longitude, alert.latitude]
      },
      properties: {
        id: alert.id,
        alertType: alert.alertType,
        address: alert.address || '',
        description: alert.description || '',
        verificationCount: alert.verificationCount,
        clearVoteCount: alert.clearVoteCount || 0,
        media: JSON.stringify(alert.media || []),
        isVerified: alert.verificationCount >= 3,
        markerColor: ALERT_TYPES[alert.alertType]?.markerColor || '#666'
      }
    }))
  }
}

// OpenFreeMap style URL (dark theme)
const OPENFREEMAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty'

export function AlertMap({
  alerts,
  userLocation,
  onMapMove,
  onAlertClick,
  onVerifyAlert,
  onMarkAllClear,
  selectedAlertId,
  className = '',
  onUserLocationUpdate
}: AlertMapProps) {
  const { language } = useLanguage()
  const t = mapTranslations[language as keyof typeof mapTranslations] || mapTranslations.en
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const popup = useRef<maplibregl.Popup | null>(null)
  const clusterMarkers = useRef<Map<string, maplibregl.Marker>>(new Map())
  const alertMarkers = useRef<Map<string, maplibregl.Marker>>(new Map())
  const userMarker = useRef<maplibregl.Marker | null>(null)
  const accuracyCircle = useRef<HTMLDivElement | null>(null)
  const initialized = useRef(false)
  const stylesInjected = useRef(false)
  const [isLocating, setIsLocating] = useState(false)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Stable callback refs
  const onMapMoveRef = useRef(onMapMove)
  const onAlertClickRef = useRef(onAlertClick)
  const onVerifyAlertRef = useRef(onVerifyAlert)
  const onMarkAllClearRef = useRef(onMarkAllClear)
  const alertsRef = useRef(alerts)
  const tRef = useRef(t)

  useEffect(() => {
    onMapMoveRef.current = onMapMove
    onAlertClickRef.current = onAlertClick
    onVerifyAlertRef.current = onVerifyAlert
    onMarkAllClearRef.current = onMarkAllClear
    alertsRef.current = alerts
    tRef.current = t
  }, [onMapMove, onAlertClick, onVerifyAlert, onMarkAllClear, alerts, t])

  // Inject styles once
  useEffect(() => {
    if (stylesInjected.current) return
    stylesInjected.current = true
    const styleEl = document.createElement('style')
    styleEl.textContent = markerStyles
    document.head.appendChild(styleEl)
    return () => {
      styleEl.remove()
      stylesInjected.current = false
    }
  }, [])

  // Global click handler for popup buttons
  useEffect(() => {
    const handleConfirmClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.classList.contains('confirm-alert-btn')) {
        const alertId = target.dataset.alertId
        if (alertId && onVerifyAlertRef.current) {
          if (!window.confirm(tRef.current.confirmVote)) return
          target.textContent = tRef.current.confirming
          target.setAttribute('disabled', 'true')
          try {
            await onVerifyAlertRef.current(alertId)
            target.textContent = tRef.current.confirmed
            target.style.background = '#84CC16'
          } catch {
            target.textContent = 'Error'
            target.style.background = '#DC2626'
          }
        }
      }
      if (target.classList.contains('all-clear-btn')) {
        const alertId = target.dataset.alertId
        if (alertId && onMarkAllClearRef.current) {
          if (!window.confirm(tRef.current.confirmClear)) return
          target.textContent = tRef.current.updating
          target.setAttribute('disabled', 'true')
          try {
            await onMarkAllClearRef.current(alertId)
            target.textContent = tRef.current.cleared
            target.style.background = '#84CC16'
          } catch {
            target.textContent = 'Error'
            target.style.background = '#DC2626'
          }
        }
      }
    }
    document.addEventListener('click', handleConfirmClick)
    return () => document.removeEventListener('click', handleConfirmClick)
  }, [])

  // Create popup HTML for an alert
  const createPopupHTML = useCallback((alertData: Alert) => {
    const type = ALERT_TYPES[alertData.alertType]
    const typeLabel = language === 'es' ? type.labelEs : language === 'pt' ? type.labelPt : type.label
    const isVerified = alertData.verificationCount >= 3

    let mediaHtml = ''
    if (alertData.media && alertData.media.length > 0) {
      const mediaItems = alertData.media.slice(0, 3).map(m => {
        if (m.mediaType === 'video' && m.thumbnailUrl) {
          return `<div style="position: relative; width: 60px; height: 60px; border-radius: 4px; overflow: hidden; background: #1a1a1a;">
            <img src="${m.thumbnailUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="" />
            <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3);">
              <span style="color: white; font-size: 16px;">▶</span>
            </div>
          </div>`
        } else {
          return `<div style="width: 60px; height: 60px; border-radius: 4px; overflow: hidden; background: #1a1a1a;">
            <img src="${m.storageUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="" />
          </div>`
        }
      }).join('')
      mediaHtml = `<div style="display: flex; gap: 4px; margin-top: 8px;">${mediaItems}</div>`
    }

    const safeAddress = alertData.address ? escapeHtml(alertData.address) : ''
    const safeDescription = alertData.description ? escapeHtml(alertData.description) : ''

    return `
      <div style="padding: 10px; min-width: 200px; max-width: 280px;">
        <div style="font-weight: 600; color: ${type.markerColor}; font-size: 14px;">${typeLabel}</div>
        ${safeAddress ? `<div style="font-size: 12px; color: #666; margin-top: 4px;">${safeAddress}</div>` : ''}
        ${safeDescription ? `<div style="font-size: 12px; color: #888; margin-top: 6px; padding: 8px; background: rgba(0,0,0,0.05); border-radius: 6px; word-wrap: break-word;">"${safeDescription}"</div>` : ''}
        ${mediaHtml}
        <div style="font-size: 11px; color: #999; margin-top: 6px;">
          ${isVerified ? t.verified + ' • ' : ''}${alertData.verificationCount} ${t.confirmations}
        </div>
        <div style="display: flex; gap: 8px; margin-top: 10px;">
          <button
            class="confirm-alert-btn"
            data-alert-id="${alertData.id}"
            style="flex: 1; min-height: 44px; padding: 10px 12px; background: #00A6B4; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; touch-action: manipulation;"
          >
            ${t.confirmReport}
          </button>
          <button
            class="all-clear-btn"
            data-alert-id="${alertData.id}"
            style="flex: 1; min-height: 44px; padding: 10px 12px; background: #84CC16; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; touch-action: manipulation;"
          >
            ${t.theyveLeft} (${alertData.clearVoteCount || 0}/${CLEAR_VOTES_REQUIRED})
          </button>
        </div>
      </div>
    `
  }, [language, t])

  // Show popup for an alert
  const showAlertPopup = useCallback((alertData: Alert, lngLat: [number, number]) => {
    if (!map.current) return

    popup.current?.remove()
    popup.current = new maplibregl.Popup({ offset: 25, closeButton: true, closeOnClick: false })
      .setLngLat(lngLat)
      .setHTML(createPopupHTML(alertData))
      .addTo(map.current)
  }, [createPopupHTML])

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || initialized.current) return

    initialized.current = true

    const initialCenter: [number, number] = userLocation
      ? [userLocation.lng, userLocation.lat]
      : [-98.5795, 39.8283]
    const initialZoom = userLocation ? 10 : 3.5

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: OPENFREEMAP_STYLE,
      center: initialCenter,
      zoom: initialZoom,
    })

    // Add attribution control
    map.current.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right')

    const mapInstance = map.current
    mapInstance.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')

    mapInstance.on('load', () => {
      setIsMapLoaded(true)

      // Add clustered source
      mapInstance.addSource('alerts', {
        type: 'geojson',
        data: alertsToGeoJSON([]),
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      })

      // Cluster circles layer
      mapInstance.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'alerts',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#00A6B4',   // < 10: teal
            10,
            '#F59E0B',   // 10-30: amber
            30,
            '#DC2626'    // 30+: red
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,   // < 10: 20px
            10,
            25,   // 10-30: 25px
            30,
            30    // 30+: 30px
          ],
          'circle-stroke-width': 3,
          'circle-stroke-color': '#fff'
        }
      })

      // Cluster count labels
      mapInstance.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'alerts',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-size': 14
        },
        paint: {
          'text-color': '#ffffff'
        }
      })

      // Individual alert markers (unclustered)
      mapInstance.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'alerts',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': ['get', 'markerColor'],
          'circle-radius': [
            'case',
            ['get', 'isVerified'],
            12,
            10
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      })

      // Verified pulse effect layer (behind markers)
      mapInstance.addLayer({
        id: 'verified-pulse',
        type: 'circle',
        source: 'alerts',
        filter: ['all', ['!', ['has', 'point_count']], ['get', 'isVerified']],
        paint: {
          'circle-color': ['get', 'markerColor'],
          'circle-radius': 16,
          'circle-opacity': 0.3,
          'circle-stroke-width': 0
        }
      }, 'unclustered-point')

      // Click on cluster to zoom
      mapInstance.on('click', 'clusters', async (e) => {
        const features = mapInstance.queryRenderedFeatures(e.point, { layers: ['clusters'] })
        if (!features.length) return

        const clusterId = features[0].properties?.cluster_id
        const source = mapInstance.getSource('alerts') as maplibregl.GeoJSONSource

        try {
          const zoom = await source.getClusterExpansionZoom(clusterId)
          const geometry = features[0].geometry as GeoJSON.Point
          mapInstance.easeTo({
            center: geometry.coordinates as [number, number],
            zoom: zoom ?? 14
          })
        } catch (err) {
          console.error('Error expanding cluster:', err)
        }
      })

      // Click on individual marker
      mapInstance.on('click', 'unclustered-point', (e) => {
        if (!e.features?.length) return
        const feature = e.features[0]
        const props = feature.properties
        const geometry = feature.geometry as GeoJSON.Point
        const coords = geometry.coordinates as [number, number]

        // Find the full alert data
        const alertData = alertsRef.current.find(a => a.id === props?.id)
        if (alertData) {
          showAlertPopup(alertData, coords)
          onAlertClickRef.current?.(alertData)
        }
      })

      // Change cursor on hover
      mapInstance.on('mouseenter', 'clusters', () => {
        mapInstance.getCanvas().style.cursor = 'pointer'
      })
      mapInstance.on('mouseleave', 'clusters', () => {
        mapInstance.getCanvas().style.cursor = ''
      })
      mapInstance.on('mouseenter', 'unclustered-point', () => {
        mapInstance.getCanvas().style.cursor = 'pointer'
      })
      mapInstance.on('mouseleave', 'unclustered-point', () => {
        mapInstance.getCanvas().style.cursor = ''
      })
    })

    // Escape to close popup
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        popup.current?.remove()
      }
    }
    document.addEventListener('keydown', handleEscape)

    // Report bounds on user moves
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
      popup.current?.remove()
      userMarker.current?.remove()
      accuracyCircle.current?.remove()
      document.removeEventListener('keydown', handleEscape)
      mapInstance.remove()
      map.current = null
      initialized.current = false
      setIsMapLoaded(false)
    }
  }, [])

  // Update GeoJSON source when alerts change
  useEffect(() => {
    if (!map.current || !isMapLoaded) return

    const source = map.current.getSource('alerts') as maplibregl.GeoJSONSource
    if (source) {
      source.setData(alertsToGeoJSON(alerts))
    }
  }, [alerts, isMapLoaded])

  // Update user location marker
  useEffect(() => {
    if (!map.current || !userLocation) return

    if (userMarker.current) {
      userMarker.current.setLngLat([userLocation.lng, userLocation.lat])
    } else {
      const el = document.createElement('div')
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
      userMarker.current = new maplibregl.Marker({ element: el })
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map.current)
    }
  }, [userLocation])

  // Fly to selected alert
  useEffect(() => {
    if (!map.current || !selectedAlertId || !isMapLoaded) return

    const alert = alerts.find(a => a.id === selectedAlertId)
    if (alert) {
      map.current.flyTo({
        center: [alert.longitude, alert.latitude],
        zoom: 13,
        duration: 1000
      })

      // Show popup after fly completes
      setTimeout(() => {
        showAlertPopup(alert, [alert.longitude, alert.latitude])
      }, 1000)
    }
  }, [selectedAlertId, alerts, isMapLoaded, showAlertPopup])

  // Meters to pixels helper
  const metersToPixels = useCallback((meters: number, latitude: number, zoom: number) => {
    const earthCircumference = 40075017
    const metersPerPixel = (earthCircumference * Math.cos(latitude * Math.PI / 180)) / (Math.pow(2, zoom + 8))
    return meters / metersPerPixel
  }, [])

  // Locate me
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

      const { latitude, longitude, accuracy } = position.coords

      if (userMarker.current) {
        userMarker.current.setLngLat([longitude, latitude])
      } else {
        const el = document.createElement('div')
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
        userMarker.current = new maplibregl.Marker({ element: el })
          .setLngLat([longitude, latitude])
          .addTo(map.current)
      }

      // Accuracy circle
      const currentZoom = map.current.getZoom()
      const radiusPixels = Math.max(30, metersToPixels(accuracy, latitude, currentZoom))

      if (accuracyCircle.current) {
        accuracyCircle.current.style.width = `${radiusPixels * 2}px`
        accuracyCircle.current.style.height = `${radiusPixels * 2}px`
      } else {
        const circleEl = document.createElement('div')
        circleEl.className = 'user-accuracy-circle'
        circleEl.style.width = `${radiusPixels * 2}px`
        circleEl.style.height = `${radiusPixels * 2}px`
        circleEl.style.position = 'absolute'
        circleEl.style.transform = 'translate(-50%, -50%)'

        new maplibregl.Marker({ element: circleEl })
          .setLngLat([longitude, latitude])
          .addTo(map.current)

        accuracyCircle.current = circleEl

        map.current.on('zoom', () => {
          if (accuracyCircle.current && map.current) {
            const newZoom = map.current.getZoom()
            const newRadius = Math.max(30, metersToPixels(accuracy, latitude, newZoom))
            accuracyCircle.current.style.width = `${newRadius * 2}px`
            accuracyCircle.current.style.height = `${newRadius * 2}px`
          }
        })
      }

      map.current.flyTo({
        center: [longitude, latitude],
        zoom: 12,
        duration: 1500
      })

      onUserLocationUpdate?.({ lat: latitude, lng: longitude })
    } catch (err) {
      console.error('Error getting location:', err)
      alert(t.locationError)
    } finally {
      setIsLocating(false)
    }
  }, [onUserLocationUpdate, metersToPixels, t.locationError])

  // Toggle fullscreen
  const handleFullscreen = useCallback(() => {
    if (!mapContainer.current) return

    if (!document.fullscreenElement) {
      mapContainer.current.parentElement?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      {/* Loading skeleton */}
      {!isMapLoaded && (
        <div className="absolute inset-0 rounded-2xl map-loading-skeleton flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <span className="text-sm text-muted-foreground">{t.loading}</span>
          </div>
        </div>
      )}

      <div ref={mapContainer} className="w-full h-full rounded-2xl" />

      {/* Fullscreen Button */}
      <button
        onClick={handleFullscreen}
        className="absolute top-3 left-3 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label={t.fullscreen}
      >
        {isFullscreen ? (
          <Minimize2 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <Maximize2 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>

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
            <span className="text-white/80">{t.presence}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-600"></span>
            <span className="text-white/80">{t.checkpoint}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            <span className="text-white/80">{t.vehicle}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
            <span className="text-white/80">{t.transit}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-500"></span>
            <span className="text-white/80">{t.other}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
