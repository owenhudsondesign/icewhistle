import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecordingModal } from './RecordingModal'
import { useRecordingStore } from '@/stores/recordingStore'

const push = vi.fn()
const startRecording = vi.fn().mockResolvedValue(true)
const stopRecording = vi.fn().mockResolvedValue(undefined)
const saveRecording = vi.fn()
const discardRecording = vi.fn()

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))

vi.mock('@/hooks/useEnhancedRecording', () => ({
  useEnhancedRecording: () => ({
    startRecording,
    stopRecording,
    saveRecording,
    discardRecording,
  }),
}))

vi.mock('@/lib/recording-manager', () => ({
  recordingManager: {
    getPreviewStream: vi.fn().mockResolvedValue(null),
    stopPreviewStream: vi.fn(),
  },
}))

vi.mock('@/components/emergency-contacts', () => ({
  AlertContactsButton: () => <button>Alert My Contacts</button>,
}))

const props = {
  isOpen: true,
  onClose: vi.fn(),
  onContinueWithoutRecording: vi.fn(),
  language: 'en',
}

const renderModal = (overrides = {}) => {
  const merged = { ...props, ...overrides }
  render(<RecordingModal {...merged} />)
  return merged
}

beforeEach(() => {
  useRecordingStore.setState({ isRecording: false, isPaused: false, recordingTime: 0 })
  startRecording.mockResolvedValue(true)
})

afterEach(() => vi.clearAllMocks())

describe('visibility', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<RecordingModal {...props} isOpen={false} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders when open', () => {
    renderModal()

    expect(screen.getByText(/record video/i)).toBeInTheDocument()
  })
})

describe('choosing what to record', () => {
  it('offers video and audio', () => {
    renderModal()

    expect(screen.getByText(/record video/i)).toBeInTheDocument()
    expect(screen.getByText(/record audio only/i)).toBeInTheDocument()
  })

  it('offers a way to continue without recording', () => {
    renderModal()

    expect(screen.getByText(/continue without recording/i)).toBeInTheDocument()
  })

  it('offers alerting contacts as an alternative to recording', () => {
    renderModal()

    expect(screen.getByText(/alert my contacts/i)).toBeInTheDocument()
  })

  it('asks which camera to use for video', async () => {
    renderModal()

    await userEvent.click(screen.getByText(/record video/i))

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /start recording/i })).toBeInTheDocument()
    )
  })

  it('starts an audio recording immediately, with no camera step', async () => {
    renderModal()

    await userEvent.click(screen.getByText(/record audio only/i))

    await waitFor(() => expect(startRecording).toHaveBeenCalledWith('audio', 'back'))
  })

  it('navigates to the encounter guide when continuing without recording', async () => {
    renderModal()

    await userEvent.click(screen.getByText(/continue without recording/i))

    expect(push).toHaveBeenCalledWith('/encounter')
  })
})

describe('starting a video recording', () => {
  const reachCameraStep = async () => {
    renderModal()
    await userEvent.click(screen.getByText(/record video/i))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /start recording/i })).toBeInTheDocument()
    )
  }

  it('starts with the chosen camera', async () => {
    await reachCameraStep()

    await userEvent.click(screen.getByRole('button', { name: /start recording/i }))

    await waitFor(() => expect(startRecording).toHaveBeenCalledWith('video', 'back'))
  })

  it('moves to the encounter guide once recording begins', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    await reachCameraStep()

    await userEvent.click(screen.getByRole('button', { name: /start recording/i }))
    await waitFor(() => expect(startRecording).toHaveBeenCalled())
    await vi.advanceTimersByTimeAsync(600)

    expect(push).toHaveBeenCalledWith('/encounter')
    vi.useRealTimers()
  })

  it('stays on the camera step when recording fails to start', async () => {
    startRecording.mockResolvedValue(false)
    await reachCameraStep()

    await userEvent.click(screen.getByRole('button', { name: /start recording/i }))

    await waitFor(() => expect(startRecording).toHaveBeenCalled())
    expect(push).not.toHaveBeenCalled()
  })
})

describe('translations', () => {
  it('renders Spanish copy', () => {
    renderModal({ language: 'es' })

    expect(screen.getByText(/grabar video/i)).toBeInTheDocument()
  })

  it('falls back to English for an unsupported language', () => {
    renderModal({ language: 'zz' })

    expect(screen.getByText(/record video/i)).toBeInTheDocument()
  })
})
