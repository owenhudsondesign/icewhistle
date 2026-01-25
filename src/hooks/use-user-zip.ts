'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'userZip'

export function useUserZip() {
  const [zip, setZipState] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    setZipState(stored)
    setMounted(true)
  }, [])

  const updateZip = useCallback((newZip: string | null) => {
    if (newZip) {
      localStorage.setItem(STORAGE_KEY, newZip)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
    setZipState(newZip)
  }, [])

  const clearZip = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setZipState(null)
  }, [])

  return { zip, updateZip, clearZip, mounted }
}
