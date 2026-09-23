import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppHeader } from './AppHeader'
import { track } from '@vercel/analytics'

const mockTrack = vi.mocked(track)

const mockPWA = {
  canInstall: false,
  isIOS: false,
  isInstalled: false,
  installState: 'idle' as const,
  promptInstall: vi.fn().mockResolvedValue(true),
}

vi.mock('@/hooks/use-pwa-install', () => ({
  usePWAInstall: () => mockPWA,
}))

const setPWA = (state: Partial<typeof mockPWA>) => Object.assign(mockPWA, state)

beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as unknown as typeof window.matchMedia
  setPWA({ canInstall: false, isIOS: false, isInstalled: false })
})

afterEach(() => {
  vi.clearAllMocks()
})

const installButton = () => screen.queryByRole('button', { name: /install/i })

describe('AppHeader install button', () => {
  it('is hidden when the app cannot be installed', () => {
    render(<AppHeader />)

    expect(installButton()).not.toBeInTheDocument()
  })

  it('is hidden when the app is already installed', () => {
    setPWA({ canInstall: true, isInstalled: true })

    render(<AppHeader />)

    expect(installButton()).not.toBeInTheDocument()
  })

  it('is shown when the browser offers a native install', () => {
    setPWA({ canInstall: true })

    render(<AppHeader />)

    expect(installButton()).toBeInTheDocument()
  })

  it('is shown on iOS, which is where most visitors are', () => {
    setPWA({ isIOS: true })

    render(<AppHeader />)

    expect(installButton()).toBeInTheDocument()
  })

  it('is not hidden at phone widths by a responsive utility class', () => {
    setPWA({ isIOS: true })

    render(<AppHeader />)

    // `hidden sm:flex` made the button desktop-only, which meant no iPhone
    // visitor could ever reach the Add to Home Screen instructions.
    expect(installButton()).not.toHaveClass('hidden')
  })

  it('triggers the native prompt when one is available', async () => {
    setPWA({ canInstall: true })
    render(<AppHeader />)

    await userEvent.click(installButton()!)

    expect(mockPWA.promptInstall).toHaveBeenCalledTimes(1)
  })
})

describe('AppHeader iOS instructions', () => {
  beforeEach(() => setPWA({ isIOS: true }))

  it('opens the Add to Home Screen steps on iOS', async () => {
    render(<AppHeader />)

    await userEvent.click(installButton()!)

    expect(screen.getByText(/Install on iPhone/i)).toBeInTheDocument()
  })

  it('does not call the native prompt on iOS', async () => {
    render(<AppHeader />)

    await userEvent.click(installButton()!)

    expect(mockPWA.promptInstall).not.toHaveBeenCalled()
  })

  it('reports that the iOS hint was shown', async () => {
    render(<AppHeader />)

    await userEvent.click(installButton()!)

    expect(mockTrack).toHaveBeenCalledWith('pwa_install_prompt_shown', {
      platform: 'ios',
    })
  })

  it('reports a dismissal when the steps are closed', async () => {
    render(<AppHeader />)
    await userEvent.click(installButton()!)

    await userEvent.click(screen.getByRole('button', { name: /got it/i }))

    expect(mockTrack).toHaveBeenCalledWith('pwa_install_prompt_response', {
      platform: 'ios',
      outcome: 'dismissed',
    })
  })

  it('closes the steps after dismissal', async () => {
    render(<AppHeader />)
    await userEvent.click(installButton()!)

    await userEvent.click(screen.getByRole('button', { name: /got it/i }))

    expect(screen.queryByText(/Install on iPhone/i)).not.toBeInTheDocument()
  })
})

describe('AppHeader language selector', () => {
  it('offers English and Spanish directly', () => {
    render(<AppHeader />)

    expect(screen.getByRole('button', { name: /english/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /español/i })).toBeInTheDocument()
  })

  it('reveals more languages on request', async () => {
    render(<AppHeader />)

    await userEvent.click(screen.getByRole('button', { name: /more languages/i }))

    expect(screen.getByText(/select language/i)).toBeInTheDocument()
  })
})
