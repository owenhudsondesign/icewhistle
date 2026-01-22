/**
 * Recording Manager - Singleton that persists across component lifecycles
 *
 * This manages the actual MediaRecorder, streams, and timer outside of React
 * so recording continues even when navigating between pages.
 */

import { useRecordingStore, type CameraMode, type RecordingType } from '@/stores/recordingStore'

// Module-level state (persists across component lifecycles)
let primaryRecorder: MediaRecorder | null = null
let secondaryRecorder: MediaRecorder | null = null
let primaryStream: MediaStream | null = null
let secondaryStream: MediaStream | null = null
let primaryChunks: Blob[] = []
let secondaryChunks: Blob[] = []
let timerInterval: NodeJS.Timeout | null = null
let detectedMimeType: string = ''

// Detect if running on iOS Safari
function isIOSSafari(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua)
  return isIOS || isSafari
}

function getMimeType(type: RecordingType): string {
  // iOS Safari only supports mp4
  if (isIOSSafari()) {
    if (type === 'video') {
      // Try various mp4 formats for iOS
      const mp4Types = [
        'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
        'video/mp4;codecs=avc1',
        'video/mp4',
      ]
      for (const mimeType of mp4Types) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          return mimeType
        }
      }
      // Let browser choose on iOS
      return ''
    }
    // Audio for iOS
    if (MediaRecorder.isTypeSupported('audio/mp4')) {
      return 'audio/mp4'
    }
    return ''
  }

  // Non-iOS: prefer webm
  if (type === 'video') {
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
      return 'video/webm;codecs=vp9'
    }
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
      return 'video/webm;codecs=vp8'
    }
    if (MediaRecorder.isTypeSupported('video/webm')) {
      return 'video/webm'
    }
    if (MediaRecorder.isTypeSupported('video/mp4')) {
      return 'video/mp4'
    }
    return ''
  }
  if (MediaRecorder.isTypeSupported('audio/webm')) {
    return 'audio/webm'
  }
  if (MediaRecorder.isTypeSupported('audio/mp4')) {
    return 'audio/mp4'
  }
  return ''
}

function createRecorder(stream: MediaStream, chunks: Blob[], mimeType: string, isVideo: boolean): MediaRecorder {
  // High quality recording options for court evidence
  const recorderOptions: MediaRecorderOptions = {
    // High bitrates for quality evidence
    videoBitsPerSecond: isVideo ? 8000000 : undefined, // 8 Mbps for video
    audioBitsPerSecond: 256000, // 256 kbps for audio
  }

  if (mimeType) {
    recorderOptions.mimeType = mimeType
  }

  let recorder: MediaRecorder

  try {
    recorder = new MediaRecorder(stream, recorderOptions)
  } catch (e) {
    // If high quality fails, try without bitrate settings
    console.warn('Failed to create high-quality MediaRecorder, trying defaults:', e)
    try {
      recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
    } catch (e2) {
      console.warn('Failed with mimeType, using browser defaults:', e2)
      recorder = new MediaRecorder(stream)
    }
  }

  // Store the actual mimeType being used
  detectedMimeType = recorder.mimeType || mimeType || 'video/mp4'
  console.log('MediaRecorder using mimeType:', detectedMimeType, 'videoBps:', recorder.videoBitsPerSecond, 'audioBps:', recorder.audioBitsPerSecond)

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data)
    }
  }
  recorder.onerror = (e) => {
    console.error('MediaRecorder error:', e)
  }
  return recorder
}

// High quality audio constraints - no processing to preserve authenticity
const HD_AUDIO_CONSTRAINTS: MediaTrackConstraints = {
  sampleRate: { ideal: 48000 },
  sampleSize: { ideal: 16 },
  channelCount: { ideal: 2 },
  echoCancellation: false, // Preserve original audio for evidence
  noiseSuppression: false, // Don't alter audio
  autoGainControl: false, // Keep original levels
}

function stopAllStreams() {
  primaryStream?.getTracks().forEach(track => track.stop())
  secondaryStream?.getTracks().forEach(track => track.stop())
  primaryStream = null
  secondaryStream = null
  primaryRecorder = null
  secondaryRecorder = null
}

/**
 * Find the widest angle camera for a given facing mode
 * Prefers ultra-wide > wide > standard lens
 */
async function findWidestCamera(facingMode: 'user' | 'environment'): Promise<string | null> {
  try {
    // First request temporary permission to get labeled device list
    const tempStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } })
    tempStream.getTracks().forEach(track => track.stop())

    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoDevices = devices.filter(d => d.kind === 'videoinput')

    console.log('Available video devices:', videoDevices.map(d => ({ label: d.label, id: d.deviceId })))

    // Keywords that indicate wide-angle cameras (prioritized)
    const wideKeywords = ['ultra wide', 'ultrawide', 'ultra-wide', 'wide angle', 'wide-angle', '0.5x']
    const standardWideKeywords = ['wide', 'back camera 0', 'rear camera 0'] // Often the first back camera is widest

    // Filter cameras by facing mode based on label
    const facingKeywords = facingMode === 'user'
      ? ['front', 'facetime', 'selfie', 'user']
      : ['back', 'rear', 'environment', 'main']

    const matchingCameras = videoDevices.filter(device => {
      const label = device.label.toLowerCase()
      return facingKeywords.some(keyword => label.includes(keyword))
    })

    // If we couldn't filter by facing mode, try all cameras
    const camerasToSearch = matchingCameras.length > 0 ? matchingCameras : videoDevices

    // First pass: look for ultra-wide cameras
    for (const device of camerasToSearch) {
      const label = device.label.toLowerCase()
      if (wideKeywords.some(keyword => label.includes(keyword))) {
        console.log('Found ultra-wide camera:', device.label)
        return device.deviceId
      }
    }

    // Second pass: look for wide cameras
    for (const device of camerasToSearch) {
      const label = device.label.toLowerCase()
      if (standardWideKeywords.some(keyword => label.includes(keyword))) {
        console.log('Found wide camera:', device.label)
        return device.deviceId
      }
    }

    // For back camera, if multiple cameras exist, the first one is often the widest
    if (facingMode === 'environment' && camerasToSearch.length > 1) {
      console.log('Using first back camera (likely widest):', camerasToSearch[0].label)
      return camerasToSearch[0].deviceId
    }

    console.log('No wide-angle camera found, will use facingMode constraint')
    return null
  } catch (err) {
    console.warn('Could not enumerate cameras:', err)
    return null
  }
}

function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
  timerInterval = setInterval(() => {
    useRecordingStore.getState().incrementTime()
  }, 1000)
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

export const recordingManager = {
  async startRecording(type: RecordingType, cameraMode: CameraMode): Promise<boolean> {
    try {
      primaryChunks = []
      secondaryChunks = []

      const mimeType = getMimeType(type)

      if (type === 'video') {
        const facingMode = cameraMode === 'front' ? 'user' : 'environment'

        // Try to find the widest angle camera for this facing mode
        const wideDeviceId = await findWidestCamera(facingMode)

        // High quality video constraints - max out device capabilities
        // Use specific deviceId if we found a wide-angle camera, otherwise use facingMode
        const videoConstraints: MediaTrackConstraints = wideDeviceId
          ? {
              deviceId: { exact: wideDeviceId },
              width: { ideal: 4096, min: 1280 }, // Request up to 4K
              height: { ideal: 2160, min: 720 }, // Request up to 4K
              frameRate: { ideal: 60, min: 24 }, // Up to 60fps if supported
              aspectRatio: { ideal: 16/9 },
            }
          : {
              facingMode,
              width: { ideal: 4096, min: 1280 }, // Request up to 4K
              height: { ideal: 2160, min: 720 }, // Request up to 4K
              frameRate: { ideal: 60, min: 24 }, // Up to 60fps if supported
              aspectRatio: { ideal: 16/9 },
            }

        // Primary camera stream with high quality
        const pStream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: HD_AUDIO_CONSTRAINTS,
        })

        // Log actual resolution obtained
        const videoTrack = pStream.getVideoTracks()[0]
        const settings = videoTrack?.getSettings()
        console.log('Video recording quality:', settings?.width, 'x', settings?.height, '@', settings?.frameRate, 'fps')

        primaryStream = pStream
        primaryRecorder = createRecorder(pStream, primaryChunks, mimeType, true)

        // Secondary camera for dual mode (native app only)
        if (cameraMode === 'both') {
          try {
            await new Promise(resolve => setTimeout(resolve, 500))

            // Try to find widest front camera for secondary stream
            const wideFrontDeviceId = await findWidestCamera('user')
            const secondaryVideoConstraints: MediaTrackConstraints = wideFrontDeviceId
              ? {
                  deviceId: { exact: wideFrontDeviceId },
                  width: { ideal: 4096, min: 1280 },
                  height: { ideal: 2160, min: 720 },
                  frameRate: { ideal: 60, min: 24 },
                  aspectRatio: { ideal: 16/9 },
                }
              : {
                  facingMode: 'user',
                  width: { ideal: 4096, min: 1280 },
                  height: { ideal: 2160, min: 720 },
                  frameRate: { ideal: 60, min: 24 },
                  aspectRatio: { ideal: 16/9 },
                }

            const sStream = await navigator.mediaDevices.getUserMedia({
              video: secondaryVideoConstraints,
              audio: false,
            })

            if (!primaryStream?.active) {
              console.warn('Primary stream was stopped when requesting secondary camera')
              sStream.getTracks().forEach(track => track.stop())
              // Re-find widest back camera for primary
              const wideBackDeviceId = await findWidestCamera('environment')
              const recoveryConstraints: MediaTrackConstraints = wideBackDeviceId
                ? {
                    deviceId: { exact: wideBackDeviceId },
                    width: { ideal: 4096, min: 1280 },
                    height: { ideal: 2160, min: 720 },
                    frameRate: { ideal: 60, min: 24 },
                    aspectRatio: { ideal: 16/9 },
                  }
                : {
                    facingMode: 'environment',
                    width: { ideal: 4096, min: 1280 },
                    height: { ideal: 2160, min: 720 },
                    frameRate: { ideal: 60, min: 24 },
                    aspectRatio: { ideal: 16/9 },
                  }
              const newPrimary = await navigator.mediaDevices.getUserMedia({
                video: recoveryConstraints,
                audio: HD_AUDIO_CONSTRAINTS,
              })
              primaryStream = newPrimary
              primaryRecorder = createRecorder(newPrimary, primaryChunks, mimeType, true)
            } else {
              secondaryStream = sStream
              secondaryRecorder = createRecorder(sStream, secondaryChunks, mimeType, true)
            }
          } catch (err) {
            console.warn('Dual camera not supported, using single camera:', err)
          }
        }
      } else {
        // Audio only - high quality
        const aStream = await navigator.mediaDevices.getUserMedia({ audio: HD_AUDIO_CONSTRAINTS })
        primaryStream = aStream
        primaryRecorder = createRecorder(aStream, primaryChunks, mimeType, false)
      }

      // Start recording
      primaryRecorder?.start(1000)
      secondaryRecorder?.start(1000)

      // Update store and start timer
      useRecordingStore.getState().setRecordingStarted(type, cameraMode)
      startTimer()

      return true
    } catch (err) {
      console.error('Failed to start recording:', err)
      stopAllStreams()
      return false
    }
  },

  stopRecording(): Promise<void> {
    return new Promise((resolve) => {
      stopTimer()

      let primaryBlob: Blob | null = null
      let secondBlob: Blob | null = null
      let primaryStopped = false
      let secondaryStopped = !secondaryRecorder

      const checkCompletion = () => {
        if (primaryStopped && secondaryStopped) {
          stopAllStreams()
          if (primaryBlob) {
            useRecordingStore.getState().setRecordingStopped(primaryBlob, secondBlob || undefined)
          }
          resolve()
        }
      }

      // Determine the correct mimeType - use detected, then recorder's, then platform default
      const getActualMimeType = (recorder: MediaRecorder): string => {
        if (recorder.mimeType) return recorder.mimeType
        if (detectedMimeType) return detectedMimeType
        // Fallback based on platform
        return isIOSSafari() ? 'video/mp4' : 'video/webm'
      }

      if (primaryRecorder && primaryRecorder.state !== 'inactive') {
        const primaryMimeType = getActualMimeType(primaryRecorder)
        console.log('Stopping primary recorder with mimeType:', primaryMimeType)
        primaryRecorder.onstop = () => {
          primaryBlob = new Blob(primaryChunks, { type: primaryMimeType })
          console.log('Primary blob created:', primaryBlob.type, primaryBlob.size)
          primaryStopped = true
          checkCompletion()
        }
        primaryRecorder.stop()
      } else {
        primaryStopped = true
        checkCompletion()
      }

      if (secondaryRecorder && secondaryRecorder.state !== 'inactive') {
        const secondaryMimeType = getActualMimeType(secondaryRecorder)
        secondaryRecorder.onstop = () => {
          secondBlob = new Blob(secondaryChunks, { type: secondaryMimeType })
          secondaryStopped = true
          checkCompletion()
        }
        secondaryRecorder.stop()
      }
    })
  },

  pauseRecording() {
    if (primaryRecorder?.state === 'recording') {
      primaryRecorder.pause()
    }
    if (secondaryRecorder?.state === 'recording') {
      secondaryRecorder.pause()
    }
    useRecordingStore.getState().setRecordingPaused(true)
    stopTimer()
  },

  resumeRecording() {
    if (primaryRecorder?.state === 'paused') {
      primaryRecorder.resume()
    }
    if (secondaryRecorder?.state === 'paused') {
      secondaryRecorder.resume()
    }
    useRecordingStore.getState().setRecordingPaused(false)
    startTimer()
  },

  // Get current streams for preview
  getPrimaryStream(): MediaStream | null {
    return primaryStream
  },

  getSecondaryStream(): MediaStream | null {
    return secondaryStream
  },

  // Check if actively recording
  isActive(): boolean {
    return primaryRecorder?.state === 'recording' || primaryRecorder?.state === 'paused'
  },
}
