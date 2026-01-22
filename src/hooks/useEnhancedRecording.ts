'use client'

import { useCallback } from 'react'
import { useRecordingStore, type CameraMode, type RecordingType } from '@/stores/recordingStore'
import { recordingManager } from '@/lib/recording-manager'
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
  saveRecording: () => Promise<void>
  discardRecording: () => void
}

export function useEnhancedRecording(): UseEnhancedRecordingReturn {
  const store = useRecordingStore()

  const startRecording = useCallback(async (
    type: RecordingType,
    cameraMode: CameraMode
  ): Promise<boolean> => {
    return recordingManager.startRecording(type, cameraMode)
  }, [])

  const stopRecording = useCallback(async (): Promise<void> => {
    return recordingManager.stopRecording()
  }, [])

  const pauseRecording = useCallback(() => {
    recordingManager.pauseRecording()
  }, [])

  const resumeRecording = useCallback(() => {
    recordingManager.resumeRecording()
  }, [])

  const saveRecording = useCallback(async () => {
    const { recordingBlob, secondaryBlob, recordingType, cameraMode, recordingTime } = store

    if (recordingBlob) {
      try {
        const cameraSuffix = cameraMode === 'both' ? 'back' : cameraMode
        await saveVideoWithManifest(recordingBlob, {
          cameraMode: cameraSuffix,
          recordingType,
          durationSeconds: recordingTime,
        })
      } catch (err) {
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
    error: null, // Errors are handled in the manager

    // Streams for preview (from singleton manager)
    primaryStream: recordingManager.getPrimaryStream(),
    secondaryStream: recordingManager.getSecondaryStream(),

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
