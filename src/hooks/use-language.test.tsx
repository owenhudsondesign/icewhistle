import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  LanguageProvider,
  useLanguage,
  translationsCache,
  SUPPORTED_LANGUAGES,
  LANGUAGE_META,
} from './use-language'

const STORAGE_KEY = 'icewhistle-lang'

const localeResponse = (nav: Record<string, string>) => ({
  ok: true,
  json: async () => ({ nav }),
})

const wrapper = ({ children }: { children: ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
)

const renderLanguage = async () => {
  const hook = renderHook(() => useLanguage(), { wrapper })
  await waitFor(() => expect(hook.result.current.isLoading).toBe(false))
  return hook
}

beforeEach(() => {
  translationsCache.clear()
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(localeResponse({ install: 'Install' })))
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('language metadata', () => {
  it('includes English and Spanish', () => {
    expect(SUPPORTED_LANGUAGES).toContain('en')
    expect(SUPPORTED_LANGUAGES).toContain('es')
  })

  it('describes every supported language', () => {
    const missing = SUPPORTED_LANGUAGES.filter((code) => !LANGUAGE_META[code])

    expect(missing).toEqual([])
  })

  it('gives every language a native name, so speakers recognise it', () => {
    const missing = SUPPORTED_LANGUAGES.filter(
      (code) => !LANGUAGE_META[code]?.nativeName
    )

    expect(missing).toEqual([])
  })

  it('uses unique short labels', () => {
    const labels = SUPPORTED_LANGUAGES.map((c) => LANGUAGE_META[c].label)

    expect(new Set(labels).size).toBe(labels.length)
  })
})

describe('useLanguage outside a provider', () => {
  it('falls back to English rather than throwing', () => {
    const { result } = renderHook(() => useLanguage())

    expect(result.current.language).toBe('en')
  })

  it('still exposes translations, so text never renders blank', () => {
    const { result } = renderHook(() => useLanguage())

    expect(result.current.t.nav).toBeDefined()
  })
})

describe('LanguageProvider', () => {
  it('defaults to English', async () => {
    const { result } = await renderLanguage()

    expect(result.current.language).toBe('en')
  })

  it('restores a stored language', async () => {
    localStorage.setItem(STORAGE_KEY, 'es')

    const { result } = await renderLanguage()

    expect(result.current.language).toBe('es')
  })

  it('ignores an unsupported stored language', async () => {
    localStorage.setItem(STORAGE_KEY, 'xx')

    const { result } = await renderLanguage()

    expect(result.current.language).toBe('en')
  })

  it('reports mounted after hydration', async () => {
    const { result } = await renderLanguage()

    expect(result.current.mounted).toBe(true)
  })

  it('fetches the locale file for the active language', async () => {
    localStorage.setItem(STORAGE_KEY, 'es')

    await renderLanguage()

    expect(fetch).toHaveBeenCalledWith('/locales/es.json')
  })

  it('never fetches English, which ships in the bundle', async () => {
    await renderLanguage()

    const englishRequests = vi
      .mocked(fetch)
      .mock.calls.filter(([url]) => String(url).includes('/locales/en.json'))

    expect(englishRequests).toEqual([])
  })

  it('has English text available with no network at all', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    const { result } = await renderLanguage()

    expect(result.current.t.home.iceNear).toBeTruthy()
  })

  it('names the emergency buttons from the bundled strings', async () => {
    const { result } = await renderLanguage()

    expect(result.current.t.home.iceNear).toMatch(/ICE/i)
  })
})

describe('setLanguage', () => {
  it('switches the active language', async () => {
    const { result } = await renderLanguage()

    await act(async () => {
      await result.current.setLanguage('es')
    })

    expect(result.current.language).toBe('es')
  })

  it('persists the choice', async () => {
    const { result } = await renderLanguage()

    await act(async () => {
      await result.current.setLanguage('es')
    })

    expect(localStorage.getItem(STORAGE_KEY)).toBe('es')
  })

  it('loads the new translations', async () => {
    const { result } = await renderLanguage()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(localeResponse({ install: 'Instalar' }))
    )

    await act(async () => {
      await result.current.setLanguage('es')
    })

    expect(result.current.t.nav.install).toBe('Instalar')
  })

  it('refuses an unsupported language', async () => {
    const { result } = await renderLanguage()

    await act(async () => {
      await result.current.setLanguage('xx' as never)
    })

    expect(result.current.language).toBe('en')
  })

  it('does not persist an unsupported language', async () => {
    const { result } = await renderLanguage()

    await act(async () => {
      await result.current.setLanguage('xx' as never)
    })

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})

describe('translation loading failures', () => {
  it('falls back to English text when the locale file is missing', async () => {
    localStorage.setItem(STORAGE_KEY, 'es')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }))

    const { result } = await renderLanguage()

    expect(result.current.t.nav).toBeDefined()
  })

  it('falls back to English text when the network fails', async () => {
    localStorage.setItem(STORAGE_KEY, 'es')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    const { result } = await renderLanguage()

    expect(result.current.t.nav).toBeDefined()
  })

  it('still reports the selected language after a load failure', async () => {
    localStorage.setItem(STORAGE_KEY, 'es')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    const { result } = await renderLanguage()

    expect(result.current.language).toBe('es')
  })
})

describe('translation caching', () => {
  it('caches a loaded locale', async () => {
    localStorage.setItem(STORAGE_KEY, 'es')

    await renderLanguage()

    expect(translationsCache.has('es')).toBe(true)
  })

  it('does not refetch a cached locale, so switching works offline', async () => {
    const { result } = await renderLanguage()
    await act(async () => {
      await result.current.setLanguage('es')
    })
    const callsAfterFirstSwitch = vi.mocked(fetch).mock.calls.length

    await act(async () => {
      await result.current.setLanguage('en')
    })
    await act(async () => {
      await result.current.setLanguage('es')
    })

    expect(vi.mocked(fetch).mock.calls.length).toBe(callsAfterFirstSwitch)
  })

  it('does not cache a failed load, so it can retry later', async () => {
    localStorage.setItem(STORAGE_KEY, 'es')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    await renderLanguage()

    expect(translationsCache.has('es')).toBe(false)
  })
})
