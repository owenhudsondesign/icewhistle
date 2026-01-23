'use client'

import { useState, useEffect, useCallback } from 'react'

export interface EmergencyContact {
  id: string
  name: string
  phone: string // Store as digits only
}

interface EmergencyContactsState {
  contacts: EmergencyContact[]
  customMessage: string
  isEnabled: boolean
}

const STORAGE_KEY = 'icewhistle-emergency-contacts'

const DEFAULT_STATE: EmergencyContactsState = {
  contacts: [],
  customMessage: '',
  isEnabled: true,
}

// Default messages by language
export const defaultMessages = {
  en: "URGENT: I may be in an ICE encounter right now. My location: {location}. If you don't hear from me in 30 minutes, please call the ICE detention hotline: 1-888-351-4024",
  es: "URGENTE: Puedo estar en un encuentro con ICE ahora mismo. Mi ubicación: {location}. Si no sabes de mí en 30 minutos, llama a la línea de detención de ICE: 1-888-351-4024",
  pt: "URGENTE: Posso estar em um encontro com ICE agora. Minha localização: {location}. Se não tiver notícias minhas em 30 minutos, ligue para a linha de detenção do ICE: 1-888-351-4024",
}

/**
 * Format phone number for display (US format)
 */
export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }
  return phone
}

/**
 * Validate phone number (basic validation)
 */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15
}

/**
 * Hook for managing emergency contacts
 * All data stored locally - never sent to server
 */
export function useEmergencyContacts() {
  const [state, setState] = useState<EmergencyContactsState>(DEFAULT_STATE)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setState({
          contacts: parsed.contacts || [],
          customMessage: parsed.customMessage || '',
          isEnabled: parsed.isEnabled !== false,
        })
      }
    } catch (e) {
      console.warn('Failed to load emergency contacts:', e)
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage when state changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      } catch (e) {
        console.warn('Failed to save emergency contacts:', e)
      }
    }
  }, [state, isLoaded])

  const addContact = useCallback((name: string, phone: string) => {
    const digits = phone.replace(/\D/g, '')
    if (!isValidPhone(digits)) return false

    const newContact: EmergencyContact = {
      id: crypto.randomUUID(),
      name: name.trim(),
      phone: digits,
    }

    setState(prev => ({
      ...prev,
      contacts: [...prev.contacts, newContact],
    }))
    return true
  }, [])

  const removeContact = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      contacts: prev.contacts.filter(c => c.id !== id),
    }))
  }, [])

  const updateContact = useCallback((id: string, name: string, phone: string) => {
    const digits = phone.replace(/\D/g, '')
    if (!isValidPhone(digits)) return false

    setState(prev => ({
      ...prev,
      contacts: prev.contacts.map(c =>
        c.id === id ? { ...c, name: name.trim(), phone: digits } : c
      ),
    }))
    return true
  }, [])

  const setCustomMessage = useCallback((message: string) => {
    setState(prev => ({ ...prev, customMessage: message }))
  }, [])

  const setEnabled = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, isEnabled: enabled }))
  }, [])

  /**
   * Generate SMS URL for alerting all contacts
   * Opens native SMS app with pre-filled recipients and message
   */
  const generateSmsUrl = useCallback((
    language: 'en' | 'es' | 'pt' = 'en',
    location?: { lat: number; lng: number } | null
  ): string | null => {
    if (state.contacts.length === 0) return null

    // Build recipient list
    const recipients = state.contacts.map(c => c.phone).join(',')

    // Build message
    let message = state.customMessage || defaultMessages[language]

    // Replace location placeholder
    if (location) {
      const locationUrl = `https://maps.google.com/?q=${location.lat},${location.lng}`
      message = message.replace('{location}', locationUrl)
    } else {
      message = message.replace('{location}', '(location unavailable)')
    }

    // Encode for URL
    const encodedMessage = encodeURIComponent(message)

    // iOS uses &body=, Android uses ?body=
    // Using the more compatible format that works on both
    return `sms:${recipients}?body=${encodedMessage}`
  }, [state.contacts, state.customMessage])

  /**
   * Open SMS app with pre-filled alert
   */
  const sendAlert = useCallback((
    language: 'en' | 'es' | 'pt' = 'en',
    location?: { lat: number; lng: number } | null
  ): boolean => {
    const url = generateSmsUrl(language, location)
    if (!url) return false

    // Open SMS app
    window.location.href = url
    return true
  }, [generateSmsUrl])

  return {
    contacts: state.contacts,
    customMessage: state.customMessage,
    isEnabled: state.isEnabled,
    isLoaded,
    hasContacts: state.contacts.length > 0,

    // Actions
    addContact,
    removeContact,
    updateContact,
    setCustomMessage,
    setEnabled,
    generateSmsUrl,
    sendAlert,
  }
}
