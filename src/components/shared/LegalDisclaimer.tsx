'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'

const disclaimerText = {
  en: {
    title: 'Important Information',
    notLegalAdvice: 'This app provides general information only and does not constitute legal advice.',
    notGovernment: 'ICEwhistle is not affiliated with any government agency.',
    informationalOnly: 'All content is for informational and educational purposes only.',
    consultAttorney: 'For advice about your specific situation, consult a qualified immigration attorney.',
    noInterference: 'Do not interfere with law enforcement officers.',
  },
  es: {
    title: 'Información Importante',
    notLegalAdvice: 'Esta aplicación proporciona información general únicamente y no constituye asesoramiento legal.',
    notGovernment: 'ICEwhistle no está afiliado con ninguna agencia gubernamental.',
    informationalOnly: 'Todo el contenido es solo para fines informativos y educativos.',
    consultAttorney: 'Para consejos sobre su situación específica, consulte a un abogado de inmigración calificado.',
    noInterference: 'No interfiera con los oficiales de la ley.',
  },
  pt: {
    title: 'Informação Importante',
    notLegalAdvice: 'Este aplicativo fornece apenas informações gerais e não constitui aconselhamento jurídico.',
    notGovernment: 'ICEwhistle não é afiliado a nenhuma agência governamental.',
    informationalOnly: 'Todo o conteúdo é apenas para fins informativos e educacionais.',
    consultAttorney: 'Para aconselhamento sobre sua situação específica, consulte um advogado de imigração qualificado.',
    noInterference: 'Não interfira com os oficiais da lei.',
  },
}

interface LegalDisclaimerProps {
  variant?: 'full' | 'compact' | 'inline'
  className?: string
}

export function LegalDisclaimer({ variant = 'compact', className = '' }: LegalDisclaimerProps) {
  const { language } = useLanguage()
  const t = disclaimerText[language as keyof typeof disclaimerText] || disclaimerText.en

  if (variant === 'inline') {
    return (
      <p className={`text-xs text-muted-foreground ${className}`}>
        {t.informationalOnly} {t.notLegalAdvice}
      </p>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`text-xs text-muted-foreground text-center space-y-1 ${className}`}>
        <p>{t.informationalOnly}</p>
        <p>{t.notLegalAdvice} {t.notGovernment}</p>
      </div>
    )
  }

  // Full variant
  return (
    <Alert className={`border-muted bg-muted/20 ${className}`}>
      <Info className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2 text-sm">
          <p className="font-medium">{t.title}</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>{t.notLegalAdvice}</li>
            <li>{t.notGovernment}</li>
            <li>{t.informationalOnly}</li>
            <li>{t.consultAttorney}</li>
            <li>{t.noInterference}</li>
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  )
}
