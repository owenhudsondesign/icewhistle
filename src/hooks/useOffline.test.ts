import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useOffline } from './useOffline'
import { getOfflineQueue } from '@/lib/offline'

const setOnline = (value: boolean) =>
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(value)

beforeEach(() => {
  setOnline(true)
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useOffline', () => {
  it('reports online when the browser is online', async () => {
    const { result } = renderHook(() => useOffline())

    await waitFor(() => expect(result.current.online).toBe(true))
    expect(result.current.offline).toBe(false)
  })

  it('reports offline when the browser starts offline', async () => {
    setOnline(false)

    const { result } = renderHook(() => useOffline())

    await waitFor(() => expect(result.current.offline).toBe(true))
  })

  it('reacts to going offline mid-session', async () => {
    const { result } = renderHook(() => useOffline())
    await waitFor(() => expect(result.current.online).toBe(true))

    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    expect(result.current.offline).toBe(true)
  })

  it('reacts to coming back online', async () => {
    setOnline(false)
    const { result } = renderHook(() => useOffline())
    await waitFor(() => expect(result.current.offline).toBe(true))

    act(() => {
      window.dispatchEvent(new Event('online'))
    })

    expect(result.current.online).toBe(true)
  })

  it('queues an action with a timestamp', async () => {
    const { result } = renderHook(() => useOffline())
    await waitFor(() => expect(result.current.online).toBe(true))

    act(() => result.current.queueAction('panic_alert', { contacts: 2 }))

    expect(getOfflineQueue()[0]).toMatchObject({
      type: 'panic_alert',
      payload: { contacts: 2 },
    })
    expect(getOfflineQueue()[0].timestamp).toBeGreaterThan(0)
  })

  it('processes the queue while online', async () => {
    const { result } = renderHook(() => useOffline())
    await waitFor(() => expect(result.current.online).toBe(true))
    act(() => result.current.queueAction('alert', {}))
    const processor = vi.fn().mockResolvedValue(undefined)

    await act(async () => {
      await result.current.processQueue(processor)
    })

    expect(processor).toHaveBeenCalledTimes(1)
  })

  it('holds the queue while offline rather than dropping it', async () => {
    setOnline(false)
    const { result } = renderHook(() => useOffline())
    await waitFor(() => expect(result.current.offline).toBe(true))
    act(() => result.current.queueAction('alert', {}))
    const processor = vi.fn()

    await act(async () => {
      await result.current.processQueue(processor)
    })

    expect(processor).not.toHaveBeenCalled()
    expect(getOfflineQueue()).toHaveLength(1)
  })

  it('stops listening after unmount', async () => {
    const { result, unmount } = renderHook(() => useOffline())
    await waitFor(() => expect(result.current.online).toBe(true))

    unmount()

    expect(() => window.dispatchEvent(new Event('offline'))).not.toThrow()
  })
})
