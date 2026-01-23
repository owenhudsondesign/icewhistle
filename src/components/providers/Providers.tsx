'use client'

import { ReactNode } from 'react'
import { LanguageProvider } from '@/hooks/use-language'
import { FeatureFlagsProvider } from '@/hooks/use-feature-flags'
import { LocationProvider } from '@/hooks/use-location'
import { OnboardingProvider } from '@/components/onboarding/OnboardingProvider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <FeatureFlagsProvider>
      <LanguageProvider>
        <LocationProvider>
          <OnboardingProvider>
            {children}
          </OnboardingProvider>
        </LocationProvider>
      </LanguageProvider>
    </FeatureFlagsProvider>
  )
}
