'use client'

import { useState, useCallback, useRef } from 'react'
import { useGeolocation } from './useGeolocation'

interface PanicContact {
  name: string
  phone: string
}

interface PanicConfig {
  enabled: boolean
  contacts: PanicContact[]
  customMessage?: string
  includeLocation: boolean
}

interface PanicState {
  isActivating: boolean
  isActivated: boolean
  error: string | null
}

const LONG_PRESS_DURATION = 2000 // 2 seconds
const TRIPLE_TAP_INTERVAL = 500 // 500ms between taps

export function usePanicButton(config: PanicConfig) {
  const [state, setState] = useState<PanicState>({
    isActivating: false,
    isActivated: false,
    error: null,
  })

  const { getLocation, latitude, longitude, hasLocation } = useGeolocation()

  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const tapCount = useRef(0)
  const lastTapTime = useRef(0)

  /**
   * Send emergency alert to all contacts
   */
  const sendAlert = useCallback(async () => {
    if (!config.enabled || config.contacts.length === 0) {
      setState((prev) => ({ ...prev, error: 'Panic button not configured' }))
      return false
    }

    setState({ isActivating: true, isActivated: false, error: null })

    try {
      // Get current location if enabled
      let locationString = ''
      if (config.includeLocation) {
        if (!hasLocation) {
          getLocation()
        }
        if (latitude && longitude) {
          locationString = `\nLocation: https://maps.google.com/?q=${latitude},${longitude}`
        }
      }

      const message =
        config.customMessage ||
        `Emergency alert activated. Please check on me.${locationString}\nTime: ${new Date().toLocaleString()}`

      // Send SMS to all contacts via API
      const response = await fetch('/api/panic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contacts: config.contacts,
          message,
          location:
            config.includeLocation && latitude && longitude
              ? { latitude, longitude }
              : null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send emergency alert')
      }

      setState({ isActivating: false, isActivated: true, error: null })

      // Provide haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100])
      }

      return true
    } catch (error) {
      setState({
        isActivating: false,
        isActivated: false,
        error: 'Failed to send alert',
      })
      return false
    }
  }, [config, getLocation, hasLocation, latitude, longitude])

  /**
   * Handle long press start
   */
  const handlePressStart = useCallback(() => {
    if (!config.enabled) return

    setState((prev) => ({ ...prev, isActivating: true }))

    longPressTimer.current = setTimeout(() => {
      sendAlert()
    }, LONG_PRESS_DURATION)
  }, [config.enabled, sendAlert])

  /**
   * Handle press end (cancel if not held long enough)
   */
  const handlePressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    setState((prev) => ({ ...prev, isActivating: false }))
  }, [])

  /**
   * Handle triple tap activation
   */
  const handleTap = useCallback(() => {
    if (!config.enabled) return

    const now = Date.now()
    if (now - lastTapTime.current < TRIPLE_TAP_INTERVAL) {
      tapCount.current += 1
      if (tapCount.current >= 3) {
        sendAlert()
        tapCount.current = 0
      }
    } else {
      tapCount.current = 1
    }
    lastTapTime.current = now
  }, [config.enabled, sendAlert])

  /**
   * Reset state after activation
   */
  const reset = useCallback(() => {
    setState({ isActivating: false, isActivated: false, error: null })
  }, [])

  return {
    ...state,
    sendAlert,
    handlePressStart,
    handlePressEnd,
    handleTap,
    reset,
    isConfigured: config.enabled && config.contacts.length > 0,
  }
}
