'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import { useRecordingStore, type CameraMode, type RecordingType } from '@/stores/recordingStore'
import { saveVideoWithManifest } from '@/lib/video-authenticity'

interface UseEnhancedRecordingReturn {
  // State from store
  isRecording: boolean
  isPaused: boolean
  recordingTime: number
  cameraMode: CameraMode
  recordingType: RecordingType
  recordingBlob: Blob | null
  secondaryBlob: Blob | null
  showSaveDialog: boolean
  error: string | null

  // Stream references for preview
  primaryStream: MediaStream | null
  secondaryStream: MediaStream | null

  // Actions
  startRecording: (type: RecordingType, cameraMode: CameraMode) => Promise<boolean>
  stopRecording: () => Promise<void>
  pauseRecording: () => void
  resumeRecording: () => void
  saveRecording: () => void
  discardRecording: () => void
}

export function useEnhancedRecording(): UseEnhancedRecordingReturn {
  const store = useRecordingStore()

  // Refs for media handling
  const primaryRecorder = useRef<MediaRecorder | null>(null)
  const secondaryRecorder = useRef<MediaRecorder | null>(null)
  const primaryStream = useRef<MediaStream | null>(null)
  const secondaryStream = useRef<MediaStream | null>(null)
  const primaryChunks = useRef<Blob[]>([])
  const secondaryChunks = useRef<Blob[]>([])
  const timerInterval = useRef<NodeJS.Timeout | null>(null)
  const errorRef = useRef<string | null>(null)

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAllStreams()
      if (timerInterval.current) {
        clearInterval(timerInterval.current)
      }
    }
  }, [])

  const stopAllStreams = useCallback(() => {
    primaryStream.current?.getTracks().forEach(track => track.stop())
    secondaryStream.current?.getTracks().forEach(track => track.stop())
    primaryStream.current = null
    secondaryStream.current = null
    primaryRecorder.current = null
    secondaryRecorder.current = null
  }, [])

  const startTimer = useCallback(() => {
    timerInterval.current = setInterval(() => {
      store.incrementTime()
    }, 1000)
  }, [store])

  const stopTimer = useCallback(() => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current)
      timerInterval.current = null
    }
  }, [])

  const getMimeType = (type: RecordingType): string => {
    if (type === 'video') {
      // Check supported formats in order of preference
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        return 'video/webm;codecs=vp9'
      }
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        return 'video/webm;codecs=vp8'
      }
      if (MediaRecorder.isTypeSupported('video/webm')) {
        return 'video/webm'
      }
      // iOS Safari only supports mp4
      if (MediaRecorder.isTypeSupported('video/mp4')) {
        return 'video/mp4'
      }
      // Fallback - let browser choose
      return ''
    }
    // Audio formats
    if (MediaRecorder.isTypeSupported('audio/webm')) {
      return 'audio/webm'
    }
    if (MediaRecorder.isTypeSupported('audio/mp4')) {
      return 'audio/mp4'
    }
    return ''
  }

  const createRecorder = (stream: MediaStream, chunks: Blob[], mimeType: string): MediaRecorder => {
    // If mimeType is empty, let the browser choose
    const options = mimeType ? { mimeType } : undefined
    const recorder = new MediaRecorder(stream, options)
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

  const startRecording = useCallback(async (
    type: RecordingType,
    cameraMode: CameraMode
  ): Promise<boolean> => {
    try {
      errorRef.current = null
      primaryChunks.current = []
      secondaryChunks.current = []

      const mimeType = getMimeType(type)

      // Get primary stream
      if (type === 'video') {
        const facingMode = cameraMode === 'front' ? 'user' : 'environment'

        // Primary camera stream
        const pStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: true,
        })
        primaryStream.current = pStream
        primaryRecorder.current = createRecorder(pStream, primaryChunks.current, mimeType)

        // Secondary camera for dual mode
        // Note: Most mobile browsers don't support two simultaneous camera streams
        if (cameraMode === 'both') {
          try {
            // Small delay to ensure first stream is established
            await new Promise(resolve => setTimeout(resolve, 500))

            const sStream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: 'user' }, // Front camera as secondary/PiP
              audio: false, // Only primary has audio
            })

            // Check if primary stream is still active (some browsers stop it when requesting second)
            if (!primaryStream.current?.active) {
              console.warn('Primary stream was stopped when requesting secondary camera')
              // Re-acquire primary stream
              sStream.getTracks().forEach(track => track.stop())
              const newPrimary = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: true,
              })
              primaryStream.current = newPrimary
              primaryRecorder.current = createRecorder(newPrimary, primaryChunks.current, mimeType)
            } else {
              secondaryStream.current = sStream
              secondaryRecorder.current = createRecorder(sStream, secondaryChunks.current, mimeType)
            }
          } catch (err) {
            console.warn('Dual camera not supported on this device, using single camera:', err)
            // Continue with single camera - this is expected on most mobile devices
          }
        }
      } else {
        // Audio only
        const aStream = await navigator.mediaDevices.getUserMedia({ audio: true })
        primaryStream.current = aStream
        primaryRecorder.current = createRecorder(aStream, primaryChunks.current, mimeType)
      }

      // Start recording
      primaryRecorder.current?.start(1000)
      secondaryRecorder.current?.start(1000)

      // Update store
      store.setRecordingStarted(type, cameraMode)
      startTimer()

      return true
    } catch (err) {
      console.error('Failed to start recording:', err)
      errorRef.current = err instanceof Error ? err.message : 'Failed to access camera/microphone'
      stopAllStreams()
      return false
    }
  }, [store, startTimer, stopAllStreams])

  const stopRecording = useCallback(async (): Promise<void> => {
    return new Promise((resolve) => {
      stopTimer()

      let primaryBlob: Blob | null = null
      let secondBlob: Blob | null = null
      let primaryStopped = false
      let secondaryStopped = !secondaryRecorder.current // If no secondary, consider it done

      const checkCompletion = () => {
        if (primaryStopped && secondaryStopped) {
          stopAllStreams()
          store.setRecordingStopped(primaryBlob!, secondBlob || undefined)
          resolve()
        }
      }

      // Stop primary recorder
      if (primaryRecorder.current && primaryRecorder.current.state !== 'inactive') {
        const primaryMimeType = primaryRecorder.current.mimeType || 'video/webm'
        primaryRecorder.current.onstop = () => {
          primaryBlob = new Blob(primaryChunks.current, { type: primaryMimeType })
          primaryStopped = true
          checkCompletion()
        }
        primaryRecorder.current.stop()
      } else {
        primaryStopped = true
        checkCompletion()
      }

      // Stop secondary recorder
      if (secondaryRecorder.current && secondaryRecorder.current.state !== 'inactive') {
        const secondaryMimeType = secondaryRecorder.current.mimeType || 'video/webm'
        secondaryRecorder.current.onstop = () => {
          secondBlob = new Blob(secondaryChunks.current, { type: secondaryMimeType })
          secondaryStopped = true
          checkCompletion()
        }
        secondaryRecorder.current.stop()
      }
    })
  }, [store, stopTimer, stopAllStreams])

  const pauseRecording = useCallback(() => {
    if (primaryRecorder.current?.state === 'recording') {
      primaryRecorder.current.pause()
    }
    if (secondaryRecorder.current?.state === 'recording') {
      secondaryRecorder.current.pause()
    }
    store.setRecordingPaused(true)
    stopTimer()
  }, [store, stopTimer])

  const resumeRecording = useCallback(() => {
    if (primaryRecorder.current?.state === 'paused') {
      primaryRecorder.current.resume()
    }
    if (secondaryRecorder.current?.state === 'paused') {
      secondaryRecorder.current.resume()
    }
    store.setRecordingPaused(false)
    startTimer()
  }, [store, startTimer])

  const saveRecording = useCallback(async () => {
    const { recordingBlob, secondaryBlob, recordingType, cameraMode, recordingTime } = store

    if (recordingBlob) {
      try {
        // Save with cryptographic manifest for authenticity
        const cameraSuffix = cameraMode === 'both' ? 'back' : cameraMode
        await saveVideoWithManifest(recordingBlob, {
          cameraMode: cameraSuffix,
          recordingType,
          durationSeconds: recordingTime,
        })
      } catch (err) {
        // Fallback to simple download if manifest creation fails
        console.warn('Could not create manifest, falling back to simple download:', err)
        downloadBlob(recordingBlob, recordingType, 'primary')
      }
    }

    if (secondaryBlob) {
      try {
        await saveVideoWithManifest(secondaryBlob, {
          cameraMode: 'front',
          recordingType: 'video',
          durationSeconds: recordingTime,
        })
      } catch (err) {
        console.warn('Could not create manifest for secondary, falling back:', err)
        downloadBlob(secondaryBlob, 'video', 'front-camera')
      }
    }

    store.clearRecording()
  }, [store])

  const discardRecording = useCallback(() => {
    store.clearRecording()
  }, [store])

  return {
    // State
    isRecording: store.isRecording,
    isPaused: store.isPaused,
    recordingTime: store.recordingTime,
    cameraMode: store.cameraMode,
    recordingType: store.recordingType,
    recordingBlob: store.recordingBlob,
    secondaryBlob: store.secondaryBlob,
    showSaveDialog: store.showSaveDialog,
    error: errorRef.current,

    // Streams for preview
    primaryStream: primaryStream.current,
    secondaryStream: secondaryStream.current,

    // Actions
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    saveRecording,
    discardRecording,
  }
}

// Helper to download blob
function downloadBlob(blob: Blob, type: RecordingType, suffix: string = '') {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  // Determine extension from blob type
  let extension = 'webm'
  if (blob.type.includes('mp4')) {
    extension = 'mp4'
  } else if (blob.type.includes('webm')) {
    extension = 'webm'
  }
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = suffix
    ? `icewhistle-${suffix}-${timestamp}.${extension}`
    : `icewhistle-recording-${timestamp}.${extension}`
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Re-export for convenience
export { formatRecordingTime } from '@/stores/recordingStore'
