'use client'

import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get stored theme or default to dark
    const stored = localStorage.getItem('icewhistle-theme') as Theme | null
    if (stored) {
      setThemeState(stored)
      applyTheme(stored)
    } else {
      // Default to dark mode
      setThemeState('dark')
      applyTheme('dark')
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('icewhistle-theme', newTheme)
    applyTheme(newTheme)
  }

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'light' : 'dark')
  }

  return {
    theme,
    setTheme,
    toggleTheme,
    mounted,
    isDark: mounted && document.documentElement.classList.contains('dark')
  }
}
