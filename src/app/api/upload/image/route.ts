import { NextRequest, NextResponse } from 'next/server'
import { createImageUploadUrl, getStorageUploadHeaders, isBunnyConfigured } from '@/lib/bunny'

// Allowed image extensions
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'heic']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

/**
 * POST /api/upload/image
 * Proxies image uploads to Bunny Storage to avoid CORS issues
 * Accepts multipart form data with image file
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

    const contentType = request.headers.get('content-type') || ''

    // Handle multipart form data (actual file upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      }

      // Validate file size
      if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
      }

      // Get extension from filename
      const parts = file.name.split('.')
      const ext = parts.length > 1 ? parts.pop()!.toLowerCase() : 'jpg'

      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return NextResponse.json(
          { error: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}` },
          { status: 400 }
        )
      }

      // Generate upload URL
      const upload = await createImageUploadUrl(ext)
      const uploadHeaders = getStorageUploadHeaders()

      // Read file data
      const fileBuffer = await file.arrayBuffer()

      // Upload to Bunny Storage (server-side, no CORS issues)
      const uploadResponse = await fetch(upload.uploadUrl, {
        method: 'PUT',
        headers: {
          ...uploadHeaders,
          'Content-Type': file.type || `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        },
        body: fileBuffer,
      })

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text().catch(() => '')
        console.error('Bunny upload failed:', uploadResponse.status, errorText)
        return NextResponse.json(
          { error: 'Failed to upload to storage' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        publicUrl: upload.publicUrl,
        filename: upload.filename,
      })
    }

    // Handle JSON request (legacy - returns signed URL for direct upload)
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
    console.error('Error in image upload:', error)
    return NextResponse.json(
      { error: 'Failed to process image upload' },
      { status: 500 }
    )
  }
}
