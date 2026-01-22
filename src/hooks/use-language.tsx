'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'

export type Language = 'en' | 'es' | 'pt'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  mounted: boolean
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('icewhistle-lang') as Language | null
    if (stored) {
      setLanguageState(stored)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('icewhistle-lang', lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, mounted }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    // Fallback for components outside provider (shouldn't happen in normal use)
    return { language: 'en' as Language, setLanguage: () => {}, mounted: false }
  }
  return context
}

// Common translations
export const commonTranslations = {
  en: {
    // Home page - Emergency buttons
    iceNear: 'ICE Is Near Me',
    iceNearSub: 'Record & get help',
    trafficStop: 'Traffic Stop',
    trafficStopSub: 'Driver or passenger',
    someoneTaken: 'Someone Was Taken',
    someoneTakenSub: 'Find & help them',
    liveAlerts: 'Live Alerts',
    liveAlertsSub: 'Community reports',
    knowRights: 'Know Your Rights',
    knowRightsSub: 'What to say & do',
    findLawyer: 'Find a Lawyer',
    findLawyerSub: 'Free legal aid',

    // Home page - Search & location
    askQuestion: 'Ask a question...',
    search: 'Search',
    locationPlaceholder: 'City or zip (optional, never stored)',

    // Home page - Resources
    emergencyHotlines: 'Emergency Hotlines',
    bondFunds: 'Bond Funds',
    bondFundsSub: 'Help pay bail',
    available247: '24/7',

    // Home page - Rights reminder
    youCanSay: 'You can say:',
    never: 'Never:',
    rightSilent: '"I am exercising my right to remain silent."',
    rightLawyer: '"I want to speak to a lawyer."',
    rightNoEntry: '"I do not consent to your entry."',
    neverOpenDoor: 'Open door without judicial warrant',
    neverSign: 'Sign any documents',
    neverLie: 'Lie or show fake documents',
    learnMore: 'Learn more',

    // Privacy
    anonymous: 'Anonymous',
    noTracking: 'No accounts. No tracking. Location rounded for privacy.',
    precision100m: '~100m precision',
    autoExpire8hr: '8hr auto-expire',

    // Alerts page
    report: 'Report',
    reportActivity: 'Report Activity',
    reportActivityAlt: 'Reportar Actividad',
    mapView: 'Map View',
    listView: 'List View',
    quickReport: 'Quick Report',
    recentReports: 'Recent Reports',
    seeAll: 'See all',
    noActiveAlerts: 'No Active Alerts',
    noAlertsDesc: 'No ICE activity reported in this area recently.',
    verified: 'Verified',
    active: 'active',

    // Alert types
    raids: 'Presence',
    checkpoints: 'Checkpoints',
    vehicles: 'Vehicles',
    raid: 'Presence',
    workplace: 'Workplace',
    residence: 'Residence',
    checkpoint: 'Checkpoint',
    vehicle: 'Vehicle',
    transit: 'Transit',

    // Time
    loading: 'Loading...',
    loadingAlerts: 'Loading alerts...',
    justNow: 'just now',
    minsAgo: 'm ago',
    hoursAgo: 'h ago',

    // Hotlines
    iceDetaineeLocator: 'ICE Detainee Locator',
    unitedWeDream: 'United We Dream',
    traffickingHotline: 'Trafficking Hotline',
    crisisLine: 'Crisis Line',

    // Hotline descriptions
    iceDetaineeDesc: 'Find someone in ICE custody',
    unitedWeDreamDesc: 'Report enforcement activity',
    traffickingDesc: 'Help for trafficking victims',
    crisisDesc: 'Mental health support',
    callFree247: 'Free 24/7 hotline',

    // How it works
    howItWorks: 'How ICEwhistle Works',
    step1Title: 'Report',
    step1Desc: 'See ICE? Tap to alert your community instantly',
    step2Title: 'Alert',
    step2Desc: 'Nearby users receive anonymous notifications',
    step3Title: 'Protect',
    step3Desc: 'Communities can prepare and stay safe',
    privacyFirst: 'Privacy First',
    privacyDesc: 'No accounts, no tracking. All data stays on your device.',

    // Recording feature
    recordingFeature: 'Built-in Recording',
    recordingFeatureDesc: 'Document encounters with video or audio. Each recording includes a cryptographic signature proving it was captured in real-time — not AI-generated or edited.',
    recordingFeature1: 'Front, back, or dual camera',
    recordingFeature2: 'Cryptographic authenticity proof',
    recordingFeature3: 'Admissible documentation',

    // Section badges
    badgeEmergency: 'EMERGENCY',
    badgeReport: 'REPORT',
    badgeResources: 'RESOURCES',
    badgeRights: 'KNOW YOUR RIGHTS',
    badgeHotlines: 'CALL NOW',

    // Language labels
    langEnglish: 'English',
    langSpanish: 'Español',
    langPortuguese: 'Português',

    // Support
    supportTool: 'Support this free tool',

    // Support page
    supportTitle: 'Support this tool',
    supportIntro: 'This tool is free, ad-free, and available to everyone.',
    supportMission: 'It is maintained as a public resource to help people understand their rights, share timely information, and access community support during ICE encounters. No account is required, and no usage data is tracked.',
    howSupportUsed: 'How support is used',
    supportHelps: 'Community support helps cover:',
    supportHosting: 'Website hosting and infrastructure',
    supportTranslation: 'Accessibility and multilingual translation',
    supportMaintenance: 'Ongoing maintenance and updates',
    supportLegal: 'Occasional legal and content review',
    supportTransparency: 'Contributors may receive modest stipends for maintenance or translation work. These expenses are reported transparently. Any surplus funds may be redistributed to aligned community organizations or mutual aid efforts.',
    privacyTrust: 'Privacy & trust',
    donationsOptional: 'Donations are optional',
    donationsSecure: 'Donations are processed securely by OpenCollective',
    noStoreDonorInfo: 'This site does not collect or store donor information',
    accessNeverGated: 'Access to resources is never gated by payment',
    supportClosing: 'Support is one way to help keep this tool available and sustainable — but the information here will always remain free.',
    donationsProcessed: 'Donations are processed by OpenCollective. This site does not handle payments or collect donor data.',
    preferDirect: 'Prefer to donate directly on OpenCollective?',
    openInOC: 'Open in OpenCollective',
    supportInfrastructure: 'Your donation supports infrastructure, not data collection.',
  },
  es: {
    // Home page - Emergency buttons
    iceNear: 'ICE Está Cerca',
    iceNearSub: 'Grabar y obtener ayuda',
    trafficStop: 'Control de Tráfico',
    trafficStopSub: 'Conductor o pasajero',
    someoneTaken: 'Alguien Fue Detenido',
    someoneTakenSub: 'Encontrar y ayudar',
    liveAlerts: 'Alertas en Vivo',
    liveAlertsSub: 'Reportes comunitarios',
    knowRights: 'Conoce Tus Derechos',
    knowRightsSub: 'Qué decir y hacer',
    findLawyer: 'Buscar Abogado',
    findLawyerSub: 'Ayuda legal gratis',

    // Home page - Search & location
    askQuestion: 'Haz una pregunta...',
    search: 'Buscar',
    locationPlaceholder: 'Ciudad o código postal (opcional)',

    // Home page - Resources
    emergencyHotlines: 'Líneas de Emergencia',
    bondFunds: 'Fondos de Fianza',
    bondFundsSub: 'Ayuda a pagar fianza',
    available247: '24/7',

    // Home page - Rights reminder
    youCanSay: 'Puedes decir:',
    never: 'Nunca:',
    rightSilent: '"Estoy ejerciendo mi derecho a guardar silencio."',
    rightLawyer: '"Quiero hablar con un abogado."',
    rightNoEntry: '"No doy permiso para entrar."',
    neverOpenDoor: 'Abrir la puerta sin orden judicial',
    neverSign: 'Firmar documentos',
    neverLie: 'Mentir o mostrar documentos falsos',
    learnMore: 'Más información',

    // Privacy
    anonymous: 'Anónimo',
    noTracking: 'Sin cuentas. Sin rastreo. Ubicación redondeada para privacidad.',
    precision100m: '~100m de precisión',
    autoExpire8hr: 'Expira en 8hrs',

    // Alerts page
    report: 'Reportar',
    reportActivity: 'Reportar Actividad',
    reportActivityAlt: 'Report Activity',
    mapView: 'Ver Mapa',
    listView: 'Ver Lista',
    quickReport: 'Reporte Rápido',
    recentReports: 'Reportes Recientes',
    seeAll: 'Ver todos',
    noActiveAlerts: 'Sin Alertas Activas',
    noAlertsDesc: 'No hay actividad de ICE reportada en esta área recientemente.',
    verified: 'Verificado',
    active: 'activas',

    // Alert types
    raids: 'Presencia',
    checkpoints: 'Puntos de Control',
    vehicles: 'Vehículos',
    raid: 'Presencia',
    workplace: 'Trabajo',
    residence: 'Residencia',
    checkpoint: 'Control',
    vehicle: 'Vehículo',
    transit: 'Tránsito',

    // Time
    loading: 'Cargando...',
    loadingAlerts: 'Cargando alertas...',
    justNow: 'ahora mismo',
    minsAgo: 'm atrás',
    hoursAgo: 'h atrás',

    // Hotlines
    iceDetaineeLocator: 'Localizador de Detenidos',
    unitedWeDream: 'United We Dream',
    traffickingHotline: 'Línea de Tráfico',
    crisisLine: 'Línea de Crisis',

    // Hotline descriptions
    iceDetaineeDesc: 'Encontrar a alguien bajo custodia de ICE',
    unitedWeDreamDesc: 'Reportar actividad de inmigración',
    traffickingDesc: 'Ayuda para víctimas de tráfico',
    crisisDesc: 'Apoyo de salud mental',
    callFree247: 'Línea gratuita 24/7',

    // How it works
    howItWorks: 'Cómo Funciona ICEwhistle',
    step1Title: 'Reportar',
    step1Desc: '¿Ves a ICE? Toca para alertar a tu comunidad',
    step2Title: 'Alertar',
    step2Desc: 'Usuarios cercanos reciben notificaciones anónimas',
    step3Title: 'Proteger',
    step3Desc: 'Las comunidades pueden prepararse y mantenerse seguras',
    privacyFirst: 'Privacidad Primero',
    privacyDesc: 'Sin cuentas. Sin rastreo. Ubicación redondeada para privacidad.',

    // Recording feature
    recordingFeature: 'Grabación Integrada',
    recordingFeatureDesc: 'Documenta encuentros con video o audio. Cada grabación incluye una firma criptográfica que prueba que fue capturada en tiempo real — no generada por IA ni editada.',
    recordingFeature1: 'Cámara frontal, trasera o dual',
    recordingFeature2: 'Prueba de autenticidad criptográfica',
    recordingFeature3: 'Documentación admisible',

    // Section badges
    badgeEmergency: 'EMERGENCIA',
    badgeReport: 'REPORTAR',
    badgeResources: 'RECURSOS',
    badgeRights: 'TUS DERECHOS',
    badgeHotlines: 'LLAMAR AHORA',

    // Language labels
    langEnglish: 'English',
    langSpanish: 'Español',
    langPortuguese: 'Português',

    // Support
    supportTool: 'Apoya esta herramienta gratuita',

    // Support page
    supportTitle: 'Apoya esta herramienta',
    supportIntro: 'Esta herramienta es gratuita, sin anuncios y disponible para todos.',
    supportMission: 'Se mantiene como un recurso público para ayudar a las personas a entender sus derechos, compartir información oportuna y acceder al apoyo comunitario durante encuentros con ICE. No se requiere cuenta y no se rastrea ningún dato de uso.',
    howSupportUsed: 'Cómo se usa el apoyo',
    supportHelps: 'El apoyo comunitario ayuda a cubrir:',
    supportHosting: 'Alojamiento web e infraestructura',
    supportTranslation: 'Accesibilidad y traducción multilingüe',
    supportMaintenance: 'Mantenimiento y actualizaciones continuas',
    supportLegal: 'Revisión legal y de contenido ocasional',
    supportTransparency: 'Los colaboradores pueden recibir modestos estipendios por trabajo de mantenimiento o traducción. Estos gastos se reportan de manera transparente. Los fondos excedentes pueden redistribuirse a organizaciones comunitarias alineadas o esfuerzos de ayuda mutua.',
    privacyTrust: 'Privacidad y confianza',
    donationsOptional: 'Las donaciones son opcionales',
    donationsSecure: 'Las donaciones se procesan de forma segura por OpenCollective',
    noStoreDonorInfo: 'Este sitio no recopila ni almacena información de donantes',
    accessNeverGated: 'El acceso a los recursos nunca está condicionado al pago',
    supportClosing: 'Apoyar es una forma de ayudar a mantener esta herramienta disponible y sostenible — pero la información aquí siempre será gratuita.',
    donationsProcessed: 'Las donaciones son procesadas por OpenCollective. Este sitio no maneja pagos ni recopila datos de donantes.',
    preferDirect: '¿Prefieres donar directamente en OpenCollective?',
    openInOC: 'Abrir en OpenCollective',
    supportInfrastructure: 'Tu donación apoya infraestructura, no recolección de datos.',
  },
  pt: {
    // Home page - Emergency buttons
    iceNear: 'ICE Está Perto',
    iceNearSub: 'Gravar e obter ajuda',
    trafficStop: 'Blitz de Trânsito',
    trafficStopSub: 'Motorista ou passageiro',
    someoneTaken: 'Alguém Foi Levado',
    someoneTakenSub: 'Encontrar e ajudar',
    liveAlerts: 'Alertas ao Vivo',
    liveAlertsSub: 'Relatórios da comunidade',
    knowRights: 'Conheça Seus Direitos',
    knowRightsSub: 'O que dizer e fazer',
    findLawyer: 'Encontrar Advogado',
    findLawyerSub: 'Ajuda jurídica grátis',

    // Home page - Search & location
    askQuestion: 'Faça uma pergunta...',
    search: 'Buscar',
    locationPlaceholder: 'Cidade ou CEP (opcional)',

    // Home page - Resources
    emergencyHotlines: 'Linhas de Emergência',
    bondFunds: 'Fundos de Fiança',
    bondFundsSub: 'Ajuda a pagar fiança',
    available247: '24/7',

    // Home page - Rights reminder
    youCanSay: 'Você pode dizer:',
    never: 'Nunca:',
    rightSilent: '"Estou exercendo meu direito de permanecer em silêncio."',
    rightLawyer: '"Quero falar com um advogado."',
    rightNoEntry: '"Não autorizo sua entrada."',
    neverOpenDoor: 'Abrir a porta sem mandado judicial',
    neverSign: 'Assinar documentos',
    neverLie: 'Mentir ou mostrar documentos falsos',
    learnMore: 'Saiba mais',

    // Privacy
    anonymous: '100% Anônimo',
    noTracking: 'Sem contas. Sem rastreamento. Localização arredondada para privacidade.',
    precision100m: '~100m de precisão',
    autoExpire8hr: 'Expira em 8hrs',

    // Alerts page
    report: 'Reportar',
    reportActivity: 'Reportar Atividade',
    reportActivityAlt: 'Report Activity',
    mapView: 'Ver Mapa',
    listView: 'Ver Lista',
    quickReport: 'Relatório Rápido',
    recentReports: 'Relatórios Recentes',
    seeAll: 'Ver todos',
    noActiveAlerts: 'Sem Alertas Ativos',
    noAlertsDesc: 'Nenhuma atividade do ICE relatada nesta área recentemente.',
    verified: 'Verificado',
    active: 'ativos',

    // Alert types
    raids: 'Presença',
    checkpoints: 'Postos de Controle',
    vehicles: 'Veículos',
    raid: 'Presença',
    workplace: 'Trabalho',
    residence: 'Residência',
    checkpoint: 'Posto',
    vehicle: 'Veículo',
    transit: 'Trânsito',

    // Time
    loading: 'Carregando...',
    loadingAlerts: 'Carregando alertas...',
    justNow: 'agora mesmo',
    minsAgo: 'm atrás',
    hoursAgo: 'h atrás',

    // Hotlines
    iceDetaineeLocator: 'Localizador de Detidos',
    unitedWeDream: 'United We Dream',
    traffickingHotline: 'Linha de Tráfico',
    crisisLine: 'Linha de Crise',

    // Hotline descriptions
    iceDetaineeDesc: 'Encontrar alguém sob custódia do ICE',
    unitedWeDreamDesc: 'Reportar atividade de imigração',
    traffickingDesc: 'Ajuda para vítimas de tráfico',
    crisisDesc: 'Apoio de saúde mental',
    callFree247: 'Linha gratuita 24/7',

    // How it works
    howItWorks: 'Como o ICEwhistle Funciona',
    step1Title: 'Reportar',
    step1Desc: 'Viu ICE? Toque para alertar sua comunidade',
    step2Title: 'Alertar',
    step2Desc: 'Usuários próximos recebem notificações anônimas',
    step3Title: 'Proteger',
    step3Desc: 'Comunidades podem se preparar e ficar seguras',
    privacyFirst: 'Privacidade Primeiro',
    privacyDesc: 'Sem contas. Sem rastreamento. Localização arredondada para privacidade.',

    // Recording feature
    recordingFeature: 'Gravação Integrada',
    recordingFeatureDesc: 'Documente encontros com vídeo ou áudio. Cada gravação inclui uma assinatura criptográfica provando que foi capturada em tempo real — não gerada por IA nem editada.',
    recordingFeature1: 'Câmera frontal, traseira ou dual',
    recordingFeature2: 'Prova de autenticidade criptográfica',
    recordingFeature3: 'Documentação admissível',

    // Section badges
    badgeEmergency: 'EMERGÊNCIA',
    badgeReport: 'REPORTAR',
    badgeResources: 'RECURSOS',
    badgeRights: 'SEUS DIREITOS',
    badgeHotlines: 'LIGAR AGORA',

    // Language labels
    langEnglish: 'English',
    langSpanish: 'Español',
    langPortuguese: 'Português',

    // Support
    supportTool: 'Apoie esta ferramenta gratuita',

    // Support page
    supportTitle: 'Apoie esta ferramenta',
    supportIntro: 'Esta ferramenta é gratuita, sem anúncios e disponível para todos.',
    supportMission: 'É mantida como um recurso público para ajudar as pessoas a entender seus direitos, compartilhar informações oportunas e acessar apoio comunitário durante encontros com o ICE. Nenhuma conta é necessária e nenhum dado de uso é rastreado.',
    howSupportUsed: 'Como o apoio é usado',
    supportHelps: 'O apoio da comunidade ajuda a cobrir:',
    supportHosting: 'Hospedagem e infraestrutura do site',
    supportTranslation: 'Acessibilidade e tradução multilíngue',
    supportMaintenance: 'Manutenção e atualizações contínuas',
    supportLegal: 'Revisão legal e de conteúdo ocasional',
    supportTransparency: 'Colaboradores podem receber modestos estipêndios por trabalho de manutenção ou tradução. Essas despesas são reportadas de forma transparente. Fundos excedentes podem ser redistribuídos para organizações comunitárias alinhadas ou esforços de ajuda mútua.',
    privacyTrust: 'Privacidade e confiança',
    donationsOptional: 'Doações são opcionais',
    donationsSecure: 'Doações são processadas de forma segura pelo OpenCollective',
    noStoreDonorInfo: 'Este site não coleta nem armazena informações de doadores',
    accessNeverGated: 'O acesso aos recursos nunca é condicionado ao pagamento',
    supportClosing: 'Apoiar é uma forma de ajudar a manter esta ferramenta disponível e sustentável — mas as informações aqui sempre serão gratuitas.',
    donationsProcessed: 'Doações são processadas pelo OpenCollective. Este site não processa pagamentos nem coleta dados de doadores.',
    preferDirect: 'Prefere doar diretamente no OpenCollective?',
    openInOC: 'Abrir no OpenCollective',
    supportInfrastructure: 'Sua doação apoia infraestrutura, não coleta de dados.',
  },
}
