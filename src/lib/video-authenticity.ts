/**
 * Video Authenticity Service
 *
 * Provides cryptographic signing and metadata embedding for video recordings
 * to prove authenticity in legal proceedings (not AI-generated).
 *
 * Uses:
 * - SHA-512 hash for unique fingerprint
 * - Ed25519 signature for cryptographic verification
 * - Comprehensive metadata manifest
 */

import { Capacitor } from '@capacitor/core'

export interface VideoManifest {
  // File info
  fileHash: string // SHA-512 hash
  fileSize: number
  mimeType: string
  duration?: number

  // Timestamp (multiple sources for verification)
  captureTimestamp: string // ISO 8601
  captureTimestampUnix: number
  timezoneOffset: number

  // Device info
  deviceInfo: {
    platform: string // 'ios' | 'android' | 'web'
    userAgent: string
    screenWidth: number
    screenHeight: number
    devicePixelRatio: number
    language: string
  }

  // Recording details
  recording: {
    cameraMode: string // 'front' | 'back' | 'both'
    recordingType: string // 'video' | 'audio'
    durationSeconds: number
  }

  // App info
  app: {
    name: string
    version: string
    buildId: string
  }

  // Signature
  signature?: string // Ed25519 signature of the manifest (excluding signature field)
  publicKey?: string // For verification
}

/**
 * Generate SHA-512 hash of a file
 */
export async function generateFileHash(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-512', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Generate a key pair for signing (stored in localStorage)
 * In production, this would use secure enclave on iOS/Android
 */
async function getOrCreateKeyPair(): Promise<CryptoKeyPair> {
  const storedKeyPair = localStorage.getItem('icewhistle_signing_keypair')

  if (storedKeyPair) {
    const { publicKey, privateKey } = JSON.parse(storedKeyPair)
    return {
      publicKey: await crypto.subtle.importKey(
        'jwk',
        publicKey,
        { name: 'Ed25519' },
        true,
        ['verify']
      ),
      privateKey: await crypto.subtle.importKey(
        'jwk',
        privateKey,
        { name: 'Ed25519' },
        true,
        ['sign']
      ),
    }
  }

  // Generate new key pair
  const keyPair = await crypto.subtle.generateKey(
    { name: 'Ed25519' },
    true,
    ['sign', 'verify']
  )

  // Export and store
  const publicKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey)
  const privateKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey)

  localStorage.setItem('icewhistle_signing_keypair', JSON.stringify({
    publicKey: publicKeyJwk,
    privateKey: privateKeyJwk,
  }))

  return keyPair
}

/**
 * Convert ArrayBuffer to base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

/**
 * Export public key as base64 for sharing/verification
 */
async function exportPublicKey(publicKey: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('raw', publicKey)
  return arrayBufferToBase64(exported)
}

/**
 * Sign data with Ed25519 private key
 */
async function signData(data: string, privateKey: CryptoKey): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const signature = await crypto.subtle.sign('Ed25519', privateKey, dataBuffer)
  return arrayBufferToBase64(signature)
}

/**
 * Create a complete video manifest with all metadata
 */
export async function createVideoManifest(
  blob: Blob,
  options: {
    cameraMode: string
    recordingType: string
    durationSeconds: number
  }
): Promise<VideoManifest> {
  const now = new Date()

  // Generate file hash
  const fileHash = await generateFileHash(blob)

  // Build manifest (without signature)
  const manifest: VideoManifest = {
    fileHash,
    fileSize: blob.size,
    mimeType: blob.type,

    captureTimestamp: now.toISOString(),
    captureTimestampUnix: now.getTime(),
    timezoneOffset: now.getTimezoneOffset(),

    deviceInfo: {
      platform: Capacitor.isNativePlatform() ? Capacitor.getPlatform() : 'web',
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      devicePixelRatio: window.devicePixelRatio,
      language: navigator.language,
    },

    recording: {
      cameraMode: options.cameraMode,
      recordingType: options.recordingType,
      durationSeconds: options.durationSeconds,
    },

    app: {
      name: 'ICEwhistle',
      version: '1.0.0',
      buildId: process.env.NEXT_PUBLIC_BUILD_ID || 'dev',
    },
  }

  // Sign the manifest
  try {
    const keyPair = await getOrCreateKeyPair()
    const manifestString = JSON.stringify(manifest)
    manifest.signature = await signData(manifestString, keyPair.privateKey)
    manifest.publicKey = await exportPublicKey(keyPair.publicKey)
  } catch (error) {
    // Ed25519 may not be supported in all browsers
    console.warn('Could not sign manifest:', error)
  }

  return manifest
}

/**
 * Verify a video manifest signature
 */
export async function verifyManifest(manifest: VideoManifest): Promise<boolean> {
  if (!manifest.signature || !manifest.publicKey) {
    return false
  }

  try {
    // Reconstruct manifest without signature for verification
    const { signature, publicKey, ...manifestData } = manifest
    const manifestString = JSON.stringify(manifestData)

    // Import public key
    const publicKeyBytes = Uint8Array.from(atob(publicKey), c => c.charCodeAt(0))
    const cryptoPublicKey = await crypto.subtle.importKey(
      'raw',
      publicKeyBytes,
      { name: 'Ed25519' },
      true,
      ['verify']
    )

    // Verify signature
    const signatureBytes = Uint8Array.from(atob(signature), c => c.charCodeAt(0))
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(manifestString)

    return await crypto.subtle.verify(
      'Ed25519',
      cryptoPublicKey,
      signatureBytes,
      dataBuffer
    )
  } catch (error) {
    console.error('Manifest verification failed:', error)
    return false
  }
}

/**
 * Create a downloadable manifest JSON file
 */
export function createManifestBlob(manifest: VideoManifest): Blob {
  const json = JSON.stringify(manifest, null, 2)
  return new Blob([json], { type: 'application/json' })
}

/**
 * Generate filenames for video and manifest
 */
export function generateFilenames(timestamp: Date, cameraMode: string, mimeType: string): {
  videoFilename: string
  manifestFilename: string
} {
  const dateStr = timestamp.toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const base = `icewhistle-${dateStr}-${cameraMode}`

  // Determine extension from mime type
  let extension = 'webm'
  if (mimeType.includes('mp4')) {
    extension = 'mp4'
  } else if (mimeType.includes('webm')) {
    extension = 'webm'
  }

  return {
    videoFilename: `${base}.${extension}`,
    manifestFilename: `${base}-manifest.json`,
  }
}

/**
 * Helper to trigger a download
 */
function triggerDownload(url: string, filename: string): Promise<void> {
  return new Promise((resolve) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    // Small delay before cleanup to ensure download starts
    setTimeout(() => {
      document.body.removeChild(link)
      resolve()
    }, 100)
  })
}

/**
 * Save video with manifest (downloads both files)
 */
export async function saveVideoWithManifest(
  blob: Blob,
  options: {
    cameraMode: string
    recordingType: string
    durationSeconds: number
  }
): Promise<{ manifest: VideoManifest; videoFilename: string; manifestFilename: string }> {
  // Create manifest
  const manifest = await createVideoManifest(blob, options)

  // Generate filenames
  const timestamp = new Date(manifest.captureTimestamp)
  const { videoFilename, manifestFilename } = generateFilenames(timestamp, options.cameraMode, blob.type)

  // Create URLs
  const videoUrl = URL.createObjectURL(blob)
  const manifestBlob = createManifestBlob(manifest)
  const manifestUrl = URL.createObjectURL(manifestBlob)

  // Download video first (most important)
  await triggerDownload(videoUrl, videoFilename)

  // Wait before triggering second download (mobile browsers block rapid downloads)
  await new Promise(resolve => setTimeout(resolve, 500))

  // Download manifest
  await triggerDownload(manifestUrl, manifestFilename)

  // Cleanup URLs after downloads complete
  setTimeout(() => {
    URL.revokeObjectURL(videoUrl)
    URL.revokeObjectURL(manifestUrl)
  }, 2000)

  return { manifest, videoFilename, manifestFilename }
}
