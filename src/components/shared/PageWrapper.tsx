'use client'

import { ReactNode } from 'react'
import { AppHeader } from './AppHeader'

interface PageWrapperProps {
  children: ReactNode
  showBack?: boolean
  title?: string
  subtitle?: string
}

export function PageWrapper({ children, showBack = true, title, subtitle }: PageWrapperProps) {
  return (
    <>
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
    </>
  )
}

export default PageWrapper
