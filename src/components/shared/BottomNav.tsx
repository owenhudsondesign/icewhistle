'use client'

import { useState, useEffect, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MapPin, Plus, Shield, Phone, MessageCircleQuestion } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import { cn } from '@/lib/utils'
import { Capacitor } from '@capacitor/core'

// Wrapper that adds bottom padding only in native app
export function AppWrapper({ children }: { children: ReactNode }) {
  const [isNative, setIsNative] = useState(false)

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform())
  }, [])

  return (
    <div className={isNative ? 'pb-20' : ''}>
      {children}
    </div>
  )
}

const navTranslations = {
  en: {
    home: 'Home',
    alerts: 'Alerts',
    report: 'Report',
    rights: 'Rights',
    faq: 'FAQ',
    emergency: 'Emergency',
  },
  es: {
    home: 'Inicio',
    alerts: 'Alertas',
    report: 'Reportar',
    rights: 'Derechos',
    faq: 'Preguntas',
    emergency: 'Emergencia',
  },
  pt: {
    home: 'Início',
    alerts: 'Alertas',
    report: 'Reportar',
    rights: 'Direitos',
    faq: 'Perguntas',
    emergency: 'Emergência',
  },
}

export function BottomNav() {
  const pathname = usePathname()
  const { language } = useLanguage()
  const t = navTranslations[language]
  const [isNative, setIsNative] = useState(false)

  useEffect(() => {
    // Only show bottom nav in native Capacitor app
    setIsNative(Capacitor.isNativePlatform())
  }, [])

  // Don't render on web
  if (!isNative) return null

  const tabs = [
    { href: '/', icon: Home, label: t.home },
    { href: '/alerts', icon: MapPin, label: t.alerts },
    { href: '/alerts?report=true', icon: Plus, label: t.report, isReport: true },
    { href: '/rights', icon: Shield, label: t.rights },
    { href: '/faq', icon: MessageCircleQuestion, label: t.faq },
    { href: '/emergency', icon: Phone, label: t.emergency },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href.includes('?')) return false // Report button never shows as active
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map(({ href, icon: Icon, label, isReport }) => {
          const active = isActive(href)

          if (isReport) {
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center gap-0.5 -mt-4"
              >
                <div className="w-14 h-14 rounded-full bg-[#DC2626] flex items-center justify-center shadow-lg shadow-[#DC2626]/30 press-scale">
                  <Icon className="h-7 w-7 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-medium text-[#DC2626] mt-1">{label}</span>
              </Link>
            )
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-lg transition-colors min-w-[60px]",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "text-primary")} strokeWidth={active ? 2.5 : 2} />
              <span className={cn("text-[10px]", active ? "font-semibold" : "font-medium")}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
