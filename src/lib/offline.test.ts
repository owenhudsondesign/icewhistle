import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  isOnline,
  registerConnectivityListener,
  cacheData,
  getCachedData,
  clearCache,
  queueOfflineAction,
  getOfflineQueue,
  clearOfflineQueue,
  processOfflineQueue,
} from './offline'

const action = (type: string, timestamp = 1) => ({ type, payload: { id: type }, timestamp })

beforeEach(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('isOnline', () => {
  it('reflects navigator.onLine when online', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true)

    expect(isOnline()).toBe(true)
  })

  it('reflects navigator.onLine when offline', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)

    expect(isOnline()).toBe(false)
  })
})

describe('registerConnectivityListener', () => {
  it('fires the online callback', () => {
    const onOnline = vi.fn()
    const unregister = registerConnectivityListener(onOnline, vi.fn())

    window.dispatchEvent(new Event('online'))

    expect(onOnline).toHaveBeenCalledTimes(1)
    unregister()
  })

  it('fires the offline callback', () => {
    const onOffline = vi.fn()
    const unregister = registerConnectivityListener(vi.fn(), onOffline)

    window.dispatchEvent(new Event('offline'))

    expect(onOffline).toHaveBeenCalledTimes(1)
    unregister()
  })

  it('stops firing after the returned cleanup runs', () => {
    const onOnline = vi.fn()
    const unregister = registerConnectivityListener(onOnline, vi.fn())

    unregister()
    window.dispatchEvent(new Event('online'))

    expect(onOnline).not.toHaveBeenCalled()
  })
})

describe('cacheData / getCachedData', () => {
  it('round trips an object', () => {
    cacheData('hotlines', { count: 3 })

    expect(getCachedData('hotlines')).toEqual({ count: 3 })
  })

  it('returns null for a key that was never cached', () => {
    expect(getCachedData('missing')).toBeNull()
  })

  it('returns the value while it is within maxAge', () => {
    cacheData('fresh', 'value')

    expect(getCachedData('fresh', 60_000)).toBe('value')
  })

  it('returns null once the entry is older than maxAge', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-05T12:00:00Z'))
    cacheData('stale', 'value')

    vi.setSystemTime(new Date('2026-03-05T12:10:00Z'))

    expect(getCachedData('stale', 60_000)).toBeNull()
    vi.useRealTimers()
  })

  it('evicts the expired entry rather than leaving it behind', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-05T12:00:00Z'))
    cacheData('stale', 'value')

    vi.setSystemTime(new Date('2026-03-05T12:10:00Z'))
    getCachedData('stale', 60_000)

    expect(localStorage.getItem('icewhistle_cache_stale')).toBeNull()
    vi.useRealTimers()
  })

  it('ignores maxAge when it is not supplied', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-05T12:00:00Z'))
    cacheData('forever', 'value')

    vi.setSystemTime(new Date('2027-03-05T12:00:00Z'))

    expect(getCachedData('forever')).toBe('value')
    vi.useRealTimers()
  })

  it('returns null instead of throwing on corrupted JSON', () => {
    localStorage.setItem('icewhistle_cache_broken', 'not json{{')

    expect(getCachedData('broken')).toBeNull()
  })

  it('namespaces keys so it cannot collide with other storage', () => {
    cacheData('zip', '02139')

    expect(localStorage.getItem('icewhistle_cache_zip')).not.toBeNull()
  })
})

describe('clearCache', () => {
  it('removes cached entries', () => {
    cacheData('a', 1)
    cacheData('b', 2)

    clearCache()

    expect(getCachedData('a')).toBeNull()
    expect(getCachedData('b')).toBeNull()
  })

  it('leaves unrelated localStorage keys alone', () => {
    localStorage.setItem('user_zip', '02139')
    cacheData('a', 1)

    clearCache()

    expect(localStorage.getItem('user_zip')).toBe('02139')
  })
})

describe('offline queue', () => {
  it('starts empty', () => {
    expect(getOfflineQueue()).toEqual([])
  })

  it('preserves insertion order', () => {
    queueOfflineAction(action('first'))
    queueOfflineAction(action('second'))

    expect(getOfflineQueue().map((a) => a.type)).toEqual(['first', 'second'])
  })

  it('clears on demand', () => {
    queueOfflineAction(action('one'))

    clearOfflineQueue()

    expect(getOfflineQueue()).toEqual([])
  })

  it('returns an empty array instead of throwing on corrupted storage', () => {
    localStorage.setItem('icewhistle_offline_queue', 'not json{{')

    expect(getOfflineQueue()).toEqual([])
  })
})

describe('processOfflineQueue', () => {
  it('processes every queued action', async () => {
    queueOfflineAction(action('a'))
    queueOfflineAction(action('b'))
    const processor = vi.fn().mockResolvedValue(undefined)

    await processOfflineQueue(processor)

    expect(processor).toHaveBeenCalledTimes(2)
  })

  it('empties the queue once everything succeeds', async () => {
    queueOfflineAction(action('a'))

    await processOfflineQueue(vi.fn().mockResolvedValue(undefined))

    expect(getOfflineQueue()).toEqual([])
  })

  it('keeps a failed action queued for retry', async () => {
    queueOfflineAction(action('panic_alert'))

    await processOfflineQueue(async () => {
      throw new Error('network down')
    })

    expect(getOfflineQueue().map((a) => a.type)).toEqual(['panic_alert'])
  })

  it('keeps only the failures when some actions succeed', async () => {
    queueOfflineAction(action('ok'))
    queueOfflineAction(action('fails'))

    await processOfflineQueue(async (a) => {
      if (a.type === 'fails') throw new Error('network down')
    })

    expect(getOfflineQueue().map((a) => a.type)).toEqual(['fails'])
  })

  it('does not duplicate a failed action across repeated runs', async () => {
    queueOfflineAction(action('fails'))
    const failing = async () => {
      throw new Error('network down')
    }

    await processOfflineQueue(failing)
    await processOfflineQueue(failing)

    expect(getOfflineQueue()).toHaveLength(1)
  })

  it('preserves the original payload of a retried action', async () => {
    queueOfflineAction({ type: 'alert', payload: { contacts: 3 }, timestamp: 42 })

    await processOfflineQueue(async () => {
      throw new Error('network down')
    })

    expect(getOfflineQueue()[0]).toEqual({
      type: 'alert',
      payload: { contacts: 3 },
      timestamp: 42,
    })
  })

  it('does nothing when the queue is empty', async () => {
    const processor = vi.fn()

    await processOfflineQueue(processor)

    expect(processor).not.toHaveBeenCalled()
  })
})
