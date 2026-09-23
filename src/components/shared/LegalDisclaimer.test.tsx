import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LegalDisclaimer } from './LegalDisclaimer'

const mockLanguage = vi.fn().mockReturnValue('en')

vi.mock('@/hooks/use-language', () => ({
  useLanguage: () => ({ language: mockLanguage() }),
}))

afterEach(() => {
  mockLanguage.mockReturnValue('en')
  vi.clearAllMocks()
})

describe('LegalDisclaimer', () => {
  it('states it is not legal advice by default', () => {
    render(<LegalDisclaimer />)

    expect(screen.getByText(/does not constitute legal advice/i)).toBeInTheDocument()
  })

  it('states it is not a government agency', () => {
    render(<LegalDisclaimer />)

    expect(screen.getByText(/not affiliated with any government agency/i)).toBeInTheDocument()
  })

  it('renders the inline variant', () => {
    render(<LegalDisclaimer variant="inline" />)

    expect(screen.getByText(/informational and educational purposes/i)).toBeInTheDocument()
  })

  it('renders the full variant as an alert', () => {
    render(<LegalDisclaimer variant="full" />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('applies a caller supplied class', () => {
    const { container } = render(<LegalDisclaimer className="mt-8" />)

    expect(container.firstChild).toHaveClass('mt-8')
  })
})

describe('translated disclaimers', () => {
  it('renders Spanish text for Spanish speakers', () => {
    mockLanguage.mockReturnValue('es')

    render(<LegalDisclaimer />)

    expect(screen.getByText(/no constituye asesoramiento legal/i)).toBeInTheDocument()
  })

  it('renders Portuguese text for Portuguese speakers', () => {
    mockLanguage.mockReturnValue('pt')

    render(<LegalDisclaimer />)

    expect(screen.getByText(/não constitui aconselhamento jurídico/i)).toBeInTheDocument()
  })

  it('falls back to English for a language with no disclaimer copy', () => {
    mockLanguage.mockReturnValue('ko')

    render(<LegalDisclaimer />)

    expect(screen.getByText(/does not constitute legal advice/i)).toBeInTheDocument()
  })
})

describe('machine translation notice', () => {
  it('is absent for English, which is the source language', () => {
    render(<LegalDisclaimer />)

    expect(screen.queryByText(/machine-translated/i)).not.toBeInTheDocument()
  })

  it('warns Spanish readers that the text is translated', () => {
    mockLanguage.mockReturnValue('es')

    render(<LegalDisclaimer />)

    expect(screen.getByText(/traducido automáticamente/i)).toBeInTheDocument()
  })

  it('warns in the reader\'s own language, not English', () => {
    mockLanguage.mockReturnValue('ko')

    render(<LegalDisclaimer />)

    expect(screen.getByText(/기계 번역/)).toBeInTheDocument()
  })

  it('warns Arabic readers in Arabic', () => {
    mockLanguage.mockReturnValue('ar')

    render(<LegalDisclaimer />)

    expect(screen.getByText(/ترجمة هذا المحتوى آليًا/)).toBeInTheDocument()
  })

  it('falls back to an English notice for an unlisted language', () => {
    mockLanguage.mockReturnValue('sw')

    render(<LegalDisclaimer />)

    expect(screen.getByText(/machine-translated/i)).toBeInTheDocument()
  })
})
