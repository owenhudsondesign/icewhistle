'use client'

import { useState, useEffect, useCallback, Suspense, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Alert as AlertType, AlertMapBounds, ALERT_TYPES } from '@/types/alert'
import { AlertMap } from '@/components/alerts/AlertMap'
import { ReportAlertModal } from '@/components/alerts/ReportAlertModal'
import { AppHeader } from '@/components/shared/AppHeader'
import { useLanguage, commonTranslations } from '@/hooks/use-language'
import {
  AlertTriangle,
  Plus,
  RefreshCw,
  Clock,
  Building2,
  Home,
  Car,
  Train,
  ShieldAlert,
  CheckCircle
} from 'lucide-react'

function AlertsPageContent() {
  const searchParams = useSearchParams()
  const { language } = useLanguage()
  const t = commonTranslations[language]
  const [alerts, setAlerts] = useState<AlertType[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const mapBoundsRef = useRef<AlertMapBounds | null>(null)
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportType, setReportType] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (err) => {
          console.log('Location access denied or unavailable:', err.message)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      )
    }
  }, [])

  // Fetch alerts
  const fetchAlerts = useCallback(async (bounds?: AlertMapBounds) => {
    try {
      const params = new URLSearchParams()
      if (bounds) {
        params.set('north', bounds.north.toString())
        params.set('south', bounds.south.toString())
        params.set('east', bounds.east.toString())
        params.set('west', bounds.west.toString())
      }
      params.set('maxAgeHours', '24')

      const response = await fetch(`/api/alerts?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch alerts')

      const data = await response.json()
      setAlerts(data.alerts)
      setLastRefresh(new Date())
      setError(null)
    } catch (err) {
      console.error('Error fetching alerts:', err)
      setError('Failed to load alerts')
    }
  }, [])

  // Initial fetch only
  useEffect(() => {
    const initialLoad = async () => {
      setLoading(true)
      await fetchAlerts()
      setLoading(false)
    }
    initialLoad()
  }, [fetchAlerts])

  // Auto-refresh every 30 seconds (separate effect to avoid loops)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAlerts()
    }, 30000)
    return () => clearInterval(interval)
  }, [fetchAlerts])

  // Don't trigger re-renders on map move - just store for manual refresh
  const handleMapMove = useCallback((bounds: AlertMapBounds) => {
    // Store in ref instead of state to avoid re-renders
    mapBoundsRef.current = bounds
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAlerts(mapBoundsRef.current || undefined)
    setRefreshing(false)
  }

  const handleAlertClick = (alert: AlertType) => {
    setSelectedAlertId(alert.id)
  }

  const handleVerifyAlert = async (alertId: string) => {
    const response = await fetch(`/api/alerts/${alertId}/verify`, { method: 'POST' })
    if (!response.ok) throw new Error('Failed to verify')
    const data = await response.json()
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, ...data.alert } : a))
  }

  const handleSubmitAlert = async (data: {
    alertType: string
    latitude: number
    longitude: number
    address?: string
    description?: string
    media?: {
      type: 'image' | 'video'
      url: string
      caption?: string
      videoId?: string
      thumbnailUrl?: string
      durationSeconds?: number
      fileSizeBytes?: number
    }[]
  }) => {
    const response = await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, occurredAt: new Date().toISOString() }),
    })
    if (!response.ok) throw new Error('Failed to submit')
    const result = await response.json()
    setAlerts(prev => [result.alert, ...prev])
    setShowReportModal(false)
  }

  const handleQuickReport = (type: string) => {
    setReportType(type)
    setShowReportModal(true)
  }

  // Stats
  const raidCount = alerts.filter(a => a.alertType.includes('raid') || a.alertType.includes('workplace') || a.alertType.includes('residence')).length
  const checkpointCount = alerts.filter(a => a.alertType === 'ice_checkpoint').length
  const vehicleCount = alerts.filter(a => a.alertType === 'ice_vehicle').length
  const verifiedCount = alerts.filter(a => a.verificationCount >= 3).length

  useEffect(() => {
    if (searchParams.get('report') === 'true') {
      setShowReportModal(true)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        showBack
        title={t.liveAlerts}
        subtitle={`${alerts.length} ${t.active} • ${formatTimeAgo(lastRefresh, t)}`}
      />

      <main className="container mx-auto px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">{t.loadingAlerts}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Bento Grid - Soft Transit Design */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-6">
              {/* Quick Report - Emergency Red - Large Hero Button */}
              <button
                onClick={() => setShowReportModal(true)}
                className="col-span-2 row-span-2 bg-[#DC2626] text-white rounded-[16px] p-8 flex flex-col items-center justify-center gap-4 press-scale hover-scale glow-emergency animate-urgent relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="relative z-10 w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                  <Plus className="h-10 w-10" strokeWidth={2.5} />
                </div>
                <div className="relative z-10 text-center">
                  <div className="text-title">{t.reportActivity}</div>
                  <div className="text-caption text-white/80">{t.reportActivityAlt}</div>
                </div>
              </button>

              {/* Stats Cards - Glass Design */}
              <div className="card-glass category-bar category-bar-tangerine p-5 flex flex-col items-center justify-center">
                <AlertTriangle className="h-7 w-7 text-[#FF8C42] mb-1" strokeWidth={2} />
                <div className="text-title font-extrabold">{raidCount}</div>
                <div className="text-small text-muted-foreground font-medium">{t.raids}</div>
              </div>

              <div className="card-glass category-bar category-bar-bondi p-5 flex flex-col items-center justify-center">
                <ShieldAlert className="h-7 w-7 text-[#00A6B4] mb-1" strokeWidth={2} />
                <div className="text-title font-extrabold">{checkpointCount}</div>
                <div className="text-small text-muted-foreground font-medium">{t.checkpoints}</div>
              </div>

              <div className="card-glass category-bar category-bar-grape p-5 flex flex-col items-center justify-center">
                <Car className="h-7 w-7 text-[#8B5CF6] mb-1" strokeWidth={2} />
                <div className="text-title font-extrabold">{vehicleCount}</div>
                <div className="text-small text-muted-foreground font-medium">{t.vehicles}</div>
              </div>

              <div className="card-glass category-bar category-bar-lime p-5 flex flex-col items-center justify-center">
                <CheckCircle className="h-7 w-7 text-[#84CC16] mb-1" strokeWidth={2} />
                <div className="text-title font-extrabold">{verifiedCount}</div>
                <div className="text-small text-muted-foreground font-medium">{t.verified}</div>
              </div>
            </div>

            {/* Quick Report Type Buttons */}
            <div className="mb-5">
              <h2 className="text-small font-semibold mb-3 text-muted-foreground uppercase tracking-wide">{t.quickReport}</h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[
                  { type: 'ice_raid', icon: AlertTriangle, label: t.raid, color: 'text-[#DC2626] bg-[#DC2626]/10 hover:bg-[#DC2626]/20' },
                  { type: 'ice_workplace', icon: Building2, label: t.workplace, color: 'text-[#DC2626] bg-[#DC2626]/10 hover:bg-[#DC2626]/20' },
                  { type: 'ice_residence', icon: Home, label: t.residence, color: 'text-[#DC2626] bg-[#DC2626]/10 hover:bg-[#DC2626]/20' },
                  { type: 'ice_checkpoint', icon: ShieldAlert, label: t.checkpoint, color: 'text-[#FF8C42] bg-[#FF8C42]/10 hover:bg-[#FF8C42]/20' },
                  { type: 'ice_vehicle', icon: Car, label: t.vehicle, color: 'text-[#8B5CF6] bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20' },
                  { type: 'ice_transit', icon: Train, label: t.transit, color: 'text-[#00A6B4] bg-[#00A6B4]/10 hover:bg-[#00A6B4]/20' },
                  { type: 'all_clear', icon: CheckCircle, label: t.theyveLeft, color: 'text-[#84CC16] bg-[#84CC16]/10 hover:bg-[#84CC16]/20' },
                ].map(({ type, icon: Icon, label, color }) => (
                  <button
                    key={type}
                    onClick={() => handleQuickReport(type)}
                    className={`${color} rounded-[8px] p-4 flex flex-col items-center gap-2 press-scale hover-scale border border-transparent hover:border-current/20 min-h-[48px]`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={2} />
                    <span className="text-small font-semibold">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Map View */}
            <div className="rounded-[16px] overflow-hidden border shadow-lg">
              <AlertMap
                alerts={alerts}
                userLocation={userLocation}
                onMapMove={handleMapMove}
                onAlertClick={handleAlertClick}
                onVerifyAlert={handleVerifyAlert}
                selectedAlertId={selectedAlertId}
                onUserLocationUpdate={setUserLocation}
                className="h-[50vh] min-h-[400px]"
              />
            </div>

            {/* Recent Alerts Preview */}
            {alerts.length > 0 && (
              <div className="mt-5">
                <h2 className="text-small font-semibold text-muted-foreground uppercase tracking-wide mb-3">{t.recentReports}</h2>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
                  {alerts.slice(0, 5).map((alert) => {
                    const type = ALERT_TYPES[alert.alertType]
                    return (
                      <button
                        key={alert.id}
                        onClick={() => handleAlertClick(alert)}
                        className="flex-shrink-0 w-52 card-glass p-4 text-left press-scale hover-scale"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: type.markerColor }} />
                          <span className="text-caption font-semibold">{language === 'en' ? type.label : type.labelEs}</span>
                        </div>
                        {alert.address && (
                          <p className="text-small text-muted-foreground truncate mb-2">{alert.address}</p>
                        )}
                        <div className="flex items-center gap-2 text-small text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(new Date(alert.reportedAt), t)}</span>
                          {alert.verificationCount >= 3 && (
                            <span className="text-[#84CC16] font-medium">{t.verified}</span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Report Modal */}
      <ReportAlertModal
        isOpen={showReportModal}
        onClose={() => {
          setShowReportModal(false)
          setReportType(null)
        }}
        onSubmit={handleSubmitAlert}
        initialLocation={userLocation}
      />
    </div>
  )
}

function formatTimeAgo(date: Date, t?: typeof commonTranslations['en']): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  if (seconds < 60) return t?.justNow || 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}${t?.minsAgo || 'm ago'}`
  return `${Math.floor(seconds / 3600)}${t?.hoursAgo || 'h ago'}`
}

export default function AlertsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <AlertsPageContent />
    </Suspense>
  )
}
