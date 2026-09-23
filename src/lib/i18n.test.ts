import { describe, it, expect } from 'vitest'
import { locales, defaultLocale, localeNames } from './i18n'

describe('locales', () => {
  it('includes English and Spanish, the two largest audiences', () => {
    expect(locales).toContain('en')
    expect(locales).toContain('es')
  })

  it('defaults to English', () => {
    expect(defaultLocale).toBe('en')
  })

  it('has English among the supported locales', () => {
    expect(locales).toContain(defaultLocale)
  })

  it('lists no duplicates', () => {
    expect(new Set(locales).size).toBe(locales.length)
  })

  it('uses lowercase ISO style codes', () => {
    const malformed = locales.filter((l) => !/^[a-z]{2}$/.test(l))

    expect(malformed).toEqual([])
  })
})

describe('localeNames', () => {
  it('names every supported locale', () => {
    const missing = locales.filter((l) => !localeNames[l])

    expect(missing).toEqual([])
  })

  it('names each locale in its own language, not in English', () => {
    expect(localeNames.es).toBe('Español')
    expect(localeNames.zh).toBe('中文')
    expect(localeNames.ar).toBe('العربية')
  })

  it('uses a distinct name per locale', () => {
    const names = locales.map((l) => localeNames[l])

    expect(new Set(names).size).toBe(names.length)
  })
})
