import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageWrapper } from './PageWrapper'

vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: () => false, getPlatform: () => 'web' },
}))

vi.mock('./AppHeader', () => ({
  AppHeader: () => <header>Header</header>,
}))

const setStandalone = (matches: boolean) => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as unknown as typeof window.matchMedia
}

beforeEach(() => setStandalone(false))
afterEach(() => vi.clearAllMocks())

describe('PageWrapper', () => {
  it('renders its children', () => {
    render(
      <PageWrapper>
        <p>Body</p>
      </PageWrapper>
    )

    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('always includes the header', () => {
    render(
      <PageWrapper>
        <p>Body</p>
      </PageWrapper>
    )

    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renders a title as the page heading', () => {
    render(
      <PageWrapper title="Know Your Rights">
        <p>Body</p>
      </PageWrapper>
    )

    expect(screen.getByRole('heading', { name: 'Know Your Rights' })).toBeInTheDocument()
  })

  it('omits the heading when no title is given', () => {
    render(
      <PageWrapper>
        <p>Body</p>
      </PageWrapper>
    )

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('renders a subtitle alongside the title', () => {
    render(
      <PageWrapper title="Hotlines" subtitle="Free and confidential">
        <p>Body</p>
      </PageWrapper>
    )

    expect(screen.getByText('Free and confidential')).toBeInTheDocument()
  })

  it('ignores a subtitle with no title', () => {
    render(
      <PageWrapper subtitle="Orphaned">
        <p>Body</p>
      </PageWrapper>
    )

    expect(screen.queryByText('Orphaned')).not.toBeInTheDocument()
  })

  it('provides a main landmark for the skip link to target', () => {
    render(
      <PageWrapper>
        <p>Body</p>
      </PageWrapper>
    )

    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
  })

  it('puts the content inside the landmark', () => {
    render(
      <PageWrapper>
        <p>Body</p>
      </PageWrapper>
    )

    expect(screen.getByRole('main')).toHaveTextContent('Body')
  })

  it('offers a skip link ahead of the header', () => {
    const { container } = render(
      <PageWrapper>
        <p>Body</p>
      </PageWrapper>
    )

    expect(container.querySelector('a')).toHaveAttribute('href', '#main-content')
  })

  it('renders at most one level one heading', () => {
    render(
      <PageWrapper title="Hotlines">
        <p>Body</p>
      </PageWrapper>
    )

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('reserves space for the bottom nav in app mode', () => {
    setStandalone(true)

    const { container } = render(
      <PageWrapper>
        <p>Body</p>
      </PageWrapper>
    )

    expect(container.firstChild).toHaveClass('pb-24')
  })
})
