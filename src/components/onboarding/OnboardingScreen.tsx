'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Shield, Globe, MapPin, Eye, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage, Language } from '@/hooks/use-language'
import { useLocation, geocodeZipCode } from '@/hooks/use-location'

const translations = {
  en: {
    welcome: 'Welcome to ICEwhistle',
    subtitle: 'Community safety. Know your rights.',

    // Language section
    languageTitle: 'Choose your language',

    // ZIP section
    zipTitle: 'Your ZIP code',
    zipSubtitle: 'Get alerts for activity in your area',
    zipPlaceholder: '12345',
    zipOptional: '(optional)',

    // Privacy section
    privacyTitle: 'Your privacy matters',
    privacyAnonymous: 'Everything is anonymous',
    privacyAnonymousDesc: 'No accounts, no tracking, no personal data stored.',
    privacyLocation: 'Location data',
    privacyLocationDesc: 'We only store location when you voluntarily report activity — rounded to ~500m, auto-deleted after 8 hours.',

    // Caveat
    caveatTitle: 'A note on surveillance',
    caveatText: 'We cannot guarantee complete privacy. Assume you are always being watched. Governments and corporations may have access to your data through your device, network, or service providers regardless of what any app promises.',

    // Buttons
    getStarted: 'Get Started',
    skip: 'Skip for now',

    // Validation
    invalidZip: 'Please enter a valid 5-digit ZIP code',
    lookingUp: 'Looking up...',
  },
  es: {
    welcome: 'Bienvenido a ICEwhistle',
    subtitle: 'Seguridad comunitaria. Conoce tus derechos.',

    languageTitle: 'Elige tu idioma',

    zipTitle: 'Tu código postal',
    zipSubtitle: 'Recibe alertas de actividad en tu área',
    zipPlaceholder: '12345',
    zipOptional: '(opcional)',

    privacyTitle: 'Tu privacidad importa',
    privacyAnonymous: 'Todo es anónimo',
    privacyAnonymousDesc: 'Sin cuentas, sin rastreo, sin datos personales almacenados.',
    privacyLocation: 'Datos de ubicación',
    privacyLocationDesc: 'Solo guardamos ubicación cuando reportas actividad voluntariamente — redondeada a ~500m, eliminada automáticamente después de 8 horas.',

    caveatTitle: 'Una nota sobre vigilancia',
    caveatText: 'No podemos garantizar privacidad completa. Asume que siempre estás siendo observado. Gobiernos y corporaciones pueden tener acceso a tus datos a través de tu dispositivo, red o proveedores de servicio sin importar lo que cualquier app prometa.',

    getStarted: 'Comenzar',
    skip: 'Saltar por ahora',

    invalidZip: 'Por favor ingresa un código postal válido de 5 dígitos',
    lookingUp: 'Buscando...',
  },
  pt: {
    welcome: 'Bem-vindo ao ICEwhistle',
    subtitle: 'Segurança comunitária. Conheça seus direitos.',

    languageTitle: 'Escolha seu idioma',

    zipTitle: 'Seu código postal',
    zipSubtitle: 'Receba alertas de atividade na sua área',
    zipPlaceholder: '12345',
    zipOptional: '(opcional)',

    privacyTitle: 'Sua privacidade importa',
    privacyAnonymous: 'Tudo é anônimo',
    privacyAnonymousDesc: 'Sem contas, sem rastreamento, sem dados pessoais armazenados.',
    privacyLocation: 'Dados de localização',
    privacyLocationDesc: 'Só guardamos localização quando você reporta atividade voluntariamente — arredondada para ~500m, deletada automaticamente após 8 horas.',

    caveatTitle: 'Uma nota sobre vigilância',
    caveatText: 'Não podemos garantir privacidade completa. Assuma que você está sempre sendo observado. Governos e corporações podem ter acesso aos seus dados através do seu dispositivo, rede ou provedores de serviço independente do que qualquer app prometa.',

    getStarted: 'Começar',
    skip: 'Pular por agora',

    invalidZip: 'Por favor, digite um código postal válido de 5 dígitos',
    lookingUp: 'Procurando...',
  },
}

interface OnboardingScreenProps {
  onComplete: () => void
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { language, setLanguage } = useLanguage()
  const { setSavedLocation } = useLocation()
  const t = translations[language as keyof typeof translations] || translations.en

  const [zipCode, setZipCode] = useState('')
  const [zipError, setZipError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
  }

  const handleGetStarted = async () => {
    // If zip code provided, validate and geocode it
    if (zipCode.trim()) {
      const cleanZip = zipCode.trim().replace(/[^0-9]/g, '')
      if (cleanZip.length !== 5) {
        setZipError(t.invalidZip)
        return
      }

      setIsLoading(true)
      setZipError('')

      const result = await geocodeZipCode(cleanZip)
      if (result) {
        setSavedLocation({
          zipCode: cleanZip,
          lat: result.lat,
          lng: result.lng,
          city: result.city
        })
      }
      setIsLoading(false)
    }

    onComplete()
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full flex flex-col justify-center px-6 py-12 max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <Image
                src="/images/icewhistle-logo-white.svg"
                alt="ICEwhistle"
                width={200}
                height={48}
                className="h-12 w-auto mx-auto dark:block hidden"
                priority
              />
              <Image
                src="/images/icewhistle-logo-dark.svg"
                alt="ICEwhistle"
                width={200}
                height={48}
                className="h-12 w-auto mx-auto dark:hidden block"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold">{t.welcome}</h1>
            <p className="text-muted-foreground mt-1">{t.subtitle}</p>
          </div>

          {/* Language Selection */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium mb-3">
              <Globe className="w-4 h-4 text-muted-foreground" />
              {t.languageTitle}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['en', 'es', 'pt'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    language === lang
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {lang === 'en' ? 'English' : lang === 'es' ? 'Español' : 'Português'}
                </button>
              ))}
            </div>
          </div>

          {/* ZIP Code */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium mb-1">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              {t.zipTitle}
              <span className="text-muted-foreground font-normal">{t.zipOptional}</span>
            </label>
            <p className="text-xs text-muted-foreground mb-3">{t.zipSubtitle}</p>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={5}
              placeholder={t.zipPlaceholder}
              value={zipCode}
              onChange={(e) => {
                setZipCode(e.target.value.replace(/[^0-9]/g, ''))
                setZipError('')
              }}
              className="text-lg text-center tracking-widest"
            />
            {zipError && (
              <p className="text-xs text-destructive mt-1">{zipError}</p>
            )}
          </div>

          {/* Privacy Info */}
          <div className="mb-6 space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-500">{t.privacyAnonymous}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.privacyAnonymousDesc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-500">{t.privacyLocation}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.privacyLocationDesc}</p>
              </div>
            </div>
          </div>

          {/* Surveillance Caveat */}
          <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-500">{t.caveatTitle}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {t.caveatText}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleGetStarted}
              disabled={isLoading}
              className="w-full h-12 text-base"
            >
              {isLoading ? t.lookingUp : t.getStarted}
              {!isLoading && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>

            <button
              onClick={handleSkip}
              className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.skip}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
