import { NextRequest, NextResponse } from 'next/server'
import { createImageUploadUrl, getStorageUploadHeaders, isBunnyConfigured } from '@/lib/bunny'

// Allowed image extensions
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'heic']

/**
 * POST /api/upload/image
 * Generates a signed upload URL for Bunny Storage
 * Returns upload URL and headers for direct client upload
 *
 * No user data is stored - images are completely anonymous
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

    // Get file extension from request
    const body = await request.json()
    const { extension, mimeType } = body

    if (!extension) {
      return NextResponse.json(
        { error: 'File extension required' },
        { status: 400 }
      )
    }

    // Validate extension
    const ext = extension.toLowerCase().replace('.', '')
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}` },
        { status: 400 }
      )
    }

    // Generate upload URL
    const upload = await createImageUploadUrl(ext)

    // Get storage headers
    const uploadHeaders = getStorageUploadHeaders()

    return NextResponse.json({
      uploadUrl: upload.uploadUrl,
      publicUrl: upload.publicUrl,
      filename: upload.filename,
      uploadHeaders,
      contentType: mimeType || `image/${ext === 'jpg' ? 'jpeg' : ext}`,
    })
  } catch (error) {
    console.error('Error creating image upload:', error)
    return NextResponse.json(
      { error: 'Failed to create image upload' },
      { status: 500 }
    )
  }
}
