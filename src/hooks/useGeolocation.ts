'use client'

import { useState, useCallback, useEffect } from 'react'

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  error: string | null
  loading: boolean
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
  watch?: boolean
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    watch = false,
  } = options

  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: false,
  })

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      error: null,
      loading: false,
    })
  }, [])

  const handleError = useCallback((error: GeolocationPositionError) => {
    let errorMessage: string

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location permission denied'
        break
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location unavailable'
        break
      case error.TIMEOUT:
        errorMessage = 'Location request timed out'
        break
      default:
        errorMessage = 'An unknown error occurred'
    }

    setState((prev) => ({
      ...prev,
      error: errorMessage,
      loading: false,
    }))
  }, [])

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      }))
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy,
      timeout,
      maximumAge,
    })
  }, [enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError])

  // Watch position if enabled
  useEffect(() => {
    if (!watch || !navigator.geolocation) return

    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy, timeout, maximumAge }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [watch, enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError])

  // Reduce precision for privacy (approximately 0.5 mile radius)
  const getImpreciseLocation = useCallback(() => {
    if (state.latitude === null || state.longitude === null) return null

    // Round to ~0.5 mile precision (about 0.01 degrees)
    return {
      latitude: Math.round(state.latitude * 100) / 100,
      longitude: Math.round(state.longitude * 100) / 100,
    }
  }, [state.latitude, state.longitude])

  return {
    ...state,
    getLocation,
    getImpreciseLocation,
    hasLocation: state.latitude !== null && state.longitude !== null,
  }
}
