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

function createRecorder(stream: MediaStream, chunks: Blob[], mimeType: string): MediaRecorder {
  const options = mimeType ? { mimeType } : undefined
  let recorder: MediaRecorder

  try {
    recorder = new MediaRecorder(stream, options)
  } catch (e) {
    // If specified mimeType fails, let browser choose
    console.warn('Failed to create MediaRecorder with mimeType:', mimeType, e)
    recorder = new MediaRecorder(stream)
  }

  // Store the actual mimeType being used
  detectedMimeType = recorder.mimeType || mimeType || 'video/mp4'
  console.log('MediaRecorder using mimeType:', detectedMimeType)

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

function stopAllStreams() {
  primaryStream?.getTracks().forEach(track => track.stop())
  secondaryStream?.getTracks().forEach(track => track.stop())
  primaryStream = null
  secondaryStream = null
  primaryRecorder = null
  secondaryRecorder = null
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

        // Primary camera stream
        const pStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: true,
        })
        primaryStream = pStream
        primaryRecorder = createRecorder(pStream, primaryChunks, mimeType)

        // Secondary camera for dual mode (native app only)
        if (cameraMode === 'both') {
          try {
            await new Promise(resolve => setTimeout(resolve, 500))

            const sStream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: 'user' },
              audio: false,
            })

            if (!primaryStream?.active) {
              console.warn('Primary stream was stopped when requesting secondary camera')
              sStream.getTracks().forEach(track => track.stop())
              const newPrimary = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: true,
              })
              primaryStream = newPrimary
              primaryRecorder = createRecorder(newPrimary, primaryChunks, mimeType)
            } else {
              secondaryStream = sStream
              secondaryRecorder = createRecorder(sStream, secondaryChunks, mimeType)
            }
          } catch (err) {
            console.warn('Dual camera not supported, using single camera:', err)
          }
        }
      } else {
        // Audio only
        const aStream = await navigator.mediaDevices.getUserMedia({ audio: true })
        primaryStream = aStream
        primaryRecorder = createRecorder(aStream, primaryChunks, mimeType)
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
