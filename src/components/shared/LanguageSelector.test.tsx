import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageSelector } from './LanguageSelector'
import { PRIMARY_LANGUAGES, SUPPORTED_LANGUAGES, LANGUAGE_META } from '@/hooks/use-language'

const setLanguage = vi.fn()
const state = { language: 'en', mounted: true }

vi.mock('@/hooks/use-language', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/hooks/use-language')>()
  return {
    ...actual,
    useLanguage: () => ({ ...state, setLanguage, t: { nav: {} } }),
  }
})

beforeEach(() => {
  state.language = 'en'
  state.mounted = true
})

afterEach(() => vi.clearAllMocks())

describe('before hydration', () => {
  it('renders a stable placeholder to avoid a hydration mismatch', () => {
    state.mounted = false

    render(<LanguageSelector />)

    expect(screen.getByText('EN')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})

describe('primary languages', () => {
  it('offers each primary language directly', () => {
    render(<LanguageSelector />)

    for (const code of PRIMARY_LANGUAGES) {
      expect(screen.getByText(LANGUAGE_META[code].label)).toBeInTheDocument()
    }
  })

  it('switches language when one is picked', async () => {
    render(<LanguageSelector />)

    await userEvent.click(screen.getByText(LANGUAGE_META[PRIMARY_LANGUAGES[1]].label))

    expect(setLanguage).toHaveBeenCalledWith(PRIMARY_LANGUAGES[1])
  })
})

describe('the full language list', () => {
  it('stays collapsed until asked for', () => {
    render(<LanguageSelector />)

    expect(screen.queryByText(LANGUAGE_META.ko.nativeName)).not.toBeInTheDocument()
  })

  it('expands to every supported language', async () => {
    render(<LanguageSelector />)

    await userEvent.click(screen.getAllByRole('button').at(-1)!)

    expect(screen.getAllByText(LANGUAGE_META.ko.nativeName).length).toBeGreaterThan(0)
  })

  it('offers every supported language once expanded', async () => {
    render(<LanguageSelector />)

    await userEvent.click(screen.getAllByRole('button').at(-1)!)

    for (const code of SUPPORTED_LANGUAGES) {
      expect(screen.getAllByText(LANGUAGE_META[code].nativeName).length).toBeGreaterThan(0)
    }
  })

  it('switches to a language chosen from the full list', async () => {
    render(<LanguageSelector />)
    await userEvent.click(screen.getAllByRole('button').at(-1)!)

    await userEvent.click(screen.getAllByText(LANGUAGE_META.ko.nativeName)[0])

    expect(setLanguage).toHaveBeenCalledWith('ko')
  })

  it('closes after a language is chosen', async () => {
    render(<LanguageSelector />)
    await userEvent.click(screen.getAllByRole('button').at(-1)!)

    await userEvent.click(screen.getAllByText(LANGUAGE_META.ko.nativeName)[0])

    expect(screen.queryByText(LANGUAGE_META.ko.nativeName)).not.toBeInTheDocument()
  })
})

describe('current selection', () => {
  it('applies a class to the active primary language', () => {
    state.language = 'es'

    render(<LanguageSelector />)

    const active = screen.getByText(LANGUAGE_META.es.label).closest('button')!

    expect(active.className).toMatch(/bg-/)
  })

  it('applies a caller supplied class', () => {
    const { container } = render(<LanguageSelector className="ml-auto" />)

    expect(container.firstChild).toHaveClass('ml-auto')
  })
})
