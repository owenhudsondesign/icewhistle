import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { addZipPreference, updateZipPreferences } from '@/services/push/ZipRadiusService'

const prisma = new PrismaClient()

interface RegisterPushRequest {
  pushToken: string
  platform: 'ios' | 'android'
  language?: string
  alertsEnabled?: boolean
  quietHoursStart?: string | null
  quietHoursEnd?: string | null
  // Labels are stored client-side only (localStorage) for privacy
  zipCodes?: string[]
}

/**
 * POST /api/push/register
 *
 * Register or update a push notification subscription
 */
export async function POST(request: NextRequest) {
  try {
    const body: RegisterPushRequest = await request.json()

    const {
      pushToken,
      platform,
      language = 'en',
      alertsEnabled = true,
      quietHoursStart = null,
      quietHoursEnd = null,
      zipCodes = [],
    } = body

    // Validate required fields
    if (!pushToken) {
      return NextResponse.json(
        { error: 'pushToken is required' },
        { status: 400 }
      )
    }

    if (!platform || !['ios', 'android'].includes(platform)) {
      return NextResponse.json(
        { error: 'platform must be "ios" or "android"' },
        { status: 400 }
      )
    }

    // Check if subscription already exists
    const existing = await prisma.pushSubscription.findUnique({
      where: { pushToken },
      include: { zipPreferences: true },
    })

    if (existing) {
      // Update existing subscription
      const updated = await prisma.pushSubscription.update({
        where: { pushToken },
        data: {
          platform,
          language,
          alertsEnabled,
          quietHoursStart,
          quietHoursEnd,
          disabledAt: alertsEnabled ? null : new Date(),
        },
        include: { zipPreferences: true },
      })

      // Update ZIP preferences if provided
      if (zipCodes.length > 0) {
        await updateZipPreferences(updated.id, zipCodes)
      }

      // Fetch updated subscription with new preferences
      const result = await prisma.pushSubscription.findUnique({
        where: { id: updated.id },
        include: { zipPreferences: true },
      })

      return NextResponse.json({
        success: true,
        subscription: result,
        message: 'Subscription updated',
      })
    }

    // Create new subscription
    const subscription = await prisma.pushSubscription.create({
      data: {
        pushToken,
        platform,
        language,
        alertsEnabled,
        quietHoursStart,
        quietHoursEnd,
      },
    })

    // Add ZIP preferences (labels stored client-side only)
    if (zipCodes.length > 0) {
      for (const zipCode of zipCodes) {
        await addZipPreference(subscription.id, zipCode)
      }
    }

    // Fetch complete subscription with preferences
    const result = await prisma.pushSubscription.findUnique({
      where: { id: subscription.id },
      include: { zipPreferences: true },
    })

    return NextResponse.json({
      success: true,
      subscription: result,
      message: 'Subscription created',
    })
  } catch (error) {
    console.error('Push registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register push subscription' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/push/register
 *
 * Unregister a push notification subscription.
 * By default, does a soft delete (disables alerts).
 * With ?delete=true, permanently deletes the subscription and all ZIP preferences.
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pushToken = searchParams.get('pushToken')
    const hardDelete = searchParams.get('delete') === 'true'

    if (!pushToken) {
      return NextResponse.json(
        { error: 'pushToken is required' },
        { status: 400 }
      )
    }

    if (hardDelete) {
      // Permanently delete subscription and all associated data
      // First find the subscription to get its ID
      const existing = await prisma.pushSubscription.findUnique({
        where: { pushToken },
      })

      if (!existing) {
        return NextResponse.json(
          { error: 'Subscription not found' },
          { status: 404 }
        )
      }

      // Delete ZIP preferences first (due to foreign key)
      await prisma.zipPreference.deleteMany({
        where: { subscriptionId: existing.id },
      })

      // Delete the subscription
      await prisma.pushSubscription.delete({
        where: { pushToken },
      })

      return NextResponse.json({
        success: true,
        message: 'Subscription and all associated data permanently deleted',
      })
    }

    // Soft delete by setting disabledAt
    await prisma.pushSubscription.update({
      where: { pushToken },
      data: {
        alertsEnabled: false,
        disabledAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription disabled',
    })
  } catch (error) {
    console.error('Push unregister error:', error)
    return NextResponse.json(
      { error: 'Failed to unregister push subscription' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/push/register
 *
 * Update push notification preferences
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      pushToken,
      alertsEnabled,
      quietHoursStart,
      quietHoursEnd,
      language,
      zipCodes,
    } = body

    if (!pushToken) {
      return NextResponse.json(
        { error: 'pushToken is required' },
        { status: 400 }
      )
    }

    // Find existing subscription
    const existing = await prisma.pushSubscription.findUnique({
      where: { pushToken },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    // Build update data
    const updateData: Record<string, unknown> = {}
    if (alertsEnabled !== undefined) {
      updateData.alertsEnabled = alertsEnabled
      updateData.disabledAt = alertsEnabled ? null : new Date()
    }
    if (quietHoursStart !== undefined) updateData.quietHoursStart = quietHoursStart
    if (quietHoursEnd !== undefined) updateData.quietHoursEnd = quietHoursEnd
    if (language !== undefined) updateData.language = language

    // Update subscription
    const updated = await prisma.pushSubscription.update({
      where: { pushToken },
      data: updateData,
    })

    // Update ZIP preferences if provided
    if (zipCodes !== undefined) {
      await updateZipPreferences(updated.id, zipCodes)
    }

    // Fetch complete subscription
    const result = await prisma.pushSubscription.findUnique({
      where: { id: updated.id },
      include: { zipPreferences: true },
    })

    return NextResponse.json({
      success: true,
      subscription: result,
      message: 'Preferences updated',
    })
  } catch (error) {
    console.error('Push preferences update error:', error)
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    )
  }
}
