/**
 * PushService
 *
 * Handles sending push notifications to iOS (APNs) and Android (FCM) devices.
 * Uses Expo's push notification service as an intermediary for simplicity.
 *
 * In production, you may want to use direct APNs/FCM connections for more control.
 */

import { PushSubscription } from '@prisma/client'

// Expo Push API endpoint (works with Capacitor too)
const EXPO_PUSH_API = 'https://exp.host/--/api/v2/push/send'

// Alert type labels for notifications
const ALERT_TYPE_LABELS: Record<string, { en: string; es: string }> = {
  ice_raid: { en: 'ICE Raid', es: 'Redada de ICE' },
  ice_checkpoint: { en: 'ICE Checkpoint', es: 'Control de ICE' },
  ice_vehicle: { en: 'ICE Vehicle', es: 'Vehículo de ICE' },
  ice_transit: { en: 'ICE at Transit', es: 'ICE en Tránsito' },
  ice_workplace: { en: 'ICE at Workplace', es: 'ICE en Trabajo' },
  ice_residence: { en: 'ICE at Residence', es: 'ICE en Residencia' },
  unconfirmed: { en: 'Unconfirmed Report', es: 'Reporte no confirmado' },
}

export interface PushNotificationPayload {
  alertId: string
  alertType: string
  latitude: number
  longitude: number
  neighborhood?: string
  description?: string
}

export interface PushMessage {
  to: string
  title: string
  body: string
  data?: Record<string, unknown>
  sound?: 'default' | null
  badge?: number
  channelId?: string
  priority?: 'default' | 'normal' | 'high'
}

/**
 * Build a push notification message for an alert
 */
function buildPushMessage(
  token: string,
  payload: PushNotificationPayload,
  language: string = 'en'
): PushMessage {
  const lang = language === 'es' ? 'es' : 'en'
  const alertLabel = ALERT_TYPE_LABELS[payload.alertType]?.[lang] || payload.alertType

  const title = lang === 'es' ? 'Alerta de Comunidad' : 'Community Alert'
  const location = payload.neighborhood || 'your area'
  const body =
    lang === 'es'
      ? `${alertLabel} reportado cerca de ${location}`
      : `${alertLabel} reported near ${location}`

  return {
    to: token,
    title,
    body,
    data: {
      alertId: payload.alertId,
      alertType: payload.alertType,
      url: '/alerts',
    },
    sound: 'default',
    priority: 'high',
    channelId: 'ice-alerts', // For Android notification channels
  }
}

/**
 * Send a push notification to a single device using Expo's push service
 */
export async function sendPushNotification(
  token: string,
  payload: PushNotificationPayload,
  language: string = 'en'
): Promise<{ success: boolean; error?: string }> {
  const message = buildPushMessage(token, payload, language)

  try {
    const response = await fetch(EXPO_PUSH_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(message),
    })

    const result = await response.json()

    if (result.data?.status === 'ok') {
      return { success: true }
    }

    return {
      success: false,
      error: result.data?.message || 'Unknown error',
    }
  } catch (error) {
    console.error('Push notification error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send push notifications to multiple devices in batch
 */
export async function sendPushNotificationBatch(
  subscriptions: PushSubscription[],
  payload: PushNotificationPayload
): Promise<{ sent: number; failed: number; errors: string[] }> {
  const messages = subscriptions.map((sub) =>
    buildPushMessage(sub.pushToken, payload, sub.language)
  )

  // Expo recommends batches of up to 100
  const BATCH_SIZE = 100
  const batches: PushMessage[][] = []

  for (let i = 0; i < messages.length; i += BATCH_SIZE) {
    batches.push(messages.slice(i, i + BATCH_SIZE))
  }

  let sent = 0
  let failed = 0
  const errors: string[] = []

  for (const batch of batches) {
    try {
      const response = await fetch(EXPO_PUSH_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(batch),
      })

      const result = await response.json()

      if (result.data) {
        for (const item of result.data) {
          if (item.status === 'ok') {
            sent++
          } else {
            failed++
            if (item.message) {
              errors.push(item.message)
            }
          }
        }
      }
    } catch (error) {
      failed += batch.length
      const errorMessage = error instanceof Error ? error.message : 'Batch send failed'
      errors.push(errorMessage)
    }
  }

  return { sent, failed, errors }
}

/**
 * Alternative: Send push notification using native APNs (iOS)
 * This requires APNs credentials and is more complex but gives more control
 */
export async function sendAPNsNotification(
  deviceToken: string,
  payload: PushNotificationPayload
): Promise<{ success: boolean; error?: string }> {
  // APNs implementation would go here
  // Requires:
  // - APNs Auth Key (.p8 file)
  // - Team ID
  // - Key ID
  // - Bundle ID

  // For now, fall back to Expo push
  return sendPushNotification(deviceToken, payload)
}

/**
 * Alternative: Send push notification using FCM (Android)
 * This requires Firebase credentials
 */
export async function sendFCMNotification(
  deviceToken: string,
  payload: PushNotificationPayload
): Promise<{ success: boolean; error?: string }> {
  // FCM implementation would go here
  // Requires:
  // - Firebase service account JSON
  // - Project ID

  const fcmKey = process.env.FIREBASE_SERVER_KEY
  if (!fcmKey) {
    // Fall back to Expo push
    return sendPushNotification(deviceToken, payload)
  }

  try {
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${fcmKey}`,
      },
      body: JSON.stringify({
        to: deviceToken,
        notification: {
          title: 'Community Alert',
          body: `${ALERT_TYPE_LABELS[payload.alertType]?.en || payload.alertType} reported nearby`,
        },
        data: {
          alertId: payload.alertId,
          alertType: payload.alertType,
          url: '/alerts',
        },
        priority: 'high',
      }),
    })

    const result = await response.json()

    if (result.success === 1) {
      return { success: true }
    }

    return {
      success: false,
      error: result.results?.[0]?.error || 'FCM send failed',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'FCM error',
    }
  }
}

/**
 * Send notification using the appropriate service based on platform
 */
export async function sendNotificationByPlatform(
  subscription: PushSubscription,
  payload: PushNotificationPayload
): Promise<{ success: boolean; error?: string }> {
  // Use Expo push for simplicity (works with both iOS and Android via Capacitor)
  // In production, you might want to use native APNs/FCM for better reliability
  return sendPushNotification(subscription.pushToken, payload, subscription.language)
}
