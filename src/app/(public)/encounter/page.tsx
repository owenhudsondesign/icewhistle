'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { RecordingIndicator } from '@/components/recording/RecordingIndicator'
import { AlertContactsButton } from '@/components/emergency-contacts'
import { useRecordingStore } from '@/stores/recordingStore'
import { useEnhancedRecording } from '@/hooks/useEnhancedRecording'
import { useLanguage } from '@/hooks/use-language'
import { AppHeader } from '@/components/shared/AppHeader'
import {
  AlertTriangle,
  Phone,
  Shield,
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Car,
  User,
  Users,
  Building,
  Search,
  ExternalLink,
  Download,
  MapPin,
  Map,
  Loader2,
  Check,
} from 'lucide-react'
import { useState } from 'react'

// Translations for the encounter page
const translations = {
  en: {
    title: 'Emergency Guide',
    subtitle: 'Stay calm. You have rights.',
    backHome: 'Back to Home',

    // Recording
    recordingActive: 'Recording Active',
    stopAndSave: 'Stop & Save',

    // Urgent steps
    urgentTitle: 'Do These Things NOW',
    urgent1: 'Stay calm. Do not run.',
    urgent2: 'Do NOT open the door unless they show a warrant signed by a JUDGE.',
    urgent3: 'Remain silent. You do not have to answer questions.',

    // What to say
    sayTitle: 'What to Say',
    say1: 'I am exercising my right to remain silent.',
    say1es: 'Estoy ejerciendo mi derecho a permanecer en silencio.',
    say2: 'I want to speak to a lawyer.',
    say2es: 'Quiero hablar con un abogado.',
    say3: 'I do not consent to your entry.',
    say3es: 'No doy mi consentimiento para que entren.',
    say4: 'I do not consent to a search.',
    say4es: 'No doy mi consentimiento para un registro.',

    // Warrant
    warrantTitle: 'Warrant Comparison',
    judicialWarrant: 'Judicial Warrant = VALID',
    judicialSigned: 'Signed by a JUDGE',
    judicialCourt: 'Has court name',
    iceWarrant: 'ICE Warrant (I-200) = NOT VALID',
    iceSigned: 'Signed by ICE officer',
    iceNoEntry: 'Does NOT allow entry',

    // Traffic stop
    trafficTitle: 'If Stopped in Vehicle',
    driverTitle: 'DRIVER',
    driverMust: 'You MUST provide:',
    driverLicense: "Driver's license",
    driverReg: 'Registration',
    driverIns: 'Insurance',
    driverNote: 'Do NOT answer about immigration status.',
    passengerTitle: 'PASSENGER',
    passengerNote: 'You have NO obligation to:',
    passengerNoId: 'Show any ID',
    passengerNoName: 'Give your name',
    passengerNoAnswer: 'Answer any questions',
    passengerSilent: 'Remain completely silent.',

    // If detained
    detainedTitle: 'If Someone Is Detained',
    getANumber: 'Get the A-Number',
    aNumberDesc: '9-digit number (e.g., A123456789) from immigration documents.',
    useLocator: 'Use ICE Detainee Locator',
    locatorOnline: 'locator.ice.gov',
    locatorPhone: '1-888-351-4024 (24/7)',
    contactLawyer: 'Contact an immigration lawyer',
    noSign: 'Tell them: Do NOT sign any documents!',

    // Do not
    doNotTitle: 'Do NOT',
    doNot1: 'Open door without judicial warrant',
    doNot2: 'Run or flee',
    doNot3: 'Sign any documents',
    doNot4: 'Lie or show fake documents',
    doNot5: 'Physically resist',

    // Hotlines
    hotlinesTitle: 'Emergency Hotlines',
    hotline1Name: 'United We Dream',
    hotline1Desc: 'Report ICE activity',
    hotline1Phone: '1-844-363-1423',
    hotline2Name: 'ICE Detainee Locator',
    hotline2Desc: 'Find someone in custody',
    hotline2Phone: '1-888-351-4024',
    hotline3Name: 'NIJC',
    hotline3Desc: 'Legal help',
    hotline3Phone: '312-660-1370',

    // Quick actions
    reportHere: 'Report ICE Here',
    reportHereDesc: 'Share location to alert neighbors',
    viewMap: 'View Map',
    reporting: 'Getting location...',
    reported: 'Reported!',
    locationError: 'Try again',
    rateLimited: 'Wait {minutes} min',
    discard: 'Discard',

    // Footer
    fullGuide: 'Full Rights Guide',
    allResources: 'All Resources',
  },
  es: {
    title: 'Guía de Emergencia',
    subtitle: 'Mantén la calma. Tienes derechos.',
    backHome: 'Volver al inicio',

    recordingActive: 'Grabación Activa',
    stopAndSave: 'Detener y Guardar',

    urgentTitle: 'Haz Esto AHORA',
    urgent1: 'Mantén la calma. No corras.',
    urgent2: 'NO abras la puerta a menos que muestren una orden firmada por un JUEZ.',
    urgent3: 'Permanece en silencio. No tienes que responder preguntas.',

    sayTitle: 'Qué Decir',
    say1: 'I am exercising my right to remain silent.',
    say1es: 'Estoy ejerciendo mi derecho a permanecer en silencio.',
    say2: 'I want to speak to a lawyer.',
    say2es: 'Quiero hablar con un abogado.',
    say3: 'I do not consent to your entry.',
    say3es: 'No doy mi consentimiento para que entren.',
    say4: 'I do not consent to a search.',
    say4es: 'No doy mi consentimiento para un registro.',

    warrantTitle: 'Comparación de Órdenes',
    judicialWarrant: 'Orden Judicial = VÁLIDA',
    judicialSigned: 'Firmada por un JUEZ',
    judicialCourt: 'Tiene nombre del tribunal',
    iceWarrant: 'Orden ICE (I-200) = NO VÁLIDA',
    iceSigned: 'Firmada por oficial de ICE',
    iceNoEntry: 'NO permite entrada',

    trafficTitle: 'Si Te Detienen en Vehículo',
    driverTitle: 'CONDUCTOR',
    driverMust: 'DEBES proporcionar:',
    driverLicense: 'Licencia de conducir',
    driverReg: 'Registro del vehículo',
    driverIns: 'Seguro',
    driverNote: 'NO respondas sobre estatus migratorio.',
    passengerTitle: 'PASAJERO',
    passengerNote: 'NO tienes obligación de:',
    passengerNoId: 'Mostrar identificación',
    passengerNoName: 'Dar tu nombre',
    passengerNoAnswer: 'Responder preguntas',
    passengerSilent: 'Permanece completamente en silencio.',

    detainedTitle: 'Si Alguien Es Detenido',
    getANumber: 'Obtén el Número A',
    aNumberDesc: 'Número de 9 dígitos (ej: A123456789) de documentos de inmigración.',
    useLocator: 'Usa el Localizador de ICE',
    locatorOnline: 'locator.ice.gov',
    locatorPhone: '1-888-351-4024 (24/7)',
    contactLawyer: 'Contacta un abogado de inmigración',
    noSign: 'Diles: ¡NO firmes ningún documento!',

    doNotTitle: 'NO Hagas',
    doNot1: 'Abrir puerta sin orden judicial',
    doNot2: 'Correr o huir',
    doNot3: 'Firmar documentos',
    doNot4: 'Mentir o mostrar documentos falsos',
    doNot5: 'Resistir físicamente',

    hotlinesTitle: 'Líneas de Emergencia',
    hotline1Name: 'United We Dream',
    hotline1Desc: 'Reportar actividad de ICE',
    hotline1Phone: '1-844-363-1423',
    hotline2Name: 'Localizador de Detenidos',
    hotline2Desc: 'Encontrar a alguien detenido',
    hotline2Phone: '1-888-351-4024',
    hotline3Name: 'NIJC',
    hotline3Desc: 'Ayuda legal',
    hotline3Phone: '312-660-1370',

    // Quick actions
    reportHere: 'Reportar ICE Aquí',
    reportHereDesc: 'Compartir ubicación para alertar vecinos',
    viewMap: 'Ver Mapa',
    reporting: 'Obteniendo ubicación...',
    reported: '¡Reportado!',
    locationError: 'Reintentar',
    rateLimited: 'Espera {minutes} min',
    discard: 'Descartar',

    fullGuide: 'Guía Completa',
    allResources: 'Todos los Recursos',
  },
  pt: {
    title: 'Guia de Emergência',
    subtitle: 'Mantenha a calma. Você tem direitos.',
    backHome: 'Voltar ao início',

    recordingActive: 'Gravação Ativa',
    stopAndSave: 'Parar e Salvar',

    urgentTitle: 'Faça Isso AGORA',
    urgent1: 'Mantenha a calma. Não corra.',
    urgent2: 'NÃO abra a porta a menos que mostrem um mandado assinado por um JUIZ.',
    urgent3: 'Fique em silêncio. Você não precisa responder perguntas.',

    sayTitle: 'O Que Dizer',
    say1: 'I am exercising my right to remain silent.',
    say1es: 'Estoy ejerciendo mi derecho a permanecer en silencio.',
    say2: 'I want to speak to a lawyer.',
    say2es: 'Quiero hablar con un abogado.',
    say3: 'I do not consent to your entry.',
    say3es: 'No doy mi consentimiento para que entren.',
    say4: 'I do not consent to a search.',
    say4es: 'No doy mi consentimiento para un registro.',

    warrantTitle: 'Comparação de Mandados',
    judicialWarrant: 'Mandado Judicial = VÁLIDO',
    judicialSigned: 'Assinado por um JUIZ',
    judicialCourt: 'Tem nome do tribunal',
    iceWarrant: 'Mandado ICE (I-200) = NÃO VÁLIDO',
    iceSigned: 'Assinado por oficial do ICE',
    iceNoEntry: 'NÃO permite entrada',

    trafficTitle: 'Se Parado em Veículo',
    driverTitle: 'MOTORISTA',
    driverMust: 'Você DEVE fornecer:',
    driverLicense: 'Carteira de motorista',
    driverReg: 'Registro do veículo',
    driverIns: 'Seguro',
    driverNote: 'NÃO responda sobre status imigratório.',
    passengerTitle: 'PASSAGEIRO',
    passengerNote: 'Você NÃO tem obrigação de:',
    passengerNoId: 'Mostrar identificação',
    passengerNoName: 'Dar seu nome',
    passengerNoAnswer: 'Responder perguntas',
    passengerSilent: 'Fique completamente em silêncio.',

    detainedTitle: 'Se Alguém For Detido',
    getANumber: 'Obtenha o Número A',
    aNumberDesc: 'Número de 9 dígitos (ex: A123456789) de documentos de imigração.',
    useLocator: 'Use o Localizador do ICE',
    locatorOnline: 'locator.ice.gov',
    locatorPhone: '1-888-351-4024 (24/7)',
    contactLawyer: 'Contate um advogado de imigração',
    noSign: 'Diga: NÃO assine nenhum documento!',

    doNotTitle: 'NÃO Faça',
    doNot1: 'Abrir porta sem mandado judicial',
    doNot2: 'Correr ou fugir',
    doNot3: 'Assinar documentos',
    doNot4: 'Mentir ou mostrar documentos falsos',
    doNot5: 'Resistir fisicamente',

    hotlinesTitle: 'Linhas de Emergência',
    hotline1Name: 'United We Dream',
    hotline1Desc: 'Reportar atividade do ICE',
    hotline1Phone: '1-844-363-1423',
    hotline2Name: 'Localizador de Detidos',
    hotline2Desc: 'Encontrar alguém detido',
    hotline2Phone: '1-888-351-4024',
    hotline3Name: 'NIJC',
    hotline3Desc: 'Ajuda legal',
    hotline3Phone: '312-660-1370',

    // Quick actions
    reportHere: 'Reportar ICE Aqui',
    reportHereDesc: 'Compartilhar localização para alertar vizinhos',
    viewMap: 'Ver Mapa',
    reporting: 'Obtendo localização...',
    reported: 'Reportado!',
    locationError: 'Tentar novamente',
    rateLimited: 'Aguarde {minutes} min',
    discard: 'Descartar',

    fullGuide: 'Guia Completo',
    allResources: 'Todos os Recursos',
  },
}

export default function EncounterPage() {
  const { language } = useLanguage()
  const t = translations[language]
  const { isRecording, showSaveDialog, recordingBlob } = useRecordingStore()
  const { stopRecording, saveRecording, discardRecording } = useEnhancedRecording()
  const [reportStatus, setReportStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'rate_limited'>('idle')
  const [cooldownMinutes, setCooldownMinutes] = useState(0)

  const REPORT_COOLDOWN_MS = 5 * 60 * 1000 // 5 minutes

  const handleStopAndSave = async () => {
    await stopRecording()
  }

  const handleReportICE = async () => {
    // Show disclaimer/confirmation
    const disclaimerText = language === 'es'
      ? 'Esto compartirá tu ubicación aproximada para alertar a otros en tu área. Tu ubicación exacta nunca se almacena.\n\nNota: Si tu navegador está configurado para "Nunca" permitir ubicación, esto no funcionará.\n\n¿Continuar?'
      : language === 'pt'
      ? 'Isso compartilhará sua localização aproximada para alertar outros na sua área. Sua localização exata nunca é armazenada.\n\nNota: Se seu navegador estiver configurado para "Nunca" permitir localização, isso não funcionará.\n\nContinuar?'
      : 'This will share your approximate location to alert others in your area. Your exact location is never stored.\n\nNote: If your browser is set to "Never" allow location, this won\'t work.\n\nContinue?'

    if (!confirm(disclaimerText)) {
      return
    }

    // Check rate limit
    const lastReportTime = localStorage.getItem('icewhistle_last_report')
    if (lastReportTime) {
      const timeSinceLastReport = Date.now() - parseInt(lastReportTime, 10)
      if (timeSinceLastReport < REPORT_COOLDOWN_MS) {
        const minutesRemaining = Math.ceil((REPORT_COOLDOWN_MS - timeSinceLastReport) / 60000)
        setCooldownMinutes(minutesRemaining)
        setReportStatus('rate_limited')
        setTimeout(() => setReportStatus('idle'), 4000)
        return
      }
    }

    setReportStatus('loading')

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation not supported')
      }

      // Try to get position - first with high accuracy, then fallback to low accuracy
      const getPosition = (highAccuracy: boolean): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: highAccuracy,
            timeout: highAccuracy ? 10000 : 20000,
            maximumAge: 600000, // Accept 10 min old cached position
          })
        })
      }

      let position: GeolocationPosition
      try {
        position = await getPosition(true)
      } catch {
        // Retry with low accuracy if high accuracy fails
        position = await getPosition(false)
      }

      const currentLat = position.coords.latitude
      const currentLng = position.coords.longitude

      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: currentLat,
          longitude: currentLng,
          alertType: 'ice_raid',
          description: 'Quick report from emergency page',
        }),
      })

      if (response.ok) {
        localStorage.setItem('icewhistle_last_report', Date.now().toString())
        setReportStatus('success')
        setTimeout(() => setReportStatus('idle'), 5000)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('API error:', response.status, errorData)
        const errorMsg = language === 'es'
          ? `Error al enviar (${response.status}). Intenta de nuevo.`
          : language === 'pt'
          ? `Erro ao enviar (${response.status}). Tente novamente.`
          : `Failed to submit (${response.status}). Please try again.`
        alert(errorMsg)
        setReportStatus('error')
        setTimeout(() => setReportStatus('idle'), 3000)
      }
    } catch (err: unknown) {
      const error = err as Error & { code?: number }
      console.error('Failed to report ICE activity:', error, 'Code:', error?.code, 'Message:', error?.message)

      // Offer to go to alerts page where they can enter address manually
      const goToAlerts = confirm(
        language === 'es'
          ? 'No se pudo obtener ubicación automáticamente.\n\n¿Ir a la página de alertas para ingresar una dirección manualmente?'
          : language === 'pt'
          ? 'Não foi possível obter localização automaticamente.\n\nIr para a página de alertas para inserir um endereço manualmente?'
          : 'Could not get location automatically.\n\nGo to alerts page to enter an address manually?'
      )

      if (goToAlerts) {
        window.location.href = '/alerts?report=true'
      }

      setReportStatus('error')
      setTimeout(() => setReportStatus('idle'), 4000)
    }
  }

  return (
    <>
      <AppHeader showBack title={t.title} />
      <div className="min-h-screen bg-background pb-8">
        {/* Recording Indicator - Fixed at top */}
        <RecordingIndicator onStopClick={handleStopAndSave} />

      {/* Save Recording Dialog */}
      {showSaveDialog && recordingBlob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="card-glass p-6 max-w-sm w-full">
            <h2 className="text-title text-center mb-4">{t.recordingActive}</h2>
            <div className="space-y-3">
              <Button
                onClick={saveRecording}
                className="w-full h-12 bg-[#84CC16] hover:bg-[#84CC16]/90 text-white"
              >
                <Download className="h-5 w-5 mr-2" />
                {t.stopAndSave}
              </Button>
              <Button
                variant="outline"
                onClick={discardRecording}
                className="w-full"
              >
                {t.discard}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t.backHome}
        </Link>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#DC2626]/20 mb-3">
            <AlertTriangle className="h-7 w-7 text-[#DC2626]" />
          </div>
          <h1 className="text-2xl font-bold text-[#DC2626] mb-1">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Alert Contacts Button */}
        <AlertContactsButton className="mb-4" />

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            onClick={handleReportICE}
            disabled={reportStatus === 'loading' || reportStatus === 'success' || reportStatus === 'rate_limited'}
            className={`h-14 text-sm font-semibold ${
              reportStatus === 'success'
                ? 'bg-[#84CC16] hover:bg-[#84CC16]'
                : reportStatus === 'rate_limited'
                ? 'bg-gray-500 hover:bg-gray-500'
                : 'bg-[#DC2626] hover:bg-[#DC2626]/90'
            } text-white`}
          >
            {reportStatus === 'loading' ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                {t.reporting}
              </>
            ) : reportStatus === 'success' ? (
              <>
                <Check className="h-5 w-5 mr-2" />
                {t.reported}
              </>
            ) : reportStatus === 'rate_limited' ? (
              <>
                <MapPin className="h-5 w-5 mr-2" />
                {t.rateLimited.replace('{minutes}', cooldownMinutes.toString())}
              </>
            ) : reportStatus === 'error' ? (
              <>
                <MapPin className="h-5 w-5 mr-2" />
                {t.locationError}
              </>
            ) : (
              <>
                <MapPin className="h-5 w-5 mr-2" />
                <span className="flex flex-col items-start leading-tight">
                  <span>{t.reportHere}</span>
                  <span className="text-[10px] font-normal opacity-80">{t.reportHereDesc}</span>
                </span>
              </>
            )}
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-14 text-sm font-semibold border-2"
          >
            <Link href="/alerts">
              <Map className="h-5 w-5 mr-2" />
              {t.viewMap}
            </Link>
          </Button>
        </div>

        {/* URGENT STEPS - Priority 1 */}
        <Alert className="mb-4 border-[#DC2626]/30 bg-[#DC2626]/5">
          <AlertTriangle className="h-4 w-4 text-[#DC2626]" />
          <AlertTitle className="text-[#DC2626] font-bold">{t.urgentTitle}</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#DC2626] flex-shrink-0" />
                <span><strong>{t.urgent1}</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#DC2626] flex-shrink-0" />
                <span><strong>{t.urgent2}</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#DC2626] flex-shrink-0" />
                <span><strong>{t.urgent3}</strong></span>
              </li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* WHAT TO SAY */}
        <Card className="mb-4 border-[#00A6B4]/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Volume2 className="h-5 w-5 text-[#00A6B4]" />
              {t.sayTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { en: t.say1, es: t.say1es },
              { en: t.say2, es: t.say2es },
              { en: t.say3, es: t.say3es },
              { en: t.say4, es: t.say4es },
            ].map((phrase, i) => (
              <div key={i} className="p-3 bg-[#00A6B4]/5 rounded-lg">
                <p className="font-medium text-sm">"{phrase.en}"</p>
                <p className="text-xs text-muted-foreground italic">"{phrase.es}"</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* WARRANT COMPARISON */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="border-[#84CC16]/30">
            <CardHeader className="pb-1 pt-3 px-3 bg-[#84CC16]/10">
              <CardTitle className="text-[#84CC16] text-sm font-bold">
                {t.judicialWarrant}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 px-3 pb-3">
              <ul className="text-xs space-y-1">
                <li className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-[#84CC16]" />
                  {t.judicialSigned}
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-[#84CC16]" />
                  {t.judicialCourt}
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-[#DC2626]/30">
            <CardHeader className="pb-1 pt-3 px-3 bg-[#DC2626]/10">
              <CardTitle className="text-[#DC2626] text-sm font-bold">
                {t.iceWarrant}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 px-3 pb-3">
              <ul className="text-xs space-y-1">
                <li className="flex items-center gap-1">
                  <XCircle className="h-3 w-3 text-[#DC2626]" />
                  {t.iceSigned}
                </li>
                <li className="flex items-center gap-1">
                  <XCircle className="h-3 w-3 text-[#DC2626]" />
                  {t.iceNoEntry}
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* TRAFFIC STOP - Driver vs Passenger */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Car className="h-5 w-5 text-[#00A6B4]" />
              {t.trafficTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#00A6B4]/5 rounded-lg">
                <div className="flex items-center gap-1 mb-2">
                  <User className="h-4 w-4 text-[#00A6B4]" />
                  <span className="font-bold text-sm text-[#00A6B4]">{t.driverTitle}</span>
                </div>
                <p className="text-xs font-medium mb-1">{t.driverMust}</p>
                <ul className="text-xs space-y-0.5 text-muted-foreground">
                  <li>• {t.driverLicense}</li>
                  <li>• {t.driverReg}</li>
                  <li>• {t.driverIns}</li>
                </ul>
                <p className="text-xs mt-2 text-[#DC2626]">{t.driverNote}</p>
              </div>
              <div className="p-3 bg-[#84CC16]/5 rounded-lg">
                <div className="flex items-center gap-1 mb-2">
                  <Users className="h-4 w-4 text-[#84CC16]" />
                  <span className="font-bold text-sm text-[#84CC16]">{t.passengerTitle}</span>
                </div>
                <p className="text-xs font-medium mb-1">{t.passengerNote}</p>
                <ul className="text-xs space-y-0.5 text-muted-foreground">
                  <li>• {t.passengerNoId}</li>
                  <li>• {t.passengerNoName}</li>
                  <li>• {t.passengerNoAnswer}</li>
                </ul>
                <p className="text-xs mt-2 font-bold text-[#84CC16]">{t.passengerSilent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* IF DETAINED */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Building className="h-5 w-5 text-[#FF8C42]" />
              {t.detainedTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF8C42] text-white flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <p className="font-medium text-sm">{t.getANumber}</p>
                <p className="text-xs text-muted-foreground">{t.aNumberDesc}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF8C42] text-white flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <p className="font-medium text-sm">{t.useLocator}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <a
                    href="https://locator.ice.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#00A6B4] hover:underline"
                  >
                    {t.locatorOnline} <ExternalLink className="h-3 w-3" />
                  </a>
                  <a
                    href="tel:18883514024"
                    className="inline-flex items-center gap-1 text-xs text-[#00A6B4] hover:underline"
                  >
                    {t.locatorPhone}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF8C42] text-white flex items-center justify-center text-xs font-bold">3</span>
              <p className="font-medium text-sm">{t.contactLawyer}</p>
            </div>
            <Alert className="border-[#DC2626]/30 bg-[#DC2626]/5 py-2">
              <AlertTriangle className="h-4 w-4 text-[#DC2626]" />
              <AlertDescription className="text-sm font-bold text-[#DC2626]">
                {t.noSign}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* DO NOT */}
        <Card className="mb-4 border-[#DC2626]/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-[#DC2626] text-base">
              <XCircle className="h-5 w-5" />
              {t.doNotTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {[t.doNot1, t.doNot2, t.doNot3, t.doNot4, t.doNot5].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <XCircle className="h-4 w-4 text-[#DC2626] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* EMERGENCY HOTLINES - Sticky at bottom on mobile */}
        <Card className="mb-4 border-2 border-[#DC2626]/30">
          <CardHeader className="pb-2 bg-[#DC2626]/5">
            <CardTitle className="flex items-center gap-2 text-base">
              <Phone className="h-5 w-5 text-[#DC2626]" />
              {t.hotlinesTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-3">
            {[
              { name: t.hotline1Name, desc: t.hotline1Desc, phone: t.hotline1Phone, tel: '18443631423' },
              { name: t.hotline2Name, desc: t.hotline2Desc, phone: t.hotline2Phone, tel: '18883514024' },
              { name: t.hotline3Name, desc: t.hotline3Desc, phone: t.hotline3Phone, tel: '3126601370' },
            ].map((hotline, i) => (
              <a
                key={i}
                href={`tel:${hotline.tel}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{hotline.name}</p>
                  <p className="text-xs text-muted-foreground">{hotline.desc}</p>
                </div>
                <span className="font-bold text-[#00A6B4]">{hotline.phone}</span>
              </a>
            ))}
          </CardContent>
        </Card>

        {/* MORE RESOURCES */}
        <div className="flex gap-3">
          <Button asChild className="flex-1 h-11">
            <Link href="/rights">
              <Shield className="h-4 w-4 mr-2" />
              {t.fullGuide}
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 h-11">
            <Link href="/resources">
              <Search className="h-4 w-4 mr-2" />
              {t.allResources}
            </Link>
          </Button>
        </div>
      </div>
    </div>
    </>
  )
}
