'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  AlertTriangle,
  Building2,
  Home,
  ShieldAlert,
  Car,
  Train,
  HelpCircle,
  MapPin,
  Crosshair,
  X,
  Loader2,
  Lock,
  CheckCircle,
  ChevronLeft
} from 'lucide-react'
import { AlertType, ALERT_TYPES, fuzzyLocation } from '@/types/alert'
import { Geolocation } from '@capacitor/geolocation'

interface ReportAlertModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    alertType: AlertType
    latitude: number
    longitude: number
    address?: string
    description?: string
  }) => Promise<void>
  initialLocation?: { lat: number; lng: number } | null
}

// Map alert types to Soft Transit colors
const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  ice_raid: { bg: 'bg-[#DC2626]/10', text: 'text-[#DC2626]' },
  ice_workplace: { bg: 'bg-[#DC2626]/10', text: 'text-[#DC2626]' },
  ice_residence: { bg: 'bg-[#DC2626]/10', text: 'text-[#DC2626]' },
  ice_checkpoint: { bg: 'bg-[#FF8C42]/10', text: 'text-[#FF8C42]' },
  ice_vehicle: { bg: 'bg-[#8B5CF6]/10', text: 'text-[#8B5CF6]' },
  ice_transit: { bg: 'bg-[#00A6B4]/10', text: 'text-[#00A6B4]' },
  unconfirmed: { bg: 'bg-muted', text: 'text-muted-foreground' },
}

const ALERT_TYPE_OPTIONS: { type: AlertType; icon: React.ReactNode }[] = [
  { type: 'ice_raid', icon: <AlertTriangle className="h-5 w-5" strokeWidth={2} /> },
  { type: 'ice_workplace', icon: <Building2 className="h-5 w-5" strokeWidth={2} /> },
  { type: 'ice_residence', icon: <Home className="h-5 w-5" strokeWidth={2} /> },
  { type: 'ice_checkpoint', icon: <ShieldAlert className="h-5 w-5" strokeWidth={2} /> },
  { type: 'ice_vehicle', icon: <Car className="h-5 w-5" strokeWidth={2} /> },
  { type: 'ice_transit', icon: <Train className="h-5 w-5" strokeWidth={2} /> },
  { type: 'unconfirmed', icon: <HelpCircle className="h-5 w-5" strokeWidth={2} /> },
]

export function ReportAlertModal({
  isOpen,
  onClose,
  onSubmit,
  initialLocation
}: ReportAlertModalProps) {
  const [step, setStep] = useState<'type' | 'location' | 'details' | 'submitting' | 'success'>('type')
  const [alertType, setAlertType] = useState<AlertType | null>(null)
  const [locationMethod, setLocationMethod] = useState<'gps' | 'address' | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(initialLocation || null)
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('type')
      setAlertType(null)
      setLocationMethod(null)
      setLocation(initialLocation || null)
      setAddress('')
      setDescription('')
      setError(null)
    }
  }, [isOpen, initialLocation])

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true)
    setError(null)

    try {
      // Request permission first - this triggers the system dialog
      const permissionStatus = await Geolocation.requestPermissions()

      if (permissionStatus.location === 'denied') {
        setError('Location permission was denied. Please allow location access in your device settings, or enter an address instead.')
        setIsGettingLocation(false)
        return
      }

      // Get the current position
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000
      })

      // Apply fuzzy location for privacy
      setLocation({
        lat: fuzzyLocation(position.coords.latitude),
        lng: fuzzyLocation(position.coords.longitude)
      })
      setLocationMethod('gps')
      setStep('details')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      if (errorMessage.includes('denied') || errorMessage.includes('permission')) {
        setError('Location permission was denied. Please allow location access in your device settings, or enter an address instead.')
      } else if (errorMessage.includes('unavailable') || errorMessage.includes('disabled')) {
        setError('Could not determine your location. Please make sure location services are enabled on your device, or enter an address instead.')
      } else if (errorMessage.includes('timeout')) {
        setError('Location request timed out. Please try again or enter an address instead.')
      } else {
        setError('Could not get your location. Please enter an address instead.')
      }
    } finally {
      setIsGettingLocation(false)
    }
  }

  const handleGeocodeAddress = async () => {
    if (!address.trim()) {
      setError('Please enter an address')
      return
    }

    setIsGeocoding(true)
    setError(null)

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&country=US&limit=1`
      )
      const data = await response.json()

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center
        // Apply fuzzy location for privacy
        setLocation({
          lat: fuzzyLocation(lat),
          lng: fuzzyLocation(lng)
        })
        setLocationMethod('address')
        setStep('details')
      } else {
        setError('Could not find that address. Please try again.')
      }
    } catch (err) {
      setError('Error looking up address. Please try again.')
    } finally {
      setIsGeocoding(false)
    }
  }

  const handleSubmit = async () => {
    if (!alertType || !location) return

    setStep('submitting')

    try {
      await onSubmit({
        alertType,
        latitude: location.lat,
        longitude: location.lng,
        address: locationMethod === 'address' ? address : undefined,
        description: description.trim() || undefined
      })
      setStep('success')
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      setError('Failed to submit report. Please try again.')
      setStep('details')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal - Soft Transit Design */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto z-10 card-glass p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#DC2626]/20 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-[#DC2626]" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-headline">Report ICE activity</h2>
                <p className="text-small text-muted-foreground">Help your community stay safe</p>
              </div>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground press-scale" aria-label="Close">
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>

          {/* Privacy Notice */}
          <div className="flex items-start gap-2 p-3 bg-[#00A6B4]/10 rounded-[8px]">
            <Lock className="h-4 w-4 text-[#00A6B4] mt-0.5 flex-shrink-0" strokeWidth={2} />
            <p className="text-small text-muted-foreground">
              <strong className="text-foreground">Anonymous</strong> — No accounts. No tracking.
              Location rounded to ~100m for privacy.
            </p>
          </div>
        </div>

        {/* Step 1: Select Alert Type */}
        {step === 'type' && (
          <div className="space-y-4">
            <Label className="text-caption font-semibold">What type of activity?</Label>
            <div className="grid grid-cols-2 gap-3">
              {ALERT_TYPE_OPTIONS.map(({ type, icon }) => {
                const info = ALERT_TYPES[type]
                const colors = TYPE_COLORS[type]
                return (
                  <button
                    key={type}
                    onClick={() => {
                      setAlertType(type)
                      setStep('location')
                    }}
                    className={`flex items-center gap-3 p-4 rounded-[8px] text-left press-scale hover-scale ${colors.bg} border border-transparent hover:border-current/20 min-h-[48px]`}
                  >
                    <div className={colors.text}>{icon}</div>
                    <div>
                      <div className="text-caption font-semibold">{info.label}</div>
                      <div className="text-small text-muted-foreground">{info.labelEs}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 'location' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" onClick={() => setStep('type')} className="rounded-[8px] press-scale">
                <ChevronLeft className="h-4 w-4 mr-1" strokeWidth={2} />
                Back
              </Button>
              <span className="text-small text-muted-foreground">
                Reporting: {alertType && ALERT_TYPES[alertType].label}
              </span>
            </div>

            <Label className="text-caption font-semibold">Where is this happening?</Label>

            <div className="space-y-3">
              <button
                onClick={handleGetCurrentLocation}
                disabled={isGettingLocation}
                className="w-full flex items-center gap-3 p-4 rounded-[8px] bg-[#00A6B4]/10 text-left press-scale hover-scale border border-transparent hover:border-[#00A6B4]/20 min-h-[48px]"
              >
                {isGettingLocation ? (
                  <Loader2 className="h-5 w-5 animate-spin text-[#00A6B4]" />
                ) : (
                  <Crosshair className="h-5 w-5 text-[#00A6B4]" strokeWidth={2} />
                )}
                <div>
                  <div className="text-caption font-semibold">Use my current location</div>
                  <div className="text-small text-muted-foreground">
                    Approximate location only (~100m precision)
                  </div>
                </div>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-small uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={2} />
                    <Input
                      placeholder="Enter address, intersection, or landmark"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="pl-10 h-12 rounded-[8px]"
                      onKeyDown={(e) => e.key === 'Enter' && handleGeocodeAddress()}
                    />
                  </div>
                  <Button
                    onClick={handleGeocodeAddress}
                    disabled={isGeocoding || !address.trim()}
                    className="h-12 px-6 rounded-[8px] bg-[#00A6B4] hover:bg-[#00A6B4]/90 text-white"
                  >
                    {isGeocoding ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Find'}
                  </Button>
                </div>
                <p className="text-small text-muted-foreground">
                  Enter a street address, cross streets, or business name
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-[#DC2626]/10 text-[#DC2626] text-caption rounded-[8px]">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Additional Details */}
        {step === 'details' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" onClick={() => setStep('location')} className="rounded-[8px] press-scale">
                <ChevronLeft className="h-4 w-4 mr-1" strokeWidth={2} />
                Back
              </Button>
            </div>

            {/* Summary */}
            <div className="p-4 card-glass space-y-2">
              <div className="flex items-center gap-2">
                <div className={TYPE_COLORS[alertType!].text}>
                  {ALERT_TYPE_OPTIONS.find(o => o.type === alertType)?.icon}
                </div>
                <span className="text-caption font-semibold">{ALERT_TYPES[alertType!].label}</span>
              </div>
              <div className="flex items-center gap-2 text-small text-muted-foreground">
                <MapPin className="h-4 w-4" strokeWidth={2} />
                {locationMethod === 'address' ? address : 'Current location (approximate)'}
              </div>
            </div>

            {/* Optional description */}
            <div className="space-y-2">
              <Label className="text-caption font-semibold">
                Additional details (optional)
              </Label>
              <textarea
                placeholder="E.g., Number of officers, vehicles, direction of movement..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[100px] p-3 rounded-[8px] border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-[#00A6B4] text-body"
                maxLength={500}
              />
              <p className="text-small text-muted-foreground text-right">
                {description.length}/500
              </p>
            </div>

            {error && (
              <div className="p-3 bg-[#DC2626]/10 text-[#DC2626] text-caption rounded-[8px]">
                {error}
              </div>
            )}

            <Button
              onClick={handleSubmit}
              className="w-full h-12 rounded-[8px] bg-[#DC2626] hover:bg-[#DC2626]/90 text-white press-scale"
            >
              <AlertTriangle className="h-4 w-4 mr-2" strokeWidth={2} />
              Submit report
            </Button>
          </div>
        )}

        {/* Submitting */}
        {step === 'submitting' && (
          <div className="py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#00A6B4]" />
            <p className="text-caption text-muted-foreground">Submitting your report...</p>
          </div>
        )}

        {/* Success */}
        {step === 'success' && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#84CC16]/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-[#84CC16]" strokeWidth={2} />
            </div>
            <h3 className="text-headline mb-2">Report submitted</h3>
            <p className="text-caption text-muted-foreground">
              Thank you for helping keep your community safe.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportAlertModal
