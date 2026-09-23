import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocalHotlineBanner } from './LocalHotlineBanner'

const mockLanguage = vi.fn().mockReturnValue('en')

vi.mock('@/hooks/use-language', () => ({
  useLanguage: () => ({ language: mockLanguage(), t: { nav: {} } }),
}))

const callLinks = () =>
  screen.getAllByRole('link').filter((a) => a.getAttribute('href')?.startsWith('tel:'))

beforeEach(() => {
  localStorage.clear()
  mockLanguage.mockReturnValue('en')
})

afterEach(() => vi.clearAllMocks())

describe('LocalHotlineBanner', () => {
  it('renders a hotline rather than a permanent skeleton', async () => {
    const { container } = render(<LocalHotlineBanner />)

    await waitFor(() => expect(callLinks().length).toBeGreaterThan(0))
    expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument()
  })

  it('shows a callable hotline once mounted', async () => {
    render(<LocalHotlineBanner />)

    await waitFor(() => expect(callLinks().length).toBeGreaterThan(0))
  })

  it('always offers a number even with no ZIP set', async () => {
    render(<LocalHotlineBanner />)

    await waitFor(() => expect(callLinks().length).toBeGreaterThan(0))
  })

  it('shows a local hotline when the ZIP has one', async () => {
    localStorage.setItem('userZip', '02139')

    render(<LocalHotlineBanner />)

    await waitFor(() => expect(callLinks().length).toBeGreaterThan(0))
  })

  it('respects maxHotlines', async () => {
    render(<LocalHotlineBanner maxHotlines={1} />)

    await waitFor(() => expect(callLinks().length).toBe(1))
  })

  it('dials a number stripped of punctuation', async () => {
    render(<LocalHotlineBanner />)

    await waitFor(() => expect(callLinks().length).toBeGreaterThan(0))
    expect(callLinks()[0].getAttribute('href')).toMatch(/^tel:\d+$/)
  })

  it('applies a caller supplied class', async () => {
    const { container } = render(<LocalHotlineBanner className="mb-4" />)

    await waitFor(() => expect(container.firstChild).toHaveClass('mb-4'))
  })
})

describe('variants', () => {
  it.each(['prominent', 'emergency', 'compact'] as const)(
    'renders the %s variant with a callable number',
    async (variant) => {
      render(<LocalHotlineBanner variant={variant} />)

      await waitFor(() => expect(callLinks().length).toBeGreaterThan(0))
    }
  )
})

describe('ZIP entry', () => {
  it('offers a way to set a ZIP', async () => {
    render(<LocalHotlineBanner />)

    await waitFor(() => expect(callLinks().length).toBeGreaterThan(0))
    const zipAffordance =
      screen.queryByRole('textbox') ||
      screen.getAllByRole('button').find((b) => /zip|código/i.test(b.textContent || ''))

    expect(zipAffordance).toBeDefined()
  })

  it('can be rendered without ZIP entry', async () => {
    render(<LocalHotlineBanner showZipInput={false} />)

    await waitFor(() => expect(callLinks().length).toBeGreaterThan(0))
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('shows the stored ZIP', async () => {
    localStorage.setItem('userZip', '02139')

    render(<LocalHotlineBanner />)

    await waitFor(() => expect(screen.getByText(/02139/)).toBeInTheDocument())
  })
})

describe('Spanish', () => {
  it('renders without error in Spanish', async () => {
    mockLanguage.mockReturnValue('es')

    render(<LocalHotlineBanner />)

    await waitFor(() => expect(callLinks().length).toBeGreaterThan(0))
  })
})
