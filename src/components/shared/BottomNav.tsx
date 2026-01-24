'use client'

import { useState, useEffect, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MapPin, AlertTriangle, Shield, MessageCircleQuestion } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import { cn } from '@/lib/utils'
import { Capacitor } from '@capacitor/core'

// Check if running as installed PWA or native app
function useIsAppMode() {
  const [isAppMode, setIsAppMode] = useState(false)

  useEffect(() => {
    // Check if native Capacitor app
    if (Capacitor.isNativePlatform()) {
      setIsAppMode(true)
      return
    }

    // Check if PWA installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppMode(true)
      return
    }

    // Check iOS standalone (added to home screen)
    if ((navigator as any).standalone === true) {
      setIsAppMode(true)
      return
    }
  }, [])

  return isAppMode
}

// Wrapper that adds bottom padding in app mode (native or PWA)
export function AppWrapper({ children }: { children: ReactNode }) {
  const isAppMode = useIsAppMode()

  return (
    <div className={isAppMode ? 'pb-24' : ''}>
      {children}
    </div>
  )
}

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const nav = t.nav
  const isAppMode = useIsAppMode()

  // Only render in app mode (native or installed PWA)
  if (!isAppMode) return null

  const tabs = [
    { href: '/', icon: Home, label: nav.home },
    { href: '/alerts', icon: MapPin, label: nav.alerts },
    { href: '/alerts?report=true', icon: AlertTriangle, label: nav.report, isReport: true },
    { href: '/rights', icon: Shield, label: nav.rights },
    { href: '/faq', icon: MessageCircleQuestion, label: nav.faq },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href.includes('?')) return false // Report button never shows as active
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-20 max-w-lg mx-auto px-2">
        {tabs.map(({ href, icon: Icon, label, isReport }) => {
          const active = isActive(href)

          if (isReport) {
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center gap-1 px-2"
              >
                <div className="w-11 h-11 rounded-full bg-[#DC2626] flex items-center justify-center shadow-md press-scale">
                  <Icon className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-semibold text-[#DC2626]">{label}</span>
              </Link>
            )
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-colors",
                active
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className={cn("h-6 w-6 flex-shrink-0", active && "text-primary")} strokeWidth={active ? 2.5 : 2} />
              <span className={cn("text-[10px]", active ? "font-semibold" : "font-medium")}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
