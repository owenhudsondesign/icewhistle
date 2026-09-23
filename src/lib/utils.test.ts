import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { cn, formatDate, formatTime, formatDateTime, formatRelativeTime, truncate, generateId } from './utils'

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('drops falsy values', () => {
    expect(cn('a', false && 'b', undefined, null, 'c')).toBe('a c')
  })

  it('lets a later tailwind class win over an earlier conflicting one', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('keeps non-conflicting tailwind classes', () => {
    expect(cn('px-2', 'py-4')).toBe('px-2 py-4')
  })

  it('returns an empty string with no input', () => {
    expect(cn()).toBe('')
  })
})

describe('formatDate', () => {
  it('accepts a Date', () => {
    expect(formatDate(new Date('2026-03-05T12:00:00Z'))).toMatch(/2026/)
  })

  it('accepts an ISO string', () => {
    expect(formatDate('2026-03-05T12:00:00Z')).toMatch(/2026/)
  })
})

describe('formatTime', () => {
  it('renders hours and minutes', () => {
    expect(formatTime(new Date('2026-03-05T14:30:00Z'))).toMatch(/\d{1,2}:\d{2}/)
  })
})

describe('formatDateTime', () => {
  it('combines the date and the time', () => {
    const date = new Date('2026-03-05T14:30:00Z')

    expect(formatDateTime(date)).toBe(`${formatDate(date)} ${formatTime(date)}`)
  })
})

describe('formatRelativeTime', () => {
  const now = new Date('2026-03-05T12:00:00Z')

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(now)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const ago = (ms: number) => new Date(now.getTime() - ms)

  it('says "Just now" under a minute', () => {
    expect(formatRelativeTime(ago(30_000))).toBe('Just now')
  })

  it('switches to minutes at exactly one minute', () => {
    expect(formatRelativeTime(ago(60_000))).toBe('1m ago')
  })

  it('reports minutes below an hour', () => {
    expect(formatRelativeTime(ago(59 * 60_000))).toBe('59m ago')
  })

  it('switches to hours at exactly one hour', () => {
    expect(formatRelativeTime(ago(3_600_000))).toBe('1h ago')
  })

  it('reports hours below a day', () => {
    expect(formatRelativeTime(ago(23 * 3_600_000))).toBe('23h ago')
  })

  it('switches to days at exactly one day', () => {
    expect(formatRelativeTime(ago(86_400_000))).toBe('1d ago')
  })

  it('falls back to an absolute date at a week', () => {
    const sevenDaysAgo = ago(7 * 86_400_000)

    expect(formatRelativeTime(sevenDaysAgo)).toBe(formatDate(sevenDaysAgo))
  })

  it('accepts an ISO string', () => {
    expect(formatRelativeTime(ago(120_000).toISOString())).toBe('2m ago')
  })
})

describe('truncate', () => {
  it('leaves a short string alone', () => {
    expect(truncate('short', 10)).toBe('short')
  })

  it('leaves a string of exactly the limit alone', () => {
    expect(truncate('exactly10!', 10)).toBe('exactly10!')
  })

  it('appends an ellipsis past the limit', () => {
    expect(truncate('abcdefghijk', 10)).toBe('abcdefghij...')
  })

  it('handles an empty string', () => {
    expect(truncate('', 5)).toBe('')
  })
})

describe('generateId', () => {
  it('returns a UUID', () => {
    expect(generateId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    )
  })

  it('does not repeat', () => {
    const ids = new Set(Array.from({ length: 100 }, generateId))

    expect(ids.size).toBe(100)
  })
})
