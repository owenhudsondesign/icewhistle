import { NextRequest, NextResponse } from 'next/server'
import { createBunnyVideo, isBunnyConfigured } from '@/lib/bunny'

const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100MB
const BUNNY_API_KEY = process.env.BUNNY_API_KEY!
const BUNNY_STREAM_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID!

/**
 * POST /api/upload/video
 * Proxies video uploads to Bunny Stream to avoid CORS issues
 * Accepts multipart form data with video file
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

    const contentType = request.headers.get('content-type') || ''

    // Handle multipart form data (actual file upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      }

      // Validate file size
      if (file.size > MAX_VIDEO_SIZE) {
        return NextResponse.json({ error: 'File too large (max 100MB)' }, { status: 400 })
      }

      // Generate anonymous title (timestamp only, no user info)
      const title = `alert-${Date.now()}`

      // Create video in Bunny Stream
      const video = await createBunnyVideo(title)

      // Read file data
      const fileBuffer = await file.arrayBuffer()

      // Upload video to Bunny Stream (server-side, no CORS issues)
      const uploadResponse = await fetch(
        `https://video.bunnycdn.com/library/${BUNNY_STREAM_LIBRARY_ID}/videos/${video.videoId}`,
        {
          method: 'PUT',
          headers: {
            'AccessKey': BUNNY_API_KEY,
            'Content-Type': 'application/octet-stream',
          },
          body: fileBuffer,
        }
      )

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text().catch(() => '')
        console.error('Bunny video upload failed:', uploadResponse.status, errorText)
        return NextResponse.json(
          { error: 'Failed to upload video to storage' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        videoId: video.videoId,
        thumbnailUrl: video.thumbnailUrl,
        hlsUrl: video.hlsUrl,
        publicUrl: video.hlsUrl,
      })
    }

    // Legacy: JSON request just creates video entry (for TUS uploads)
    const title = `alert-${Date.now()}`
    const video = await createBunnyVideo(title)

    return NextResponse.json({
      videoId: video.videoId,
      uploadUrl: video.uploadUrl,
      tusHeaders: {
        AuthorizationSignature: BUNNY_API_KEY,
        AuthorizationExpire: String(Math.floor(Date.now() / 1000) + 3600),
        VideoId: video.videoId,
        LibraryId: BUNNY_STREAM_LIBRARY_ID,
      },
      thumbnailUrl: video.thumbnailUrl,
      hlsUrl: video.hlsUrl,
    })
  } catch (error) {
    console.error('Error in video upload:', error)
    return NextResponse.json(
      { error: 'Failed to process video upload' },
      { status: 500 }
    )
  }
}
