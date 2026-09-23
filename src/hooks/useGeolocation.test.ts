import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useGeolocation } from './useGeolocation'

const position = (latitude: number, longitude: number, accuracy = 10) =>
  ({ coords: { latitude, longitude, accuracy } }) as GeolocationPosition

/** Mirrors the numeric codes the browser uses on GeolocationPositionError. */
const positionError = (code: number) =>
  ({
    code,
    PERMISSION_DENIED: 1,
    POSITION_UNAVAILABLE: 2,
    TIMEOUT: 3,
  }) as GeolocationPositionError

const geolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn().mockReturnValue(42),
  clearWatch: vi.fn(),
}

beforeEach(() => {
  Object.defineProperty(navigator, 'geolocation', {
    value: geolocation,
    configurable: true,
  })
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('useGeolocation', () => {
  it('starts with no location and no error', () => {
    const { result } = renderHook(() => useGeolocation())

    expect(result.current).toMatchObject({
      latitude: null,
      longitude: null,
      error: null,
      loading: false,
      hasLocation: false,
    })
  })

  it('stores a successful fix', async () => {
    geolocation.getCurrentPosition.mockImplementation((onSuccess) =>
      onSuccess(position(42.36, -71.06))
    )
    const { result } = renderHook(() => useGeolocation())

    act(() => result.current.getLocation())

    await waitFor(() => expect(result.current.hasLocation).toBe(true))
    expect(result.current).toMatchObject({ latitude: 42.36, longitude: -71.06 })
  })

  it('clears loading once a fix arrives', async () => {
    geolocation.getCurrentPosition.mockImplementation((onSuccess) =>
      onSuccess(position(1, 2))
    )
    const { result } = renderHook(() => useGeolocation())

    act(() => result.current.getLocation())

    await waitFor(() => expect(result.current.loading).toBe(false))
  })

  it.each([
    [1, 'Location permission denied'],
    [2, 'Location unavailable'],
    [3, 'Location request timed out'],
    [99, 'An unknown error occurred'],
  ])('maps error code %i to a readable message', async (code, message) => {
    geolocation.getCurrentPosition.mockImplementation((_s, onError) =>
      onError(positionError(code))
    )
    const { result } = renderHook(() => useGeolocation())

    act(() => result.current.getLocation())

    await waitFor(() => expect(result.current.error).toBe(message))
  })

  it('reports an unsupported browser without throwing', async () => {
    Object.defineProperty(navigator, 'geolocation', {
      value: undefined,
      configurable: true,
    })
    const { result } = renderHook(() => useGeolocation())

    act(() => result.current.getLocation())

    await waitFor(() =>
      expect(result.current.error).toBe('Geolocation is not supported by your browser')
    )
  })

  it('passes the requested accuracy options through', () => {
    const { result } = renderHook(() =>
      useGeolocation({ enableHighAccuracy: false, timeout: 5000, maximumAge: 1000 })
    )

    act(() => result.current.getLocation())

    expect(geolocation.getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 1000 }
    )
  })

  it('does not watch position unless asked', () => {
    renderHook(() => useGeolocation())

    expect(geolocation.watchPosition).not.toHaveBeenCalled()
  })

  it('watches position when asked', () => {
    renderHook(() => useGeolocation({ watch: true }))

    expect(geolocation.watchPosition).toHaveBeenCalledTimes(1)
  })

  it('clears the watch on unmount, so it cannot drain battery', () => {
    const { unmount } = renderHook(() => useGeolocation({ watch: true }))

    unmount()

    expect(geolocation.clearWatch).toHaveBeenCalledWith(42)
  })

  it('clears a previous error when a new request starts', async () => {
    geolocation.getCurrentPosition.mockImplementationOnce((_s, onError) =>
      onError(positionError(1))
    )
    const { result } = renderHook(() => useGeolocation())
    act(() => result.current.getLocation())
    await waitFor(() => expect(result.current.error).not.toBeNull())

    geolocation.getCurrentPosition.mockImplementationOnce((onSuccess) =>
      onSuccess(position(1, 2))
    )
    act(() => result.current.getLocation())

    await waitFor(() => expect(result.current.error).toBeNull())
  })
})

describe('getImpreciseLocation', () => {
  it('returns null before any fix', () => {
    const { result } = renderHook(() => useGeolocation())

    expect(result.current.getImpreciseLocation()).toBeNull()
  })

  it('rounds coordinates to two decimals for privacy', async () => {
    geolocation.getCurrentPosition.mockImplementation((onSuccess) =>
      onSuccess(position(42.36159, -71.06529))
    )
    const { result } = renderHook(() => useGeolocation())
    act(() => result.current.getLocation())
    await waitFor(() => expect(result.current.hasLocation).toBe(true))

    expect(result.current.getImpreciseLocation()).toEqual({
      latitude: 42.36,
      longitude: -71.07,
    })
  })

  it('discards precision beyond two decimals rather than exposing it', async () => {
    geolocation.getCurrentPosition.mockImplementation((onSuccess) =>
      onSuccess(position(42.361594789, -71.065291234))
    )
    const { result } = renderHook(() => useGeolocation())
    act(() => result.current.getLocation())
    await waitFor(() => expect(result.current.hasLocation).toBe(true))

    const imprecise = result.current.getImpreciseLocation()!

    expect(String(imprecise.latitude).split('.')[1].length).toBeLessThanOrEqual(2)
  })

  it('handles negative coordinates correctly', async () => {
    geolocation.getCurrentPosition.mockImplementation((onSuccess) =>
      onSuccess(position(-33.8688, 151.2093))
    )
    const { result } = renderHook(() => useGeolocation())
    act(() => result.current.getLocation())
    await waitFor(() => expect(result.current.hasLocation).toBe(true))

    expect(result.current.getImpreciseLocation()).toEqual({
      latitude: -33.87,
      longitude: 151.21,
    })
  })
})
