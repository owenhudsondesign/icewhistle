import { describe, it, expect } from 'vitest'
import {
  HOTLINES,
  getHotlinesForZip,
  getStateFromZipCode,
  getLocationDisplay,
  hasLocalResources,
  getPrimaryLocalHotline,
} from './hotlines'

describe('HOTLINES data', () => {
  it('has at least one national hotline as a baseline', () => {
    expect(HOTLINES.some((h) => h.type === 'national')).toBe(true)
  })

  it('gives every hotline a phone number', () => {
    expect(HOTLINES.filter((h) => !h.phone)).toEqual([])
  })

  it('uses unique ids', () => {
    expect(new Set(HOTLINES.map((h) => h.id)).size).toBe(HOTLINES.length)
  })
})

describe('getHotlinesForZip', () => {
  it('falls back to national hotlines for a null ZIP', () => {
    expect(getHotlinesForZip(null).every((h) => h.type === 'national')).toBe(true)
  })

  it('falls back to national hotlines for a too-short ZIP', () => {
    expect(getHotlinesForZip('02').every((h) => h.type === 'national')).toBe(true)
  })

  it('never returns an empty list, so someone always has a number to call', () => {
    for (const zip of [null, '', '00000', '02139', '99999', 'abcde']) {
      expect(getHotlinesForZip(zip).length).toBeGreaterThan(0)
    }
  })

  it('lists national hotlines before local ones', () => {
    const types = getHotlinesForZip('02139').map((h) => h.type)
    const lastNational = types.lastIndexOf('national')
    const firstNonNational = types.findIndex((t) => t !== 'national')

    if (firstNonNational !== -1) expect(lastNational).toBeLessThan(firstNonNational)
  })

  it('surfaces Massachusetts resources for an 021 ZIP', () => {
    const results = getHotlinesForZip('02139')

    expect(results.length).toBeGreaterThan(getHotlinesForZip(null).length)
  })

  it('ignores digits beyond the three digit prefix', () => {
    expect(getHotlinesForZip('02139').map((h) => h.id)).toEqual(
      getHotlinesForZip('02100').map((h) => h.id)
    )
  })
})

describe('getStateFromZipCode', () => {
  it('returns null for a null ZIP', () => {
    expect(getStateFromZipCode(null)).toBeNull()
  })

  it('returns null for a too-short ZIP', () => {
    expect(getStateFromZipCode('02')).toBeNull()
  })

  it('maps an 021 ZIP to Massachusetts', () => {
    expect(getStateFromZipCode('02139')).toEqual({ code: 'MA', name: 'Massachusetts' })
  })

  it('maps an 028 ZIP to Rhode Island', () => {
    expect(getStateFromZipCode('02860')?.code).toBe('RI')
  })

  it('returns null rather than throwing on a non-numeric ZIP', () => {
    expect(getStateFromZipCode('abcde')).toBeNull()
  })
})

describe('getLocationDisplay', () => {
  it('shows the state name for a known ZIP', () => {
    expect(getLocationDisplay('02139')).toBe('Massachusetts')
  })

  it('falls back to "National" in English', () => {
    expect(getLocationDisplay(null)).toBe('National')
  })

  it('falls back to "Nacional" in Spanish', () => {
    expect(getLocationDisplay(null, 'es')).toBe('Nacional')
  })

  it('defaults to English for an unknown language', () => {
    expect(getLocationDisplay(null, 'zz')).toBe('National')
  })
})

describe('hasLocalResources', () => {
  it('is false without a ZIP', () => {
    expect(hasLocalResources(null)).toBe(false)
  })

  it('is false for a too-short ZIP', () => {
    expect(hasLocalResources('02')).toBe(false)
  })

  it('is true for a ZIP with state coverage', () => {
    expect(hasLocalResources('02139')).toBe(true)
  })
})

describe('getPrimaryLocalHotline', () => {
  it('always returns a hotline, even with no ZIP', () => {
    expect(getPrimaryLocalHotline(null)).not.toBeNull()
  })

  it('prefers a local or state hotline where one exists', () => {
    const primary = getPrimaryLocalHotline('02139')

    expect(['local', 'state']).toContain(primary!.type)
  })

  it('falls back to a national hotline for an uncovered ZIP', () => {
    expect(getPrimaryLocalHotline('99999')).not.toBeNull()
  })
})
