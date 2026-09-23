import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Providers } from './Providers'

beforeEach(() => {
  localStorage.setItem('icewhistle-onboarding-complete', 'true')
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, json: async () => ({ flags: {}, nav: {} }) })
  )
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('Providers', () => {
  it('renders the app once every provider is ready', async () => {
    render(
      <Providers>
        <p>App content</p>
      </Providers>
    )

    await waitFor(() => expect(screen.getByText('App content')).toBeInTheDocument())
  })

  it('withholds the app until onboarding is complete', async () => {
    localStorage.setItem('icewhistle-onboarding-complete', 'false')

    render(
      <Providers>
        <p>App content</p>
      </Providers>
    )

    await waitFor(() => expect(screen.queryByText('App content')).not.toBeInTheDocument())
  })

  it('does not throw when a provider request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    render(
      <Providers>
        <p>App content</p>
      </Providers>
    )

    await waitFor(() => expect(screen.getByText('App content')).toBeInTheDocument())
  })
})
