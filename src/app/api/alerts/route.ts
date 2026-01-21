import { NextRequest, NextResponse } from 'next/server'
import { alertSubmissionSchema } from '@/lib/validators'
import prisma from '@/lib/db'
import { ALERT_EXPIRY_HOURS, fuzzyLocation } from '@/types/alert'

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
        alertType: true,
        description: true,
        status: true,
        verificationCount: true,
        reportedAt: true,
        occurredAt: true,
        expiresAt: true,
      },
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
