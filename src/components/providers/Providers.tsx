'use client'

import { ReactNode } from 'react'
import { LanguageProvider } from '@/hooks/use-language'
import { FeatureFlagsProvider } from '@/hooks/use-feature-flags'
import { LocationProvider } from '@/hooks/use-location'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <FeatureFlagsProvider>
      <LanguageProvider>
        <LocationProvider>
          {children}
        </LocationProvider>
      </LanguageProvider>
    </FeatureFlagsProvider>
  )
}
