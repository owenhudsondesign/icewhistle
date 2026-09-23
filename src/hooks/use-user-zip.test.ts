import { describe, it, expect } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useUserZip } from './use-user-zip'

const STORAGE_KEY = 'userZip'

describe('useUserZip', () => {
  it('starts unmounted with no ZIP, so SSR and client markup agree', () => {
    const { result } = renderHook(() => useUserZip())

    expect(result.current.zip).toBeNull()
  })

  it('reports mounted after hydration', async () => {
    const { result } = renderHook(() => useUserZip())

    await waitFor(() => expect(result.current.mounted).toBe(true))
  })

  it('reads a previously stored ZIP', async () => {
    localStorage.setItem(STORAGE_KEY, '02139')

    const { result } = renderHook(() => useUserZip())

    await waitFor(() => expect(result.current.zip).toBe('02139'))
  })

  it('persists an updated ZIP', async () => {
    const { result } = renderHook(() => useUserZip())
    await waitFor(() => expect(result.current.mounted).toBe(true))

    act(() => result.current.updateZip('10001'))

    expect(localStorage.getItem(STORAGE_KEY)).toBe('10001')
    expect(result.current.zip).toBe('10001')
  })

  it('preserves a leading zero', async () => {
    const { result } = renderHook(() => useUserZip())
    await waitFor(() => expect(result.current.mounted).toBe(true))

    act(() => result.current.updateZip('02139'))

    expect(localStorage.getItem(STORAGE_KEY)).toBe('02139')
  })

  it('removes the stored ZIP when updated to null', async () => {
    localStorage.setItem(STORAGE_KEY, '02139')
    const { result } = renderHook(() => useUserZip())
    await waitFor(() => expect(result.current.zip).toBe('02139'))

    act(() => result.current.updateZip(null))

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(result.current.zip).toBeNull()
  })

  it('clears the ZIP on demand, so a user can remove their location', async () => {
    localStorage.setItem(STORAGE_KEY, '02139')
    const { result } = renderHook(() => useUserZip())
    await waitFor(() => expect(result.current.zip).toBe('02139'))

    act(() => result.current.clearZip())

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(result.current.zip).toBeNull()
  })

  it('stores nothing beyond the ZIP itself', async () => {
    const { result } = renderHook(() => useUserZip())
    await waitFor(() => expect(result.current.mounted).toBe(true))

    act(() => result.current.updateZip('02139'))

    expect(Object.keys(localStorage)).toEqual([STORAGE_KEY])
  })
})
