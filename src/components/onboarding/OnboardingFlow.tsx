'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Shield, Lock, Globe, Bell, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { MultiZipInput, type ZipEntry } from './MultiZipInput'

// Onboarding translations
const translations = {
  en: {
    // Screen 1: Welcome
    welcome: 'Welcome to ICEwhistle',
    welcomeSubtitle: 'Know your rights. Stay informed.',
    noAccount: 'No account required.',
    noAds: 'No ads. No tracking.',
    noLocation: 'We do not collect precise location.',
    youControl: 'You control notifications.',
    continue: 'Continue',
    privacyPolicy: 'Privacy Policy',
    terms: 'Terms of Service',

    // Screen 2: ZIP Code
    setArea: 'Set Your Home Area',
    setAreaDesc: 'Get community updates relevant to your area. We only store your ZIP code - never your precise location.',
    zipPlaceholder: 'Enter ZIP code',
    zipHelp: 'This is only used to show nearby updates.',
    skip: 'Skip for now',

    // Screen 3: Language
    chooseLanguage: 'Choose Your Language',
    languageDesc: 'Select your preferred language for the app and notifications.',

    // Screen 4: Notifications
    enableNotifications: 'Stay Informed',
    notificationsDesc: 'Get notified when there are community updates in your area.',
    notificationsOptional: 'Notifications are optional.',
    enableAlerts: 'Enable community updates',
    nearbyOnly: 'Nearby only',
    statewide: 'Statewide',
    quietHours: 'Quiet hours',
    quietHoursDesc: '10pm - 7am',
    getStarted: 'Get Started',
    notNow: 'Not now',

    // General
    step: 'Step',
    of: 'of',
  },
  es: {
    welcome: 'Bienvenido a ICEwhistle',
    welcomeSubtitle: 'Conoce tus derechos. Mantente informado.',
    noAccount: 'No se requiere cuenta.',
    noAds: 'Sin anuncios. Sin rastreo.',
    noLocation: 'No recopilamos ubicación precisa.',
    youControl: 'Tú controlas las notificaciones.',
    continue: 'Continuar',
    privacyPolicy: 'Política de Privacidad',
    terms: 'Términos de Servicio',

    setArea: 'Configura Tu Área',
    setAreaDesc: 'Recibe actualizaciones de la comunidad relevantes para tu área. Solo guardamos tu código postal.',
    zipPlaceholder: 'Ingresa código postal',
    zipHelp: 'Esto solo se usa para mostrar actualizaciones cercanas.',
    skip: 'Omitir por ahora',

    chooseLanguage: 'Elige Tu Idioma',
    languageDesc: 'Selecciona tu idioma preferido para la app y notificaciones.',

    enableNotifications: 'Mantente Informado',
    notificationsDesc: 'Recibe notificaciones cuando haya actualizaciones de la comunidad en tu área.',
    notificationsOptional: 'Las notificaciones son opcionales.',
    enableAlerts: 'Habilitar actualizaciones',
    nearbyOnly: 'Solo cercanas',
    statewide: 'Todo el estado',
    quietHours: 'Horas silenciosas',
    quietHoursDesc: '10pm - 7am',
    getStarted: 'Comenzar',
    notNow: 'Ahora no',

    step: 'Paso',
    of: 'de',
  },
  pt: {
    welcome: 'Bem-vindo ao ICEwhistle',
    welcomeSubtitle: 'Conheça seus direitos. Mantenha-se informado.',
    noAccount: 'Não é necessário conta.',
    noAds: 'Sem anúncios. Sem rastreamento.',
    noLocation: 'Não coletamos localização precisa.',
    youControl: 'Você controla as notificações.',
    continue: 'Continuar',
    privacyPolicy: 'Política de Privacidade',
    terms: 'Termos de Serviço',

    setArea: 'Configure Sua Área',
    setAreaDesc: 'Receba atualizações da comunidade relevantes para sua área. Só armazenamos seu CEP.',
    zipPlaceholder: 'Digite o CEP',
    zipHelp: 'Isso é usado apenas para mostrar atualizações próximas.',
    skip: 'Pular por agora',

    chooseLanguage: 'Escolha Seu Idioma',
    languageDesc: 'Selecione seu idioma preferido para o app e notificações.',

    enableNotifications: 'Mantenha-se Informado',
    notificationsDesc: 'Receba notificações quando houver atualizações da comunidade na sua área.',
    notificationsOptional: 'Notificações são opcionais.',
    enableAlerts: 'Habilitar atualizações',
    nearbyOnly: 'Apenas próximas',
    statewide: 'Todo o estado',
    quietHours: 'Horário silencioso',
    quietHoursDesc: '22h - 7h',
    getStarted: 'Começar',
    notNow: 'Agora não',

    step: 'Passo',
    of: 'de',
  },
}

interface OnboardingData {
  language: string
  zip: string
  zipEntries: ZipEntry[]
  alertsEnabled: boolean
  alertScope: 'nearby' | 'statewide'
  quietHoursEnabled: boolean
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void
  onSkip?: () => void
}

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [step, setStep] = useState(1)
  const [language, setLanguage] = useState('en')
  const [zip, setZip] = useState('')
  const [zipEntries, setZipEntries] = useState<ZipEntry[]>([{ zipCode: '', label: 'home' }])
  const [zipError, setZipError] = useState('')
  const [alertsEnabled, setAlertsEnabled] = useState(false)
  const [alertScope, setAlertScope] = useState<'nearby' | 'statewide'>('nearby')
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true)

  const t = translations[language as keyof typeof translations] || translations.en
  const totalSteps = 4

  // Validate ZIP code (US format)
  const validateZip = (value: string): boolean => {
    return /^\d{5}$/.test(value)
  }

  const handleZipChange = (value: string) => {
    // Only allow digits, max 5
    const cleaned = value.replace(/\D/g, '').slice(0, 5)
    setZip(cleaned)
    setZipError('')
  }

  const handleNext = () => {
    if (step === 2) {
      const primaryZip = zipEntries[0]?.zipCode
      if (primaryZip && !validateZip(primaryZip)) {
        setZipError('Please enter a valid 5-digit ZIP code')
        return
      }
    }
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleComplete = async () => {
    onComplete({
      language,
      zip: zipEntries[0]?.zipCode || '',
      zipEntries: zipEntries.filter((e) => /^\d{5}$/.test(e.zipCode)),
      alertsEnabled,
      alertScope,
      quietHoursEnabled,
    })
  }

  const handleSkipZip = () => {
    setZip('')
    handleNext()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Progress indicator */}
      <div className="w-full max-w-md mb-6">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
          {t.step} {step} {t.of} {totalSteps}
        </div>
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i < step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      <Card className="w-full max-w-md">
        {/* Step 1: Welcome + Privacy */}
        {step === 1 && (
          <>
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">{t.welcome}</CardTitle>
              <CardDescription>{t.welcomeSubtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {[
                  { icon: Lock, text: t.noAccount },
                  { icon: Shield, text: t.noAds },
                  { icon: Globe, text: t.noLocation },
                  { icon: Bell, text: t.youControl },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">{item.text}</span>
                  </li>
                ))}
              </ul>

              <Button onClick={handleNext} className="w-full" size="lg">
                {t.continue}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>

              <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">{t.privacyPolicy}</a>
                <span>•</span>
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">{t.terms}</a>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 2: ZIP Code(s) */}
        {step === 2 && (
          <>
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>{t.setArea}</CardTitle>
              <CardDescription>{t.setAreaDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MultiZipInput
                value={zipEntries}
                onChange={(entries) => {
                  setZipEntries(entries)
                  setZipError('')
                }}
                maxEntries={5}
              />

              {zipError && (
                <p className="text-sm text-destructive text-center">{zipError}</p>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1"
                  disabled={zipEntries[0]?.zipCode.length > 0 && !validateZip(zipEntries[0].zipCode)}
                >
                  {t.continue}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <Button variant="ghost" onClick={handleSkipZip} className="w-full text-muted-foreground">
                {t.skip}
              </Button>
            </CardContent>
          </>
        )}

        {/* Step 3: Language */}
        {step === 3 && (
          <>
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>{t.chooseLanguage}</CardTitle>
              <CardDescription>{t.languageDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {[
                  { code: 'en', name: 'English', native: 'English' },
                  { code: 'es', name: 'Spanish', native: 'Español' },
                  { code: 'pt', name: 'Portuguese', native: 'Português' },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full p-4 rounded-lg border-2 transition-colors flex items-center justify-between ${
                      language === lang.code
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium">{lang.native}</div>
                      <div className="text-sm text-muted-foreground">{lang.name}</div>
                    </div>
                    {language === lang.code && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1">
                  {t.continue}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 4: Notifications */}
        {step === 4 && (
          <>
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>{t.enableNotifications}</CardTitle>
              <CardDescription>{t.notificationsDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">{t.notificationsOptional}</p>

              <div className="space-y-4 p-4 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <Label htmlFor="alerts-toggle" className="cursor-pointer">
                    {t.enableAlerts}
                  </Label>
                  <Switch
                    id="alerts-toggle"
                    checked={alertsEnabled}
                    onCheckedChange={setAlertsEnabled}
                  />
                </div>

                {alertsEnabled && (
                  <>
                    <div className="flex gap-2">
                      <Button
                        variant={alertScope === 'nearby' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAlertScope('nearby')}
                        className="flex-1"
                      >
                        {t.nearbyOnly}
                      </Button>
                      <Button
                        variant={alertScope === 'statewide' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAlertScope('statewide')}
                        className="flex-1"
                      >
                        {t.statewide}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="quiet-hours" className="cursor-pointer">
                          {t.quietHours}
                        </Label>
                        <p className="text-xs text-muted-foreground">{t.quietHoursDesc}</p>
                      </div>
                      <Switch
                        id="quiet-hours"
                        checked={quietHoursEnabled}
                        onCheckedChange={setQuietHoursEnabled}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleComplete} className="flex-1">
                  {t.getStarted}
                  <Check className="h-4 w-4 ml-2" />
                </Button>
              </div>

              {!alertsEnabled && (
                <Button variant="ghost" onClick={handleComplete} className="w-full text-muted-foreground">
                  {t.notNow}
                </Button>
              )}
            </CardContent>
          </>
        )}
      </Card>

      {/* Skip all button (only on first screen) */}
      {step === 1 && onSkip && (
        <Button variant="ghost" onClick={onSkip} className="mt-4 text-muted-foreground">
          Skip setup
        </Button>
      )}
    </div>
  )
}
