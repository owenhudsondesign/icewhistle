'use client'

import { useEffect, useCallback, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications'
import { useRouter } from 'next/navigation'

interface PushNotificationState {
  token: string | null
  isSupported: boolean
  isRegistered: boolean
  permissionStatus: 'prompt' | 'granted' | 'denied' | 'unknown'
  error: string | null
}

interface UsePushNotificationsReturn extends PushNotificationState {
  requestPermission: () => Promise<boolean>
  registerToken: (zipCodes?: { zipCode: string; label?: string }[]) => Promise<boolean>
  unregisterToken: () => Promise<boolean>
}

/**
 * Hook for managing Capacitor push notifications on iOS/Android
 */
export function usePushNotifications(): UsePushNotificationsReturn {
  const router = useRouter()
  const [state, setState] = useState<PushNotificationState>({
    token: null,
    isSupported: false,
    isRegistered: false,
    permissionStatus: 'unknown',
    error: null,
  })

  // Check if push notifications are supported (native mobile only)
  const isNativePlatform = Capacitor.isNativePlatform()

  useEffect(() => {
    if (!isNativePlatform) {
      setState(prev => ({ ...prev, isSupported: false }))
      return
    }

    setState(prev => ({ ...prev, isSupported: true }))

    // Check current permission status
    checkPermissions()

    // Set up notification listeners
    const registrationListener = PushNotifications.addListener(
      'registration',
      (token: Token) => {
        console.log('Push registration success:', token.value)
        setState(prev => ({
          ...prev,
          token: token.value,
          isRegistered: true,
          error: null,
        }))
      }
    )

    const errorListener = PushNotifications.addListener(
      'registrationError',
      (error) => {
        console.error('Push registration error:', error)
        setState(prev => ({
          ...prev,
          error: error.error || 'Registration failed',
          isRegistered: false,
        }))
      }
    )

    const notificationReceivedListener = PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push notification received:', notification)
        // Handle foreground notification (maybe show in-app toast)
      }
    )

    const notificationActionListener = PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (action: ActionPerformed) => {
        console.log('Push notification action:', action)
        // Navigate to alerts page when notification is tapped
        const data = action.notification.data
        if (data?.url) {
          router.push(data.url as string)
        } else {
          router.push('/alerts')
        }
      }
    )

    // Cleanup listeners on unmount
    return () => {
      registrationListener.then(l => l.remove())
      errorListener.then(l => l.remove())
      notificationReceivedListener.then(l => l.remove())
      notificationActionListener.then(l => l.remove())
    }
  }, [isNativePlatform, router])

  const checkPermissions = async () => {
    try {
      const result = await PushNotifications.checkPermissions()
      setState(prev => ({
        ...prev,
        permissionStatus: result.receive as 'prompt' | 'granted' | 'denied',
      }))
    } catch (error) {
      console.error('Error checking permissions:', error)
    }
  }

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isNativePlatform) return false

    try {
      // Request permission
      const permResult = await PushNotifications.requestPermissions()

      if (permResult.receive === 'granted') {
        // Register for push notifications
        await PushNotifications.register()
        setState(prev => ({ ...prev, permissionStatus: 'granted' }))
        return true
      }

      setState(prev => ({
        ...prev,
        permissionStatus: permResult.receive as 'denied' | 'prompt',
      }))
      return false
    } catch (error) {
      console.error('Error requesting permission:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Permission request failed',
      }))
      return false
    }
  }, [isNativePlatform])

  const registerToken = useCallback(
    async (zipCodes?: { zipCode: string; label?: string }[]): Promise<boolean> => {
      if (!state.token) {
        console.error('No push token available')
        return false
      }

      try {
        const response = await fetch('/api/push/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pushToken: state.token,
            platform: Capacitor.getPlatform() as 'ios' | 'android',
            language: navigator.language.split('-')[0] || 'en',
            alertsEnabled: true,
            zipCodes,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to register push token')
        }

        const result = await response.json()
        console.log('Push token registered:', result)
        return true
      } catch (error) {
        console.error('Error registering token:', error)
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Registration failed',
        }))
        return false
      }
    },
    [state.token]
  )

  const unregisterToken = useCallback(async (): Promise<boolean> => {
    if (!state.token) return false

    try {
      const response = await fetch(`/api/push/register?pushToken=${state.token}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to unregister push token')
      }

      setState(prev => ({
        ...prev,
        isRegistered: false,
      }))
      return true
    } catch (error) {
      console.error('Error unregistering token:', error)
      return false
    }
  }, [state.token])

  return {
    ...state,
    requestPermission,
    registerToken,
    unregisterToken,
  }
}

/**
 * Check if push notifications are available on this platform
 */
export function isPushSupported(): boolean {
  return Capacitor.isNativePlatform()
}
