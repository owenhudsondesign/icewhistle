'use client'

import { useUserStore } from '@/stores/userStore'
import { locales, localeNames, type Locale } from '@/lib/i18n'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const { preferences, updatePreferences } = useUserStore()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updatePreferences({ language: e.target.value as Locale })
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <select
        value={preferences.language}
        onChange={handleChange}
        className="bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-ring rounded px-2 py-1"
        aria-label="Select language"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {localeNames[locale]}
          </option>
        ))}
      </select>
    </div>
  )
}
