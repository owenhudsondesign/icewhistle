import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Home from './page'
import { auditPage } from '@/test/a11y'

/**
 * The accessible name as assistive technology computes it: visible text, an
 * aria-label, or an image's alt text.
 */
const computeAccessibleName = (el: Element): string => {
  const label = el.getAttribute('aria-label')?.trim()
  if (label) return label

  const text = el.textContent?.trim()
  if (text) return text

  return Array.from(el.querySelectorAll('img'))
    .map((img) => img.getAttribute('alt')?.trim() ?? '')
    .join(' ')
    .trim()
}

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}))

vi.mock('@/hooks/use-pwa-install', () => ({
  usePWAInstall: () => ({
    canInstall: false,
    isIOS: false,
    isInstalled: false,
    installState: 'idle',
    promptInstall: vi.fn(),
  }),
}))

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}))

beforeEach(() => {
  localStorage.clear()
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as unknown as typeof window.matchMedia
})

afterEach(() => vi.clearAllMocks())

describe('home page accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Home />)

    await waitFor(() => expect(screen.getByRole('main')).toBeInTheDocument())
    await auditPage(container)
  })

  it('offers a skip link as the first stop in the tab order', () => {
    const { container } = render(<Home />)

    const first = container.querySelector('a')

    expect(first).toHaveAttribute('href', '#main-content')
  })

  it('points the skip link at the main landmark', () => {
    render(<Home />)

    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
  })

  it('names the page with a single level one heading', () => {
    render(<Home />)

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('gives every emergency action an accessible name', () => {
    render(<Home />)

    const unnamed = screen
      .getAllByRole('button')
      .filter((el) => !computeAccessibleName(el))
      .map((el) => el.className.slice(0, 60))

    expect(unnamed).toEqual([])
  })

  it('gives every link an accessible name', () => {
    render(<Home />)

    const unnamed = screen
      .getAllByRole('link')
      .filter((el) => !computeAccessibleName(el))
      .map((el) => el.className.slice(0, 60))

    expect(unnamed).toEqual([])
  })

  it('names the emergency buttons even before translations load', () => {
    render(<Home />)

    const names = screen.getAllByRole('button').map(computeAccessibleName)

    expect(names.some((n) => /ICE/i.test(n))).toBe(true)
  })
})
