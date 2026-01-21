'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  isOnline as checkOnline,
  registerConnectivityListener,
  queueOfflineAction,
  processOfflineQueue,
} from '@/lib/offline'

export function useOffline() {
  const [online, setOnline] = useState(true)

  useEffect(() => {
    // Set initial state
    setOnline(checkOnline())

    // Listen for connectivity changes
    const unsubscribe = registerConnectivityListener(
      () => setOnline(true),
      () => setOnline(false)
    )

    return unsubscribe
  }, [])

  const queueAction = useCallback(
    (type: string, payload: unknown) => {
      queueOfflineAction({
        type,
        payload,
        timestamp: Date.now(),
      })
    },
    []
  )

  const processQueue = useCallback(
    async (
      processor: (action: { type: string; payload: unknown }) => Promise<void>
    ) => {
      if (online) {
        await processOfflineQueue(processor)
      }
    },
    [online]
  )

  return {
    online,
    offline: !online,
    queueAction,
    processQueue,
  }
}
