'use client'

import { AppHeader } from '@/components/shared/AppHeader'
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
  const t = translations[language]

  return (
    <div className="min-h-screen bg-background pb-8">
      <AppHeader showBack backHref="/" title={t.title} subtitle={t.subtitle} />

      <main className="container mx-auto px-4 py-6 max-w-lg">
        <EmergencyContactsManager />
      </main>
    </div>
  )
}
