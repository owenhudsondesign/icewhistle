'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'

interface FeatureFlags {
  // Reporting submission controls
  reporting_submit_enabled_web: boolean
  reporting_submit_enabled_ios: boolean
  reporting_submit_enabled_android: boolean

  // Report viewing
  reporting_view_enabled_web: boolean
  reporting_view_enabled_ios: boolean
  reporting_view_enabled_android: boolean

  // Push notifications
  push_enabled: boolean
  push_enabled_ios: boolean
  push_enabled_android: boolean

  // Moderation
  notify_on_approved_only: boolean

  // Kill switches
  maintenance_mode: boolean
  emergency_disable_all: boolean

  // Allow additional flags
  [key: string]: boolean
}

interface FeatureFlagsContextType {
  flags: FeatureFlags
  isLoading: boolean
  error: string | null
  platform: Platform
  canSubmitReports: boolean
  canViewReports: boolean
  isMaintenanceMode: boolean
  refetch: () => Promise<void>
}

type Platform = 'web' | 'ios' | 'android'

const defaultFlags: FeatureFlags = {
  reporting_submit_enabled_web: true,
  reporting_submit_enabled_ios: false,
  reporting_submit_enabled_android: false,
  reporting_view_enabled_web: true,
  reporting_view_enabled_ios: true,
  reporting_view_enabled_android: true,
  push_enabled: true,
  push_enabled_ios: true,
  push_enabled_android: true,
  notify_on_approved_only: true,
  maintenance_mode: false,
  emergency_disable_all: false,
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType | null>(null)

// Detect platform (for future React Native integration)
function detectPlatform(): Platform {
  // In React Native, you would check Platform.OS
  // For now, default to web
  if (typeof window !== 'undefined') {
    // Check for Capacitor or React Native webview hints
    const userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.includes('capacitor') || (window as unknown as { ReactNativeWebView?: unknown }).ReactNativeWebView) {
      // Additional detection could be done here
      // For now, we rely on the app to pass platform via query params or config
    }
  }
  return 'web'
}

export function FeatureFlagsProvider({
  children,
  initialPlatform,
}: {
  children: ReactNode
  initialPlatform?: Platform
}) {
  const [flags, setFlags] = useState<FeatureFlags>(defaultFlags)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [platform] = useState<Platform>(initialPlatform || detectPlatform())

  const fetchFlags = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/feature-flags?platform=${platform}`)
      if (!response.ok) {
        throw new Error('Failed to fetch feature flags')
      }

      const data = await response.json()
      setFlags({ ...defaultFlags, ...data.flags })
    } catch (err) {
      console.error('Error fetching feature flags:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      // Keep using default flags on error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFlags()

    // Refetch flags periodically (every 5 minutes)
    const interval = setInterval(fetchFlags, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [platform])

  // Computed convenience flags
  const canSubmitReports =
    !flags.maintenance_mode &&
    !flags.emergency_disable_all &&
    flags[`reporting_submit_enabled_${platform}`]

  const canViewReports =
    !flags.maintenance_mode &&
    !flags.emergency_disable_all &&
    flags[`reporting_view_enabled_${platform}`]

  const isMaintenanceMode = flags.maintenance_mode || flags.emergency_disable_all

  return (
    <FeatureFlagsContext.Provider
      value={{
        flags,
        isLoading,
        error,
        platform,
        canSubmitReports,
        canViewReports,
        isMaintenanceMode,
        refetch: fetchFlags,
      }}
    >
      {children}
    </FeatureFlagsContext.Provider>
  )
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext)
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider')
  }
  return context
}

// Standalone hook for simple flag checks (without context)
export function useFeatureFlag(flagKey: string, defaultValue = false): boolean {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    fetch('/api/feature-flags?platform=web')
      .then((res) => res.json())
      .then((data) => {
        if (data.flags && flagKey in data.flags) {
          setValue(data.flags[flagKey])
        }
      })
      .catch(() => {
        // Keep default on error
      })
  }, [flagKey])

  return value
}
