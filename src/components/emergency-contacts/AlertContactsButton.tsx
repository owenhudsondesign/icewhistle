'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useEmergencyContacts } from '@/hooks/use-emergency-contacts'
import { useLanguage } from '@/hooks/use-language'
import { MessageSquare, Users, ChevronRight, Check, MapPin } from 'lucide-react'
import Link from 'next/link'

const translations = {
  en: {
    alertContacts: 'Alert My Contacts',
    alertContactsDesc: 'Send SMS to your emergency contacts',
    noContacts: 'Set Up Emergency Contacts',
    noContactsDesc: 'Add people to alert in an emergency',
    gettingLocation: 'Getting location...',
    alertSent: 'Opening SMS...',
    contacts: 'contacts',
  },
  es: {
    alertContacts: 'Alertar Mis Contactos',
    alertContactsDesc: 'Enviar SMS a tus contactos de emergencia',
    noContacts: 'Configurar Contactos de Emergencia',
    noContactsDesc: 'Agrega personas para alertar en emergencia',
    gettingLocation: 'Obteniendo ubicación...',
    alertSent: 'Abriendo SMS...',
    contacts: 'contactos',
  },
  pt: {
    alertContacts: 'Alertar Meus Contatos',
    alertContactsDesc: 'Enviar SMS para seus contatos de emergência',
    noContacts: 'Configurar Contatos de Emergência',
    noContactsDesc: 'Adicione pessoas para alertar em emergência',
    gettingLocation: 'Obtendo localização...',
    alertSent: 'Abrindo SMS...',
    contacts: 'contatos',
  },
}

interface AlertContactsButtonProps {
  className?: string
  variant?: 'default' | 'compact'
}

export function AlertContactsButton({
  className = '',
  variant = 'default',
}: AlertContactsButtonProps) {
  const { language } = useLanguage()
  const t = translations[language as keyof typeof translations] || translations.en
  const { contacts, hasContacts, sendAlert, isLoaded } = useEmergencyContacts()
  const [status, setStatus] = useState<'idle' | 'locating' | 'sent'>('idle')
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Try to get location on mount (for faster alert sending)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          })
        },
        () => {
          // Location denied - that's OK, we'll send without it
        },
        { enableHighAccuracy: false, timeout: 5000 }
      )
    }
  }, [])

  const handleAlert = async () => {
    if (!hasContacts) return

    // If we don't have location yet, try to get it quickly
    if (!location && navigator.geolocation) {
      setStatus('locating')
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 3000,
          })
        })
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
        sendAlert(language, {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
      } catch {
        // Send without location
        sendAlert(language, null)
      }
    } else {
      sendAlert(language, location)
    }

    setStatus('sent')
    setTimeout(() => setStatus('idle'), 2000)
  }

  if (!isLoaded) {
    return null
  }

  // No contacts - show setup button
  if (!hasContacts) {
    if (variant === 'compact') {
      return (
        <Link href="/emergency-contacts" className={`block ${className}`}>
          <Button
            variant="outline"
            className="w-full h-12 rounded-[8px] border-dashed border-[#FF8C42]/50 text-[#FF8C42] hover:bg-[#FF8C42]/10"
          >
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{t.noContacts}</span>
          </Button>
        </Link>
      )
    }

    return (
      <Link href="/emergency-contacts" className={`block ${className}`}>
        <div className="p-4 rounded-[12px] bg-[#FF8C42]/10 border border-[#FF8C42]/30 hover:bg-[#FF8C42]/20 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#FF8C42]/20 flex items-center justify-center flex-shrink-0">
              <Users className="h-6 w-6 text-[#FF8C42]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#FF8C42] text-sm leading-tight break-words">{t.noContacts}</p>
              <p className="text-xs text-muted-foreground leading-tight break-words mt-0.5">{t.noContactsDesc}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-[#FF8C42] flex-shrink-0" />
          </div>
        </div>
      </Link>
    )
  }

  // Has contacts - show alert button
  if (variant === 'compact') {
    return (
      <Button
        onClick={handleAlert}
        disabled={status !== 'idle'}
        className={`w-full h-12 rounded-[8px] bg-[#FF8C42] hover:bg-[#FF8C42]/90 text-white ${className}`}
      >
        {status === 'locating' ? (
          <>
            <MapPin className="h-4 w-4 mr-2 animate-pulse flex-shrink-0" />
            <span className="line-clamp-1">{t.gettingLocation}</span>
          </>
        ) : status === 'sent' ? (
          <>
            <Check className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{t.alertSent}</span>
          </>
        ) : (
          <>
            <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{t.alertContacts} ({contacts.length})</span>
          </>
        )}
      </Button>
    )
  }

  return (
    <button
      onClick={handleAlert}
      disabled={status !== 'idle'}
      className={`w-full p-4 rounded-[12px] bg-[#FF8C42] hover:bg-[#FF8C42]/90 text-white transition-colors disabled:opacity-70 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          {status === 'locating' ? (
            <MapPin className="h-6 w-6 animate-pulse" />
          ) : status === 'sent' ? (
            <Check className="h-6 w-6" />
          ) : (
            <MessageSquare className="h-6 w-6" />
          )}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="font-semibold text-sm leading-tight break-words">
            {status === 'locating'
              ? t.gettingLocation
              : status === 'sent'
              ? t.alertSent
              : t.alertContacts}
          </p>
          <p className="text-xs text-white/80 leading-tight">
            {status === 'idle' && `${contacts.length} ${t.contacts}`}
          </p>
        </div>
        {status === 'idle' && <ChevronRight className="h-5 w-5 text-white/70 flex-shrink-0" />}
      </div>
    </button>
  )
}
