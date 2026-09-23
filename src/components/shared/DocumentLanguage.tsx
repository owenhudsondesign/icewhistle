'use client'

import { useEffect } from 'react'
import { useLanguage, LANGUAGE_META } from '@/hooks/use-language'

/**
 * Keeps the document's `lang` and `dir` attributes in step with the selected
 * language.
 *
 * `lang` tells a screen reader which pronunciation rules to use; without it
 * every translation is read aloud with English phonetics. `dir` matters even
 * more: Arabic, Farsi and Urdu are right-to-left, and the app shipped them in
 * a left-to-right layout, which mis-orders punctuation and mirrors the whole
 * interface away from where those readers expect it.
 *
 * Renders nothing.
 */
export function DocumentLanguage() {
  const { language } = useLanguage()

  useEffect(() => {
    const meta = LANGUAGE_META[language]
    if (!meta) return

    const root = document.documentElement
    root.setAttribute('lang', language)
    root.setAttribute('dir', meta.dir)
  }, [language])

  return null
}

export default DocumentLanguage
