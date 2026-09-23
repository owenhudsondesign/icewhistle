import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { recordingManager } from './recording-manager'
import { useRecordingStore } from '@/stores/recordingStore'

vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: () => false, getPlatform: () => 'web' },
}))

vi.mock('@capacitor/camera', () => ({
  Camera: { getPhoto: vi.fn() },
  CameraResultType: { Uri: 'uri' },
}))

/**
 * The browser path prefers RecordRTC over a raw MediaRecorder, so the fake has
 * to stand in for RecordRTC to exercise the code that actually runs in a browser.
 */
class FakeRecordRTC {
  static instances: FakeRecordRTC[] = []

  state: 'recording' | 'paused' | 'stopped' = 'stopped'
  destroyed = false

  constructor(
    public stream: MediaStream,
    public options: Record<string, unknown>
  ) {
    FakeRecordRTC.instances.push(this)
  }

  startRecording() {
    this.state = 'recording'
  }

  stopRecording(callback?: () => void) {
    this.state = 'stopped'
    callback?.()
  }

  getBlob() {
    return new Blob(['recorded'], { type: 'video/webm' })
  }

  pauseRecording() {
    this.state = 'paused'
  }

  resumeRecording() {
    this.state = 'recording'
  }

  destroy() {
    this.destroyed = true
  }
}

vi.mock('recordrtc', () => ({ default: FakeRecordRTC }))

/** A MediaStream whose tracks record whether they were stopped. */
const fakeStream = () => {
  const track = {
    stop: vi.fn(),
    kind: 'video',
    enabled: true,
    // The manager reads the negotiated resolution back off the track.
    getSettings: () => ({ width: 1920, height: 1080, frameRate: 30 }),
  }
  return {
    getTracks: () => [track],
    getVideoTracks: () => [track],
    getAudioTracks: () => [],
    _track: track,
  } as unknown as MediaStream & { _track: { stop: ReturnType<typeof vi.fn> } }
}

class FakeMediaRecorder {
  static instances: FakeMediaRecorder[] = []
  static isTypeSupported = vi.fn().mockReturnValue(true)

  state: 'inactive' | 'recording' | 'paused' = 'inactive'
  ondataavailable: ((e: { data: Blob }) => void) | null = null
  onstop: (() => void) | null = null
  onerror: (() => void) | null = null

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
    this.ondataavailable?.({ data: new Blob(['chunk'], { type: 'video/webm' }) })
    this.onstop?.()
  }

  pause() {
    this.state = 'paused'
  }

  resume() {
    this.state = 'recording'
  }
}

let currentStream: ReturnType<typeof fakeStream>

beforeEach(() => {
  vi.useFakeTimers()
  FakeMediaRecorder.instances = []
  FakeRecordRTC.instances = []
  currentStream = fakeStream()

  vi.stubGlobal('MediaRecorder', FakeMediaRecorder)
  Object.defineProperty(navigator, 'mediaDevices', {
    value: { getUserMedia: vi.fn().mockResolvedValue(currentStream) },
    configurable: true,
  })
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})

  useRecordingStore.setState({ isRecording: false, isPaused: false })
})

afterEach(async () => {
  await recordingManager.stopRecording().catch(() => {})
  recordingManager.stopPreviewStream()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('startRecording', () => {
  it('requests media access', async () => {
    await recordingManager.startRecording('video', 'back')

    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled()
  })

  it('marks the store as recording', async () => {
    await recordingManager.startRecording('video', 'back')

    expect(useRecordingStore.getState().isRecording).toBe(true)
  })

  it('becomes active', async () => {
    await recordingManager.startRecording('video', 'back')

    expect(recordingManager.isActive()).toBe(true)
  })

  it('exposes the primary stream for preview', async () => {
    await recordingManager.startRecording('video', 'back')

    expect(recordingManager.getPrimaryStream()).not.toBeNull()
  })

  it('requests audio only for an audio recording', async () => {
    await recordingManager.startRecording('audio', 'back')

    const constraints = vi.mocked(navigator.mediaDevices.getUserMedia).mock.calls[0][0]

    expect(constraints!.video).toBeFalsy()
  })

  it('requests video for a video recording', async () => {
    await recordingManager.startRecording('video', 'back')

    const constraints = vi.mocked(navigator.mediaDevices.getUserMedia).mock.calls[0][0]

    expect(constraints!.video).toBeTruthy()
  })

  it('reports failure when permission is denied instead of throwing', async () => {
    vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValue(
      new DOMException('Permission denied', 'NotAllowedError')
    )

    await expect(recordingManager.startRecording('video', 'back')).resolves.toBe(false)
  })

  it('leaves the store un-started when permission is denied', async () => {
    vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValue(
      new DOMException('Permission denied', 'NotAllowedError')
    )

    await recordingManager.startRecording('video', 'back')

    expect(useRecordingStore.getState().isRecording).toBe(false)
  })
})

describe('stopRecording', () => {
  it('leaves the manager inactive', async () => {
    await recordingManager.startRecording('video', 'back')

    await recordingManager.stopRecording()

    expect(recordingManager.isActive()).toBe(false)
  })

  it('destroys the recorder so it cannot keep buffering', async () => {
    await recordingManager.startRecording('video', 'back')

    await recordingManager.stopRecording()

    expect(FakeRecordRTC.instances[0].destroyed).toBe(true)
  })

  it('releases the camera and microphone tracks', async () => {
    await recordingManager.startRecording('video', 'back')

    await recordingManager.stopRecording()

    expect(currentStream._track.stop).toHaveBeenCalled()
  })

  it('clears the primary stream reference', async () => {
    await recordingManager.startRecording('video', 'back')

    await recordingManager.stopRecording()

    expect(recordingManager.getPrimaryStream()).toBeNull()
  })

  it('resolves even when nothing is recording', async () => {
    await expect(recordingManager.stopRecording()).resolves.toBeUndefined()
  })
})

describe('pause and resume', () => {
  it('marks the store paused', async () => {
    await recordingManager.startRecording('video', 'back')

    recordingManager.pauseRecording()

    expect(useRecordingStore.getState().isPaused).toBe(true)
  })

  it('keeps the recording active while paused', async () => {
    await recordingManager.startRecording('video', 'back')

    recordingManager.pauseRecording()

    expect(recordingManager.isActive()).toBe(true)
  })

  it('clears the paused flag on resume', async () => {
    await recordingManager.startRecording('video', 'back')
    recordingManager.pauseRecording()

    recordingManager.resumeRecording()

    expect(useRecordingStore.getState().isPaused).toBe(false)
  })

  it('pauses the underlying recorder', async () => {
    await recordingManager.startRecording('video', 'back')

    recordingManager.pauseRecording()

    expect(FakeRecordRTC.instances[0].state).toBe('paused')
  })

  it('returns the recorder to recording on resume', async () => {
    await recordingManager.startRecording('video', 'back')
    recordingManager.pauseRecording()

    recordingManager.resumeRecording()

    expect(FakeRecordRTC.instances[0].state).toBe('recording')
  })
})

describe('preview stream', () => {
  it('opens a preview stream', async () => {
    const stream = await recordingManager.getPreviewStream('environment')

    expect(stream).not.toBeNull()
  })

  it('does not capture audio for a preview', async () => {
    await recordingManager.getPreviewStream('environment')

    const constraints = vi.mocked(navigator.mediaDevices.getUserMedia).mock.calls[0][0]

    expect(constraints!.audio).toBe(false)
  })

  it('requests the camera the caller asked for', async () => {
    await recordingManager.getPreviewStream('user')

    const constraints = vi.mocked(navigator.mediaDevices.getUserMedia).mock.calls[0][0]

    expect((constraints!.video as MediaTrackConstraints).facingMode).toBe('user')
  })

  it('exposes the active preview stream', async () => {
    await recordingManager.getPreviewStream('environment')

    expect(recordingManager.getActivePreviewStream()).not.toBeNull()
  })

  it('releases the camera when the preview stops', async () => {
    await recordingManager.getPreviewStream('environment')

    recordingManager.stopPreviewStream()

    expect(currentStream._track.stop).toHaveBeenCalled()
    expect(recordingManager.getActivePreviewStream()).toBeNull()
  })

  it('does not leave the previous preview running when switching cameras', async () => {
    await recordingManager.getPreviewStream('environment')
    const first = currentStream

    currentStream = fakeStream()
    vi.mocked(navigator.mediaDevices.getUserMedia).mockResolvedValue(currentStream)
    await recordingManager.getPreviewStream('user')

    expect(first._track.stop).toHaveBeenCalled()
  })

  it('returns null rather than throwing when the camera is unavailable', async () => {
    vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValue(
      new DOMException('No camera', 'NotFoundError')
    )

    await expect(recordingManager.getPreviewStream('environment')).resolves.toBeNull()
  })
})

describe('isActive', () => {
  it('is false before anything starts', () => {
    expect(recordingManager.isActive()).toBe(false)
  })
})
