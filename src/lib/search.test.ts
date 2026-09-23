import { describe, it, expect } from 'vitest'
import {
  search,
  getByCategory,
  getById,
  getSuggestedSearches,
  getEmergencyContacts,
  highlightMatches,
} from './search'
import { knowledgeBase } from '@/data/knowledge-base'

describe('search', () => {
  it('finds entries for a plain keyword', () => {
    expect(search('warrant').length).toBeGreaterThan(0)
  })

  it('finds entries for a natural language question', () => {
    expect(search('What are my rights if ICE comes to my door?').length).toBeGreaterThan(0)
  })

  it('returns results sorted by descending score', () => {
    const scores = search('detained').map((r) => r.score)

    expect(scores).toEqual([...scores].sort((a, b) => b - a))
  })

  it('respects the limit option', () => {
    expect(search('ice', { limit: 3 })).toHaveLength(3)
  })

  it('defaults to at most ten results', () => {
    expect(search('ice').length).toBeLessThanOrEqual(10)
  })

  it('returns nothing for an empty query', () => {
    expect(search('')).toEqual([])
  })

  it('returns nothing for a query of only stopwords', () => {
    expect(search('the and of to')).toEqual([])
  })

  it('returns nothing for gibberish', () => {
    expect(search('zzzqqqxxwv')).toEqual([])
  })

  it('is case insensitive', () => {
    expect(search('WARRANT').map((r) => r.entry.id)).toEqual(
      search('warrant').map((r) => r.entry.id)
    )
  })

  it('matches synonyms, so "attorney" finds lawyer content', () => {
    expect(search('attorney').length).toBeGreaterThan(0)
  })

  it('restricts results to a category when asked', () => {
    const category = knowledgeBase[0].category
    const results = search('ice', { category, limit: 50 })

    expect(results.every((r) => r.entry.category === category)).toBe(true)
  })

  it('drops results below an explicit minScore', () => {
    const high = search('ice', { minScore: 1000 })

    expect(high).toEqual([])
  })

  it('handles punctuation without throwing', () => {
    expect(() => search('what if ICE?! (at my door)')).not.toThrow()
  })

  it('handles a very long query without throwing', () => {
    expect(() => search('ice '.repeat(500))).not.toThrow()
  })
})

describe('getByCategory', () => {
  it('returns only entries in that category', () => {
    const category = knowledgeBase[0].category

    expect(getByCategory(category).every((e) => e.category === category)).toBe(true)
  })

  it('returns an empty array for a category with no entries', () => {
    expect(getByCategory('not-a-category' as never)).toEqual([])
  })
})

describe('getById', () => {
  it('finds a known entry', () => {
    expect(getById(knowledgeBase[0].id)?.id).toBe(knowledgeBase[0].id)
  })

  it('returns undefined for an unknown id', () => {
    expect(getById('nope')).toBeUndefined()
  })
})

describe('getSuggestedSearches', () => {
  it('returns a non-empty list', () => {
    expect(getSuggestedSearches().length).toBeGreaterThan(0)
  })

  it('suggests only queries that actually return results', () => {
    const empty = getSuggestedSearches().filter((q) => search(q).length === 0)

    expect(empty).toEqual([])
  })
})

describe('getEmergencyContacts', () => {
  it('returns only high priority entries that have a phone number', () => {
    const contacts = getEmergencyContacts()

    expect(
      contacts.every((e) => e.phones!.length > 0 && e.priority! >= 9)
    ).toBe(true)
  })
})

describe('highlightMatches', () => {
  it('wraps a matched term in bold markers', () => {
    expect(highlightMatches('know your rights', ['rights'])).toBe(
      'know your **rights**'
    )
  })

  it('returns the text untouched when there are no matches', () => {
    expect(highlightMatches('know your rights', [])).toBe('know your rights')
  })

  it('matches case insensitively while preserving the original casing', () => {
    expect(highlightMatches('Know Your Rights', ['rights'])).toBe(
      'Know Your **Rights**'
    )
  })

  it('highlights every occurrence', () => {
    expect(highlightMatches('rights and more rights', ['rights'])).toBe(
      '**rights** and more **rights**'
    )
  })

  it('does not highlight a partial word', () => {
    expect(highlightMatches('birthrights', ['rights'])).toBe('birthrights')
  })

  it('does not throw when a matched term contains regex metacharacters', () => {
    expect(() => highlightMatches('legal aid (free)', ['(free)'])).not.toThrow()
  })

  it('does not throw on an unbalanced parenthesis in a term', () => {
    expect(() => highlightMatches('ICE (Immigration', ['(Immigration'])).not.toThrow()
  })

  it('treats a metacharacter term literally rather than as a pattern', () => {
    expect(highlightMatches('call 911 now', ['9.1'])).toBe('call 911 now')
  })
})
