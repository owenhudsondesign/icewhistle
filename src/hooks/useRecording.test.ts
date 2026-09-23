import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useRecording, formatRecordingTime, downloadRecording } from './useRecording'

class FakeMediaRecorder {
  static instances: FakeMediaRecorder[] = []
  static isTypeSupported = vi.fn().mockReturnValue(true)

  state: 'inactive' | 'recording' | 'paused' = 'inactive'
  ondataavailable: ((e: { data: Blob }) => void) | null = null
  onstop: (() => void) | null = null

  constructor(
    public stream: MediaStream,
    public options?: MediaRecorderOptions
  ) {
    FakeMediaRecorder.instances.push(this)
  }

  start() {
    this.state = 'recording'
  }

  stop() {
    this.state = 'inactive'
    this.ondataavailable?.({ data: new Blob(['data'], { type: 'video/webm' }) })
    this.onstop?.()
  }

  pause() {
    this.state = 'paused'
  }

  resume() {
    this.state = 'recording'
  }
}

let track: { stop: ReturnType<typeof vi.fn> }

beforeEach(() => {
  FakeMediaRecorder.instances = []
  FakeMediaRecorder.isTypeSupported.mockReturnValue(true)
  track = { stop: vi.fn() }
  vi.stubGlobal('MediaRecorder', FakeMediaRecorder)
  Object.defineProperty(navigator, 'mediaDevices', {
    value: {
      getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [track] }),
    },
    configurable: true,
  })
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('formatRecordingTime', () => {
  it.each([
    [0, '00:00'],
    [5, '00:05'],
    [59, '00:59'],
    [60, '01:00'],
    [61, '01:01'],
    [600, '10:00'],
    [3599, '59:59'],
  ])('formats %i seconds as %s', (seconds, expected) => {
    expect(formatRecordingTime(seconds)).toBe(expected)
  })

  it('keeps counting minutes past an hour rather than wrapping', () => {
    expect(formatRecordingTime(3660)).toBe('61:00')
  })
})

describe('useRecording initial state', () => {
  it('starts idle', () => {
    const { result } = renderHook(() => useRecording())

    expect(result.current).toMatchObject({
      isRecording: false,
      isPaused: false,
      recordingTime: 0,
      recordingType: null,
      error: null,
    })
  })
})

describe('startRecording', () => {
  it('starts a video recording', async () => {
    const { result } = renderHook(() => useRecording())

    await act(async () => {
      await result.current.startRecording('video')
    })

    expect(result.current.isRecording).toBe(true)
    expect(result.current.recordingType).toBe('video')
  })

  it('requests both camera and microphone for video', async () => {
    const { result } = renderHook(() => useRecording())

    await act(async () => {
      await result.current.startRecording('video')
    })

    const constraints = vi.mocked(navigator.mediaDevices.getUserMedia).mock.calls[0][0]

    expect(constraints).toMatchObject({ audio: true })
    expect(constraints!.video).toBeTruthy()
  })

  it('requests only the microphone for audio', async () => {
    const { result } = renderHook(() => useRecording())

    await act(async () => {
      await result.current.startRecording('audio')
    })

    const constraints = vi.mocked(navigator.mediaDevices.getUserMedia).mock.calls[0][0]

    expect(constraints!.video).toBeUndefined()
  })

  it('uses the rear camera, which is what faces the encounter', async () => {
    const { result } = renderHook(() => useRecording())

    await act(async () => {
      await result.current.startRecording('video')
    })

    const constraints = vi.mocked(navigator.mediaDevices.getUserMedia).mock.calls[0][0]

    expect((constraints!.video as MediaTrackConstraints).facingMode).toBe('environment')
  })

  it('falls back to plain webm when vp9 is unsupported', async () => {
    FakeMediaRecorder.isTypeSupported.mockReturnValue(false)
    const { result } = renderHook(() => useRecording())

    await act(async () => {
      await result.current.startRecording('video')
    })

    expect(FakeMediaRecorder.instances[0].options?.mimeType).toBe('video/webm')
  })

  it('reports a permission denial instead of throwing', async () => {
    vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValue(
      new Error('Permission denied')
    )
    const { result } = renderHook(() => useRecording())

    let started: boolean | undefined
    await act(async () => {
      started = await result.current.startRecording('video')
    })

    expect(started).toBe(false)
    expect(result.current.error).toBe('Permission denied')
    expect(result.current.isRecording).toBe(false)
  })

  it('resets the timer when a new recording starts', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useRecording())
    await act(async () => {
      await result.current.startRecording('video')
    })
    await act(async () => {
      vi.advanceTimersByTime(3000)
    })

    await act(async () => {
      await result.current.startRecording('video')
    })

    expect(result.current.recordingTime).toBe(0)
  })

  it('counts elapsed seconds while recording', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useRecording())
    await act(async () => {
      await result.current.startRecording('video')
    })

    await act(async () => {
      vi.advanceTimersByTime(3000)
    })

    expect(result.current.recordingTime).toBe(3)
  })
})

describe('stopRecording', () => {
  it('clears the recording state', async () => {
    const { result } = renderHook(() => useRecording())
    await act(async () => {
      await result.current.startRecording('video')
    })

    await act(async () => {
      await result.current.stopRecording()
    })

    await waitFor(() => expect(result.current.isRecording).toBe(false))
  })

  it('releases the camera and microphone', async () => {
    const { result } = renderHook(() => useRecording())
    await act(async () => {
      await result.current.startRecording('video')
    })

    await act(async () => {
      await result.current.stopRecording()
    })

    await waitFor(() => expect(track.stop).toHaveBeenCalled())
  })

  it('returns the recorded blob', async () => {
    const { result } = renderHook(() => useRecording())
    await act(async () => {
      await result.current.startRecording('video')
    })

    let blob: Blob | null = null
    await act(async () => {
      blob = await result.current.stopRecording()
    })

    expect(blob).toBeInstanceOf(Blob)
  })
})

describe('pause and resume', () => {
  it('pauses an active recording', async () => {
    const { result } = renderHook(() => useRecording())
    await act(async () => {
      await result.current.startRecording('video')
    })

    act(() => result.current.pauseRecording())

    expect(result.current.isPaused).toBe(true)
  })

  it('stops the timer while paused', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useRecording())
    await act(async () => {
      await result.current.startRecording('video')
    })
    act(() => result.current.pauseRecording())
    const atPause = result.current.recordingTime

    await act(async () => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.recordingTime).toBe(atPause)
  })

  it('resumes a paused recording', async () => {
    const { result } = renderHook(() => useRecording())
    await act(async () => {
      await result.current.startRecording('video')
    })
    act(() => result.current.pauseRecording())

    act(() => result.current.resumeRecording())

    expect(result.current.isPaused).toBe(false)
  })
})

describe('downloadRecording', () => {
  it('triggers a download with a dated filename', () => {
    const click = vi.fn()
    const anchor = document.createElement('a')
    anchor.click = click
    vi.spyOn(document, 'createElement').mockReturnValue(anchor)
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValue('blob:fake'),
      revokeObjectURL: vi.fn(),
    })

    downloadRecording(new Blob(['x']), 'video')

    expect(click).toHaveBeenCalled()
    expect(anchor.download).toMatch(/^icewhistle-recording-.*\.webm$/)
  })

  it('releases the object URL afterwards', () => {
    const anchor = document.createElement('a')
    anchor.click = vi.fn()
    vi.spyOn(document, 'createElement').mockReturnValue(anchor)
    const revokeObjectURL = vi.fn()
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValue('blob:fake'),
      revokeObjectURL,
    })

    downloadRecording(new Blob(['x']), 'audio')

    expect(revokeObjectURL).toHaveBeenCalledWith('blob:fake')
  })
})
