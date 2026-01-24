'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, MessageCircleQuestion, Loader2 } from 'lucide-react'
import { FAQChat } from '@/components/faq/FAQChat'
import { useLanguage } from '@/hooks/use-language'

const pageTranslations = {
  en: {
    title: 'FAQ Assistant',
    subtitle: 'Ask about your rights',
    back: 'Back',
  },
  es: {
    title: 'Asistente de Preguntas',
    subtitle: 'Pregunta sobre tus derechos',
    back: 'Atrás',
  },
  pt: {
    title: 'Assistente de Perguntas',
    subtitle: 'Pergunte sobre seus direitos',
    back: 'Voltar',
  },
}

function FAQContent() {
  const { language } = useLanguage()
  const t = pageTranslations[language as keyof typeof pageTranslations] || pageTranslations.en

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-h-[calc(100dvh-4rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-background">
        <Link
          href="/"
          className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
          aria-label={t.back}
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-[#00A6B4]/20 flex items-center justify-center">
            <MessageCircleQuestion className="h-5 w-5 text-[#00A6B4]" />
          </div>
          <div>
            <h1 className="font-semibold">{t.title}</h1>
            <p className="text-xs text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <FAQChat />
    </div>
  )
}

export default function FAQPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#00A6B4]" />
      </div>
    }>
      <FAQContent />
    </Suspense>
  )
}
