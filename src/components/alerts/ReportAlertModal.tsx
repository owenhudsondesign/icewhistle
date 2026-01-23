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
  ChevronLeft,
  Camera
} from 'lucide-react'
import { MediaUpload, MediaItem } from './MediaUpload'
import { AlertType, ALERT_TYPES, fuzzyLocation } from '@/types/alert'
import { Geolocation } from '@capacitor/geolocation'
import { useLanguage } from '@/hooks/use-language'

const modalTranslations = {
  en: {
    reportIceActivity: 'Report ICE activity',
    helpCommunity: 'Help your community stay safe',
    anonymous: 'Anonymous',
    noTracking: 'No accounts. No tracking. Location rounded to ~500m for privacy.',
    whatType: 'What type of activity?',
    whereHappening: 'Where is this happening?',
    useCurrentLocation: 'Use my current location',
    approximateLocation: 'Approximate location only (~500m precision)',
    or: 'or',
    enterAddress: 'Enter address, intersection, or landmark',
    addressHint: 'Enter a street address, cross streets, or business name',
    find: 'Find',
    back: 'Back',
    reporting: 'Reporting:',
    currentLocationApprox: 'Current location (approximate)',
    additionalDetails: 'What did you see? (optional)',
    notePlaceholder: 'E.g., 3 officers, 2 unmarked vehicles, heading north on Main St...',
    submitReport: 'Submit report',
    submitting: 'Submitting your report...',
    reportSubmitted: 'Report submitted',
    thankYou: 'Thank you for helping keep your community safe.',
    locationDenied: 'Location permission was denied. Please allow location access in your device settings, or enter an address instead.',
    locationUnavailable: 'Could not determine your location. Please make sure location services are enabled on your device, or enter an address instead.',
    locationTimeout: 'Location request timed out. Please try again or enter an address instead.',
    locationError: 'Could not get your location. Please enter an address instead.',
    addressError: 'Could not find that address. Please try again.',
    geocodeError: 'Error looking up address. Please try again.',
    submitError: 'Failed to submit report. Please try again.',
    enterAddressError: 'Please enter an address',
    addPhotoVideo: 'Add photo or video (optional)',
    mediaPrivacy: 'Photos and videos are 100% anonymous. No metadata, no account, no way to trace back to you.',
  },
  es: {
    reportIceActivity: 'Reportar actividad de ICE',
    helpCommunity: 'Ayuda a tu comunidad a mantenerse segura',
    anonymous: 'Anónimo',
    noTracking: 'Sin cuentas. Sin rastreo. Ubicación redondeada a ~500m para privacidad.',
    whatType: '¿Qué tipo de actividad?',
    whereHappening: '¿Dónde está pasando?',
    useCurrentLocation: 'Usar mi ubicación actual',
    approximateLocation: 'Solo ubicación aproximada (~500m de precisión)',
    or: 'o',
    enterAddress: 'Ingresa dirección, intersección o lugar',
    addressHint: 'Ingresa una dirección, calles cruzadas o nombre de negocio',
    find: 'Buscar',
    back: 'Atrás',
    reporting: 'Reportando:',
    currentLocationApprox: 'Ubicación actual (aproximada)',
    additionalDetails: '¿Qué viste? (opcional)',
    notePlaceholder: 'Ej., 3 oficiales, 2 vehículos sin marcar, yendo al norte por la calle Main...',
    submitReport: 'Enviar reporte',
    submitting: 'Enviando tu reporte...',
    reportSubmitted: 'Reporte enviado',
    thankYou: 'Gracias por ayudar a mantener segura a tu comunidad.',
    locationDenied: 'El permiso de ubicación fue denegado. Por favor permite el acceso a la ubicación en la configuración de tu dispositivo, o ingresa una dirección.',
    locationUnavailable: 'No se pudo determinar tu ubicación. Asegúrate de que los servicios de ubicación estén habilitados, o ingresa una dirección.',
    locationTimeout: 'La solicitud de ubicación expiró. Intenta de nuevo o ingresa una dirección.',
    locationError: 'No se pudo obtener tu ubicación. Por favor ingresa una dirección.',
    addressError: 'No se encontró esa dirección. Por favor intenta de nuevo.',
    geocodeError: 'Error al buscar la dirección. Por favor intenta de nuevo.',
    submitError: 'Error al enviar el reporte. Por favor intenta de nuevo.',
    enterAddressError: 'Por favor ingresa una dirección',
    addPhotoVideo: 'Agregar foto o video (opcional)',
    mediaPrivacy: 'Fotos y videos son 100% anónimos. Sin metadatos, sin cuenta, sin forma de rastrearte.',
  },
  pt: {
    reportIceActivity: 'Reportar atividade do ICE',
    helpCommunity: 'Ajude sua comunidade a se manter segura',
    anonymous: 'Anônimo',
    noTracking: 'Sem contas. Sem rastreamento. Localização arredondada para ~500m para privacidade.',
    whatType: 'Que tipo de atividade?',
    whereHappening: 'Onde está acontecendo?',
    useCurrentLocation: 'Usar minha localização atual',
    approximateLocation: 'Apenas localização aproximada (~500m de precisão)',
    or: 'ou',
    enterAddress: 'Digite endereço, cruzamento ou ponto de referência',
    addressHint: 'Digite um endereço, ruas cruzadas ou nome do estabelecimento',
    find: 'Buscar',
    back: 'Voltar',
    reporting: 'Reportando:',
    currentLocationApprox: 'Localização atual (aproximada)',
    additionalDetails: 'O que você viu? (opcional)',
    notePlaceholder: 'Ex., 3 oficiais, 2 veículos sem identificação, indo para o norte na Rua Main...',
    submitReport: 'Enviar relatório',
    submitting: 'Enviando seu relatório...',
    reportSubmitted: 'Relatório enviado',
    thankYou: 'Obrigado por ajudar a manter sua comunidade segura.',
    locationDenied: 'A permissão de localização foi negada. Por favor, permita o acesso à localização nas configurações do seu dispositivo, ou digite um endereço.',
    locationUnavailable: 'Não foi possível determinar sua localização. Certifique-se de que os serviços de localização estejam habilitados, ou digite um endereço.',
    locationTimeout: 'A solicitação de localização expirou. Tente novamente ou digite um endereço.',
    locationError: 'Não foi possível obter sua localização. Por favor, digite um endereço.',
    addressError: 'Não foi possível encontrar esse endereço. Por favor, tente novamente.',
    geocodeError: 'Erro ao buscar o endereço. Por favor, tente novamente.',
    submitError: 'Falha ao enviar o relatório. Por favor, tente novamente.',
    enterAddressError: 'Por favor, digite um endereço',
    addPhotoVideo: 'Adicionar foto ou vídeo (opcional)',
    mediaPrivacy: 'Fotos e vídeos são 100% anônimos. Sem metadados, sem conta, sem forma de rastrear você.',
  },
}

export interface ReportMediaData {
  type: 'image' | 'video'
  url: string
  caption?: string
  videoId?: string
  thumbnailUrl?: string
  durationSeconds?: number
  fileSizeBytes?: number
}

interface ReportAlertModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    alertType: AlertType
    latitude: number
    longitude: number
    address?: string
    description?: string
    media?: ReportMediaData[]
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
  const { language } = useLanguage()
  const t = modalTranslations[language]
  const [step, setStep] = useState<'type' | 'location' | 'details' | 'submitting' | 'success'>('type')
  const [alertType, setAlertType] = useState<AlertType | null>(null)
  const [locationMethod, setLocationMethod] = useState<'gps' | 'address' | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(initialLocation || null)
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [media, setMedia] = useState<MediaItem[]>([])

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
      setMedia([])
    }
  }, [isOpen, initialLocation])

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true)
    setError(null)

    try {
      // Request permission first - this triggers the system dialog
      const permissionStatus = await Geolocation.requestPermissions()

      if (permissionStatus.location === 'denied') {
        setError(t.locationDenied)
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
        setError(t.locationDenied)
      } else if (errorMessage.includes('unavailable') || errorMessage.includes('disabled')) {
        setError(t.locationUnavailable)
      } else if (errorMessage.includes('timeout')) {
        setError(t.locationTimeout)
      } else {
        setError(t.locationError)
      }
    } finally {
      setIsGettingLocation(false)
    }
  }

  const handleGeocodeAddress = async () => {
    if (!address.trim()) {
      setError(t.enterAddressError)
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
        setError(t.addressError)
      }
    } catch (err) {
      setError(t.geocodeError)
    } finally {
      setIsGeocoding(false)
    }
  }

  const handleSubmit = async () => {
    if (!alertType || !location) return

    // Check if any media is still uploading
    const hasUploadingMedia = media.some(m => m.status === 'uploading')
    if (hasUploadingMedia) {
      return // Wait for uploads to complete
    }

    setStep('submitting')

    try {
      // Only include successfully uploaded media
      const uploadedMedia: ReportMediaData[] = media
        .filter(m => m.status === 'ready' && m.publicUrl)
        .map(m => ({
          type: m.type,
          url: m.publicUrl!,
          caption: m.caption || undefined,
          videoId: m.videoId,
          thumbnailUrl: m.thumbnailUrl,
          durationSeconds: m.durationSeconds,
          fileSizeBytes: m.fileSizeBytes,
        }))

      await onSubmit({
        alertType,
        latitude: location.lat,
        longitude: location.lng,
        address: locationMethod === 'address' ? address : undefined,
        description: description.trim() || undefined,
        media: uploadedMedia.length > 0 ? uploadedMedia : undefined,
      })
      setStep('success')
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      setError(t.submitError)
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
                <h2 className="text-headline">{t.reportIceActivity}</h2>
                <p className="text-small text-muted-foreground">{t.helpCommunity}</p>
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
              <strong className="text-foreground">{t.anonymous}</strong> — {t.noTracking}
            </p>
          </div>
        </div>

        {/* Step 1: Select Alert Type */}
        {step === 'type' && (
          <div className="space-y-4">
            <Label className="text-caption font-semibold">{t.whatType}</Label>
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
                {t.back}
              </Button>
              <span className="text-small text-muted-foreground">
                {t.reporting} {alertType && (language === 'es' ? ALERT_TYPES[alertType].labelEs : language === 'pt' ? ALERT_TYPES[alertType].labelPt : ALERT_TYPES[alertType].label)}
              </span>
            </div>

            <Label className="text-caption font-semibold">{t.whereHappening}</Label>

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
                  <div className="text-caption font-semibold">{t.useCurrentLocation}</div>
                  <div className="text-small text-muted-foreground">
                    {t.approximateLocation}
                  </div>
                </div>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-small uppercase">
                  <span className="bg-card px-2 text-muted-foreground">{t.or}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={2} />
                    <Input
                      placeholder={t.enterAddress}
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
                    {isGeocoding ? <Loader2 className="h-4 w-4 animate-spin" /> : t.find}
                  </Button>
                </div>
                <p className="text-small text-muted-foreground">
                  {t.addressHint}
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
                {t.back}
              </Button>
            </div>

            {/* Summary */}
            <div className="p-4 card-glass space-y-2">
              <div className="flex items-center gap-2">
                <div className={TYPE_COLORS[alertType!].text}>
                  {ALERT_TYPE_OPTIONS.find(o => o.type === alertType)?.icon}
                </div>
                <span className="text-caption font-semibold">
                  {language === 'es' ? ALERT_TYPES[alertType!].labelEs : language === 'pt' ? ALERT_TYPES[alertType!].labelPt : ALERT_TYPES[alertType!].label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-small text-muted-foreground">
                <MapPin className="h-4 w-4" strokeWidth={2} />
                {locationMethod === 'address' ? address : t.currentLocationApprox}
              </div>
            </div>

            {/* Optional description */}
            <div className="space-y-2">
              <Label className="text-caption font-semibold">
                {t.additionalDetails}
              </Label>
              <textarea
                placeholder={t.notePlaceholder}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[100px] p-3 rounded-[8px] border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-[#00A6B4] text-body"
                maxLength={500}
              />
              <p className="text-small text-muted-foreground text-right">
                {description.length}/500
              </p>
            </div>

            {/* Photo/Video Upload */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
                <Label className="text-caption font-semibold">
                  {t.addPhotoVideo}
                </Label>
              </div>
              <p className="text-small text-muted-foreground mb-2">
                {t.mediaPrivacy}
              </p>
              <MediaUpload
                media={media}
                onChange={setMedia}
                maxItems={3}
              />
            </div>

            {error && (
              <div className="p-3 bg-[#DC2626]/10 text-[#DC2626] text-caption rounded-[8px]">
                {error}
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={media.some(m => m.status === 'uploading')}
              className="w-full h-12 rounded-[8px] bg-[#DC2626] hover:bg-[#DC2626]/90 text-white press-scale disabled:opacity-50"
            >
              {media.some(m => m.status === 'uploading') ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <AlertTriangle className="h-4 w-4 mr-2" strokeWidth={2} />
              )}
              {t.submitReport}
            </Button>
          </div>
        )}

        {/* Submitting */}
        {step === 'submitting' && (
          <div className="py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#00A6B4]" />
            <p className="text-caption text-muted-foreground">{t.submitting}</p>
          </div>
        )}

        {/* Success */}
        {step === 'success' && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#84CC16]/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-[#84CC16]" strokeWidth={2} />
            </div>
            <h3 className="text-headline mb-2">{t.reportSubmitted}</h3>
            <p className="text-caption text-muted-foreground">
              {t.thankYou}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportAlertModal
