import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Locale } from '@/lib/i18n'

interface UserPreferences {
  language: Locale
  notifications: {
    alertsEnabled: boolean
    alertRadius: number
    pushEnabled: boolean
    smsEnabled: boolean
  }
  accessibility: {
    highContrast: boolean
    largeText: boolean
    reducedMotion: boolean
  }
  panicButton: {
    enabled: boolean
    contacts: Array<{ name: string; phone: string }>
    customMessage?: string
    includeLocation: boolean
  }
}

interface UserState {
  sessionId: string | null
  deviceHash: string | null
  preferences: UserPreferences
  isOnboarded: boolean
  lastActiveAt: number | null
}

interface UserActions {
  setSessionId: (id: string) => void
  setDeviceHash: (hash: string) => void
  updatePreferences: (updates: Partial<UserPreferences>) => void
  updateNotificationSettings: (
    updates: Partial<UserPreferences['notifications']>
  ) => void
  updateAccessibilitySettings: (
    updates: Partial<UserPreferences['accessibility']>
  ) => void
  updatePanicButtonSettings: (
    updates: Partial<UserPreferences['panicButton']>
  ) => void
  setOnboarded: (onboarded: boolean) => void
  updateLastActive: () => void
  reset: () => void
}

const defaultPreferences: UserPreferences = {
  language: 'en',
  notifications: {
    alertsEnabled: false,
    alertRadius: 10,
    pushEnabled: false,
    smsEnabled: false,
  },
  accessibility: {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
  },
  panicButton: {
    enabled: false,
    contacts: [],
    includeLocation: true,
  },
}

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set) => ({
      // State
      sessionId: null,
      deviceHash: null,
      preferences: defaultPreferences,
      isOnboarded: false,
      lastActiveAt: null,

      // Actions
      setSessionId: (sessionId) => set({ sessionId }),

      setDeviceHash: (deviceHash) => set({ deviceHash }),

      updatePreferences: (updates) =>
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        })),

      updateNotificationSettings: (updates) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            notifications: { ...state.preferences.notifications, ...updates },
          },
        })),

      updateAccessibilitySettings: (updates) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            accessibility: { ...state.preferences.accessibility, ...updates },
          },
        })),

      updatePanicButtonSettings: (updates) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            panicButton: { ...state.preferences.panicButton, ...updates },
          },
        })),

      setOnboarded: (isOnboarded) => set({ isOnboarded }),

      updateLastActive: () => set({ lastActiveAt: Date.now() }),

      reset: () =>
        set({
          sessionId: null,
          deviceHash: null,
          preferences: defaultPreferences,
          isOnboarded: false,
          lastActiveAt: null,
        }),
    }),
    {
      name: 'icewhistle-user',
    }
  )
)

// Selectors
export const selectLanguage = (state: UserState): Locale => state.preferences.language

export const selectIsConfigured = (state: UserState): boolean =>
  state.sessionId !== null && state.isOnboarded

export const selectPanicButtonConfig = (state: UserState) =>
  state.preferences.panicButton
