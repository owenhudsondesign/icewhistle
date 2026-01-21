import { getRequestConfig } from 'next-intl/server'

export const locales = ['en', 'es', 'zh', 'vi', 'tl', 'ko', 'ar', 'ht', 'pt', 'fr'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  zh: '中文',
  vi: 'Tiếng Việt',
  tl: 'Tagalog',
  ko: '한국어',
  ar: 'العربية',
  ht: 'Kreyòl Ayisyen',
  pt: 'Português',
  fr: 'Français',
}

export default getRequestConfig(async ({ locale }) => ({
  locale: locale || defaultLocale,
  messages: (await import(`../../public/locales/${locale || defaultLocale}/common.json`)).default,
}))
