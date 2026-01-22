import { NextRequest, NextResponse } from 'next/server'
import { alertSubmissionSchema } from '@/lib/validators'
import prisma from '@/lib/db'
import { ALERT_EXPIRY_HOURS, fuzzyLocation } from '@/types/alert'
import { getNotifiableSubscriptions } from '@/services/push/ZipRadiusService'
import { sendPushNotificationBatch, type PushNotificationPayload } from '@/services/push/PushService'

// GET /api/alerts - Fetch alerts within bounds
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const north = searchParams.get('north')
  const south = searchParams.get('south')
  const east = searchParams.get('east')
  const west = searchParams.get('west')
  const types = searchParams.get('types')?.split(',')
  const maxAgeHours = searchParams.get('maxAgeHours')

  try {
    // Build where clause
    const where: Record<string, unknown> = {
      expiresAt: { gt: new Date() },
      status: { not: 'expired' },
    }

    // Add bounds filter if provided
    if (north && south && east && west) {
      where.latitude = { gte: parseFloat(south), lte: parseFloat(north) }
      where.longitude = { gte: parseFloat(west), lte: parseFloat(east) }
    }

    // Filter by alert types
    if (types && types.length > 0) {
      where.alertType = { in: types }
    }

    // Filter by max age
    if (maxAgeHours) {
      const cutoff = new Date(Date.now() - parseInt(maxAgeHours) * 60 * 60 * 1000)
      where.reportedAt = { gte: cutoff }
    }

    const alerts = await prisma.alert.findMany({
      where,
      orderBy: { reportedAt: 'desc' },
      take: 200,
      select: {
        id: true,
        latitude: true,
        longitude: true,
        address: true,
        neighborhood: true,
        alertType: true,
        description: true,
        status: true,
        verificationCount: true,
        reportedAt: true,
        occurredAt: true,
        expiresAt: true,
        resolvedAt: true,
      },
    })

    return NextResponse.json({ alerts })
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    )
  }
}

// POST /api/alerts - Submit a new alert
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const result = alertSubmissionSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      )
    }

    const { latitude, longitude, alertType, address, description, occurredAt } = result.data

    // Apply fuzzy location for privacy (~100m precision)
    const fuzzyLat = fuzzyLocation(latitude)
    const fuzzyLng = fuzzyLocation(longitude)

    // Calculate expiration
    const expiresAt = new Date(Date.now() + ALERT_EXPIRY_HOURS * 60 * 60 * 1000)

    // Get session ID from header if available (optional, for rate limiting)
    const sessionId = request.headers.get('x-session-id')

    const alert = await prisma.alert.create({
      data: {
        latitude: fuzzyLat,
        longitude: fuzzyLng,
        address,
        alertType,
        description,
        occurredAt: occurredAt ? new Date(occurredAt) : new Date(),
        expiresAt,
        reporterSessionId: sessionId,
        status: 'unverified',
        verificationCount: 1, // Reporter counts as first verification
      },
      select: {
        id: true,
        latitude: true,
        longitude: true,
        address: true,
        neighborhood: true,
        alertType: true,
        description: true,
        status: true,
        verificationCount: true,
        reportedAt: true,
        occurredAt: true,
        expiresAt: true,
      },
    })

    // Trigger push notifications to nearby subscribers (async, don't wait)
    triggerPushNotifications(alert).catch((err) => {
      console.error('Push notification error:', err)
    })

    return NextResponse.json({ alert }, { status: 201 })
  } catch (error) {
    console.error('Error creating alert:', error)
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    )
  }
}

/**
 * Trigger push notifications to users within 5 miles of the alert
 */
async function triggerPushNotifications(alert: {
  id: string
  latitude: number
  longitude: number
  alertType: string
  neighborhood?: string | null
  description?: string | null
}) {
  try {
    // Get subscriptions within 5 miles that aren't in quiet hours
    const subscriptions = await getNotifiableSubscriptions(alert.latitude, alert.longitude)

    if (subscriptions.length === 0) {
      console.log('No subscriptions to notify for alert:', alert.id)
      return
    }

    // Build notification payload
    const payload: PushNotificationPayload = {
      alertId: alert.id,
      alertType: alert.alertType,
      latitude: alert.latitude,
      longitude: alert.longitude,
      neighborhood: alert.neighborhood || undefined,
      description: alert.description || undefined,
    }

    // Send notifications in batch
    const result = await sendPushNotificationBatch(subscriptions, payload)

    console.log(
      `Push notifications for alert ${alert.id}: sent=${result.sent}, failed=${result.failed}`
    )

    if (result.errors.length > 0) {
      console.warn('Push notification errors:', result.errors.slice(0, 5))
    }
  } catch (error) {
    console.error('Error triggering push notifications:', error)
    // Don't throw - we don't want to fail the alert creation
  }
}
