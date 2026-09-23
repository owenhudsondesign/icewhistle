'use client'

import { useOffline } from '@/hooks/useOffline'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { WifiOff } from 'lucide-react'

export function OfflineIndicator() {
  const { offline } = useOffline()

  if (!offline) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-auto">
      <Alert variant="warning" className="flex items-center gap-2">
        <WifiOff className="h-4 w-4" aria-hidden="true" />
        <AlertDescription>
          You are offline. Some features may be limited.
        </AlertDescription>
      </Alert>
    </div>
  )
}
