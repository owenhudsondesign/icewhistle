// Bunny.net API utilities for anonymous media uploads

const BUNNY_API_KEY = process.env.BUNNY_API_KEY!
const BUNNY_STREAM_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID!
const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE!
const BUNNY_STORAGE_PASSWORD = process.env.BUNNY_STORAGE_PASSWORD!
const BUNNY_STORAGE_REGION = process.env.BUNNY_STORAGE_REGION || '' // Empty for default region

// Storage hostname based on region
const STORAGE_HOSTNAME = BUNNY_STORAGE_REGION
  ? `${BUNNY_STORAGE_REGION}.storage.bunnycdn.com`
  : 'storage.bunnycdn.com'

// CDN hostname for serving files
const CDN_HOSTNAME = `${BUNNY_STORAGE_ZONE}.b-cdn.net`

export interface CreateVideoResponse {
  videoId: string
  uploadUrl: string
  thumbnailUrl: string
  hlsUrl: string
}

export interface CreateImageUploadResponse {
  uploadUrl: string
  publicUrl: string
  filename: string
}

/**
 * Create a new video in Bunny Stream and get TUS upload URL
 * Videos are anonymous - no user data attached
 */
export async function createBunnyVideo(title: string): Promise<CreateVideoResponse> {
  // Create video entry in Bunny Stream
  const response = await fetch(
    `https://video.bunnycdn.com/library/${BUNNY_STREAM_LIBRARY_ID}/videos`,
    {
      method: 'POST',
      headers: {
        'AccessKey': BUNNY_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        // Don't store any user metadata
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create Bunny video: ${error}`)
  }

  const video = await response.json()

  return {
    videoId: video.guid,
    // TUS upload endpoint for resumable uploads
    uploadUrl: `https://video.bunnycdn.com/tusupload`,
    thumbnailUrl: `https://vz-${BUNNY_STREAM_LIBRARY_ID}.b-cdn.net/${video.guid}/thumbnail.jpg`,
    hlsUrl: `https://vz-${BUNNY_STREAM_LIBRARY_ID}.b-cdn.net/${video.guid}/playlist.m3u8`,
  }
}

/**
 * Get TUS upload headers for Bunny Stream
 */
export function getTusUploadHeaders(videoId: string): Record<string, string> {
  return {
    'AuthorizationSignature': BUNNY_API_KEY,
    'AuthorizationExpire': String(Math.floor(Date.now() / 1000) + 3600), // 1 hour
    'VideoId': videoId,
    'LibraryId': BUNNY_STREAM_LIBRARY_ID,
  }
}

/**
 * Generate a signed upload URL for Bunny Storage (images)
 * Returns both upload URL and public CDN URL
 */
export async function createImageUploadUrl(
  fileExtension: string
): Promise<CreateImageUploadResponse> {
  // Generate random filename (no user info)
  const randomId = crypto.randomUUID()
  const filename = `alerts/${randomId}.${fileExtension}`

  // Direct upload URL to Bunny Storage
  const uploadUrl = `https://${STORAGE_HOSTNAME}/${BUNNY_STORAGE_ZONE}/${filename}`

  // Public CDN URL for serving
  const publicUrl = `https://${CDN_HOSTNAME}/${filename}`

  return {
    uploadUrl,
    publicUrl,
    filename,
  }
}

/**
 * Get storage upload headers
 */
export function getStorageUploadHeaders(): Record<string, string> {
  return {
    'AccessKey': BUNNY_STORAGE_PASSWORD,
  }
}

/**
 * Delete a video from Bunny Stream (for cleanup when alerts expire)
 */
export async function deleteBunnyVideo(videoId: string): Promise<void> {
  const response = await fetch(
    `https://video.bunnycdn.com/library/${BUNNY_STREAM_LIBRARY_ID}/videos/${videoId}`,
    {
      method: 'DELETE',
      headers: {
        'AccessKey': BUNNY_API_KEY,
      },
    }
  )

  if (!response.ok) {
    console.error(`Failed to delete Bunny video ${videoId}`)
  }
}

/**
 * Delete an image from Bunny Storage
 */
export async function deleteBunnyImage(filename: string): Promise<void> {
  const response = await fetch(
    `https://${STORAGE_HOSTNAME}/${BUNNY_STORAGE_ZONE}/${filename}`,
    {
      method: 'DELETE',
      headers: {
        'AccessKey': BUNNY_STORAGE_PASSWORD,
      },
    }
  )

  if (!response.ok) {
    console.error(`Failed to delete Bunny image ${filename}`)
  }
}

/**
 * Check if Bunny is configured
 */
export function isBunnyConfigured(): boolean {
  return !!(
    BUNNY_API_KEY &&
    BUNNY_STREAM_LIBRARY_ID &&
    BUNNY_STORAGE_ZONE &&
    BUNNY_STORAGE_PASSWORD
  )
}
