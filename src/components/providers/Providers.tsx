'use client'

import { ReactNode } from 'react'
import { LanguageProvider } from '@/hooks/use-language'
import { FeatureFlagsProvider } from '@/hooks/use-feature-flags'
import { LocationProvider } from '@/hooks/use-location'
import { OnboardingProvider } from '@/components/onboarding/OnboardingProvider'
import { DocumentLanguage } from '@/components/shared/DocumentLanguage'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <FeatureFlagsProvider>
      <LanguageProvider>
        <DocumentLanguage />
        <LocationProvider>
          <OnboardingProvider>
            {children}
          </OnboardingProvider>
        </LocationProvider>
      </LanguageProvider>
    </FeatureFlagsProvider>
  )
}
