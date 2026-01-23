'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, MapPin, Loader2, Check, Trash2 } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import { useLocation, geocodeZipCode } from '@/hooks/use-location'

const translations = {
  en: {
    title: 'Set Your Location',
    subtitle: 'Enter a zip code to see alerts near you',
    placeholder: '5-digit ZIP code',
    save: 'Save',
    cancel: 'Cancel',
    clear: 'Clear',
    currentLocation: 'Currently viewing:',
    invalid: 'Invalid zip code',
    notFound: 'Zip code not found',
    saving: 'Saving...',
    privacyNote: 'Your zip code is stored only on this device',
    useCurrentLocation: 'Use my current location',
  },
  es: {
    title: 'Establecer Tu Ubicación',
    subtitle: 'Ingresa un código postal para ver alertas cerca de ti',
    placeholder: 'Código postal de 5 dígitos',
    save: 'Guardar',
    cancel: 'Cancelar',
    clear: 'Borrar',
    currentLocation: 'Actualmente viendo:',
    invalid: 'Código postal inválido',
    notFound: 'Código postal no encontrado',
    saving: 'Guardando...',
    privacyNote: 'Tu código postal se guarda solo en este dispositivo',
    useCurrentLocation: 'Usar mi ubicación actual',
  },
  pt: {
    title: 'Definir Sua Localização',
    subtitle: 'Digite um CEP para ver alertas perto de você',
    placeholder: 'CEP de 5 dígitos',
    save: 'Salvar',
    cancel: 'Cancelar',
    clear: 'Limpar',
    currentLocation: 'Visualizando atualmente:',
    invalid: 'CEP inválido',
    notFound: 'CEP não encontrado',
    saving: 'Salvando...',
    privacyNote: 'Seu CEP é armazenado apenas neste dispositivo',
    useCurrentLocation: 'Usar minha localização atual',
  },
}

interface ZipCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onLocationSet?: (location: { lat: number; lng: number } | null) => void
}

export function ZipCodeModal({ isOpen, onClose, onLocationSet }: ZipCodeModalProps) {
  const { language } = useLanguage()
  const t = translations[language]
  const { savedLocation, setSavedLocation, clearSavedLocation } = useLocation()

  const [zipCode, setZipCode] = useState(savedLocation?.zipCode || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSave = async () => {
    const cleanZip = zipCode.trim().replace(/[^0-9]/g, '')

    if (cleanZip.length !== 5) {
      setError(t.invalid)
      return
    }

    setLoading(true)
    setError(null)

    const result = await geocodeZipCode(cleanZip)

    if (!result) {
      setError(t.notFound)
      setLoading(false)
      return
    }

    setSavedLocation({
      zipCode: cleanZip,
      lat: result.lat,
      lng: result.lng,
      city: result.city,
    })

    onLocationSet?.({ lat: result.lat, lng: result.lng })
    setLoading(false)
    onClose()
  }

  const handleClear = () => {
    clearSavedLocation()
    setZipCode('')
    onLocationSet?.(null)
    onClose()
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearSavedLocation()
          onLocationSet?.({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setLoading(false)
          onClose()
        },
        () => {
          setLoading(false)
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm mx-4 card-glass p-6 rounded-[16px] shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-[8px] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#00A6B4]/10 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-[#00A6B4]" />
          </div>
          <div>
            <h2 className="text-headline">{t.title}</h2>
            <p className="text-small text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>

        {/* Current location */}
        {savedLocation && (
          <div className="mb-4 p-3 bg-[#00A6B4]/10 rounded-[8px]">
            <p className="text-small text-muted-foreground">{t.currentLocation}</p>
            <p className="text-caption font-medium">
              {savedLocation.city ? `${savedLocation.city} (${savedLocation.zipCode})` : savedLocation.zipCode}
            </p>
          </div>
        )}

        {/* Input */}
        <div className="space-y-4">
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={5}
            placeholder={t.placeholder}
            value={zipCode}
            onChange={(e) => {
              setZipCode(e.target.value.replace(/[^0-9]/g, ''))
              setError(null)
            }}
            className="h-12 text-center text-lg font-medium tracking-wider rounded-[8px]"
          />

          {error && (
            <p className="text-small text-[#DC2626] text-center">{error}</p>
          )}

          <p className="text-[11px] text-muted-foreground text-center">
            {t.privacyNote}
          </p>

          {/* Buttons */}
          <div className="flex gap-2">
            {savedLocation && (
              <Button
                variant="outline"
                onClick={handleClear}
                className="flex-1 h-11 rounded-[8px] text-[#DC2626] hover:bg-[#DC2626]/10"
                disabled={loading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t.clear}
              </Button>
            )}
            <Button
              onClick={handleSave}
              className="flex-1 h-11 rounded-[8px] bg-[#00A6B4] hover:bg-[#00A6B4]/90"
              disabled={loading || zipCode.length !== 5}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              {loading ? t.saving : t.save}
            </Button>
          </div>

          {/* Use current location button */}
          <Button
            variant="ghost"
            onClick={handleUseCurrentLocation}
            className="w-full h-10 text-small text-muted-foreground hover:text-foreground"
            disabled={loading}
          >
            <MapPin className="h-4 w-4 mr-2" />
            {t.useCurrentLocation}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ZipCodeModal
