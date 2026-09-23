import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  generateFileHash,
  createVideoManifest,
  verifyManifest,
  createManifestBlob,
  generateFilenames,
  type VideoManifest,
} from './video-authenticity'

vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: () => false,
    getPlatform: () => 'web',
  },
}))

const videoBlob = (content = 'video-bytes', type = 'video/webm') =>
  new Blob([content], { type })

const manifestOptions = {
  cameraMode: 'rear',
  recordingType: 'video',
  durationSeconds: 12,
}

beforeEach(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('generateFileHash', () => {
  it('produces a 128 character SHA-512 hex digest', async () => {
    const hash = await generateFileHash(videoBlob())

    expect(hash).toMatch(/^[0-9a-f]{128}$/)
  })

  it('is deterministic for identical content', async () => {
    expect(await generateFileHash(videoBlob('same'))).toBe(
      await generateFileHash(videoBlob('same'))
    )
  })

  it('changes when a single byte changes, which is what detects tampering', async () => {
    expect(await generateFileHash(videoBlob('recording-a'))).not.toBe(
      await generateFileHash(videoBlob('recording-b'))
    )
  })

  it('hashes an empty blob without throwing', async () => {
    await expect(generateFileHash(videoBlob(''))).resolves.toMatch(/^[0-9a-f]{128}$/)
  })
})

describe('createVideoManifest', () => {
  it('records the hash of the file it describes', async () => {
    const blob = videoBlob()

    const manifest = await createVideoManifest(blob, manifestOptions)

    expect(manifest.fileHash).toBe(await generateFileHash(blob))
  })

  it('records the file size and type', async () => {
    const blob = videoBlob('twelve-bytes')

    const manifest = await createVideoManifest(blob, manifestOptions)

    expect(manifest.fileSize).toBe(blob.size)
    expect(manifest.mimeType).toBe('video/webm')
  })

  it('records the recording parameters', async () => {
    const manifest = await createVideoManifest(videoBlob(), manifestOptions)

    expect(manifest.recording).toEqual({
      cameraMode: 'rear',
      recordingType: 'video',
      durationSeconds: 12,
    })
  })

  it('stamps an ISO capture time and a matching unix time', async () => {
    const manifest = await createVideoManifest(videoBlob(), manifestOptions)

    expect(new Date(manifest.captureTimestamp).getTime()).toBe(
      manifest.captureTimestampUnix
    )
  })

  it('records the timezone offset, so local time can be reconstructed', async () => {
    const manifest = await createVideoManifest(videoBlob(), manifestOptions)

    expect(typeof manifest.timezoneOffset).toBe('number')
  })

  it('identifies the app that produced it', async () => {
    const manifest = await createVideoManifest(videoBlob(), manifestOptions)

    expect(manifest.app.name).toBe('ICEwhistle')
  })

  it('records only the platform, never a device fingerprint', async () => {
    const manifest = await createVideoManifest(videoBlob(), manifestOptions)

    expect(Object.keys(manifest.deviceInfo)).toEqual(['platform'])
  })

  it('still returns a usable manifest when signing is unsupported', async () => {
    vi.spyOn(crypto.subtle, 'generateKey').mockRejectedValue(
      new Error('Ed25519 unsupported')
    )
    localStorage.clear()

    const manifest = await createVideoManifest(videoBlob(), manifestOptions)

    expect(manifest.fileHash).toBeTruthy()
    expect(manifest.signature).toBeUndefined()
  })
})

describe('verifyManifest', () => {
  const unsignedManifest = (): VideoManifest => ({
    fileHash: 'a'.repeat(128),
    fileSize: 10,
    mimeType: 'video/webm',
    captureTimestamp: new Date().toISOString(),
    captureTimestampUnix: Date.now(),
    timezoneOffset: 0,
    deviceInfo: { platform: 'web' },
    recording: manifestOptions,
    app: { name: 'ICEwhistle', version: '1.0.0' },
  })

  it('rejects a manifest with no signature', async () => {
    await expect(verifyManifest(unsignedManifest())).resolves.toBe(false)
  })

  it('rejects a manifest with a signature but no public key', async () => {
    const manifest = { ...unsignedManifest(), signature: 'abc' }

    await expect(verifyManifest(manifest)).resolves.toBe(false)
  })

  it('rejects a malformed signature rather than throwing', async () => {
    const manifest = {
      ...unsignedManifest(),
      signature: 'not-base64!!',
      publicKey: 'also-not-base64!!',
    }

    await expect(verifyManifest(manifest)).resolves.toBe(false)
  })
})

describe('createManifestBlob', () => {
  const manifest = {
    fileHash: 'abc',
    fileSize: 1,
    mimeType: 'video/webm',
    captureTimestamp: '2026-03-05T12:00:00.000Z',
    captureTimestampUnix: 1772798400000,
    timezoneOffset: 0,
    deviceInfo: { platform: 'web' },
    recording: manifestOptions,
    app: { name: 'ICEwhistle', version: '1.0.0' },
  } as VideoManifest

  it('produces a JSON blob', () => {
    expect(createManifestBlob(manifest).type).toBe('application/json')
  })

  it('round trips through JSON unchanged', async () => {
    const text = await createManifestBlob(manifest).text()

    expect(JSON.parse(text)).toEqual(manifest)
  })

  it('pretty prints, so a human can read the evidence record', async () => {
    const text = await createManifestBlob(manifest).text()

    expect(text).toContain('\n  ')
  })
})

describe('generateFilenames', () => {
  const timestamp = new Date('2026-03-05T14:30:45.123Z')

  it('uses a webm extension for a webm recording', () => {
    const { videoFilename } = generateFilenames(timestamp, 'rear', 'video/webm')

    expect(videoFilename).toMatch(/\.webm$/)
  })

  it('uses an mp4 extension for an mp4 recording', () => {
    const { videoFilename } = generateFilenames(timestamp, 'rear', 'video/mp4')

    expect(videoFilename).toMatch(/\.mp4$/)
  })

  it('falls back to webm for an unrecognised type', () => {
    const { videoFilename } = generateFilenames(timestamp, 'rear', 'application/octet')

    expect(videoFilename).toMatch(/\.webm$/)
  })

  it('names the manifest after the video', () => {
    const { videoFilename, manifestFilename } = generateFilenames(
      timestamp,
      'rear',
      'video/webm'
    )

    expect(manifestFilename).toBe(videoFilename.replace('.webm', '-manifest.json'))
  })

  it('includes the camera mode', () => {
    const { videoFilename } = generateFilenames(timestamp, 'front', 'video/webm')

    expect(videoFilename).toContain('front')
  })

  it('produces a filename with no characters illegal on common filesystems', () => {
    const { videoFilename } = generateFilenames(timestamp, 'rear', 'video/webm')

    expect(videoFilename).not.toMatch(/[:*?"<>|]/)
  })

  it('sorts chronologically when listed alphabetically', () => {
    const earlier = generateFilenames(
      new Date('2026-03-05T10:00:00Z'),
      'rear',
      'video/webm'
    ).videoFilename
    const later = generateFilenames(
      new Date('2026-03-05T11:00:00Z'),
      'rear',
      'video/webm'
    ).videoFilename

    expect([later, earlier].sort()).toEqual([earlier, later])
  })
})
