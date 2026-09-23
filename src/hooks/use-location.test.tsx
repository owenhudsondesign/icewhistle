import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { LocationProvider, useLocation, geocodeZipCode } from './use-location'

const STORAGE_KEY = 'icewhistle-location'

const location = {
  zipCode: '02139',
  lat: 42.36,
  lng: -71.06,
  city: 'Cambridge',
}

const wrapper = ({ children }: { children: ReactNode }) => (
  <LocationProvider>{children}</LocationProvider>
)

const renderLocation = async () => {
  const hook = renderHook(() => useLocation(), { wrapper })
  await waitFor(() => expect(hook.result.current.mounted).toBe(true))
  return hook
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('useLocation outside a provider', () => {
  it('reports no saved location rather than throwing', () => {
    const { result } = renderHook(() => useLocation())

    expect(result.current.savedLocation).toBeNull()
  })
})

describe('LocationProvider', () => {
  it('starts with no saved location', async () => {
    const { result } = await renderLocation()

    expect(result.current.savedLocation).toBeNull()
  })

  it('restores a previously saved location', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location))

    const { result } = await renderLocation()

    expect(result.current.savedLocation).toEqual(location)
  })

  it('discards corrupted stored data rather than crashing', async () => {
    localStorage.setItem(STORAGE_KEY, 'not json{{')

    const { result } = await renderLocation()

    expect(result.current.savedLocation).toBeNull()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('persists a saved location', async () => {
    const { result } = await renderLocation()

    act(() => result.current.setSavedLocation(location))

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(location)
  })

  it('removes the stored location when set to null', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location))
    const { result } = await renderLocation()

    act(() => result.current.setSavedLocation(null))

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('clears the location on demand, so a user can remove it', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location))
    const { result } = await renderLocation()

    act(() => result.current.clearSavedLocation())

    expect(result.current.savedLocation).toBeNull()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})

describe('geocodeZipCode', () => {
  const nominatimResult = [
    { lat: '42.3601', lon: '-71.0589', display_name: 'Cambridge, Middlesex County, MA' },
  ]

  it('returns coordinates for a valid ZIP', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => nominatimResult })
    )

    await expect(geocodeZipCode('02139')).resolves.toMatchObject({
      lat: 42.3601,
      lng: -71.0589,
    })
  })

  it('extracts the city name', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => nominatimResult })
    )

    const result = await geocodeZipCode('02139')

    expect(result?.city).toBe('Cambridge')
  })

  it('strips punctuation from the ZIP before querying', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => nominatimResult })
    vi.stubGlobal('fetch', fetchMock)

    await geocodeZipCode(' 02139 ')

    expect(fetchMock.mock.calls[0][0]).toContain('postalcode=02139')
  })

  it.each(['', '021', '123456', 'abcde'])(
    'rejects %s without making a request',
    async (zip) => {
      const fetchMock = vi.fn()
      vi.stubGlobal('fetch', fetchMock)

      await expect(geocodeZipCode(zip)).resolves.toBeNull()
      expect(fetchMock).not.toHaveBeenCalled()
    }
  )

  it('returns null when the ZIP is not found', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))

    await expect(geocodeZipCode('99999')).resolves.toBeNull()
  })

  it('returns null on a failed response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    await expect(geocodeZipCode('02139')).resolves.toBeNull()
  })

  it('returns null when offline rather than throwing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    await expect(geocodeZipCode('02139')).resolves.toBeNull()
  })

  it('restricts the lookup to US postal codes', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => nominatimResult })
    vi.stubGlobal('fetch', fetchMock)

    await geocodeZipCode('02139')

    expect(fetchMock.mock.calls[0][0]).toContain('country=US')
  })
})
