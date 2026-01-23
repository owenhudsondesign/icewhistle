'use client'

import { useState, useEffect, useCallback } from 'react'

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
      return
    }

    // Check if iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    if (isIOS) {
      // Check if already added to home screen on iOS
      if ((navigator as any).standalone) {
        setInstallState('installed')
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
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setInstallState('installed')
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
    }
  }, [])

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

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
