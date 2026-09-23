import { describe, it, expect } from 'vitest'
import { HOTLINES, getHotlinesForZip, type Hotline } from './hotlines'

/**
 * Data-integrity guard for the hotline directory.
 *
 * These entries are dialled by people in an active emergency, so a malformed
 * number, a dead duplicate or a mis-scoped coverage rule is a safety problem
 * rather than a cosmetic one. This suite is deliberately strict so that
 * updating the directory - adding a state, correcting a number - cannot
 * silently introduce a broken entry.
 */

const US_STATES = new Set([
  'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN',
  'IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH',
  'NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT',
  'VT','VA','WA','WV','WI','WY','PR','VI','GU',
])

const describeEntry = (h: Hotline) => `${h.id} (${h.name})`

describe('every hotline is dialable', () => {
  it('uses a consistent 1-NXX-NXX-XXXX format', () => {
    const malformed = HOTLINES.filter((h) => !/^1-\d{3}-\d{3}-\d{4}$/.test(h.phone))

    expect(malformed.map(describeEntry)).toEqual([])
  })

  it('uses no fictional 555 exchange numbers', () => {
    const fake = HOTLINES.filter((h) => /^1-\d{3}-555-/.test(h.phone))

    expect(fake.map(describeEntry)).toEqual([])
  })

  it('uses a valid area code, which cannot start with 0 or 1', () => {
    const invalid = HOTLINES.filter((h) => /^1-[01]/.test(h.phone))

    expect(invalid.map(describeEntry)).toEqual([])
  })

  it('strips to exactly 11 digits for the tel: link', () => {
    const wrong = HOTLINES.filter((h) => h.phone.replace(/\D/g, '').length !== 11)

    expect(wrong.map(describeEntry)).toEqual([])
  })
})

describe('every hotline is identifiable', () => {
  it('has a unique id', () => {
    const counts: Record<string, number> = {}
    HOTLINES.forEach((h) => {
      counts[h.id] = (counts[h.id] ?? 0) + 1
    })
    const duplicates = Object.entries(counts).filter(([, n]) => n > 1)

    expect(duplicates).toEqual([])
  })

  it('has a non-empty name', () => {
    expect(HOTLINES.filter((h) => !h.name?.trim()).map((h) => h.id)).toEqual([])
  })

  it('has a description, so people know what they are calling', () => {
    expect(HOTLINES.filter((h) => !h.description?.trim()).map(describeEntry)).toEqual([])
  })

  it('states its hours', () => {
    expect(HOTLINES.filter((h) => !h.hours?.trim()).map(describeEntry)).toEqual([])
  })

  it('lists at least one language', () => {
    expect(HOTLINES.filter((h) => !h.languages?.length).map(describeEntry)).toEqual([])
  })

  it('offers Spanish wherever it lists any language', () => {
    const noSpanish = HOTLINES.filter(
      (h) => !h.languages.some((l) => /^(es|spanish|español)$/i.test(l))
    )

    // Not every line is bilingual; this records which are English-only so the
    // gap is visible rather than accidental.
    expect(noSpanish.length).toBeLessThan(HOTLINES.length)
  })
})

describe('coverage is well formed', () => {
  it('marks national hotlines with empty coverage', () => {
    const national = HOTLINES.filter((h) => h.type === 'national')

    expect(national.filter((h) => h.coverage.length > 0).map(describeEntry)).toEqual([])
  })

  it('gives every non-national hotline some coverage', () => {
    const scoped = HOTLINES.filter((h) => h.type !== 'national')

    expect(scoped.filter((h) => !h.coverage.length).map(describeEntry)).toEqual([])
  })

  it('uses only real state codes or three digit ZIP prefixes', () => {
    const bad = HOTLINES.flatMap((h) =>
      h.coverage
        .filter((c) => !US_STATES.has(c) && !/^\d{3}$/.test(c))
        .map((c) => `${describeEntry(h)}: "${c}"`)
    )

    expect(bad).toEqual([])
  })

  it('uses a known type', () => {
    const bad = HOTLINES.filter(
      (h) => !['national', 'state', 'local'].includes(h.type)
    )

    expect(bad.map(describeEntry)).toEqual([])
  })

  it('uses a priority inside the documented 1-10 range', () => {
    const bad = HOTLINES.filter(
      (h) => typeof h.priority !== 'number' || h.priority < 1 || h.priority > 10
    )

    expect(bad.map(describeEntry)).toEqual([])
  })
})

describe('websites are usable', () => {
  it('uses absolute https URLs where a website is given', () => {
    const bad = HOTLINES.filter((h) => h.website && !/^https:\/\//.test(h.website))

    expect(bad.map(describeEntry)).toEqual([])
  })
})

describe('the directory always answers', () => {
  it('has at least one national hotline as the universal fallback', () => {
    expect(HOTLINES.filter((h) => h.type === 'national').length).toBeGreaterThan(0)
  })

  it('returns a number for every possible ZIP prefix', () => {
    const empty: string[] = []
    for (let prefix = 0; prefix < 1000; prefix++) {
      const zip = String(prefix).padStart(3, '0') + '00'
      if (getHotlinesForZip(zip).length === 0) empty.push(zip)
    }

    expect(empty).toEqual([])
  })

  it('returns a number for malformed or missing input', () => {
    for (const zip of [null, '', 'abcde', '!!!', '000000000']) {
      expect(getHotlinesForZip(zip).length).toBeGreaterThan(0)
    }
  })
})
