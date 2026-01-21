import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { VERIFICATION_THRESHOLD } from '@/types/alert'
import crypto from 'crypto'

// POST /api/alerts/[id]/verify - Verify/confirm an alert
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get a fingerprint for rate limiting (hash of IP + user agent)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const fingerprint = crypto
      .createHash('sha256')
      .update(`${ip}:${userAgent}`)
      .digest('hex')
      .substring(0, 16)

    // Find the alert
    const alert = await prisma.alert.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        verificationCount: true,
        verifierHashes: true,
        expiresAt: true,
      },
    })

    if (!alert) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      )
    }

    // Check if alert has expired
    if (new Date() > alert.expiresAt) {
      return NextResponse.json(
        { error: 'Alert has expired' },
        { status: 400 }
      )
    }

    // Check if this fingerprint has already verified
    if (alert.verifierHashes.includes(fingerprint)) {
      return NextResponse.json(
        { error: 'You have already verified this alert' },
        { status: 400 }
      )
    }

    // Update the alert
    const newCount = alert.verificationCount + 1
    const newStatus = newCount >= VERIFICATION_THRESHOLD ? 'verified' : alert.status

    const updatedAlert = await prisma.alert.update({
      where: { id },
      data: {
        verificationCount: newCount,
        verifierHashes: [...alert.verifierHashes, fingerprint],
        status: newStatus,
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

    return NextResponse.json({
      alert: updatedAlert,
      verified: newStatus === 'verified',
    })
  } catch (error) {
    console.error('Error verifying alert:', error)
    return NextResponse.json(
      { error: 'Failed to verify alert' },
      { status: 500 }
    )
  }
}
