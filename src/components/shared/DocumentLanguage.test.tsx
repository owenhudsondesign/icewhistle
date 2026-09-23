import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { DocumentLanguage } from './DocumentLanguage'

const state = { language: 'en' }

vi.mock('@/hooks/use-language', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/hooks/use-language')>()
  return {
    ...actual,
    useLanguage: () => ({ language: state.language, mounted: true, t: { nav: {} } }),
  }
})

beforeEach(() => {
  state.language = 'en'
  document.documentElement.removeAttribute('dir')
  document.documentElement.setAttribute('lang', 'en')
})

afterEach(() => vi.clearAllMocks())

describe('DocumentLanguage', () => {
  it('renders nothing visible', () => {
    const { container } = render(<DocumentLanguage />)

    expect(container).toBeEmptyDOMElement()
  })

  it('sets the document language so text is pronounced correctly', async () => {
    state.language = 'es'

    render(<DocumentLanguage />)

    await waitFor(() => expect(document.documentElement.lang).toBe('es'))
  })

  it('marks left-to-right languages as ltr', async () => {
    state.language = 'es'

    render(<DocumentLanguage />)

    await waitFor(() => expect(document.documentElement.dir).toBe('ltr'))
  })

  it.each(['ar', 'fa', 'ur'])('lays out %s right-to-left', async (language) => {
    state.language = language

    render(<DocumentLanguage />)

    await waitFor(() => expect(document.documentElement.dir).toBe('rtl'))
  })

  it('sets the language code for a right-to-left language too', async () => {
    state.language = 'ar'

    render(<DocumentLanguage />)

    await waitFor(() => expect(document.documentElement.lang).toBe('ar'))
  })

  it('switches back to ltr when leaving a right-to-left language', async () => {
    state.language = 'ar'
    const { rerender } = render(<DocumentLanguage />)
    await waitFor(() => expect(document.documentElement.dir).toBe('rtl'))

    state.language = 'en'
    rerender(<DocumentLanguage />)

    await waitFor(() => expect(document.documentElement.dir).toBe('ltr'))
  })

  it('leaves the document alone for an unknown language', async () => {
    state.language = 'zz'

    render(<DocumentLanguage />)

    await waitFor(() => expect(document.documentElement.lang).toBe('en'))
  })
})
