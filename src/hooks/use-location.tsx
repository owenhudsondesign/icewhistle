'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'

interface SavedLocation {
  zipCode: string
  lat: number
  lng: number
  city?: string
}

interface LocationContextType {
  savedLocation: SavedLocation | null
  setSavedLocation: (location: SavedLocation | null) => void
  clearSavedLocation: () => void
  mounted: boolean
}

const LocationContext = createContext<LocationContextType | null>(null)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [savedLocation, setSavedLocationState] = useState<SavedLocation | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('icewhistle-location')
    if (stored) {
      try {
        setSavedLocationState(JSON.parse(stored))
      } catch {
        // Invalid JSON, clear it
        localStorage.removeItem('icewhistle-location')
      }
    }
  }, [])

  const setSavedLocation = (location: SavedLocation | null) => {
    setSavedLocationState(location)
    if (location) {
      localStorage.setItem('icewhistle-location', JSON.stringify(location))
    } else {
      localStorage.removeItem('icewhistle-location')
    }
  }

  const clearSavedLocation = () => {
    setSavedLocationState(null)
    localStorage.removeItem('icewhistle-location')
  }

  return (
    <LocationContext.Provider value={{ savedLocation, setSavedLocation, clearSavedLocation, mounted }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (!context) {
    return {
      savedLocation: null,
      setSavedLocation: () => {},
      clearSavedLocation: () => {},
      mounted: false
    }
  }
  return context
}

// Geocode a US zip code using Nominatim (OpenStreetMap)
export async function geocodeZipCode(zipCode: string): Promise<{ lat: number; lng: number; city?: string } | null> {
  try {
    // Clean the zip code
    const cleanZip = zipCode.trim().replace(/[^0-9]/g, '')
    if (cleanZip.length !== 5) {
      return null
    }

    // Use Nominatim for geocoding (free, no API key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${cleanZip}&country=US&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'ICEwhistle/1.0 (community safety app)'
        }
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    if (data.length === 0) {
      return null
    }

    const result = data[0]
    return {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      city: result.display_name?.split(',')[0]
    }
  } catch (error) {
    console.error('Error geocoding zip code:', error)
    return null
  }
}
