import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BottomNav, AppWrapper } from './BottomNav'

const mockPathname = vi.fn().mockReturnValue('/')

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: () => false, getPlatform: () => 'web' },
}))

/** Installed PWAs report standalone display mode; browsers do not. */
const setStandalone = (matches: boolean) => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as unknown as typeof window.matchMedia
}

beforeEach(() => {
  setStandalone(false)
  mockPathname.mockReturnValue('/')
})

afterEach(() => vi.clearAllMocks())

describe('BottomNav visibility', () => {
  it('stays hidden in a normal browser tab', () => {
    render(<BottomNav />)

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('appears once the app is installed to the home screen', () => {
    setStandalone(true)

    render(<BottomNav />)

    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('appears for an iOS home screen launch', () => {
    Object.defineProperty(navigator, 'standalone', { value: true, configurable: true })

    render(<BottomNav />)

    expect(screen.getByRole('navigation')).toBeInTheDocument()
    delete (navigator as { standalone?: boolean }).standalone
  })
})

describe('BottomNav tabs', () => {
  beforeEach(() => setStandalone(true))

  it('links to the four primary destinations', () => {
    render(<BottomNav />)

    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'))

    expect(hrefs).toEqual(['/', '/hotlines', '/rights', '/faq'])
  })

  it('always offers a route to hotlines', () => {
    render(<BottomNav />)

    expect(
      screen.getAllByRole('link').some((a) => a.getAttribute('href') === '/hotlines')
    ).toBe(true)
  })

  it('marks home active only on the exact home path', () => {
    mockPathname.mockReturnValue('/rights')
    render(<BottomNav />)

    const home = screen.getAllByRole('link')[0]

    expect(home.className).not.toContain('bg-primary/10')
  })

  it('marks a section active on a nested route', () => {
    mockPathname.mockReturnValue('/rights/warrants')
    render(<BottomNav />)

    const rights = screen
      .getAllByRole('link')
      .find((a) => a.getAttribute('href') === '/rights')!

    expect(rights.className).toContain('bg-primary/10')
  })
})

describe('AppWrapper', () => {
  it('renders its children', () => {
    render(
      <AppWrapper>
        <p>Content</p>
      </AppWrapper>
    )

    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('does not reserve nav space in a browser tab', () => {
    const { container } = render(
      <AppWrapper>
        <p>Content</p>
      </AppWrapper>
    )

    expect(container.firstChild).not.toHaveClass('pb-24')
  })

  it('reserves space for the nav bar in app mode', () => {
    setStandalone(true)

    const { container } = render(
      <AppWrapper>
        <p>Content</p>
      </AppWrapper>
    )

    expect(container.firstChild).toHaveClass('pb-24')
  })
})
