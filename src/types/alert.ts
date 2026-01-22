/**
 * Alert types for ICE activity reporting
 */

export type AlertType =
  | 'ice_raid'
  | 'ice_checkpoint'
  | 'ice_vehicle'
  | 'ice_transit'
  | 'ice_workplace'
  | 'ice_residence'
  | 'unconfirmed'
  | 'all_clear'

export type AlertStatus = 'unverified' | 'verified' | 'disputed' | 'resolved' | 'expired'

export interface Alert {
  id: string
  latitude: number
  longitude: number
  address?: string
  neighborhood?: string
  alertType: AlertType
  description?: string
  status: AlertStatus
  verificationCount: number
  reportedAt: string
  occurredAt: string
  expiresAt: string
  resolvedAt?: string
  // Computed on client
  timeAgo?: string
  distance?: number
}

export interface AlertSubmission {
  latitude: number
  longitude: number
  address?: string
  alertType: AlertType
  description?: string
  occurredAt?: string
}

export interface AlertFilters {
  types?: AlertType[]
  status?: AlertStatus[]
  maxAgeHours?: number
  bounds?: AlertMapBounds
  minVerificationScore?: number
  withinMiles?: number
  centerLat?: number
  centerLng?: number
}

export interface AlertMapBounds {
  north: number
  south: number
  east: number
  west: number
}

export const ALERT_TYPES: Record<AlertType, {
  label: string
  labelEs: string
  labelPt: string
  icon: string
  color: string
  markerColor: string
  description: string
  priority: number
}> = {
  ice_raid: {
    label: 'ICE Presence',
    labelEs: 'Presencia de ICE',
    labelPt: 'Presença do ICE',
    icon: 'AlertTriangle',
    color: 'text-red-600',
    markerColor: '#dc2626',
    description: 'ICE activity in the area',
    priority: 1
  },
  ice_workplace: {
    label: 'Workplace Raid',
    labelEs: 'Redada Laboral',
    labelPt: 'Batida no Trabalho',
    icon: 'Building2',
    color: 'text-red-600',
    markerColor: '#dc2626',
    description: 'ICE at a workplace',
    priority: 1
  },
  ice_residence: {
    label: 'Residential Activity',
    labelEs: 'Actividad Residencial',
    labelPt: 'Atividade Residencial',
    icon: 'Home',
    color: 'text-red-600',
    markerColor: '#dc2626',
    description: 'ICE at homes/apartments',
    priority: 1
  },
  ice_checkpoint: {
    label: 'Checkpoint',
    labelEs: 'Puesto de Control',
    labelPt: 'Posto de Controle',
    icon: 'ShieldAlert',
    color: 'text-orange-600',
    markerColor: '#ea580c',
    description: 'Immigration checkpoint',
    priority: 2
  },
  ice_vehicle: {
    label: 'ICE Vehicle Spotted',
    labelEs: 'Vehículo de ICE',
    labelPt: 'Veículo do ICE',
    icon: 'Car',
    color: 'text-amber-600',
    markerColor: '#d97706',
    description: 'ICE vehicle in the area',
    priority: 3
  },
  ice_transit: {
    label: 'ICE on Transit',
    labelEs: 'ICE en Transporte',
    labelPt: 'ICE no Transporte',
    icon: 'Train',
    color: 'text-purple-600',
    markerColor: '#9333ea',
    description: 'ICE on public transportation',
    priority: 2
  },
  unconfirmed: {
    label: 'Unconfirmed',
    labelEs: 'Sin Confirmar',
    labelPt: 'Não Confirmado',
    icon: 'HelpCircle',
    color: 'text-gray-500',
    markerColor: '#6b7280',
    description: 'Unverified report',
    priority: 4
  },
  all_clear: {
    label: 'All Clear',
    labelEs: 'Despejado',
    labelPt: 'Tudo Livre',
    icon: 'CheckCircle',
    color: 'text-green-600',
    markerColor: '#16a34a',
    description: 'Activity has ended',
    priority: 5
  }
}

export const ALERT_EXPIRY_HOURS = 6
export const VERIFICATION_THRESHOLD = 3

// Helper to calculate time ago
export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

// Helper to calculate distance between coordinates (Haversine formula)
export function getDistanceMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Fuzzy location - round to ~0.001 degrees (~100m) for privacy
export function fuzzyLocation(coord: number): number {
  return Math.round(coord * 1000) / 1000
}
