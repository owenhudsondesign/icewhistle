'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  trackPwaInstallAvailable,
  trackPwaInstalled,
  trackPwaInstallPromptResponse,
  trackPwaInstallPromptShown,
  trackPwaSessionStandalone,
} from '@/lib/analytics'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type InstallState = 'idle' | 'available' | 'installed' | 'ios'

export function usePWAInstall() {
  const [installState, setInstallState] = useState<InstallState>('idle')
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstallState('installed')
      // Track that user is using the installed PWA (helps measure active installed users)
      trackPwaSessionStandalone('android_or_desktop')
      return
    }

    // Check if iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    if (isIOS) {
      // Check if already added to home screen on iOS
      if ((navigator as any).standalone) {
        setInstallState('installed')
        // Track iOS standalone usage
        trackPwaSessionStandalone('ios')
      } else {
        setInstallState('ios')
      }
      return
    }

    // Listen for beforeinstallprompt (Chrome, Edge, Samsung Internet, etc.)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setInstallState('available')
      // Track that install prompt became available (once per session)
      trackPwaInstallAvailable()
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // Listen for successful install
    const handleAppInstalled = () => {
      setInstallState('installed')
      setDeferredPrompt(null)
      // Track successful PWA installation
      trackPwaInstalled()
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false

    try {
      // Track that user was shown the install prompt
      trackPwaInstallPromptShown()

      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      // Track the user's choice
      trackPwaInstallPromptResponse(outcome)

      if (outcome === 'accepted') {
        setInstallState('installed')
      }

      setDeferredPrompt(null)
      return outcome === 'accepted'
    } catch (err) {
      console.error('Install prompt error:', err)
      return false
    }
  }, [deferredPrompt])

  return {
    installState,
    canInstall: installState === 'available',
    isIOS: installState === 'ios',
    isInstalled: installState === 'installed',
    promptInstall,
  }
}
