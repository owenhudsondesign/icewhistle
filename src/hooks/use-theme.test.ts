import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useTheme } from './use-theme'

const STORAGE_KEY = 'icewhistle-theme'

const setSystemDark = (matches: boolean) => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as unknown as typeof window.matchMedia
}

beforeEach(() => {
  document.documentElement.classList.remove('dark')
  setSystemDark(false)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useTheme', () => {
  it('defaults to dark when nothing is stored', async () => {
    const { result } = renderHook(() => useTheme())

    await waitFor(() => expect(result.current.theme).toBe('dark'))
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('restores a stored light theme', async () => {
    localStorage.setItem(STORAGE_KEY, 'light')

    const { result } = renderHook(() => useTheme())

    await waitFor(() => expect(result.current.theme).toBe('light'))
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('restores a stored dark theme', async () => {
    localStorage.setItem(STORAGE_KEY, 'dark')

    const { result } = renderHook(() => useTheme())

    await waitFor(() => expect(result.current.theme).toBe('dark'))
  })

  it('follows a dark system preference when set to system', async () => {
    localStorage.setItem(STORAGE_KEY, 'system')
    setSystemDark(true)

    renderHook(() => useTheme())

    await waitFor(() =>
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    )
  })

  it('follows a light system preference when set to system', async () => {
    localStorage.setItem(STORAGE_KEY, 'system')
    setSystemDark(false)

    renderHook(() => useTheme())

    await waitFor(() =>
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    )
  })

  it('persists an explicit choice', async () => {
    const { result } = renderHook(() => useTheme())
    await waitFor(() => expect(result.current.mounted).toBe(true))

    act(() => result.current.setTheme('light'))

    expect(localStorage.getItem(STORAGE_KEY)).toBe('light')
  })

  it('toggles from dark to light', async () => {
    const { result } = renderHook(() => useTheme())
    await waitFor(() => expect(result.current.theme).toBe('dark'))

    act(() => result.current.toggleTheme())

    expect(result.current.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('toggles from light back to dark', async () => {
    localStorage.setItem(STORAGE_KEY, 'light')
    const { result } = renderHook(() => useTheme())
    await waitFor(() => expect(result.current.theme).toBe('light'))

    act(() => result.current.toggleTheme())

    expect(result.current.theme).toBe('dark')
  })

  it('reports isDark true once mounted in dark mode', async () => {
    const { result } = renderHook(() => useTheme())

    await waitFor(() => expect(result.current.mounted).toBe(true))
    expect(result.current.isDark).toBe(true)
  })

  it('reports isDark false in light mode', async () => {
    localStorage.setItem(STORAGE_KEY, 'light')

    const { result } = renderHook(() => useTheme())

    await waitFor(() => expect(result.current.mounted).toBe(true))
    expect(result.current.isDark).toBe(false)
  })
})
