/**
 * ZipRadiusService
 *
 * Handles ZIP code geocoding and radius-based matching for push notifications.
 * Uses Haversine formula to calculate distances between coordinates.
 */

import { PrismaClient, ZipPreference, PushSubscription } from '@prisma/client'

const prisma = new PrismaClient()

// Earth's radius in miles
const EARTH_RADIUS_MILES = 3959

// Default notification radius in miles
export const DEFAULT_RADIUS_MILES = 5

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns Distance in miles
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return EARTH_RADIUS_MILES * c
}

/**
 * Check if a point is within a given radius of another point
 */
export function isWithinRadius(
  alertLat: number,
  alertLng: number,
  zipLat: number,
  zipLng: number,
  radiusMiles: number = DEFAULT_RADIUS_MILES
): boolean {
  const distance = haversineDistance(alertLat, alertLng, zipLat, zipLng)
  return distance <= radiusMiles
}

/**
 * Geocode a ZIP code to lat/lng using various methods
 * Priority: 1) Cache, 2) Nominatim (OpenStreetMap)
 */
export async function geocodeZipCode(
  zipCode: string
): Promise<{ latitude: number; longitude: number; city?: string; state?: string } | null> {
  // Check cache first
  const cached = await prisma.zipCodeCache.findUnique({
    where: { zipCode },
  })

  if (cached) {
    return {
      latitude: cached.latitude,
      longitude: cached.longitude,
      city: cached.city || undefined,
      state: cached.state || undefined,
    }
  }

  // Use Nominatim (OpenStreetMap) for geocoding - free, no API key, privacy-focused
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${zipCode}+USA&postalcode=${zipCode}&countrycodes=us&limit=1`,
      {
        headers: {
          'User-Agent': 'ICEwhistle/1.0 (https://icewhistle.org)'
        }
      }
    )

    if (response.ok) {
      const data = await response.json()
      if (data && data.length > 0) {
        const result = data[0]
        const latitude = parseFloat(result.lat)
        const longitude = parseFloat(result.lon)

        // Extract city and state from display_name
        // Format is usually: "12345, City, County, State, USA"
        let city: string | undefined
        let state: string | undefined

        if (result.display_name) {
          const parts = result.display_name.split(', ')
          if (parts.length >= 4) {
            city = parts[1]
            state = parts[parts.length - 2] // State is second to last
          }
        }

        // Cache the result
        await prisma.zipCodeCache.create({
          data: {
            zipCode,
            latitude,
            longitude,
            city,
            state,
          },
        })

        return { latitude, longitude, city, state }
      }
    }
  } catch (error) {
    console.error('Nominatim geocoding failed:', error)
  }

  // Fallback: return null if we can't geocode
  return null
}

/**
 * Find all push subscriptions that should be notified for an alert at the given location
 */
export async function findSubscriptionsNearAlert(
  alertLat: number,
  alertLng: number,
  radiusMiles: number = DEFAULT_RADIUS_MILES
): Promise<(PushSubscription & { zipPreferences: ZipPreference[] })[]> {
  // Get all active subscriptions with their ZIP preferences
  const subscriptions = await prisma.pushSubscription.findMany({
    where: {
      alertsEnabled: true,
      disabledAt: null,
    },
    include: {
      zipPreferences: true,
    },
  })

  // Filter subscriptions that have at least one ZIP within radius
  const matchingSubscriptions = subscriptions.filter((sub) => {
    // Check if any of the user's ZIP preferences are within radius
    return sub.zipPreferences.some((pref) => {
      if (!pref.latitude || !pref.longitude) return false
      return isWithinRadius(alertLat, alertLng, pref.latitude, pref.longitude, radiusMiles)
    })
  })

  return matchingSubscriptions
}

/**
 * Add a ZIP preference for a subscription and geocode it
 */
export async function addZipPreference(
  subscriptionId: string,
  zipCode: string,
  label?: string
): Promise<ZipPreference | null> {
  // Geocode the ZIP code
  const geo = await geocodeZipCode(zipCode)
  if (!geo) {
    console.warn(`Could not geocode ZIP code: ${zipCode}`)
    // Still create the preference, but without coordinates
    // It won't match for notifications but user can fix it later
  }

  const preference = await prisma.zipPreference.create({
    data: {
      subscriptionId,
      zipCode,
      label,
      latitude: geo?.latitude,
      longitude: geo?.longitude,
    },
  })

  return preference
}

/**
 * Update ZIP preferences for a subscription
 */
export async function updateZipPreferences(
  subscriptionId: string,
  zipCodes: { zipCode: string; label?: string }[]
): Promise<ZipPreference[]> {
  // Delete existing preferences
  await prisma.zipPreference.deleteMany({
    where: { subscriptionId },
  })

  // Create new preferences
  const preferences: ZipPreference[] = []
  for (const { zipCode, label } of zipCodes) {
    const pref = await addZipPreference(subscriptionId, zipCode, label)
    if (pref) {
      preferences.push(pref)
    }
  }

  return preferences
}

/**
 * Check if current time is within quiet hours for a subscription
 */
export function isWithinQuietHours(
  quietHoursStart: string | null,
  quietHoursEnd: string | null
): boolean {
  if (!quietHoursStart || !quietHoursEnd) return false

  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTime = currentHour * 60 + currentMinute

  const [startHour, startMinute] = quietHoursStart.split(':').map(Number)
  const [endHour, endMinute] = quietHoursEnd.split(':').map(Number)

  const startTime = startHour * 60 + startMinute
  const endTime = endHour * 60 + endMinute

  // Handle overnight quiet hours (e.g., 22:00 to 07:00)
  if (startTime > endTime) {
    return currentTime >= startTime || currentTime <= endTime
  }

  return currentTime >= startTime && currentTime <= endTime
}

/**
 * Get subscriptions that should receive a notification (filtering out quiet hours)
 */
export async function getNotifiableSubscriptions(
  alertLat: number,
  alertLng: number,
  radiusMiles: number = DEFAULT_RADIUS_MILES
): Promise<PushSubscription[]> {
  const subscriptions = await findSubscriptionsNearAlert(alertLat, alertLng, radiusMiles)

  // Filter out subscriptions in quiet hours
  return subscriptions.filter(
    (sub) => !isWithinQuietHours(sub.quietHoursStart, sub.quietHoursEnd)
  )
}
