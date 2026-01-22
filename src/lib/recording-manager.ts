/**
 * Recording Manager - Hybrid Native + Browser Recording
 *
 * Uses Capacitor Camera for native apps (best quality)
 * Falls back to optimized RecordRTC/MediaRecorder for browsers
 */

import { useRecordingStore, type CameraMode, type RecordingType } from '@/stores/recordingStore'
import { Capacitor } from '@capacitor/core'
import { Camera, CameraResultType } from '@capacitor/camera'

// Module-level state (persists across component lifecycles)
let primaryRecorder: MediaRecorder | null = null
let secondaryRecorder: MediaRecorder | null = null
let primaryStream: MediaStream | null = null
let secondaryStream: MediaStream | null = null
let primaryChunks: Blob[] = []
let secondaryChunks: Blob[] = []
let timerInterval: NodeJS.Timeout | null = null
let detectedMimeType: string = ''
let recordRTCInstance: any = null

// Check if running as native Capacitor app
function isNativeApp(): boolean {
  return Capacitor.isNativePlatform()
}

// Detect if running on iOS Safari
function isIOSSafari(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua)
  return isIOS || isSafari
}

// Detect iOS (for constraint adjustments)
function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

function getMimeType(type: RecordingType): string {
  // iOS Safari only supports mp4
  if (isIOSSafari()) {
    if (type === 'video') {
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
      return ''
    }
    if (MediaRecorder.isTypeSupported('audio/mp4')) {
      return 'audio/mp4'
    }
    return ''
  }

  // Non-iOS: prefer webm with VP9 for better quality
  if (type === 'video') {
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
      return 'video/webm;codecs=vp9,opus'
    }
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
      return 'video/webm;codecs=vp9'
    }
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
      return 'video/webm;codecs=vp8,opus'
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
  if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
    return 'audio/webm;codecs=opus'
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
  // OPTIMIZED: Lower bitrates for more stable mobile recording
  const recorderOptions: MediaRecorderOptions = {
    // Reduced bitrates for stability - still good quality for evidence
    videoBitsPerSecond: isVideo ? 2500000 : undefined, // 2.5 Mbps (down from 8)
    audioBitsPerSecond: 128000, // 128 kbps (down from 256)
  }

  if (mimeType) {
    recorderOptions.mimeType = mimeType
  }

  let recorder: MediaRecorder

  try {
    recorder = new MediaRecorder(stream, recorderOptions)
  } catch (e) {
    console.warn('Failed to create MediaRecorder with options, trying defaults:', e)
    try {
      recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
    } catch (e2) {
      console.warn('Failed with mimeType, using browser defaults:', e2)
      recorder = new MediaRecorder(stream)
    }
  }

  detectedMimeType = recorder.mimeType || mimeType || 'video/mp4'
  console.log('MediaRecorder using:', detectedMimeType, 'videoBps:', recorder.videoBitsPerSecond, 'audioBps:', recorder.audioBitsPerSecond)

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

// OPTIMIZED: More conservative constraints for stable mobile recording
const getVideoConstraints = (facingMode: 'user' | 'environment', deviceId?: string): MediaTrackConstraints => {
  // iOS needs more conservative settings
  if (isIOS()) {
    return deviceId
      ? {
          deviceId: { exact: deviceId },
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 30 },
        }
      : {
          facingMode,
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 30 },
        }
  }

  // Android/Desktop can handle higher but still keep it reasonable
  return deviceId
    ? {
        deviceId: { exact: deviceId },
        width: { ideal: 1920, max: 1920 },
        height: { ideal: 1080, max: 1080 },
        frameRate: { ideal: 30, max: 30 },
        aspectRatio: { ideal: 16/9 },
      }
    : {
        facingMode,
        width: { ideal: 1920, max: 1920 },
        height: { ideal: 1080, max: 1080 },
        frameRate: { ideal: 30, max: 30 },
        aspectRatio: { ideal: 16/9 },
      }
}

// OPTIMIZED: Audio constraints - enable some processing for cleaner audio
const getAudioConstraints = (): MediaTrackConstraints => {
  if (isIOS()) {
    // iOS works better with minimal constraints
    return {
      echoCancellation: true,
      noiseSuppression: true,
    }
  }

  return {
    sampleRate: { ideal: 44100 },
    sampleSize: { ideal: 16 },
    channelCount: { ideal: 1 }, // Mono is more reliable
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  }
}

function stopAllStreams() {
  primaryStream?.getTracks().forEach(track => track.stop())
  secondaryStream?.getTracks().forEach(track => track.stop())
  primaryStream = null
  secondaryStream = null
  primaryRecorder = null
  secondaryRecorder = null
  if (recordRTCInstance) {
    try {
      recordRTCInstance.destroy()
    } catch (e) {
      console.warn('Error destroying RecordRTC:', e)
    }
    recordRTCInstance = null
  }
}

/**
 * Find the widest angle camera for a given facing mode
 */
async function findWidestCamera(facingMode: 'user' | 'environment'): Promise<string | null> {
  try {
    const tempStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } })
    tempStream.getTracks().forEach(track => track.stop())

    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoDevices = devices.filter(d => d.kind === 'videoinput')

    console.log('Available video devices:', videoDevices.map(d => ({ label: d.label, id: d.deviceId })))

    const wideKeywords = ['ultra wide', 'ultrawide', 'ultra-wide', 'wide angle', 'wide-angle', '0.5x']
    const standardWideKeywords = ['wide', 'back camera 0', 'rear camera 0']

    const facingKeywords = facingMode === 'user'
      ? ['front', 'facetime', 'selfie', 'user']
      : ['back', 'rear', 'environment', 'main']

    const matchingCameras = videoDevices.filter(device => {
      const label = device.label.toLowerCase()
      return facingKeywords.some(keyword => label.includes(keyword))
    })

    const camerasToSearch = matchingCameras.length > 0 ? matchingCameras : videoDevices

    for (const device of camerasToSearch) {
      const label = device.label.toLowerCase()
      if (wideKeywords.some(keyword => label.includes(keyword))) {
        console.log('Found ultra-wide camera:', device.label)
        return device.deviceId
      }
    }

    for (const device of camerasToSearch) {
      const label = device.label.toLowerCase()
      if (standardWideKeywords.some(keyword => label.includes(keyword))) {
        console.log('Found wide camera:', device.label)
        return device.deviceId
      }
    }

    if (facingMode === 'environment' && camerasToSearch.length > 1) {
      console.log('Using first back camera (likely widest):', camerasToSearch[0].label)
      return camerasToSearch[0].deviceId
    }

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

/**
 * Native recording using Capacitor Camera
 * Returns the video file path/data
 */
async function startNativeRecording(): Promise<{ success: boolean; error?: string }> {
  try {
    // Check camera permission
    const permission = await Camera.checkPermissions()
    if (permission.camera !== 'granted') {
      const request = await Camera.requestPermissions({ permissions: ['camera'] })
      if (request.camera !== 'granted') {
        return { success: false, error: 'Camera permission denied' }
      }
    }

    // Note: Capacitor Camera plugin doesn't support video recording directly
    // It's primarily for photos. For native video, we'd need a different plugin
    // like @capawesome/capacitor-screen-recorder or a custom native implementation

    // For now, fall back to browser recording even in native context
    console.log('Native video recording not available via Capacitor Camera plugin')
    return { success: false, error: 'Native video recording requires additional plugin' }
  } catch (err) {
    console.error('Native recording error:', err)
    return { success: false, error: String(err) }
  }
}

/**
 * Browser recording using optimized MediaRecorder
 * With RecordRTC as enhancement layer when available
 */
async function startBrowserRecording(
  type: RecordingType,
  cameraMode: CameraMode
): Promise<boolean> {
  try {
    primaryChunks = []
    secondaryChunks = []

    const mimeType = getMimeType(type)

    if (type === 'video') {
      const facingMode = cameraMode === 'front' ? 'user' : 'environment'
      const wideDeviceId = await findWidestCamera(facingMode)
      const videoConstraints = getVideoConstraints(facingMode, wideDeviceId || undefined)
      const audioConstraints = getAudioConstraints()

      console.log('Requesting video with constraints:', videoConstraints)
      console.log('Requesting audio with constraints:', audioConstraints)

      const pStream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: audioConstraints,
      })

      const videoTrack = pStream.getVideoTracks()[0]
      const settings = videoTrack?.getSettings()
      console.log('Actual video quality:', settings?.width, 'x', settings?.height, '@', settings?.frameRate, 'fps')

      primaryStream = pStream

      // Try to use RecordRTC for better quality (if available)
      let useRecordRTC = false
      try {
        const RecordRTC = (await import('recordrtc')).default
        if (RecordRTC) {
          // RecordRTC has strict mimeType options, use webm or let it auto-detect
          const recordRTCMimeType = mimeType.includes('webm') ? 'video/webm' : undefined
          recordRTCInstance = new RecordRTC(pStream, {
            type: 'video',
            mimeType: recordRTCMimeType as any,
            // RecordRTC specific optimizations
            disableLogs: true,
            numberOfAudioChannels: 1,
            desiredSampRate: 44100,
            videoBitsPerSecond: 2500000,
            audioBitsPerSecond: 128000,
            frameInterval: 30, // Consistent frame timing
            timeSlice: 1000,
            ondataavailable: (blob: Blob) => {
              if (blob.size > 0) {
                primaryChunks.push(blob)
              }
            },
          })
          useRecordRTC = true
          console.log('Using RecordRTC for enhanced recording')
        }
      } catch (e) {
        console.log('RecordRTC not available, using standard MediaRecorder')
      }

      if (!useRecordRTC) {
        primaryRecorder = createRecorder(pStream, primaryChunks, mimeType, true)
      }

      // Secondary camera for dual mode
      if (cameraMode === 'both') {
        try {
          await new Promise(resolve => setTimeout(resolve, 500))
          const wideFrontDeviceId = await findWidestCamera('user')
          const secondaryVideoConstraints = getVideoConstraints('user', wideFrontDeviceId || undefined)

          const sStream = await navigator.mediaDevices.getUserMedia({
            video: secondaryVideoConstraints,
            audio: false,
          })

          if (!primaryStream?.active) {
            console.warn('Primary stream was stopped when requesting secondary camera')
            sStream.getTracks().forEach(track => track.stop())
          } else {
            secondaryStream = sStream
            secondaryRecorder = createRecorder(sStream, secondaryChunks, mimeType, true)
          }
        } catch (err) {
          console.warn('Dual camera not supported:', err)
        }
      }
    } else {
      // Audio only
      const audioConstraints = getAudioConstraints()
      const aStream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints })
      primaryStream = aStream
      primaryRecorder = createRecorder(aStream, primaryChunks, mimeType, false)
    }

    // Start recording with smaller chunks for better sync
    // Using 500ms chunks instead of 1000ms for smoother recording
    if (recordRTCInstance) {
      recordRTCInstance.startRecording()
    } else {
      primaryRecorder?.start(500)
    }
    secondaryRecorder?.start(500)

    useRecordingStore.getState().setRecordingStarted(type, cameraMode)
    startTimer()

    return true
  } catch (err) {
    console.error('Failed to start browser recording:', err)
    stopAllStreams()
    return false
  }
}

export const recordingManager = {
  async startRecording(type: RecordingType, cameraMode: CameraMode): Promise<boolean> {
    // Check if we're in a native app context
    if (isNativeApp()) {
      console.log('Running in native app context')
      const nativeResult = await startNativeRecording()
      if (nativeResult.success) {
        useRecordingStore.getState().setRecordingStarted(type, cameraMode)
        startTimer()
        return true
      }
      // Fall back to browser recording if native fails
      console.log('Falling back to browser recording:', nativeResult.error)
    }

    // Use optimized browser recording
    return startBrowserRecording(type, cameraMode)
  },

  stopRecording(): Promise<void> {
    return new Promise((resolve) => {
      stopTimer()

      // Handle RecordRTC
      if (recordRTCInstance) {
        recordRTCInstance.stopRecording(() => {
          const blob = recordRTCInstance.getBlob()
          stopAllStreams()
          if (blob) {
            useRecordingStore.getState().setRecordingStopped(blob, undefined)
          }
          resolve()
        })
        return
      }

      // Handle standard MediaRecorder
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

      const getActualMimeType = (recorder: MediaRecorder): string => {
        if (recorder.mimeType) return recorder.mimeType
        if (detectedMimeType) return detectedMimeType
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
    if (recordRTCInstance) {
      recordRTCInstance.pauseRecording()
    } else if (primaryRecorder?.state === 'recording') {
      primaryRecorder.pause()
    }
    if (secondaryRecorder?.state === 'recording') {
      secondaryRecorder.pause()
    }
    useRecordingStore.getState().setRecordingPaused(true)
    stopTimer()
  },

  resumeRecording() {
    if (recordRTCInstance) {
      recordRTCInstance.resumeRecording()
    } else if (primaryRecorder?.state === 'paused') {
      primaryRecorder.resume()
    }
    if (secondaryRecorder?.state === 'paused') {
      secondaryRecorder.resume()
    }
    useRecordingStore.getState().setRecordingPaused(false)
    startTimer()
  },

  getPrimaryStream(): MediaStream | null {
    return primaryStream
  },

  getSecondaryStream(): MediaStream | null {
    return secondaryStream
  },

  isActive(): boolean {
    if (recordRTCInstance) {
      return recordRTCInstance.state === 'recording' || recordRTCInstance.state === 'paused'
    }
    return primaryRecorder?.state === 'recording' || primaryRecorder?.state === 'paused'
  },
}
