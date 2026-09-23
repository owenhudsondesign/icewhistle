import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HotlineDirectory } from './HotlineDirectory'
import { getHotlinesForZip } from '@/data/hotlines'

const mockLanguage = vi.fn().mockReturnValue('en')

vi.mock('@/hooks/use-language', () => ({
  useLanguage: () => ({ language: mockLanguage(), t: { nav: {} } }),
}))

const callLinks = () =>
  screen.getAllByRole('link').filter((a) => a.getAttribute('href')?.startsWith('tel:'))

beforeEach(() => {
  mockLanguage.mockReturnValue('en')
  localStorage.clear()
})

afterEach(() => vi.clearAllMocks())

describe('HotlineDirectory', () => {
  it('lists hotlines once mounted', async () => {
    render(<HotlineDirectory />)

    await waitFor(() => expect(callLinks().length).toBeGreaterThan(0))
  })

  it('makes every hotline dialable', async () => {
    render(<HotlineDirectory />)

    await waitFor(() => expect(callLinks().length).toBeGreaterThan(0))
    for (const link of callLinks()) {
      expect(link.getAttribute('href')).toMatch(/^tel:\d+$/)
    }
  })

  it('strips punctuation from the dialed number', async () => {
    render(<HotlineDirectory />)

    await waitFor(() => expect(callLinks().length).toBeGreaterThan(0))
    expect(callLinks()[0].getAttribute('href')).not.toMatch(/[()\-\s]/)
  })

  it('shows national hotlines with no ZIP set', async () => {
    render(<HotlineDirectory />)

    await waitFor(() =>
      expect(callLinks().length).toBe(getHotlinesForZip(null).length)
    )
  })

  it('limits the list when maxItems is given', async () => {
    render(<HotlineDirectory maxItems={2} />)

    await waitFor(() => expect(callLinks().length).toBe(2))
  })

  it('offers a way to see the rest when the list is truncated', async () => {
    render(<HotlineDirectory maxItems={1} />)

    await waitFor(() => expect(callLinks().length).toBe(1))
    const showMore = screen
      .getAllByRole('button')
      .find((b) => /show|more|ver|más/i.test(b.textContent || ''))

    expect(showMore).toBeDefined()
  })

  it('reveals the full list when asked', async () => {
    const user = userEvent.setup()
    render(<HotlineDirectory maxItems={1} />)
    await waitFor(() => expect(callLinks().length).toBe(1))

    const showMore = screen
      .getAllByRole('button')
      .find((b) => /show|more|ver|más/i.test(b.textContent || ''))!
    await user.click(showMore)

    await waitFor(() => expect(callLinks().length).toBeGreaterThan(1))
  })

  it('applies a caller supplied class', async () => {
    const { container } = render(<HotlineDirectory className="mt-6" />)

    await waitFor(() => expect(container.firstChild).toHaveClass('mt-6'))
  })
})

describe('ZIP entry', () => {
  it('offers a ZIP field by default', async () => {
    render(<HotlineDirectory />)

    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
  })

  it('can be rendered without the ZIP field', async () => {
    render(<HotlineDirectory showZipInput={false} />)

    await waitFor(() => expect(callLinks().length).toBeGreaterThan(0))
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('localizes the list once a ZIP is submitted', async () => {
    const user = userEvent.setup()
    render(<HotlineDirectory />)
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
    const before = callLinks().length

    await user.type(screen.getByRole('textbox'), '02139')
    await user.keyboard('{Enter}')

    await waitFor(() => expect(callLinks().length).toBeGreaterThan(before))
  })

  it('persists the submitted ZIP', async () => {
    const user = userEvent.setup()
    render(<HotlineDirectory />)
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

    await user.type(screen.getByRole('textbox'), '02139')
    await user.keyboard('{Enter}')

    await waitFor(() => expect(localStorage.getItem('userZip')).toBe('02139'))
  })

  it('shows a stored ZIP on load', async () => {
    localStorage.setItem('userZip', '02139')

    render(<HotlineDirectory />)

    await waitFor(() => expect(screen.getByText('02139')).toBeInTheDocument())
  })
})

describe('Spanish', () => {
  it('renders Spanish hotline names where available', async () => {
    mockLanguage.mockReturnValue('es')

    render(<HotlineDirectory />)

    await waitFor(() => expect(callLinks().length).toBeGreaterThan(0))
    expect(screen.getByText(/Código postal|Ingresa/i)).toBeInTheDocument()
  })
})
