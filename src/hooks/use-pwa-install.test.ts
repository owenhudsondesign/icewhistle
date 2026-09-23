import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { track } from '@vercel/analytics'
import { usePWAInstall } from './use-pwa-install'

const mockTrack = vi.mocked(track)

/** Builds the beforeinstallprompt event Chrome fires, with a stubbed choice. */
const installPromptEvent = (outcome: 'accepted' | 'dismissed') => {
  const event = new Event('beforeinstallprompt') as Event & {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
  }
  event.prompt = vi.fn().mockResolvedValue(undefined)
  event.userChoice = Promise.resolve({ outcome })
  return event
}

const setUserAgent = (ua: string) =>
  vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(ua)

const IPHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
const ANDROID_UA = 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120'

/** jsdom has no matchMedia; standalone drives the "already installed" branch. */
const setStandalone = (matches: boolean) => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as unknown as typeof window.matchMedia
}

beforeEach(() => {
  setStandalone(false)
  setUserAgent(ANDROID_UA)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('usePWAInstall - already installed', () => {
  it('detects a standalone display mode', async () => {
    setStandalone(true)

    const { result } = renderHook(() => usePWAInstall())

    await waitFor(() => expect(result.current.isInstalled).toBe(true))
  })

  it('reports a standalone session for measurement', async () => {
    setStandalone(true)

    renderHook(() => usePWAInstall())

    await waitFor(() =>
      expect(mockTrack).toHaveBeenCalledWith('pwa_session_standalone', {
        platform: 'android_or_desktop',
      })
    )
  })

  it('does not offer an install when already installed', async () => {
    setStandalone(true)

    const { result } = renderHook(() => usePWAInstall())

    await waitFor(() => expect(result.current.canInstall).toBe(false))
  })
})

describe('usePWAInstall - iOS', () => {
  it('flags an iPhone as the iOS install path', async () => {
    setUserAgent(IPHONE_UA)

    const { result } = renderHook(() => usePWAInstall())

    await waitFor(() => expect(result.current.isIOS).toBe(true))
  })

  it('treats an iOS home screen launch as installed', async () => {
    setUserAgent(IPHONE_UA)
    Object.defineProperty(navigator, 'standalone', { value: true, configurable: true })

    const { result } = renderHook(() => usePWAInstall())

    await waitFor(() => expect(result.current.isInstalled).toBe(true))
    delete (navigator as { standalone?: boolean }).standalone
  })

  it('reports an iOS standalone session tagged as ios', async () => {
    setUserAgent(IPHONE_UA)
    Object.defineProperty(navigator, 'standalone', { value: true, configurable: true })

    renderHook(() => usePWAInstall())

    await waitFor(() =>
      expect(mockTrack).toHaveBeenCalledWith('pwa_session_standalone', {
        platform: 'ios',
      })
    )
    delete (navigator as { standalone?: boolean }).standalone
  })

  it('never reports canInstall on iOS, since there is no install API', async () => {
    setUserAgent(IPHONE_UA)

    const { result } = renderHook(() => usePWAInstall())

    await waitFor(() => expect(result.current.isIOS).toBe(true))
    expect(result.current.canInstall).toBe(false)
  })
})

describe('usePWAInstall - native prompt', () => {
  it('becomes installable when the browser offers a prompt', async () => {
    const { result } = renderHook(() => usePWAInstall())

    act(() => {
      window.dispatchEvent(installPromptEvent('accepted'))
    })

    await waitFor(() => expect(result.current.canInstall).toBe(true))
  })

  it('reports availability exactly once even if the browser re-fires', async () => {
    const { result } = renderHook(() => usePWAInstall())

    act(() => {
      window.dispatchEvent(installPromptEvent('accepted'))
      window.dispatchEvent(installPromptEvent('accepted'))
      window.dispatchEvent(installPromptEvent('accepted'))
    })

    await waitFor(() => expect(result.current.canInstall).toBe(true))
    expect(
      mockTrack.mock.calls.filter(([name]) => name === 'pwa_install_available')
    ).toHaveLength(1)
  })

  it('returns false from promptInstall when nothing is deferred', async () => {
    const { result } = renderHook(() => usePWAInstall())

    await expect(result.current.promptInstall()).resolves.toBe(false)
  })

  it('records an accepted choice', async () => {
    const { result } = renderHook(() => usePWAInstall())
    act(() => {
      window.dispatchEvent(installPromptEvent('accepted'))
    })
    await waitFor(() => expect(result.current.canInstall).toBe(true))

    await act(async () => {
      await result.current.promptInstall()
    })

    expect(mockTrack).toHaveBeenCalledWith('pwa_install_prompt_response', {
      platform: 'native',
      outcome: 'accepted',
    })
  })

  it('records a dismissed choice', async () => {
    const { result } = renderHook(() => usePWAInstall())
    act(() => {
      window.dispatchEvent(installPromptEvent('dismissed'))
    })
    await waitFor(() => expect(result.current.canInstall).toBe(true))

    await act(async () => {
      await result.current.promptInstall()
    })

    expect(mockTrack).toHaveBeenCalledWith('pwa_install_prompt_response', {
      platform: 'native',
      outcome: 'dismissed',
    })
  })

  it('marks the app installed after the user accepts', async () => {
    const { result } = renderHook(() => usePWAInstall())
    act(() => {
      window.dispatchEvent(installPromptEvent('accepted'))
    })
    await waitFor(() => expect(result.current.canInstall).toBe(true))

    await act(async () => {
      await result.current.promptInstall()
    })

    expect(result.current.isInstalled).toBe(true)
  })

  it('stays uninstalled after the user dismisses', async () => {
    const { result } = renderHook(() => usePWAInstall())
    act(() => {
      window.dispatchEvent(installPromptEvent('dismissed'))
    })
    await waitFor(() => expect(result.current.canInstall).toBe(true))

    await act(async () => {
      await result.current.promptInstall()
    })

    expect(result.current.isInstalled).toBe(false)
  })

  it('counts an appinstalled event once per device', async () => {
    renderHook(() => usePWAInstall())

    act(() => {
      window.dispatchEvent(new Event('appinstalled'))
      window.dispatchEvent(new Event('appinstalled'))
    })

    await waitFor(() =>
      expect(
        mockTrack.mock.calls.filter(([name]) => name === 'pwa_installed')
      ).toHaveLength(1)
    )
  })

  it('stops listening once unmounted', async () => {
    const { unmount } = renderHook(() => usePWAInstall())
    unmount()

    act(() => {
      window.dispatchEvent(installPromptEvent('accepted'))
    })

    expect(
      mockTrack.mock.calls.filter(([name]) => name === 'pwa_install_available')
    ).toHaveLength(0)
  })
})
