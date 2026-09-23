'use client'

import { AppHeader } from '@/components/shared/AppHeader'
import { SkipToContent } from '@/components/shared/SkipToContent'
import { EmergencyContactsManager } from '@/components/emergency-contacts'
import { useLanguage } from '@/hooks/use-language'

const translations = {
  en: {
    title: 'Emergency Contacts',
    subtitle: 'People to alert in an emergency',
  },
  es: {
    title: 'Contactos de Emergencia',
    subtitle: 'Personas para alertar en emergencia',
  },
  pt: {
    title: 'Contatos de Emergência',
    subtitle: 'Pessoas para alertar em emergência',
  },
}

export default function EmergencyContactsPage() {
  const { language } = useLanguage()
  const t = translations[language as keyof typeof translations] || translations.en

  return (
    <div className="min-h-screen bg-background pb-28">
      <SkipToContent />
      <AppHeader />

      <main id="main-content" tabIndex={-1} className="container mx-auto px-4 py-4 max-w-lg">
        <div className="mb-4">
          <h1 className="text-xl font-bold">{t.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
        </div>
        <EmergencyContactsManager />
      </main>
    </div>
  )
}
