import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { OfflineIndicator } from './OfflineIndicator'

const setOnline = (value: boolean) =>
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(value)

beforeEach(() => setOnline(true))
afterEach(() => vi.restoreAllMocks())

describe('OfflineIndicator', () => {
  it('stays out of the way while online', () => {
    render(<OfflineIndicator />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('warns when the browser starts offline', () => {
    setOnline(false)

    render(<OfflineIndicator />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('explains what being offline means', () => {
    setOnline(false)

    render(<OfflineIndicator />)

    expect(screen.getByText(/you are offline/i)).toBeInTheDocument()
  })

  it('appears when connectivity drops mid-session', () => {
    render(<OfflineIndicator />)

    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('disappears once connectivity returns', () => {
    setOnline(false)
    render(<OfflineIndicator />)

    act(() => {
      window.dispatchEvent(new Event('online'))
    })

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
