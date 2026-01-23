import { NextRequest, NextResponse } from 'next/server'
import { createBunnyVideo, getTusUploadHeaders, isBunnyConfigured } from '@/lib/bunny'

/**
 * POST /api/upload/video
 * Creates a new anonymous video entry in Bunny Stream
 * Returns TUS upload URL and headers for direct client upload
 *
 * No user data is stored - videos are completely anonymous
 */
export async function POST(request: NextRequest) {
  try {
    // Check if Bunny is configured
    if (!isBunnyConfigured()) {
      return NextResponse.json(
        { error: 'Media uploads not configured' },
        { status: 503 }
      )
    }

    // Generate anonymous title (timestamp only, no user info)
    const title = `alert-${Date.now()}`

    // Create video in Bunny Stream
    const video = await createBunnyVideo(title)

    // Get TUS upload headers
    const tusHeaders = getTusUploadHeaders(video.videoId)

    return NextResponse.json({
      videoId: video.videoId,
      uploadUrl: video.uploadUrl,
      tusHeaders,
      thumbnailUrl: video.thumbnailUrl,
      hlsUrl: video.hlsUrl,
    })
  } catch (error) {
    console.error('Error creating video upload:', error)
    return NextResponse.json(
      { error: 'Failed to create video upload' },
      { status: 500 }
    )
  }
}
