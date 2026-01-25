'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Redirect old /alerts to /hotlines
export default function AlertsRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/hotlines')
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  )
}
