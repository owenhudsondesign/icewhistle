import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import crypto from 'crypto'

const CLEAR_VOTES_REQUIRED = 5

// Generate anonymous voter hash from IP and user agent
function generateVoterHash(request: NextRequest): string {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
             request.headers.get('x-real-ip') ||
             'unknown'
  const userAgent = request.headers.get('user-agent') || ''
  const data = `clear-vote:${ip}:${userAgent}`
  return crypto.createHash('sha256').update(data).digest('hex').slice(0, 16)
}

// POST /api/alerts/[id]/clear - Vote that the presence has left (requires 5 votes to resolve)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const voterHash = generateVoterHash(request)

    // Find the alert with current clear vote info
    const alert = await prisma.alert.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        clearVoteCount: true,
        clearVoterHashes: true,
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

    // Check if this voter has already voted
    if (alert.clearVoterHashes.includes(voterHash)) {
      return NextResponse.json({
        alert: {
          id: alert.id,
          clearVoteCount: alert.clearVoteCount,
          status: alert.status,
        },
        alreadyVoted: true,
        votesNeeded: CLEAR_VOTES_REQUIRED - alert.clearVoteCount,
      })
    }

    // Calculate new vote count
    const newVoteCount = alert.clearVoteCount + 1
    const shouldResolve = newVoteCount >= CLEAR_VOTES_REQUIRED

    // Update the alert with the new vote
    const updatedAlert = await prisma.alert.update({
      where: { id },
      data: {
        clearVoteCount: newVoteCount,
        clearVoterHashes: {
          push: voterHash,
        },
        // Only resolve if we have enough votes
        ...(shouldResolve && {
          status: 'resolved',
          resolvedAt: new Date(),
        }),
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
        clearVoteCount: true,
        reportedAt: true,
        occurredAt: true,
        expiresAt: true,
        resolvedAt: true,
      },
    })

    return NextResponse.json({
      alert: updatedAlert,
      cleared: shouldResolve,
      voteRecorded: true,
      votesNeeded: shouldResolve ? 0 : CLEAR_VOTES_REQUIRED - newVoteCount,
    })
  } catch (error) {
    console.error('Error voting to clear alert:', error)
    return NextResponse.json(
      { error: 'Failed to record vote' },
      { status: 500 }
    )
  }
}
