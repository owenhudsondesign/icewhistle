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
    machineTranslated: 'This content has been machine-translated. For critical legal matters, please verify information with a qualified attorney.',
  },
  es: {
    title: 'Información Importante',
    notLegalAdvice: 'Esta aplicación proporciona información general únicamente y no constituye asesoramiento legal.',
    notGovernment: 'ICEwhistle no está afiliado con ninguna agencia gubernamental.',
    informationalOnly: 'Todo el contenido es solo para fines informativos y educativos.',
    consultAttorney: 'Para consejos sobre su situación específica, consulte a un abogado de inmigración calificado.',
    noInterference: 'No interfiera con los oficiales de la ley.',
    machineTranslated: 'Este contenido ha sido traducido automáticamente. Para asuntos legales importantes, verifique la información con un abogado calificado.',
  },
  pt: {
    title: 'Informação Importante',
    notLegalAdvice: 'Este aplicativo fornece apenas informações gerais e não constitui aconselhamento jurídico.',
    notGovernment: 'ICEwhistle não é afiliado a nenhuma agência governamental.',
    informationalOnly: 'Todo o conteúdo é apenas para fins informativos e educacionais.',
    consultAttorney: 'Para aconselhamento sobre sua situação específica, consulte um advogado de imigração qualificado.',
    noInterference: 'Não interfira com os oficiais da lei.',
    machineTranslated: 'Este conteúdo foi traduzido automaticamente. Para questões legais importantes, verifique as informações com um advogado qualificado.',
  },
}

// Translation notice for languages using machine translation
const machineTranslationNotice: Record<string, string> = {
  zh: '此内容由机器翻译。对于重要法律事务，请向合格律师核实信息。',
  'zh-TW': '此內容由機器翻譯。對於重要法律事務，請向合格律師核實信息。',
  vi: 'Nội dung này được dịch máy. Đối với các vấn đề pháp lý quan trọng, vui lòng xác minh thông tin với luật sư có trình độ.',
  tl: 'Ang nilalamang ito ay isinalin ng makina. Para sa mahahalagang legal na bagay, pakitiyak ang impormasyon sa isang kwalipikadong abogado.',
  ko: '이 콘텐츠는 기계 번역되었습니다. 중요한 법적 문제의 경우 자격을 갖춘 변호사에게 정보를 확인하세요.',
  ar: 'تمت ترجمة هذا المحتوى آليًا. للمسائل القانونية الهامة، يرجى التحقق من المعلومات مع محامٍ مؤهل.',
  fa: 'این محتوا توسط ماشین ترجمه شده است. برای موضوعات حقوقی مهم، لطفاً اطلاعات را با یک وکیل واجد شرایط تأیید کنید.',
  hi: 'यह सामग्री मशीन द्वारा अनुवादित है। महत्वपूर्ण कानूनी मामलों के लिए, कृपया योग्य वकील से जानकारी सत्यापित करें।',
  fr: 'Ce contenu a été traduit automatiquement. Pour les questions juridiques importantes, veuillez vérifier les informations auprès d\'un avocat qualifié.',
  ru: 'Этот контент переведён машиной. По важным юридическим вопросам, пожалуйста, уточните информацию у квалифицированного адвоката.',
  ja: 'このコンテンツは機械翻訳されています。重要な法的事項については、資格のある弁護士に情報を確認してください。',
  default: 'This content has been machine-translated. For critical legal matters, please verify information with a qualified attorney.',
}

interface LegalDisclaimerProps {
  variant?: 'full' | 'compact' | 'inline'
  className?: string
}

export function LegalDisclaimer({ variant = 'compact', className = '' }: LegalDisclaimerProps) {
  const { language } = useLanguage()
  const t = disclaimerText[language as keyof typeof disclaimerText] || disclaimerText.en
  const isNonEnglish = language !== 'en'
  const translationNotice = isNonEnglish
    ? (machineTranslationNotice[language] || t.machineTranslated || machineTranslationNotice.default)
    : null

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
        {translationNotice && (
          <p className="text-amber-600 dark:text-amber-400">{translationNotice}</p>
        )}
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
          {translationNotice && (
            <p className="text-amber-600 dark:text-amber-400 text-xs mt-2 pt-2 border-t border-muted">
              {translationNotice}
            </p>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}
