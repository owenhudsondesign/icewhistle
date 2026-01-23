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

  // Minimal device info (privacy-preserving - no fingerprinting)
  deviceInfo: {
    platform: string // 'ios' | 'android' | 'web' - broad category only
  }

  // Recording details
  recording: {
    cameraMode: string // 'front' | 'back'
    recordingType: string // 'video' | 'audio'
    durationSeconds: number
  }

  // App info
  app: {
    name: string
    version: string
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
  // Privacy-preserving: only store minimal info needed for authenticity verification
  const manifest: VideoManifest = {
    fileHash,
    fileSize: blob.size,
    mimeType: blob.type,

    captureTimestamp: now.toISOString(),
    captureTimestampUnix: now.getTime(),
    timezoneOffset: now.getTimezoneOffset(),

    // Minimal device info - no fingerprinting data
    deviceInfo: {
      platform: Capacitor.isNativePlatform() ? Capacitor.getPlatform() : 'web',
    },

    recording: {
      cameraMode: options.cameraMode,
      recordingType: options.recordingType,
      durationSeconds: options.durationSeconds,
    },

    app: {
      name: 'ICEwhistle',
      version: '1.0.0',
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
 * Detect mobile browser (not in native app)
 */
function isMobileBrowser(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  return isMobile && !Capacitor.isNativePlatform()
}

/**
 * Helper to save file - uses Share API on mobile for better UX, download on desktop
 */
async function triggerDownload(blob: Blob, filename: string): Promise<void> {
  // Mobile browsers: Use Web Share API for native share sheet experience
  if (isMobileBrowser() && navigator.share && navigator.canShare) {
    try {
      const file = new File([blob], filename, { type: blob.type })
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'ICEwhistle Recording',
          text: 'Save this recording to your device',
        })
        console.log('Shared via Web Share API')
        return
      }
    } catch (err) {
      // User cancelled share - that's OK
      if ((err as Error).name === 'AbortError') {
        console.log('User cancelled share')
        return
      }
      console.warn('Web Share failed, trying download:', err)
    }
  }

  // Desktop or fallback: Standard download
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()

  await new Promise(resolve => setTimeout(resolve, 100))
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Convert blob to base64 data URL
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * Save video to device photo library (native) or download (web)
 */
async function saveVideoToDevice(blob: Blob, filename: string): Promise<void> {
  // Check if running on native platform
  if (Capacitor.isNativePlatform()) {
    try {
      // Dynamic import to avoid issues on web
      const { Media } = await import('@capacitor-community/media')

      // Convert blob to base64
      const base64Data = await blobToBase64(blob)

      // Save to photo library
      await Media.saveVideo({
        path: base64Data,
        albumIdentifier: undefined, // Save to default album
      })

      console.log('Video saved to photo library:', filename)
      return
    } catch (err) {
      console.warn('Failed to save to photo library, falling back to download:', err)
    }
  }

  // Web fallback: trigger download
  await triggerDownload(blob, filename)
}

/**
 * Store manifest in localStorage for later retrieval
 */
function storeManifestLocally(manifest: VideoManifest, filename: string): void {
  try {
    const stored = localStorage.getItem('icewhistle_manifests') || '[]'
    const manifests = JSON.parse(stored)
    manifests.push({ filename, manifest, savedAt: Date.now() })
    // Keep only last 50 manifests
    while (manifests.length > 50) manifests.shift()
    localStorage.setItem('icewhistle_manifests', JSON.stringify(manifests))
  } catch (e) {
    console.warn('Could not store manifest:', e)
  }
}

/**
 * Save video with manifest (saves to photo library on native, share/download on web)
 * Simplified: Only saves the video file, stores manifest locally
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

  // Store manifest locally (don't download it - too confusing for users)
  storeManifestLocally(manifest, videoFilename)

  // Save video to device
  await saveVideoToDevice(blob, videoFilename)

  return { manifest, videoFilename, manifestFilename }
}
