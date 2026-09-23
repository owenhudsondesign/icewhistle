import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  FeatureFlagsProvider,
  useFeatureFlags,
  useFeatureFlag,
} from './use-feature-flags'

const mockFetch = (flags: Record<string, boolean>, ok = true) =>
  vi.fn().mockResolvedValue({
    ok,
    json: async () => ({ flags }),
  })

const wrapper =
  (platform?: 'web' | 'ios' | 'android') =>
  ({ children }: { children: ReactNode }) => (
    <FeatureFlagsProvider initialPlatform={platform}>{children}</FeatureFlagsProvider>
  )

const renderFlags = async (platform?: 'web' | 'ios' | 'android') => {
  const hook = renderHook(() => useFeatureFlags(), { wrapper: wrapper(platform) })
  await waitFor(() => expect(hook.result.current.isLoading).toBe(false))
  return hook
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.stubGlobal('fetch', mockFetch({}))
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('useFeatureFlags', () => {
  it('throws outside a provider, rather than silently returning nothing', () => {
    expect(() => renderHook(() => useFeatureFlags())).toThrow(
      /must be used within a FeatureFlagsProvider/
    )
  })

  it('finishes loading', async () => {
    const { result } = await renderFlags()

    expect(result.current.isLoading).toBe(false)
  })

  it('merges server flags over the defaults', async () => {
    vi.stubGlobal('fetch', mockFetch({ maintenance_mode: true }))

    const { result } = await renderFlags()

    expect(result.current.flags.maintenance_mode).toBe(true)
    expect(result.current.flags.push_enabled).toBe(true)
  })

  it('requests flags for the active platform', async () => {
    await renderFlags('ios')

    expect(fetch).toHaveBeenCalledWith('/api/feature-flags?platform=ios')
  })

  it('keeps safe defaults when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    const { result } = await renderFlags()

    expect(result.current.flags.reporting_view_enabled_web).toBe(true)
    expect(result.current.error).toBe('offline')
  })

  it('keeps safe defaults on a non-ok response', async () => {
    vi.stubGlobal('fetch', mockFetch({}, false))

    const { result } = await renderFlags()

    expect(result.current.error).toBe('Failed to fetch feature flags')
    expect(result.current.flags.maintenance_mode).toBe(false)
  })
})

describe('computed flags', () => {
  it('allows submitting on web by default', async () => {
    const { result } = await renderFlags('web')

    expect(result.current.canSubmitReports).toBe(true)
  })

  it('blocks submitting on iOS by default', async () => {
    const { result } = await renderFlags('ios')

    expect(result.current.canSubmitReports).toBe(false)
  })

  it('blocks submitting during maintenance', async () => {
    vi.stubGlobal('fetch', mockFetch({ maintenance_mode: true }))

    const { result } = await renderFlags('web')

    expect(result.current.canSubmitReports).toBe(false)
  })

  it('blocks viewing during maintenance', async () => {
    vi.stubGlobal('fetch', mockFetch({ maintenance_mode: true }))

    const { result } = await renderFlags('web')

    expect(result.current.canViewReports).toBe(false)
  })

  it('honours the emergency kill switch over everything else', async () => {
    vi.stubGlobal(
      'fetch',
      mockFetch({ emergency_disable_all: true, reporting_submit_enabled_web: true })
    )

    const { result } = await renderFlags('web')

    expect(result.current.canSubmitReports).toBe(false)
    expect(result.current.canViewReports).toBe(false)
  })

  it('reports maintenance mode when the kill switch is on', async () => {
    vi.stubGlobal('fetch', mockFetch({ emergency_disable_all: true }))

    const { result } = await renderFlags('web')

    expect(result.current.isMaintenanceMode).toBe(true)
  })

  it('is not in maintenance mode by default', async () => {
    const { result } = await renderFlags('web')

    expect(result.current.isMaintenanceMode).toBe(false)
  })
})

describe('refetch', () => {
  it('picks up flags changed since the last fetch', async () => {
    vi.stubGlobal('fetch', mockFetch({ maintenance_mode: false }))
    const { result } = await renderFlags('web')

    vi.stubGlobal('fetch', mockFetch({ maintenance_mode: true }))
    await act(async () => {
      await result.current.refetch()
    })

    expect(result.current.flags.maintenance_mode).toBe(true)
  })
})

describe('useFeatureFlag', () => {
  it('returns the default before the request resolves', () => {
    const { result } = renderHook(() => useFeatureFlag('push_enabled', true))

    expect(result.current).toBe(true)
  })

  it('returns the server value once loaded', async () => {
    vi.stubGlobal('fetch', mockFetch({ push_enabled: false }))

    const { result } = renderHook(() => useFeatureFlag('push_enabled', true))

    await waitFor(() => expect(result.current).toBe(false))
  })

  it('keeps the default for a flag the server does not know', async () => {
    vi.stubGlobal('fetch', mockFetch({ other_flag: true }))

    const { result } = renderHook(() => useFeatureFlag('unknown_flag', true))

    await waitFor(() => expect(fetch).toHaveBeenCalled())
    expect(result.current).toBe(true)
  })

  it('keeps the default when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    const { result } = renderHook(() => useFeatureFlag('push_enabled', true))

    await waitFor(() => expect(fetch).toHaveBeenCalled())
    expect(result.current).toBe(true)
  })
})
