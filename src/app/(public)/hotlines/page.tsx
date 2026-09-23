'use client'

import { useEffect } from 'react'
import { AppHeader } from '@/components/shared/AppHeader'
import { SkipToContent } from '@/components/shared/SkipToContent'
import { HotlineDirectory } from '@/components/hotlines/HotlineDirectory'
import { useLanguage } from '@/hooks/use-language'
import { Phone, Shield } from 'lucide-react'
import { trackHotlinesPageView } from '@/lib/analytics'

export default function HotlinesPage() {
  const { language } = useLanguage()

  useEffect(() => {
    trackHotlinesPageView()
  }, [])

  return (
    <div className="min-h-screen bg-background pb-28">
      <SkipToContent />
      <AppHeader />

      <main id="main-content" tabIndex={-1} className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#DC2626]/10 flex items-center justify-center mb-4">
            <Phone className="h-8 w-8 text-[#DC2626]" />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {language === 'es' ? 'Líneas de Emergencia' : 'Emergency Hotlines'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {language === 'es'
              ? 'Líneas directas de respuesta rápida y apoyo legal'
              : 'Rapid response and legal support hotlines'}
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="flex items-start gap-3 p-4 bg-[#00A6B4]/10 rounded-[12px] mb-6">
          <Shield className="h-5 w-5 text-[#00A6B4] mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            {language === 'es'
              ? 'Tu código postal se guarda solo en tu dispositivo. Nunca se envía a ningún servidor.'
              : 'Your ZIP code is stored only on your device. It is never sent to any server.'}
          </p>
        </div>

        {/* Hotline Directory */}
        <HotlineDirectory headingLevel={2} showZipInput={true} />
      </main>
    </div>
  )
}
