import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePanicButton } from './usePanicButton'

const contacts = [{ name: 'Rosa', phone: '5551234567' }]

const config = (overrides = {}) => ({
  enabled: true,
  contacts,
  includeLocation: false,
  ...overrides,
})

const okResponse = { ok: true, json: async () => ({}) }

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okResponse))
  Object.defineProperty(navigator, 'geolocation', {
    value: { getCurrentPosition: vi.fn(), watchPosition: vi.fn(), clearWatch: vi.fn() },
    configurable: true,
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('isConfigured', () => {
  it('is true when enabled with contacts', () => {
    const { result } = renderHook(() => usePanicButton(config()))

    expect(result.current.isConfigured).toBe(true)
  })

  it('is false when disabled', () => {
    const { result } = renderHook(() => usePanicButton(config({ enabled: false })))

    expect(result.current.isConfigured).toBe(false)
  })

  it('is false with no contacts', () => {
    const { result } = renderHook(() => usePanicButton(config({ contacts: [] })))

    expect(result.current.isConfigured).toBe(false)
  })
})

describe('sendAlert', () => {
  it('posts the alert to the panic endpoint', async () => {
    const { result } = renderHook(() => usePanicButton(config()))

    await act(async () => {
      await result.current.sendAlert()
    })

    expect(fetch).toHaveBeenCalledWith('/api/panic', expect.objectContaining({
      method: 'POST',
    }))
  })

  it('includes every contact in the payload', async () => {
    const { result } = renderHook(() => usePanicButton(config()))

    await act(async () => {
      await result.current.sendAlert()
    })

    const body = JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string)

    expect(body.contacts).toEqual(contacts)
  })

  it('reports success', async () => {
    const { result } = renderHook(() => usePanicButton(config()))

    let sent: boolean | undefined
    await act(async () => {
      sent = await result.current.sendAlert()
    })

    expect(sent).toBe(true)
    expect(result.current.isActivated).toBe(true)
  })

  it('refuses to send when not configured', async () => {
    const { result } = renderHook(() => usePanicButton(config({ contacts: [] })))

    let sent: boolean | undefined
    await act(async () => {
      sent = await result.current.sendAlert()
    })

    expect(sent).toBe(false)
    expect(fetch).not.toHaveBeenCalled()
    expect(result.current.error).toBe('Panic button not configured')
  })

  it('surfaces a network failure instead of claiming success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    const { result } = renderHook(() => usePanicButton(config()))

    let sent: boolean | undefined
    await act(async () => {
      sent = await result.current.sendAlert()
    })

    expect(sent).toBe(false)
    expect(result.current.error).toBe('Failed to send alert')
    expect(result.current.isActivated).toBe(false)
  })

  it('surfaces a server error response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    const { result } = renderHook(() => usePanicButton(config()))

    await act(async () => {
      await result.current.sendAlert()
    })

    expect(result.current.error).toBe('Failed to send alert')
  })

  it('uses a custom message when one is configured', async () => {
    const { result } = renderHook(() =>
      usePanicButton(config({ customMessage: 'Help me now' }))
    )

    await act(async () => {
      await result.current.sendAlert()
    })

    const body = JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string)

    expect(body.message).toBe('Help me now')
  })

  it('sends a default message when none is configured', async () => {
    const { result } = renderHook(() => usePanicButton(config()))

    await act(async () => {
      await result.current.sendAlert()
    })

    const body = JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string)

    expect(body.message).toContain('Emergency alert activated')
  })

  it('omits location when location sharing is off', async () => {
    const { result } = renderHook(() => usePanicButton(config()))

    await act(async () => {
      await result.current.sendAlert()
    })

    const body = JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string)

    expect(body.location).toBeNull()
  })

  it('still sends the alert when location is enabled but unavailable', async () => {
    const { result } = renderHook(() =>
      usePanicButton(config({ includeLocation: true }))
    )

    let sent: boolean | undefined
    await act(async () => {
      sent = await result.current.sendAlert()
    })

    expect(sent).toBe(true)
  })

  it('vibrates for confirmation when the device supports it', async () => {
    const vibrate = vi.fn()
    Object.defineProperty(navigator, 'vibrate', { value: vibrate, configurable: true })
    const { result } = renderHook(() => usePanicButton(config()))

    await act(async () => {
      await result.current.sendAlert()
    })

    expect(vibrate).toHaveBeenCalled()
    delete (navigator as { vibrate?: unknown }).vibrate
  })
})

describe('long press activation', () => {
  it('does not fire before the hold completes', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => usePanicButton(config()))

    act(() => result.current.handlePressStart())
    await act(async () => {
      vi.advanceTimersByTime(1999)
    })

    expect(fetch).not.toHaveBeenCalled()
  })

  it('fires after a two second hold', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => usePanicButton(config()))

    act(() => result.current.handlePressStart())
    await act(async () => {
      vi.advanceTimersByTime(2000)
    })

    expect(fetch).toHaveBeenCalled()
  })

  it('cancels when the press is released early', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => usePanicButton(config()))

    act(() => result.current.handlePressStart())
    await act(async () => {
      vi.advanceTimersByTime(1000)
    })
    act(() => result.current.handlePressEnd())
    await act(async () => {
      vi.advanceTimersByTime(2000)
    })

    expect(fetch).not.toHaveBeenCalled()
  })

  it('ignores a press when the panic button is disabled', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => usePanicButton(config({ enabled: false })))

    act(() => result.current.handlePressStart())
    await act(async () => {
      vi.advanceTimersByTime(3000)
    })

    expect(fetch).not.toHaveBeenCalled()
  })

  it('shows an activating state while held', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => usePanicButton(config()))

    act(() => result.current.handlePressStart())

    expect(result.current.isActivating).toBe(true)
  })

  it('clears the activating state on release', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => usePanicButton(config()))
    act(() => result.current.handlePressStart())

    act(() => result.current.handlePressEnd())

    expect(result.current.isActivating).toBe(false)
  })
})

describe('triple tap activation', () => {
  it('does not fire on two quick taps', async () => {
    const { result } = renderHook(() => usePanicButton(config()))

    await act(async () => {
      result.current.handleTap()
      result.current.handleTap()
    })

    expect(fetch).not.toHaveBeenCalled()
  })

  it('fires on three quick taps', async () => {
    const { result } = renderHook(() => usePanicButton(config()))

    await act(async () => {
      result.current.handleTap()
      result.current.handleTap()
      result.current.handleTap()
    })

    expect(fetch).toHaveBeenCalled()
  })

  it('does not fire on taps spread too far apart', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => usePanicButton(config()))

    await act(async () => {
      result.current.handleTap()
      vi.advanceTimersByTime(600)
      result.current.handleTap()
      vi.advanceTimersByTime(600)
      result.current.handleTap()
    })

    expect(fetch).not.toHaveBeenCalled()
  })

  it('ignores taps when disabled', async () => {
    const { result } = renderHook(() => usePanicButton(config({ enabled: false })))

    await act(async () => {
      result.current.handleTap()
      result.current.handleTap()
      result.current.handleTap()
    })

    expect(fetch).not.toHaveBeenCalled()
  })
})

describe('reset', () => {
  it('clears the activated state', async () => {
    const { result } = renderHook(() => usePanicButton(config()))
    await act(async () => {
      await result.current.sendAlert()
    })

    act(() => result.current.reset())

    expect(result.current.isActivated).toBe(false)
    expect(result.current.error).toBeNull()
  })
})
