'use client'

import { ReactNode, useState, useEffect } from 'react'
import { AppHeader } from './AppHeader'
import { Capacitor } from '@capacitor/core'

interface PageWrapperProps {
  children: ReactNode
  showBack?: boolean
  title?: string
  subtitle?: string
}

// Check if running as installed PWA or native app
function useIsAppMode() {
  const [isAppMode, setIsAppMode] = useState(false)

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      setIsAppMode(true)
      return
    }
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppMode(true)
      return
    }
    if ((navigator as any).standalone === true) {
      setIsAppMode(true)
      return
    }
  }, [])

  return isAppMode
}

export function PageWrapper({ children, showBack = true, title, subtitle }: PageWrapperProps) {
  const isAppMode = useIsAppMode()

  return (
    <div className={isAppMode ? 'pb-24' : ''}>
      <AppHeader showBack={showBack} />
      {title && (
        <div className="container mx-auto px-4 pt-4 max-w-4xl">
          <h1 className="text-xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

export default PageWrapper
