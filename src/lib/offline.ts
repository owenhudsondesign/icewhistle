/**
 * Offline utilities for PWA functionality
 */

// Check if running in browser
const isBrowser = typeof window !== 'undefined'

/**
 * Check if the app is currently online
 */
export function isOnline(): boolean {
  if (!isBrowser) return true
  return navigator.onLine
}

/**
 * Register for online/offline events
 */
export function registerConnectivityListener(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  if (!isBrowser) return () => {}

  window.addEventListener('online', onOnline)
  window.addEventListener('offline', onOffline)

  return () => {
    window.removeEventListener('online', onOnline)
    window.removeEventListener('offline', onOffline)
  }
}

/**
 * Cache data in localStorage for offline access
 */
export function cacheData<T>(key: string, data: T): void {
  if (!isBrowser) return

  try {
    localStorage.setItem(
      `icewhistle_cache_${key}`,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    )
  } catch (error) {
    console.warn('Failed to cache data:', error)
  }
}

/**
 * Retrieve cached data from localStorage
 */
export function getCachedData<T>(
  key: string,
  maxAge?: number
): T | null {
  if (!isBrowser) return null

  try {
    const cached = localStorage.getItem(`icewhistle_cache_${key}`)
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached)

    // Check if cache is expired
    if (maxAge && Date.now() - timestamp > maxAge) {
      localStorage.removeItem(`icewhistle_cache_${key}`)
      return null
    }

    return data as T
  } catch (error) {
    console.warn('Failed to retrieve cached data:', error)
    return null
  }
}

/**
 * Clear all cached data
 */
export function clearCache(): void {
  if (!isBrowser) return

  const keys = Object.keys(localStorage).filter((key) =>
    key.startsWith('icewhistle_cache_')
  )
  keys.forEach((key) => localStorage.removeItem(key))
}

/** A single action waiting to be sent once connectivity returns. */
export interface OfflineAction {
  type: string
  payload: unknown
  timestamp: number
}

/**
 * Queue an action to be executed when back online
 */
export function queueOfflineAction(action: OfflineAction): void {
  if (!isBrowser) return

  try {
    const queue = JSON.parse(
      localStorage.getItem('icewhistle_offline_queue') || '[]'
    )
    queue.push(action)
    localStorage.setItem('icewhistle_offline_queue', JSON.stringify(queue))
  } catch (error) {
    console.warn('Failed to queue offline action:', error)
  }
}

/**
 * Get all queued offline actions
 */
export function getOfflineQueue(): OfflineAction[] {
  if (!isBrowser) return []

  try {
    return JSON.parse(
      localStorage.getItem('icewhistle_offline_queue') || '[]'
    )
  } catch {
    return []
  }
}

/**
 * Clear the offline queue
 */
export function clearOfflineQueue(): void {
  if (!isBrowser) return
  localStorage.removeItem('icewhistle_offline_queue')
}

/**
 * Process queued offline actions
 */
export async function processOfflineQueue(
  processor: (action: { type: string; payload: unknown }) => Promise<void>
): Promise<void> {
  const queue = getOfflineQueue()
  if (queue.length === 0) return

  const failed: OfflineAction[] = []

  for (const action of queue) {
    try {
      await processor(action)
    } catch (error) {
      console.error('Failed to process offline action:', error)
      failed.push(action)
    }
  }

  // Replace the queue with only what still needs sending. Clearing first and
  // re-queueing inside the loop would drop every failure, which in this app
  // can mean an undelivered emergency alert.
  clearOfflineQueue()
  failed.forEach(queueOfflineAction)
}
