'use client'

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react'

// Supported languages - add new language codes here
// Primary languages shown prominently, others accessible via "More"
export const PRIMARY_LANGUAGES = ['en', 'es', 'pt'] as const
export const SUPPORTED_LANGUAGES = [
  'en', 'es', 'pt',           // Primary (big three)
  'zh', 'zh-TW',              // Chinese (Simplified, Traditional)
  'vi', 'tl', 'ko',           // Vietnamese, Tagalog, Korean
  'ar', 'fa',                 // Arabic, Farsi
  'fr', 'ht',                 // French, Haitian Creole
  'hi', 'pa', 'ur', 'bn', 'gu', 'ne', // South Asian
  'ru', 'uk', 'pl',           // Eastern European
  'ja', 'th', 'km', 'my', 'lo', // East/Southeast Asian
  'am', 'so',                 // East African
  'de', 'it',                 // Western European
] as const
export type Language = typeof SUPPORTED_LANGUAGES[number]

// Language metadata for UI display
export const LANGUAGE_META: Record<Language, { label: string; name: string; nativeName: string; dir: 'ltr' | 'rtl' }> = {
  // Primary (Big Three)
  en: { label: 'EN', name: 'English', nativeName: 'English', dir: 'ltr' },
  es: { label: 'ES', name: 'Spanish', nativeName: 'Español', dir: 'ltr' },
  pt: { label: 'PT', name: 'Portuguese', nativeName: 'Português', dir: 'ltr' },
  // Chinese
  zh: { label: '中文', name: 'Chinese (Simplified)', nativeName: '简体中文', dir: 'ltr' },
  'zh-TW': { label: '繁體', name: 'Chinese (Traditional)', nativeName: '繁體中文', dir: 'ltr' },
  // Southeast Asian
  vi: { label: 'VI', name: 'Vietnamese', nativeName: 'Tiếng Việt', dir: 'ltr' },
  tl: { label: 'TL', name: 'Tagalog', nativeName: 'Tagalog', dir: 'ltr' },
  ko: { label: '한국어', name: 'Korean', nativeName: '한국어', dir: 'ltr' },
  th: { label: 'TH', name: 'Thai', nativeName: 'ไทย', dir: 'ltr' },
  km: { label: 'KM', name: 'Khmer', nativeName: 'ខ្មែរ', dir: 'ltr' },
  my: { label: 'MY', name: 'Burmese', nativeName: 'မြန်မာ', dir: 'ltr' },
  lo: { label: 'LO', name: 'Lao', nativeName: 'ລາວ', dir: 'ltr' },
  ja: { label: '日本語', name: 'Japanese', nativeName: '日本語', dir: 'ltr' },
  // Middle Eastern (RTL)
  ar: { label: 'AR', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  fa: { label: 'FA', name: 'Farsi', nativeName: 'فارسی', dir: 'rtl' },
  // South Asian
  hi: { label: 'HI', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' },
  pa: { label: 'PA', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', dir: 'ltr' },
  ur: { label: 'UR', name: 'Urdu', nativeName: 'اردو', dir: 'rtl' },
  bn: { label: 'BN', name: 'Bengali', nativeName: 'বাংলা', dir: 'ltr' },
  gu: { label: 'GU', name: 'Gujarati', nativeName: 'ગુજરાતી', dir: 'ltr' },
  ne: { label: 'NE', name: 'Nepali', nativeName: 'नेपाली', dir: 'ltr' },
  // French & Creole
  fr: { label: 'FR', name: 'French', nativeName: 'Français', dir: 'ltr' },
  ht: { label: 'HT', name: 'Haitian Creole', nativeName: 'Kreyòl Ayisyen', dir: 'ltr' },
  // Eastern European
  ru: { label: 'RU', name: 'Russian', nativeName: 'Русский', dir: 'ltr' },
  uk: { label: 'UK', name: 'Ukrainian', nativeName: 'Українська', dir: 'ltr' },
  pl: { label: 'PL', name: 'Polish', nativeName: 'Polski', dir: 'ltr' },
  // East African
  am: { label: 'AM', name: 'Amharic', nativeName: 'አማርኛ', dir: 'ltr' },
  so: { label: 'SO', name: 'Somali', nativeName: 'Soomaali', dir: 'ltr' },
  // Western European
  de: { label: 'DE', name: 'German', nativeName: 'Deutsch', dir: 'ltr' },
  it: { label: 'IT', name: 'Italian', nativeName: 'Italiano', dir: 'ltr' },
}

// Type definition for translations structure
// This matches the JSON structure - update when adding new namespaces
export interface Translations {
  common: {
    loading: string
    search: string
    learnMore: string
    back: string
    close: string
    save: string
    cancel: string
    submit: string
    confirm: string
    delete: string
    edit: string
    seeAll: string
    viewAll: string
    available247: string
    anonymous: string
    verified: string
    active: string
    share: string
    download: string
  }
  nav: {
    home: string
    alerts: string
    report: string
    rights: string
    faq: string
    emergency: string
    about: string
    support: string
    install: string
    iosTitle: string
    iosStep1: string
    iosStep2: string
    iosStep3: string
    gotIt: string
  }
  home: Record<string, string>
  alerts: Record<string, string>
  rights: Record<string, string>
  faq: Record<string, string | string[]>
  emergency: Record<string, string>
  about: Record<string, string>
  support: Record<string, string>
  recording: Record<string, string>
  hotlines: Record<string, string>
  resources: Record<string, string>
  search: Record<string, string>
  offline: Record<string, string>
  privacy: Record<string, string>
  terms: Record<string, string>
  disclaimer: Record<string, string>
}

// Default/fallback translations (English) - loaded synchronously
const defaultTranslations: Translations = {
  common: {
    loading: 'Loading...',
    search: 'Search',
    learnMore: 'Learn more',
    back: 'Back',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    seeAll: 'See all',
    viewAll: 'View all',
    available247: '24/7',
    anonymous: 'Anonymous',
    verified: 'Verified',
    active: 'active',
    share: 'Share',
    download: 'Download',
  },
  nav: {
    home: 'Home',
    alerts: 'Alerts',
    report: 'Report',
    rights: 'Rights',
    faq: 'FAQ',
    emergency: 'Emergency',
    about: 'About',
    support: 'Support',
    install: 'Install App',
    iosTitle: 'Install on iPhone/iPad',
    iosStep1: '1. Tap the Share button',
    iosStep2: '2. Scroll down and tap "Add to Home Screen"',
    iosStep3: '3. Tap "Add" to install',
    gotIt: 'Got it',
  },
  home: {},
  alerts: {},
  rights: {},
  faq: {},
  emergency: {},
  about: {},
  support: {},
  recording: {},
  hotlines: {},
  resources: {},
  search: {},
  offline: {},
  privacy: {},
  terms: {},
  disclaimer: {},
}

// Cache for loaded translations
const translationsCache: Map<Language, Translations> = new Map()

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  mounted: boolean
  t: Translations
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | null>(null)

// Helper to load translations for a language
async function loadTranslations(lang: Language): Promise<Translations> {
  // Check cache first
  const cached = translationsCache.get(lang)
  if (cached) return cached

  try {
    // Load from JSON file
    const response = await fetch(`/locales/${lang}.json`)
    if (!response.ok) {
      console.warn(`Failed to load translations for ${lang}, falling back to English`)
      return defaultTranslations
    }
    const data = await response.json() as Translations

    // Cache the result
    translationsCache.set(lang, data)
    return data
  } catch (error) {
    console.warn(`Error loading translations for ${lang}:`, error)
    return defaultTranslations
  }
}

// Pre-load all translation files in the background for offline access
// This ensures users can switch languages even when offline
async function preloadAllTranslations() {
  // Wait a bit to not block initial page load
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Load each language file in the background
  for (const lang of SUPPORTED_LANGUAGES) {
    if (!translationsCache.has(lang)) {
      try {
        const response = await fetch(`/locales/${lang}.json`)
        if (response.ok) {
          const data = await response.json() as Translations
          translationsCache.set(lang, data)
        }
      } catch {
        // Silently fail - will try again on demand
      }
    }
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)
  const [translations, setTranslations] = useState<Translations>(defaultTranslations)
  const [isLoading, setIsLoading] = useState(true)

  // Load initial language and translations
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('icewhistle-lang') as Language | null
    const initialLang = stored && SUPPORTED_LANGUAGES.includes(stored) ? stored : 'en'

    setLanguageState(initialLang)

    // Load translations for initial language
    loadTranslations(initialLang).then(t => {
      setTranslations(t)
      setIsLoading(false)

      // Pre-load all other translations in background for offline access
      preloadAllTranslations()
    })
  }, [])

  const setLanguage = useCallback(async (lang: Language) => {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      console.warn(`Unsupported language: ${lang}`)
      return
    }

    setLanguageState(lang)
    localStorage.setItem('icewhistle-lang', lang)

    // Load translations for new language
    setIsLoading(true)
    const t = await loadTranslations(lang)
    setTranslations(t)
    setIsLoading(false)
  }, [])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, mounted, t: translations, isLoading }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    // Fallback for components outside provider (shouldn't happen in normal use)
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      mounted: false,
      t: defaultTranslations,
      isLoading: false,
    }
  }
  return context
}

// Re-export for convenience - components can import LANGUAGE_META to build language selectors
export { translationsCache }
