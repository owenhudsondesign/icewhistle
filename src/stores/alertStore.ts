import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Alert, AlertType, AlertFilters, AlertMapBounds } from '@/types/alert'

interface AlertState {
  alerts: Alert[]
  filters: AlertFilters
  mapBounds: AlertMapBounds | null
  isLoading: boolean
  error: string | null
  lastFetched: number | null
}

interface AlertActions {
  setAlerts: (alerts: Alert[]) => void
  addAlert: (alert: Alert) => void
  updateAlert: (id: string, updates: Partial<Alert>) => void
  removeAlert: (id: string) => void
  setFilters: (filters: Partial<AlertFilters>) => void
  setMapBounds: (bounds: AlertMapBounds) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearAlerts: () => void
}

export const useAlertStore = create<AlertState & AlertActions>()(
  persist(
    (set) => ({
      // State
      alerts: [],
      filters: {},
      mapBounds: null,
      isLoading: false,
      error: null,
      lastFetched: null,

      // Actions
      setAlerts: (alerts) =>
        set({ alerts, lastFetched: Date.now(), error: null }),

      addAlert: (alert) =>
        set((state) => ({
          alerts: [alert, ...state.alerts],
        })),

      updateAlert: (id, updates) =>
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id ? { ...alert, ...updates } : alert
          ),
        })),

      removeAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.filter((alert) => alert.id !== id),
        })),

      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),

      setMapBounds: (bounds) => set({ mapBounds: bounds }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error, isLoading: false }),

      clearAlerts: () =>
        set({ alerts: [], lastFetched: null, error: null }),
    }),
    {
      name: 'icewhistle-alerts',
      partialize: (state) => ({
        alerts: state.alerts,
        filters: state.filters,
        lastFetched: state.lastFetched,
      }),
    }
  )
)

// Selectors
export const selectFilteredAlerts = (state: AlertState): Alert[] => {
  const { alerts, filters } = state

  return alerts.filter((alert) => {
    // Filter by type
    if (filters.types && filters.types.length > 0) {
      if (!filters.types.includes(alert.alertType as AlertType)) {
        return false
      }
    }

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(alert.status as any)) {
        return false
      }
    }

    // Filter by verification count
    if (
      filters.minVerificationScore !== undefined &&
      alert.verificationCount < filters.minVerificationScore
    ) {
      return false
    }

    // Filter by distance (if center is provided)
    if (
      filters.withinMiles &&
      filters.centerLat !== undefined &&
      filters.centerLng !== undefined
    ) {
      const distance = calculateDistance(
        filters.centerLat,
        filters.centerLng,
        alert.latitude,
        alert.longitude
      )
      if (distance > filters.withinMiles) {
        return false
      }
    }

    return true
  })
}

// Helper function to calculate distance between two points
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}
