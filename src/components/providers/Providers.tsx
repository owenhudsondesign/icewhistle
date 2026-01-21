'use client'

import { ReactNode } from 'react'
import { LanguageProvider } from '@/hooks/use-language'
import { FeatureFlagsProvider } from '@/hooks/use-feature-flags'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <FeatureFlagsProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </FeatureFlagsProvider>
  )
}
