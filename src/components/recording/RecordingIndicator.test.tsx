import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecordingIndicator } from './RecordingIndicator'
import { useRecordingStore } from '@/stores/recordingStore'

const manager = {
  stopRecording: vi.fn().mockResolvedValue(undefined),
  pauseRecording: vi.fn(),
  resumeRecording: vi.fn(),
}

vi.mock('@/hooks/useEnhancedRecording', () => ({
  useEnhancedRecording: () => manager,
}))

const recording = (overrides = {}) =>
  useRecordingStore.setState({
    isRecording: true,
    isPaused: false,
    recordingTime: 65,
    recordingType: 'video',
    cameraMode: 'back',
    ...overrides,
  })

beforeEach(() => {
  useRecordingStore.setState({ isRecording: false, isPaused: false, recordingTime: 0 })
})

afterEach(() => vi.clearAllMocks())

describe('RecordingIndicator visibility', () => {
  it('stays hidden when nothing is recording', () => {
    const { container } = render(<RecordingIndicator />)

    expect(container).toBeEmptyDOMElement()
  })

  it('appears while recording', () => {
    recording()

    render(<RecordingIndicator />)

    expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument()
  })
})

describe('elapsed time', () => {
  it('shows the elapsed time in minutes and seconds', () => {
    recording({ recordingTime: 65 })

    render(<RecordingIndicator />)

    expect(screen.getByText('01:05')).toBeInTheDocument()
  })

  it('shows zero at the start', () => {
    recording({ recordingTime: 0 })

    render(<RecordingIndicator />)

    expect(screen.getByText('00:00')).toBeInTheDocument()
  })
})

describe('camera label', () => {
  it.each([
    ['back', 'Back'],
    ['front', 'Front'],
    ['both', 'Both'],
  ])('labels the %s camera mode', (mode, label) => {
    recording({ cameraMode: mode })

    render(<RecordingIndicator />)

    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it('omits the camera label for an audio recording', () => {
    recording({ recordingType: 'audio', cameraMode: 'back' })

    render(<RecordingIndicator />)

    expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument()
  })
})

describe('controls', () => {
  it('stops the recording', async () => {
    recording()
    render(<RecordingIndicator />)

    await userEvent.click(screen.getByRole('button', { name: /stop/i }))

    expect(manager.stopRecording).toHaveBeenCalledTimes(1)
  })

  it('notifies the caller after stopping', async () => {
    const onStopClick = vi.fn()
    recording()
    render(<RecordingIndicator onStopClick={onStopClick} />)

    await userEvent.click(screen.getByRole('button', { name: /stop/i }))

    expect(onStopClick).toHaveBeenCalledTimes(1)
  })

  it('pauses an active recording', async () => {
    recording({ isPaused: false })
    render(<RecordingIndicator />)

    await userEvent.click(screen.getByRole('button', { name: /pause/i }))

    expect(manager.pauseRecording).toHaveBeenCalledTimes(1)
  })

  it('resumes a paused recording', async () => {
    recording({ isPaused: true })
    render(<RecordingIndicator />)

    await userEvent.click(screen.getByRole('button', { name: /resume/i }))

    expect(manager.resumeRecording).toHaveBeenCalledTimes(1)
  })

  it('applies a caller supplied class', () => {
    recording()

    const { container } = render(<RecordingIndicator className="fixed" />)

    expect(container.firstChild).toHaveClass('fixed')
  })
})
