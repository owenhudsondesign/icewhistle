'use client'

import { useState } from 'react'
import { Alert, ALERT_TYPES, getTimeAgo, getDistanceMiles } from '@/types/alert'
import { Button } from '@/components/ui/button'
import {
  AlertTriangle,
  Building2,
  Home,
  ShieldAlert,
  Car,
  Train,
  HelpCircle,
  CheckCircle,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  ThumbsUp
} from 'lucide-react'

interface AlertFeedProps {
  alerts: Alert[]
  userLocation?: { lat: number; lng: number } | null
  onAlertClick?: (alert: Alert) => void
  onVerifyAlert?: (alertId: string) => Promise<void>
  selectedAlertId?: string | null
}

const ICONS: Record<string, React.ReactNode> = {
  AlertTriangle: <AlertTriangle className="h-5 w-5" strokeWidth={2} />,
  Building2: <Building2 className="h-5 w-5" strokeWidth={2} />,
  Home: <Home className="h-5 w-5" strokeWidth={2} />,
  ShieldAlert: <ShieldAlert className="h-5 w-5" strokeWidth={2} />,
  Car: <Car className="h-5 w-5" strokeWidth={2} />,
  Train: <Train className="h-5 w-5" strokeWidth={2} />,
  HelpCircle: <HelpCircle className="h-5 w-5" strokeWidth={2} />,
  CheckCircle: <CheckCircle className="h-5 w-5" strokeWidth={2} />,
}

// Map alert types to Soft Transit colors
const TYPE_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  ice_raid: { bg: 'bg-[#DC2626]/10', text: 'text-[#DC2626]', bar: 'category-bar-emergency' },
  ice_workplace: { bg: 'bg-[#DC2626]/10', text: 'text-[#DC2626]', bar: 'category-bar-emergency' },
  ice_residence: { bg: 'bg-[#DC2626]/10', text: 'text-[#DC2626]', bar: 'category-bar-emergency' },
  ice_checkpoint: { bg: 'bg-[#FF8C42]/10', text: 'text-[#FF8C42]', bar: 'category-bar-tangerine' },
  ice_vehicle: { bg: 'bg-[#8B5CF6]/10', text: 'text-[#8B5CF6]', bar: 'category-bar-grape' },
  ice_transit: { bg: 'bg-[#00A6B4]/10', text: 'text-[#00A6B4]', bar: 'category-bar-bondi' },
  other: { bg: 'bg-muted', text: 'text-muted-foreground', bar: '' },
}

export function AlertFeed({
  alerts,
  userLocation,
  onAlertClick,
  onVerifyAlert,
  selectedAlertId
}: AlertFeedProps) {
  const [verifyingId, setVerifyingId] = useState<string | null>(null)

  const handleVerify = async (e: React.MouseEvent, alertId: string) => {
    e.stopPropagation()
    if (!onVerifyAlert) return

    setVerifyingId(alertId)
    try {
      await onVerifyAlert(alertId)
    } finally {
      setVerifyingId(null)
    }
  }

  // Sort alerts by priority and time
  const sortedAlerts = [...alerts].sort((a, b) => {
    const typeA = ALERT_TYPES[a.alertType]
    const typeB = ALERT_TYPES[b.alertType]
    // Sort by priority first, then by time
    if (typeA.priority !== typeB.priority) {
      return typeA.priority - typeB.priority
    }
    return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
  })

  if (alerts.length === 0) {
    return (
      <div className="text-center py-12 card-glass">
        <CheckCircle className="h-12 w-12 text-[#84CC16] mx-auto mb-4" strokeWidth={2} />
        <h3 className="text-headline mb-2">No active alerts</h3>
        <p className="text-muted-foreground text-caption">
          No ICE activity has been reported in this area recently.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sortedAlerts.map((alert) => {
        const type = ALERT_TYPES[alert.alertType]
        const colors = TYPE_COLORS[alert.alertType] || TYPE_COLORS.other
        const timeAgo = getTimeAgo(alert.reportedAt)
        const distance = userLocation
          ? getDistanceMiles(userLocation.lat, userLocation.lng, alert.latitude, alert.longitude)
          : null
        const isVerified = alert.verificationCount >= 3
        const isSelected = alert.id === selectedAlertId

        return (
          <div
            key={alert.id}
            onClick={() => onAlertClick?.(alert)}
            className={`
              card-glass category-bar ${colors.bar} p-4 cursor-pointer press-scale
              ${isSelected ? 'ring-2 ring-[#00A6B4] ring-offset-2' : ''}
            `}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div
                className={`
                  flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                  ${colors.bg} ${colors.text}
                `}
              >
                {ICONS[type.icon]}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-caption font-semibold flex items-center gap-2">
                      {type.label}
                      {isVerified && (
                        <span className="px-1.5 py-0.5 text-small bg-[#84CC16]/20 text-[#84CC16] rounded-[4px] font-medium">
                          Verified
                        </span>
                      )}
                    </h4>
                    <p className="text-small text-muted-foreground">{type.labelEs}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" strokeWidth={2} />
                </div>

                {alert.description && (
                  <p className="text-caption text-muted-foreground mt-1 line-clamp-2">
                    {alert.description}
                  </p>
                )}

                {alert.address && (
                  <p className="text-small text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" strokeWidth={2} />
                    {alert.address}
                  </p>
                )}

                {/* Meta info */}
                <div className="flex items-center gap-3 mt-2 text-small text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" strokeWidth={2} />
                    {timeAgo}
                  </span>
                  {distance !== null && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" strokeWidth={2} />
                      {distance < 0.1 ? 'Very close' : `${distance.toFixed(1)} mi`}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" strokeWidth={2} />
                    {alert.verificationCount} confirmation{alert.verificationCount !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Verify button */}
                {onVerifyAlert && !isVerified && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 h-10 text-small text-[#00A6B4] hover:bg-[#00A6B4]/10 rounded-[8px] press-scale"
                    onClick={(e) => handleVerify(e, alert.id)}
                    disabled={verifyingId === alert.id}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" strokeWidth={2} />
                    {verifyingId === alert.id ? 'Confirming...' : 'I see this too'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AlertFeed
