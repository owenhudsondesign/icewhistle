import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useEnhancedRecording } from './useEnhancedRecording'
import { useRecordingStore } from '@/stores/recordingStore'
import { recordingManager } from '@/lib/recording-manager'
import { saveVideoWithManifest } from '@/lib/video-authenticity'

vi.mock('@/lib/recording-manager', () => ({
  recordingManager: {
    startRecording: vi.fn().mockResolvedValue(true),
    stopRecording: vi.fn().mockResolvedValue(undefined),
    pauseRecording: vi.fn(),
    resumeRecording: vi.fn(),
    getPrimaryStream: vi.fn().mockReturnValue(null),
    getSecondaryStream: vi.fn().mockReturnValue(null),
  },
}))

vi.mock('@/lib/video-authenticity', () => ({
  saveVideoWithManifest: vi.fn().mockResolvedValue(undefined),
}))

const blob = (name: string) => new Blob([name], { type: 'video/webm' })

const resetStore = () =>
  useRecordingStore.setState({
    isRecording: false,
    isPaused: false,
    recordingTime: 0,
    recordingBlob: null,
    secondaryBlob: null,
    cameraMode: 'back',
    recordingType: 'video',
    showSaveDialog: false,
  })

beforeEach(() => {
  resetStore()
  vi.mocked(saveVideoWithManifest).mockResolvedValue(
    {} as Awaited<ReturnType<typeof saveVideoWithManifest>>
  )
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.stubGlobal('URL', {
    createObjectURL: vi.fn().mockReturnValue('blob:fake'),
    revokeObjectURL: vi.fn(),
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
  vi.restoreAllMocks()
})

describe('state', () => {
  it('reflects the store while idle', () => {
    const { result } = renderHook(() => useEnhancedRecording())

    expect(result.current.isRecording).toBe(false)
    expect(result.current.recordingTime).toBe(0)
  })

  it('reflects an active recording', () => {
    useRecordingStore.setState({ isRecording: true, recordingTime: 12 })

    const { result } = renderHook(() => useEnhancedRecording())

    expect(result.current.isRecording).toBe(true)
    expect(result.current.recordingTime).toBe(12)
  })

  it('reports no error, since the manager handles them', () => {
    const { result } = renderHook(() => useEnhancedRecording())

    expect(result.current.error).toBeNull()
  })
})

describe('controls', () => {
  it('delegates start to the manager', async () => {
    const { result } = renderHook(() => useEnhancedRecording())

    await act(async () => {
      await result.current.startRecording('video', 'back')
    })

    expect(recordingManager.startRecording).toHaveBeenCalledWith('video', 'back')
  })

  it('delegates stop to the manager', async () => {
    const { result } = renderHook(() => useEnhancedRecording())

    await act(async () => {
      await result.current.stopRecording()
    })

    expect(recordingManager.stopRecording).toHaveBeenCalledTimes(1)
  })

  it('delegates pause to the manager', () => {
    const { result } = renderHook(() => useEnhancedRecording())

    act(() => result.current.pauseRecording())

    expect(recordingManager.pauseRecording).toHaveBeenCalledTimes(1)
  })

  it('delegates resume to the manager', () => {
    const { result } = renderHook(() => useEnhancedRecording())

    act(() => result.current.resumeRecording())

    expect(recordingManager.resumeRecording).toHaveBeenCalledTimes(1)
  })
})

describe('saveRecording', () => {
  it('saves the recording with an authenticity manifest', async () => {
    useRecordingStore.setState({ recordingBlob: blob('primary'), recordingTime: 30 })
    const { result } = renderHook(() => useEnhancedRecording())

    await act(async () => {
      await result.current.saveRecording()
    })

    expect(saveVideoWithManifest).toHaveBeenCalledWith(
      expect.any(Blob),
      expect.objectContaining({ durationSeconds: 30 })
    )
  })

  it('records which camera produced the file', async () => {
    useRecordingStore.setState({ recordingBlob: blob('primary'), cameraMode: 'front' })
    const { result } = renderHook(() => useEnhancedRecording())

    await act(async () => {
      await result.current.saveRecording()
    })

    expect(saveVideoWithManifest).toHaveBeenCalledWith(
      expect.any(Blob),
      expect.objectContaining({ cameraMode: 'front' })
    )
  })

  it('labels a dual camera recording as back for the primary file', async () => {
    useRecordingStore.setState({ recordingBlob: blob('primary'), cameraMode: 'both' })
    const { result } = renderHook(() => useEnhancedRecording())

    await act(async () => {
      await result.current.saveRecording()
    })

    expect(saveVideoWithManifest).toHaveBeenCalledWith(
      expect.any(Blob),
      expect.objectContaining({ cameraMode: 'back' })
    )
  })

  it('saves the front camera file too when there is one', async () => {
    useRecordingStore.setState({
      recordingBlob: blob('primary'),
      secondaryBlob: blob('secondary'),
      cameraMode: 'both',
    })
    const { result } = renderHook(() => useEnhancedRecording())

    await act(async () => {
      await result.current.saveRecording()
    })

    expect(saveVideoWithManifest).toHaveBeenCalledTimes(2)
  })

  it('falls back to a plain download when the manifest cannot be made', async () => {
    vi.mocked(saveVideoWithManifest).mockRejectedValue(new Error('no crypto'))
    useRecordingStore.setState({ recordingBlob: blob('primary') })
    const click = vi.fn()
    const anchor = document.createElement('a')
    anchor.click = click
    vi.spyOn(document, 'createElement').mockReturnValue(anchor)
    const { result } = renderHook(() => useEnhancedRecording())

    await act(async () => {
      await result.current.saveRecording()
    })

    expect(click).toHaveBeenCalled()
  })

  it('does nothing when there is no recording to save', async () => {
    const { result } = renderHook(() => useEnhancedRecording())

    await act(async () => {
      await result.current.saveRecording()
    })

    expect(saveVideoWithManifest).not.toHaveBeenCalled()
  })

  it('clears the recording once saved', async () => {
    useRecordingStore.setState({ recordingBlob: blob('primary') })
    const { result } = renderHook(() => useEnhancedRecording())

    await act(async () => {
      await result.current.saveRecording()
    })

    expect(useRecordingStore.getState().recordingBlob).toBeNull()
  })
})

describe('discardRecording', () => {
  it('drops the recording', () => {
    useRecordingStore.setState({ recordingBlob: blob('primary') })
    const { result } = renderHook(() => useEnhancedRecording())

    act(() => result.current.discardRecording())

    expect(useRecordingStore.getState().recordingBlob).toBeNull()
  })

  it('does not save a discarded recording', () => {
    useRecordingStore.setState({ recordingBlob: blob('primary') })
    const { result } = renderHook(() => useEnhancedRecording())

    act(() => result.current.discardRecording())

    expect(saveVideoWithManifest).not.toHaveBeenCalled()
  })
})
