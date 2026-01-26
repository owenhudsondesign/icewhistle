'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { RecordingIndicator } from '@/components/recording/RecordingIndicator'
import { AlertContactsButton } from '@/components/emergency-contacts'
import { LocalHotlineBanner } from '@/components/hotlines/LocalHotlineBanner'
import { useRecordingStore } from '@/stores/recordingStore'
import { useEnhancedRecording } from '@/hooks/useEnhancedRecording'
import { useLanguage } from '@/hooks/use-language'
import { useUserZip } from '@/hooks/use-user-zip'
import { AppHeader } from '@/components/shared/AppHeader'
import { getHotlinesForZip, getLocationDisplay } from '@/data/hotlines'
import { trackEncounterGuideView, trackHotlineCallClick } from '@/lib/analytics'
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
} from 'lucide-react'
import { useEffect } from 'react'

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
  const t = translations[language as keyof typeof translations] || translations.en
  const { showSaveDialog, recordingBlob } = useRecordingStore()
  const { stopRecording, saveRecording, discardRecording } = useEnhancedRecording()
  const { zip, mounted } = useUserZip()
  const locationDisplay = mounted ? getLocationDisplay(zip, language) : ''
  const hotlines = mounted ? getHotlinesForZip(zip) : []

  // Get top hotlines to display - prioritize local/state
  const localHotlines = hotlines.filter(h => h.type === 'local' || h.type === 'state')
  const nationalHotlines = hotlines.filter(h => h.type === 'national')
  const displayHotlines = [
    ...localHotlines.slice(0, 2),
    ...nationalHotlines.slice(0, 3 - Math.min(localHotlines.length, 2))
  ].slice(0, 3)

  // Track encounter guide view for social proof
  useEffect(() => {
    trackEncounterGuideView()
  }, [])

  const handleStopAndSave = async () => {
    await stopRecording()
  }

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-background pb-28">
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
        <AlertContactsButton className="mb-8" />

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
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Card className="border-[#84CC16]/30">
            <CardHeader className="pb-1 pt-2 px-2 bg-[#84CC16]/10">
              <CardTitle className="text-[#84CC16] text-xs font-bold leading-tight break-words">
                {t.judicialWarrant}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 px-2 pb-2">
              <ul className="text-[10px] space-y-1">
                <li className="flex items-start gap-1">
                  <CheckCircle2 className="h-3 w-3 text-[#84CC16] flex-shrink-0 mt-0.5" />
                  <span className="break-words">{t.judicialSigned}</span>
                </li>
                <li className="flex items-start gap-1">
                  <CheckCircle2 className="h-3 w-3 text-[#84CC16] flex-shrink-0 mt-0.5" />
                  <span className="break-words">{t.judicialCourt}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-[#DC2626]/30">
            <CardHeader className="pb-1 pt-2 px-2 bg-[#DC2626]/10">
              <CardTitle className="text-[#DC2626] text-xs font-bold leading-tight break-words">
                {t.iceWarrant}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 px-2 pb-2">
              <ul className="text-[10px] space-y-1">
                <li className="flex items-start gap-1">
                  <XCircle className="h-3 w-3 text-[#DC2626] flex-shrink-0 mt-0.5" />
                  <span className="break-words">{t.iceSigned}</span>
                </li>
                <li className="flex items-start gap-1">
                  <XCircle className="h-3 w-3 text-[#DC2626] flex-shrink-0 mt-0.5" />
                  <span className="break-words">{t.iceNoEntry}</span>
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
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-[#00A6B4]/5 rounded-lg">
                <div className="flex items-center gap-1 mb-1.5">
                  <User className="h-3 w-3 text-[#00A6B4] flex-shrink-0" />
                  <span className="font-bold text-xs text-[#00A6B4] break-words">{t.driverTitle}</span>
                </div>
                <p className="text-[10px] font-medium mb-1 break-words">{t.driverMust}</p>
                <ul className="text-[10px] space-y-0.5 text-muted-foreground">
                  <li className="break-words">• {t.driverLicense}</li>
                  <li className="break-words">• {t.driverReg}</li>
                  <li className="break-words">• {t.driverIns}</li>
                </ul>
                <p className="text-[10px] mt-1.5 text-[#DC2626] break-words">{t.driverNote}</p>
              </div>
              <div className="p-2 bg-[#84CC16]/5 rounded-lg">
                <div className="flex items-center gap-1 mb-1.5">
                  <Users className="h-3 w-3 text-[#84CC16] flex-shrink-0" />
                  <span className="font-bold text-xs text-[#84CC16] break-words">{t.passengerTitle}</span>
                </div>
                <p className="text-[10px] font-medium mb-1 break-words">{t.passengerNote}</p>
                <ul className="text-[10px] space-y-0.5 text-muted-foreground">
                  <li className="break-words">• {t.passengerNoId}</li>
                  <li className="break-words">• {t.passengerNoName}</li>
                  <li className="break-words">• {t.passengerNoAnswer}</li>
                </ul>
                <p className="text-[10px] mt-1.5 font-bold text-[#84CC16] break-words">{t.passengerSilent}</p>
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

        {/* EMERGENCY HOTLINES - Dynamic based on ZIP */}
        <Card className="mb-4 border-2 border-[#DC2626]/30">
          <CardHeader className="pb-2 bg-[#DC2626]/5">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-[#DC2626]" />
                {t.hotlinesTitle}
              </div>
              {mounted && zip && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground font-normal">
                  <MapPin className="h-3 w-3" />
                  {locationDisplay}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-3">
            {/* Local hotline prompt if no ZIP */}
            {mounted && !zip && (
              <LocalHotlineBanner variant="emergency" showZipInput={true} maxHotlines={0} className="mb-2" />
            )}

            {/* Dynamic hotlines based on ZIP */}
            {displayHotlines.map((hotline) => {
              const name = language === 'es' && hotline.nameEs ? hotline.nameEs : hotline.name
              const desc = language === 'es' && hotline.descriptionEs ? hotline.descriptionEs : hotline.description
              const isLocal = hotline.type === 'local' || hotline.type === 'state'

              return (
                <a
                  key={hotline.id}
                  href={`tel:${hotline.phone.replace(/\D/g, '')}`}
                  className={`flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors ${
                    isLocal ? 'border-[#00A6B4]/30 bg-[#00A6B4]/5' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{name}</p>
                      {isLocal && (
                        <span className="px-1.5 py-0.5 bg-[#00A6B4]/10 text-[#00A6B4] text-[9px] font-semibold rounded">
                          {language === 'es' ? 'LOCAL' : 'LOCAL'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <span className="font-bold text-[#00A6B4]">{hotline.phone}</span>
                </a>
              )
            })}

            {/* Link to all hotlines */}
            <Link
              href="/hotlines"
              className="inline-flex items-center text-xs text-[#00A6B4] hover:underline mt-2 font-semibold"
            >
              {language === 'es' ? 'Ver todas las líneas' : 'View all hotlines'} →
            </Link>
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
