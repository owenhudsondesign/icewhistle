import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// POST /api/alerts/[id]/clear - Mark an alert as resolved/all-clear
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Find the alert
    const alert = await prisma.alert.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        expiresAt: true,
      },
    })

    if (!alert) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      )
    }

    // Check if alert is already resolved
    if (alert.status === 'resolved') {
      return NextResponse.json(
        { error: 'Alert is already marked as resolved' },
        { status: 400 }
      )
    }

    // Update the alert to resolved status
    const updatedAlert = await prisma.alert.update({
      where: { id },
      data: {
        status: 'resolved',
        resolvedAt: new Date(),
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
        resolvedAt: true,
      },
    })

    return NextResponse.json({
      alert: updatedAlert,
      cleared: true,
    })
  } catch (error) {
    console.error('Error clearing alert:', error)
    return NextResponse.json(
      { error: 'Failed to clear alert' },
      { status: 500 }
    )
  }
}
