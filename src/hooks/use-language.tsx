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
    iceNear: 'Report ICE Near Me',
    iceNearSub: 'Alert your community',
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
    anonymous: '100% Anonymous',
    noTracking: 'No accounts • No tracking • Works offline • Your data stays on your device',
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
    raids: 'Raids',
    checkpoints: 'Checkpoints',
    vehicles: 'Vehicles',
    raid: 'Raid',
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
  },
  es: {
    // Home page - Emergency buttons
    iceNear: 'Reportar ICE Cerca',
    iceNearSub: 'Alerta a tu comunidad',
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
    anonymous: '100% Anónimo',
    noTracking: 'Sin cuentas • Sin rastreo • Funciona sin internet • Tus datos quedan en tu dispositivo',
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
    raids: 'Redadas',
    checkpoints: 'Puntos de Control',
    vehicles: 'Vehículos',
    raid: 'Redada',
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
  },
  pt: {
    // Home page - Emergency buttons
    iceNear: 'Reportar ICE Perto',
    iceNearSub: 'Alerte sua comunidade',
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
    noTracking: 'Sem contas • Sem rastreamento • Funciona offline • Seus dados ficam no seu dispositivo',
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
    raids: 'Batidas',
    checkpoints: 'Postos de Controle',
    vehicles: 'Veículos',
    raid: 'Batida',
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
  },
}
