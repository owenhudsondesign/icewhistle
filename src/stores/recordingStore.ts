import { create } from 'zustand'

export type CameraMode = 'front' | 'back' | 'both'
export type RecordingType = 'video' | 'audio'

interface RecordingState {
  // Recording status
  isRecording: boolean
  isPaused: boolean
  recordingTime: number

  // Recording configuration
  cameraMode: CameraMode
  recordingType: RecordingType

  // Stream references (stored as IDs, actual streams managed by hook)
  hasActiveStream: boolean

  // Recorded data
  recordingBlob: Blob | null
  secondaryBlob: Blob | null // For dual camera fallback

  // UI state
  showSaveDialog: boolean
}

interface RecordingActions {
  // Recording control
  setRecordingStarted: (type: RecordingType, cameraMode: CameraMode) => void
  setRecordingStopped: (blob: Blob, secondaryBlob?: Blob) => void
  setRecordingPaused: (paused: boolean) => void
  incrementTime: () => void

  // Stream management
  setHasActiveStream: (hasStream: boolean) => void

  // UI
  setShowSaveDialog: (show: boolean) => void
  clearRecording: () => void

  // Full reset
  reset: () => void
}

const initialState: RecordingState = {
  isRecording: false,
  isPaused: false,
  recordingTime: 0,
  cameraMode: 'back',
  recordingType: 'video',
  hasActiveStream: false,
  recordingBlob: null,
  secondaryBlob: null,
  showSaveDialog: false,
}

export const useRecordingStore = create<RecordingState & RecordingActions>()(
  (set) => ({
    ...initialState,

    setRecordingStarted: (type, cameraMode) =>
      set({
        isRecording: true,
        isPaused: false,
        recordingTime: 0,
        recordingType: type,
        cameraMode,
        hasActiveStream: true,
        recordingBlob: null,
        secondaryBlob: null,
        showSaveDialog: false,
      }),

    setRecordingStopped: (blob, secondaryBlob) =>
      set({
        isRecording: false,
        isPaused: false,
        hasActiveStream: false,
        recordingBlob: blob,
        secondaryBlob: secondaryBlob || null,
        showSaveDialog: true,
      }),

    setRecordingPaused: (paused) =>
      set({ isPaused: paused }),

    incrementTime: () =>
      set((state) => ({
        recordingTime: state.recordingTime + 1,
      })),

    setHasActiveStream: (hasStream) =>
      set({ hasActiveStream: hasStream }),

    setShowSaveDialog: (show) =>
      set({ showSaveDialog: show }),

    clearRecording: () =>
      set({
        recordingBlob: null,
        secondaryBlob: null,
        showSaveDialog: false,
      }),

    reset: () => set(initialState),
  })
)

// Selectors
export const selectIsRecording = (state: RecordingState) => state.isRecording
export const selectIsPaused = (state: RecordingState) => state.isPaused
export const selectRecordingTime = (state: RecordingState) => state.recordingTime
export const selectCameraMode = (state: RecordingState) => state.cameraMode
export const selectRecordingType = (state: RecordingState) => state.recordingType
export const selectHasRecording = (state: RecordingState) => state.recordingBlob !== null

// Helper to format recording time
export function formatRecordingTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
