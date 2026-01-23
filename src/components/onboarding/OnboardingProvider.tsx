'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { OnboardingScreen } from './OnboardingScreen'

const ONBOARDING_KEY = 'icewhistle-onboarding-complete'

interface OnboardingContextType {
  isOnboardingComplete: boolean
  resetOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextType | null>(null)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(ONBOARDING_KEY)
    setIsOnboardingComplete(stored === 'true')
  }, [])

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setIsOnboardingComplete(true)
  }

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY)
    setIsOnboardingComplete(false)
  }

  // Don't render anything until we've checked localStorage
  if (!mounted || isOnboardingComplete === null) {
    return null
  }

  return (
    <OnboardingContext.Provider value={{ isOnboardingComplete, resetOnboarding }}>
      {!isOnboardingComplete && (
        <OnboardingScreen onComplete={completeOnboarding} />
      )}
      {isOnboardingComplete && children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    return { isOnboardingComplete: true, resetOnboarding: () => {} }
  }
  return context
}
