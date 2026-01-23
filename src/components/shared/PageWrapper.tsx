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
      <AppHeader showBack={showBack} title={title} subtitle={subtitle} />
      {children}
    </>
  )
}

export default PageWrapper
