/**
 * Centralized translations for ICEwhistle
 *
 * All translations should be added here. Components import via:
 * import { translations, getT } from '@/lib/translations'
 *
 * Usage:
 * const { language } = useLanguage()
 * const t = getT(language) // Falls back to English for unsupported languages
 *
 * Organization:
 * - common: Shared across multiple pages
 * - nav: Navigation and header
 * - home: Home page
 * - alerts: Alerts page and reporting
 * - rights: Rights page
 * - faq: FAQ page and chatbot
 * - emergency: Emergency page
 * - about: About page
 * - support: Support/donate page
 * - recording: Recording modal and features
 * - etc.
 */

// Languages with full translations in this file
type TranslatedLanguage = 'en' | 'es' | 'pt'

export const translations = {
  en: {
    // ============================================
    // COMMON - Used across multiple pages
    // ============================================
    common: {
      loading: 'Loading...',
      search: 'Search',
      learnMore: 'Learn more',
      back: 'Back',
      close: 'Close',
      save: 'Save',
      cancel: 'Cancel',
      submit: 'Submit',
      confirm: 'Confirm',
      delete: 'Delete',
      edit: 'Edit',
      seeAll: 'See all',
      viewAll: 'View all',
      available247: '24/7',
      anonymous: 'Anonymous',
      verified: 'Verified',
      active: 'active',
      share: 'Share',
      download: 'Download',
    },

    // ============================================
    // NAV - Navigation and header
    // ============================================
    nav: {
      home: 'Home',
      hotlines: 'Hotlines',
      alerts: 'Alerts',
      report: 'Report',
      rights: 'Rights',
      faq: 'FAQ',
      emergency: 'Emergency',
      about: 'About',
      support: 'Support',
      install: 'Install App',
      iosTitle: 'Install on iPhone/iPad',
      iosStep1: '1. Tap the Share button',
      iosStep2: '2. Scroll down and tap "Add to Home Screen"',
      iosStep3: '3. Tap "Add" to install',
      gotIt: 'Got it',
    },

    // ============================================
    // HOME - Home page
    // ============================================
    home: {
      // Emergency buttons
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

      // Search
      askQuestion: 'Ask a question...',
      locationPlaceholder: 'City or zip (optional, never stored)',

      // Resources
      emergencyHotlines: 'Emergency Hotlines',
      bondFunds: 'Bond Funds',
      bondFundsSub: 'Help pay bail',

      // Rights reminder
      youCanSay: 'You can say:',
      never: 'Never:',
      rightSilent: '"I am exercising my right to remain silent."',
      rightLawyer: '"I want to speak to a lawyer."',
      rightNoEntry: '"I do not consent to your entry."',
      neverOpenDoor: 'Open door without judicial warrant',
      neverSign: 'Sign any documents',
      neverLie: 'Lie or show fake documents',

      // Privacy
      noTracking: 'No accounts. No tracking. Location rounded for privacy.',
      precision500m: '~500m precision',
      autoExpire8hr: '8hr auto-expire',

      // How it works
      howItWorks: 'How ICEwhistle Works',
      step1Title: 'Learn',
      step1Desc: 'Know your rights before you need them',
      step2Title: 'Prepare',
      step2Desc: 'Create an emergency plan for your family',
      step3Title: 'Connect',
      step3Desc: 'One tap to reach hotlines and trusted contacts',
      privacyFirst: 'Privacy First',
      privacyDesc: 'No accounts, no tracking. All data stays on your device.',

      // Emergency Plan
      emergencyPlan: 'My Emergency Plan',
      emergencyPlanSub: 'Contacts & panic button',

      // Recording feature
      recordingFeature: 'Built-in Recording',
      recordingFeatureDesc: 'Document encounters with video or audio. Each recording includes a cryptographic signature proving it was captured in real-time — not AI-generated or edited.',
      recordingFeature1: 'Front or back camera',
      recordingFeature2: 'Cryptographic authenticity proof',
      recordingFeature3: 'Admissible documentation',

      // Section badges
      badgeEmergency: 'EMERGENCY',
      badgeReport: 'REPORT',
      badgeResources: 'RESOURCES',
      badgeRights: 'KNOW YOUR RIGHTS',
      badgeHotlines: 'CALL NOW',

      // Support
      supportTool: 'Support this free tool',
    },

    // ============================================
    // ALERTS - Alerts page and reporting
    // ============================================
    alerts: {
      liveAlerts: 'Live Alerts',
      reportActivity: 'Report Activity',
      reportActivityAlt: 'Tap to report ICE activity',
      mapView: 'Map View',
      listView: 'List View',
      quickReport: 'Quick Report',
      recentReports: 'Recent Reports',
      noActiveAlerts: 'No Active Alerts',
      noAlertsDesc: 'No ICE activity reported in this area recently.',
      loadingAlerts: 'Loading alerts...',

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
      theyveLeft: "They've Left",
      allClear: 'All Clear',

      // Time
      justNow: 'just now',
      minsAgo: 'm ago',
      hoursAgo: 'h ago',

      // Report modal
      reportTitle: 'Report ICE Activity',
      reportSubtitle: 'Help keep your community safe',
      whatDidYouSee: 'What did you see?',
      locationLabel: 'Location',
      locationAuto: 'Using your approximate location',
      additionalDetails: 'Additional details (optional)',
      detailsPlaceholder: 'Number of officers, vehicles, descriptions...',
      disclaimer: 'Reports are anonymous and location is rounded to ~500m for privacy.',
      submitting: 'Submitting...',
      submitReport: 'Submit Report',
      reportSuccess: 'Report submitted',
      reportSuccessDesc: 'Thank you for helping keep your community informed.',
      reportError: 'Failed to submit report',
      reportErrorDesc: 'Please try again.',
      locationRequired: 'Location required',
      locationRequiredDesc: 'Please enable location services to submit a report.',
      rateLimited: 'Please wait',
      rateLimitedDesc: 'You can submit another report in a few minutes.',
    },

    // ============================================
    // RIGHTS - Rights page
    // ============================================
    rights: {
      pageTitle: 'Know Your Rights',
      pageSubtitle: 'Understanding your constitutional rights during encounters with immigration enforcement',
      disclaimerTitle: 'Important Disclaimer',
      disclaimerText: 'This information is for educational purposes only and does not constitute legal advice. Every situation is different. For advice about your specific circumstances, please consult with a qualified immigration attorney.',

      coreRightsTitle: 'Your Core Rights',
      rightSilentTitle: 'Right to Remain Silent',
      rightSilentDesc: 'You do not have to answer questions about where you were born, your immigration status, or how you entered the United States.',
      rightSilentPhrase: 'Say: "I am exercising my right to remain silent."',
      rightAttorneyTitle: 'Right to an Attorney',
      rightAttorneyDesc: 'You have the right to speak with a lawyer before answering any questions. If detained, you can make phone calls.',
      rightAttorneyPhrase: 'Say: "I want to speak to a lawyer."',
      rightNoSignTitle: 'Do Not Sign Documents',
      rightNoSignDesc: 'Do not sign anything without speaking to an attorney. Signing "voluntary departure" can waive your right to a hearing.',
      rightNoSignPhrase: 'Say: "I do not want to sign anything until I speak with my attorney."',
      rightNoLieTitle: 'Do Not Lie',
      rightNoLieDesc: 'Never provide false information or fake documents. This can result in criminal charges and bars to future immigration relief.',
      rightNoLiePhrase: 'Stay silent rather than make up answers.',

      warrantTitle: 'Judicial vs. Administrative Warrant',
      warrantSubtitle: 'Understanding the difference can protect your rights. Only a JUDICIAL warrant allows entry into your home.',
      judicialWarrant: 'Judicial Warrant',
      judicialValid: 'VALID - Allows Entry',
      adminWarrant: 'Administrative Warrant (I-200, I-205)',
      adminInvalid: 'NOT VALID for Home Entry',

      rightsByLocation: 'Rights by Location',
      atHome: 'At Home',
      atHomeDesc: 'If ICE comes to your door',
      inPublic: 'In Public',
      inPublicDesc: 'Your rights in public spaces',
      whileDriving: 'While Driving',
      whileDrivingDesc: 'Traffic stops and checkpoints',
      atWork: 'At Work',
      atWorkDesc: 'Workplace encounters',

      detainedTitle: 'If You or a Loved One Is Detained',
      detainedSubtitle: 'Critical steps to take immediately',
      emergencyContacts: 'Emergency Contacts:',

      consularTitle: 'Your Right to Contact Your Consulate',
      consularText: 'Under the Vienna Convention, if you are detained, you have the right to contact your country\'s consulate.',
      consularPhrase: 'Say: "I want to contact my consulate."',

      searchButton: 'Search for Answers',
      cardsButton: 'Get Printable Cards',
    },

    // ============================================
    // FAQ - FAQ page and chatbot
    // ============================================
    faq: {
      title: 'FAQ',
      subtitle: 'Get answers about your rights',
      greeting: 'Hi! I can help you find information about your rights. Try asking a question or tap a suggestion below.',
      placeholder: 'Ask a question...',
      noResults: "I couldn't find specific information on that. Try the hotline for immediate help:",
      suggestedTitle: 'Common questions:',
      resultsFound: 'results found',
      callNow: 'Call Now',
      suggestions: [
        'What if ICE comes to my door?',
        'How do I find a detained family member?',
        'What are my rights in a traffic stop?',
        'How do I find a free immigration lawyer?',
        'What should I do if arrested?',
        'How do I protect my children?',
      ],
    },

    // ============================================
    // EMERGENCY - Emergency page
    // ============================================
    emergency: {
      title: 'Emergency Guide',
      subtitle: 'Step-by-step guidance for urgent situations',
      iceAtDoor: 'ICE at Your Door',
      trafficStop: 'Traffic Stop',
      workplaceRaid: 'Workplace Raid',
      someoneTaken: 'Someone Was Taken',
      callHotline: 'Call Hotline',
      step: 'Step',
    },

    // ============================================
    // ABOUT - About page
    // ============================================
    about: {
      title: 'How ICEwhistle Works',
      subtitle: 'Transparency & Privacy',
      tagline: 'No accounts. No tracking. Location rounded for privacy.',
      taglineDesc: 'ICEwhistle is designed to protect your privacy while helping communities stay informed. We collect the minimum data necessary and never track you.',

      locationPrivacy: 'Location Privacy',
      step1Title: 'Rounded to ~500 meter grid',
      step1Desc: 'Your exact coordinates are never stored. We round to a 500m grid, which covers roughly 4-6 city blocks.',
      step2Title: 'Random offset added',
      step2Desc: 'We add a random offset of ±100m so even the grid position is unpredictable. This makes it impossible to reverse-engineer your exact location.',
      step3Title: 'Result: Neighborhood-level only',
      step3Desc: 'Reports identify a general area, not a specific address. You cannot be identified by your report location.',

      whatWeCollect: 'What We Collect',
      dataColumn: 'Data',
      whenColumn: 'When',
      retentionColumn: 'Retention',
      approxLocation: 'Approximate location (~500m)',
      whenReport: 'When you submit a report',
      retention8hr: '8 hours (auto-deleted)',
      alertType: 'Alert type',
      optional: 'Optional',
      neverStored: 'Never stored',

      whatWeNeverCollect: 'What We Never Collect',
      neverIP: 'IP addresses',
      neverDevice: 'Device identifiers',
      neverAccounts: 'User accounts or login',
      neverTracking: 'Tracking or analytics',
      neverPrecise: 'Precise location',
      neverPersonal: 'Personal information',

      openSource: 'Open Source',
      openSourceDesc: 'ICEwhistle is open source. Anyone can review the code to verify these privacy claims.',
      viewCode: 'View Code on GitHub',
    },

    // ============================================
    // SUPPORT - Support/donate page
    // ============================================
    support: {
      title: 'Support this tool',
      intro: 'This tool is free, ad-free, and available to everyone.',
      mission: 'It is maintained as a public resource to help people understand their rights, share timely information, and access community support during ICE encounters. No account is required, and no usage data is tracked.',
      howUsed: 'How support is used',
      helps: 'Community support helps cover:',
      hosting: 'Website hosting and infrastructure',
      translation: 'Accessibility and multilingual translation',
      maintenance: 'Ongoing maintenance and updates',
      legal: 'Occasional legal and content review',
      transparency: 'Contributors may receive modest stipends for maintenance or translation work. These expenses are reported transparently. Any surplus funds may be redistributed to aligned community organizations or mutual aid efforts.',
      privacyTrust: 'Privacy & trust',
      donationsOptional: 'Donations are optional',
      donationsSecure: 'Donations are processed securely by OpenCollective',
      noStoreDonorInfo: 'This site does not collect or store donor information',
      accessNeverGated: 'Access to resources is never gated by payment',
      closing: 'Support is one way to help keep this tool available and sustainable — but the information here will always remain free.',
      processed: 'Donations are processed by OpenCollective. This site does not handle payments or collect donor data.',
      preferDirect: 'Prefer to donate directly on OpenCollective?',
      openInOC: 'Open in OpenCollective',
      infrastructure: 'Your donation supports infrastructure, not data collection.',
    },

    // ============================================
    // RECORDING - Recording modal and features
    // ============================================
    recording: {
      chooseType: 'Choose Recording Type',
      chooseTypeDesc: 'Select how you want to document this encounter',
      videoRecording: 'Video Recording',
      videoDesc: 'Record video with audio',
      audioOnly: 'Audio Only',
      audioDesc: 'Record audio discreetly',
      chooseCamera: 'Choose Camera',
      chooseCameraDesc: 'Select which camera to use',
      frontCamera: 'Front Camera',
      frontCameraDesc: 'Record yourself',
      backCamera: 'Back Camera',
      backCameraDesc: 'Record your surroundings',
      startRecording: 'Start Recording',
      stopRecording: 'Stop Recording',
      pauseRecording: 'Pause',
      resumeRecording: 'Resume',
      recording: 'Recording',
      paused: 'Paused',
      saveRecording: 'Save Recording',
      discardRecording: 'Discard',
      recordingSaved: 'Recording Saved',
      recordingSavedDesc: 'Your recording has been saved to your device.',
      recordingDiscarded: 'Recording Discarded',
      permissionDenied: 'Camera permission denied',
      legalTip: 'You have the right to record police encounters in public',
    },

    // ============================================
    // HOTLINES - Emergency hotlines
    // ============================================
    hotlines: {
      iceDetaineeLocator: 'ICE Detainee Locator',
      iceDetaineeDesc: 'Find someone in ICE custody',
      unitedWeDream: 'United We Dream',
      unitedWeDreamDesc: 'Report enforcement activity',
      traffickingHotline: 'Trafficking Hotline',
      traffickingDesc: 'Help for trafficking victims',
      crisisLine: 'Crisis Line',
      crisisDesc: 'Mental health support',
      callFree247: 'Free 24/7 hotline',
    },
  },

  es: {
    // ============================================
    // COMMON
    // ============================================
    common: {
      loading: 'Cargando...',
      search: 'Buscar',
      learnMore: 'Más información',
      back: 'Atrás',
      close: 'Cerrar',
      save: 'Guardar',
      cancel: 'Cancelar',
      submit: 'Enviar',
      confirm: 'Confirmar',
      delete: 'Eliminar',
      edit: 'Editar',
      seeAll: 'Ver todos',
      viewAll: 'Ver todos',
      available247: '24/7',
      anonymous: 'Anónimo',
      verified: 'Verificado',
      active: 'activas',
      share: 'Compartir',
      download: 'Descargar',
    },

    // ============================================
    // NAV
    // ============================================
    nav: {
      home: 'Inicio',
      hotlines: 'Líneas de Ayuda',
      alerts: 'Alertas',
      report: 'Reportar',
      rights: 'Derechos',
      faq: 'Preguntas',
      emergency: 'Emergencia',
      about: 'Acerca de',
      support: 'Apoyar',
      install: 'Instalar App',
      iosTitle: 'Instalar en iPhone/iPad',
      iosStep1: '1. Toca el botón Compartir',
      iosStep2: '2. Desplázate y toca "Añadir a la pantalla de inicio"',
      iosStep3: '3. Toca "Añadir" para instalar',
      gotIt: 'Entendido',
    },

    // ============================================
    // HOME
    // ============================================
    home: {
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

      askQuestion: 'Haz una pregunta...',
      locationPlaceholder: 'Ciudad o código postal (opcional)',

      emergencyHotlines: 'Líneas de Emergencia',
      bondFunds: 'Fondos de Fianza',
      bondFundsSub: 'Ayuda a pagar fianza',

      youCanSay: 'Puedes decir:',
      never: 'Nunca:',
      rightSilent: '"Estoy ejerciendo mi derecho a guardar silencio."',
      rightLawyer: '"Quiero hablar con un abogado."',
      rightNoEntry: '"No doy permiso para entrar."',
      neverOpenDoor: 'Abrir la puerta sin orden judicial',
      neverSign: 'Firmar documentos',
      neverLie: 'Mentir o mostrar documentos falsos',

      noTracking: 'Sin cuentas. Sin rastreo. Ubicación redondeada para privacidad.',
      precision500m: '~500m de precisión',
      autoExpire8hr: 'Expira en 8hrs',

      howItWorks: 'Cómo Funciona ICEwhistle',
      step1Title: 'Aprende',
      step1Desc: 'Conoce tus derechos antes de necesitarlos',
      step2Title: 'Prepara',
      step2Desc: 'Crea un plan de emergencia para tu familia',
      step3Title: 'Conecta',
      step3Desc: 'Un toque para contactar líneas de ayuda y contactos de confianza',
      privacyFirst: 'Privacidad Primero',
      privacyDesc: 'Sin cuentas. Sin rastreo. Todos los datos quedan en tu dispositivo.',

      emergencyPlan: 'Mi Plan de Emergencia',
      emergencyPlanSub: 'Contactos y botón de pánico',

      recordingFeature: 'Grabación Integrada',
      recordingFeatureDesc: 'Documenta encuentros con video o audio. Cada grabación incluye una firma criptográfica que prueba que fue capturada en tiempo real — no generada por IA ni editada.',
      recordingFeature1: 'Cámara frontal o trasera',
      recordingFeature2: 'Prueba de autenticidad criptográfica',
      recordingFeature3: 'Documentación admisible',

      badgeEmergency: 'EMERGENCIA',
      badgeReport: 'REPORTAR',
      badgeResources: 'RECURSOS',
      badgeRights: 'TUS DERECHOS',
      badgeHotlines: 'LLAMAR AHORA',

      supportTool: 'Apoya esta herramienta gratuita',
    },

    // ============================================
    // ALERTS
    // ============================================
    alerts: {
      liveAlerts: 'Alertas en Vivo',
      reportActivity: 'Reportar Actividad',
      reportActivityAlt: 'Toca para reportar actividad de ICE',
      mapView: 'Ver Mapa',
      listView: 'Ver Lista',
      quickReport: 'Reporte Rápido',
      recentReports: 'Reportes Recientes',
      noActiveAlerts: 'Sin Alertas Activas',
      noAlertsDesc: 'No hay actividad de ICE reportada en esta área recientemente.',
      loadingAlerts: 'Cargando alertas...',

      raids: 'Presencia',
      checkpoints: 'Puntos de Control',
      vehicles: 'Vehículos',
      raid: 'Presencia',
      workplace: 'Trabajo',
      residence: 'Residencia',
      checkpoint: 'Control',
      vehicle: 'Vehículo',
      transit: 'Tránsito',
      theyveLeft: 'Ya Se Fueron',
      allClear: 'Todo Despejado',

      justNow: 'ahora mismo',
      minsAgo: 'm atrás',
      hoursAgo: 'h atrás',

      reportTitle: 'Reportar Actividad de ICE',
      reportSubtitle: 'Ayuda a mantener segura a tu comunidad',
      whatDidYouSee: '¿Qué viste?',
      locationLabel: 'Ubicación',
      locationAuto: 'Usando tu ubicación aproximada',
      additionalDetails: 'Detalles adicionales (opcional)',
      detailsPlaceholder: 'Número de oficiales, vehículos, descripciones...',
      disclaimer: 'Los reportes son anónimos y la ubicación se redondea a ~500m para privacidad.',
      submitting: 'Enviando...',
      submitReport: 'Enviar Reporte',
      reportSuccess: 'Reporte enviado',
      reportSuccessDesc: 'Gracias por ayudar a mantener informada a tu comunidad.',
      reportError: 'Error al enviar reporte',
      reportErrorDesc: 'Por favor intenta de nuevo.',
      locationRequired: 'Ubicación requerida',
      locationRequiredDesc: 'Por favor habilita los servicios de ubicación para enviar un reporte.',
      rateLimited: 'Por favor espera',
      rateLimitedDesc: 'Puedes enviar otro reporte en unos minutos.',
    },

    // ============================================
    // RIGHTS
    // ============================================
    rights: {
      pageTitle: 'Conoce Tus Derechos',
      pageSubtitle: 'Entendiendo tus derechos constitucionales durante encuentros con agentes de inmigración',
      disclaimerTitle: 'Aviso Importante',
      disclaimerText: 'Esta información es solo para fines educativos y no constituye asesoría legal. Cada situación es diferente. Para consejos sobre tu situación específica, consulta con un abogado de inmigración calificado.',

      coreRightsTitle: 'Tus Derechos Fundamentales',
      rightSilentTitle: 'Derecho a Guardar Silencio',
      rightSilentDesc: 'No tienes que responder preguntas sobre dónde naciste, tu estatus migratorio o cómo entraste a Estados Unidos.',
      rightSilentPhrase: 'Di: "Estoy ejerciendo mi derecho a guardar silencio."',
      rightAttorneyTitle: 'Derecho a un Abogado',
      rightAttorneyDesc: 'Tienes derecho a hablar con un abogado antes de responder cualquier pregunta. Si eres detenido, puedes hacer llamadas telefónicas.',
      rightAttorneyPhrase: 'Di: "Quiero hablar con un abogado."',
      rightNoSignTitle: 'No Firmes Documentos',
      rightNoSignDesc: 'No firmes nada sin hablar con un abogado. Firmar "salida voluntaria" puede renunciar a tu derecho a una audiencia.',
      rightNoSignPhrase: 'Di: "No quiero firmar nada hasta hablar con mi abogado."',
      rightNoLieTitle: 'No Mientas',
      rightNoLieDesc: 'Nunca proporciones información falsa o documentos falsos. Esto puede resultar en cargos criminales y prohibiciones para futuros beneficios migratorios.',
      rightNoLiePhrase: 'Guarda silencio en lugar de inventar respuestas.',

      warrantTitle: 'Orden Judicial vs. Orden Administrativa',
      warrantSubtitle: 'Entender la diferencia puede proteger tus derechos. Solo una orden JUDICIAL permite la entrada a tu hogar.',
      judicialWarrant: 'Orden Judicial',
      judicialValid: 'VÁLIDA - Permite Entrada',
      adminWarrant: 'Orden Administrativa (I-200, I-205)',
      adminInvalid: 'NO VÁLIDA para Entrar al Hogar',

      rightsByLocation: 'Derechos por Ubicación',
      atHome: 'En Casa',
      atHomeDesc: 'Si ICE llega a tu puerta',
      inPublic: 'En Público',
      inPublicDesc: 'Tus derechos en espacios públicos',
      whileDriving: 'Manejando',
      whileDrivingDesc: 'Paradas de tráfico y puntos de control',
      atWork: 'En el Trabajo',
      atWorkDesc: 'Encuentros en el lugar de trabajo',

      detainedTitle: 'Si Tú o un Ser Querido Es Detenido',
      detainedSubtitle: 'Pasos críticos a tomar inmediatamente',
      emergencyContacts: 'Contactos de Emergencia:',

      consularTitle: 'Tu Derecho a Contactar a Tu Consulado',
      consularText: 'Bajo la Convención de Viena, si eres detenido, tienes derecho a contactar al consulado de tu país.',
      consularPhrase: 'Di: "Quiero contactar a mi consulado."',

      searchButton: 'Buscar Respuestas',
      cardsButton: 'Obtener Tarjetas Imprimibles',
    },

    // ============================================
    // FAQ
    // ============================================
    faq: {
      title: 'Preguntas Frecuentes',
      subtitle: 'Obtén respuestas sobre tus derechos',
      greeting: '¡Hola! Puedo ayudarte a encontrar información sobre tus derechos. Intenta hacer una pregunta o toca una sugerencia abajo.',
      placeholder: 'Haz una pregunta...',
      noResults: 'No encontré información específica sobre eso. Prueba la línea de ayuda:',
      suggestedTitle: 'Preguntas comunes:',
      resultsFound: 'resultados encontrados',
      callNow: 'Llamar Ahora',
      suggestions: [
        '¿Qué hago si ICE llega a mi puerta?',
        '¿Cómo encuentro a un familiar detenido?',
        '¿Cuáles son mis derechos en una parada de tráfico?',
        '¿Cómo encuentro un abogado de inmigración gratis?',
        '¿Qué debo hacer si me arrestan?',
        '¿Cómo protejo a mis hijos?',
      ],
    },

    // ============================================
    // EMERGENCY
    // ============================================
    emergency: {
      title: 'Guía de Emergencia',
      subtitle: 'Orientación paso a paso para situaciones urgentes',
      iceAtDoor: 'ICE en Tu Puerta',
      trafficStop: 'Parada de Tráfico',
      workplaceRaid: 'Redada en el Trabajo',
      someoneTaken: 'Alguien Fue Detenido',
      callHotline: 'Llamar Línea de Ayuda',
      step: 'Paso',
    },

    // ============================================
    // ABOUT
    // ============================================
    about: {
      title: 'Cómo Funciona ICEwhistle',
      subtitle: 'Transparencia y Privacidad',
      tagline: 'Sin cuentas. Sin rastreo. Ubicación redondeada para privacidad.',
      taglineDesc: 'ICEwhistle está diseñado para proteger tu privacidad mientras ayuda a las comunidades a mantenerse informadas. Recopilamos el mínimo de datos necesarios y nunca te rastreamos.',

      locationPrivacy: 'Privacidad de Ubicación',
      step1Title: 'Redondeado a cuadrícula de ~500m',
      step1Desc: 'Tus coordenadas exactas nunca se almacenan. Redondeamos a una cuadrícula de 500m, que cubre aproximadamente 4-6 cuadras.',
      step2Title: 'Desplazamiento aleatorio añadido',
      step2Desc: 'Añadimos un desplazamiento aleatorio de ±100m para que incluso la posición de la cuadrícula sea impredecible.',
      step3Title: 'Resultado: Solo nivel de vecindario',
      step3Desc: 'Los reportes identifican un área general, no una dirección específica.',

      whatWeCollect: 'Qué Recopilamos',
      dataColumn: 'Datos',
      whenColumn: 'Cuándo',
      retentionColumn: 'Retención',
      approxLocation: 'Ubicación aproximada (~500m)',
      whenReport: 'Cuando envías un reporte',
      retention8hr: '8 horas (eliminado automáticamente)',
      alertType: 'Tipo de alerta',
      optional: 'Opcional',
      neverStored: 'Nunca almacenado',

      whatWeNeverCollect: 'Lo Que Nunca Recopilamos',
      neverIP: 'Direcciones IP',
      neverDevice: 'Identificadores de dispositivo',
      neverAccounts: 'Cuentas de usuario o inicio de sesión',
      neverTracking: 'Rastreo o analíticas',
      neverPrecise: 'Ubicación precisa',
      neverPersonal: 'Información personal',

      openSource: 'Código Abierto',
      openSourceDesc: 'ICEwhistle es de código abierto. Cualquiera puede revisar el código para verificar estas afirmaciones de privacidad.',
      viewCode: 'Ver Código en GitHub',
    },

    // ============================================
    // SUPPORT
    // ============================================
    support: {
      title: 'Apoya esta herramienta',
      intro: 'Esta herramienta es gratuita, sin anuncios y disponible para todos.',
      mission: 'Se mantiene como un recurso público para ayudar a las personas a entender sus derechos. No se requiere cuenta y no se rastrea ningún dato de uso.',
      howUsed: 'Cómo se usa el apoyo',
      helps: 'El apoyo comunitario ayuda a cubrir:',
      hosting: 'Alojamiento web e infraestructura',
      translation: 'Accesibilidad y traducción multilingüe',
      maintenance: 'Mantenimiento y actualizaciones continuas',
      legal: 'Revisión legal y de contenido ocasional',
      transparency: 'Los colaboradores pueden recibir modestos estipendios por trabajo de mantenimiento o traducción.',
      privacyTrust: 'Privacidad y confianza',
      donationsOptional: 'Las donaciones son opcionales',
      donationsSecure: 'Las donaciones se procesan de forma segura por OpenCollective',
      noStoreDonorInfo: 'Este sitio no recopila ni almacena información de donantes',
      accessNeverGated: 'El acceso a los recursos nunca está condicionado al pago',
      closing: 'Apoyar es una forma de ayudar a mantener esta herramienta disponible — pero la información aquí siempre será gratuita.',
      processed: 'Las donaciones son procesadas por OpenCollective.',
      preferDirect: '¿Prefieres donar directamente en OpenCollective?',
      openInOC: 'Abrir en OpenCollective',
      infrastructure: 'Tu donación apoya infraestructura, no recolección de datos.',
    },

    // ============================================
    // RECORDING
    // ============================================
    recording: {
      chooseType: 'Elige Tipo de Grabación',
      chooseTypeDesc: 'Selecciona cómo quieres documentar este encuentro',
      videoRecording: 'Grabación de Video',
      videoDesc: 'Grabar video con audio',
      audioOnly: 'Solo Audio',
      audioDesc: 'Grabar audio discretamente',
      chooseCamera: 'Elige Cámara',
      chooseCameraDesc: 'Selecciona qué cámara usar',
      frontCamera: 'Cámara Frontal',
      frontCameraDesc: 'Grábate a ti mismo',
      backCamera: 'Cámara Trasera',
      backCameraDesc: 'Graba tu entorno',
      startRecording: 'Iniciar Grabación',
      stopRecording: 'Detener Grabación',
      pauseRecording: 'Pausar',
      resumeRecording: 'Reanudar',
      recording: 'Grabando',
      paused: 'Pausado',
      saveRecording: 'Guardar Grabación',
      discardRecording: 'Descartar',
      recordingSaved: 'Grabación Guardada',
      recordingSavedDesc: 'Tu grabación ha sido guardada en tu dispositivo.',
      recordingDiscarded: 'Grabación Descartada',
      permissionDenied: 'Permiso de cámara denegado',
      legalTip: 'Tienes derecho a grabar encuentros con la policía en público',
    },

    // ============================================
    // HOTLINES
    // ============================================
    hotlines: {
      iceDetaineeLocator: 'Localizador de Detenidos',
      iceDetaineeDesc: 'Encontrar a alguien bajo custodia de ICE',
      unitedWeDream: 'United We Dream',
      unitedWeDreamDesc: 'Reportar actividad de inmigración',
      traffickingHotline: 'Línea de Tráfico',
      traffickingDesc: 'Ayuda para víctimas de tráfico',
      crisisLine: 'Línea de Crisis',
      crisisDesc: 'Apoyo de salud mental',
      callFree247: 'Línea gratuita 24/7',
    },
  },

  pt: {
    // ============================================
    // COMMON
    // ============================================
    common: {
      loading: 'Carregando...',
      search: 'Buscar',
      learnMore: 'Saiba mais',
      back: 'Voltar',
      close: 'Fechar',
      save: 'Salvar',
      cancel: 'Cancelar',
      submit: 'Enviar',
      confirm: 'Confirmar',
      delete: 'Excluir',
      edit: 'Editar',
      seeAll: 'Ver todos',
      viewAll: 'Ver todos',
      available247: '24/7',
      anonymous: 'Anônimo',
      verified: 'Verificado',
      active: 'ativos',
      share: 'Compartilhar',
      download: 'Baixar',
    },

    // ============================================
    // NAV
    // ============================================
    nav: {
      home: 'Início',
      hotlines: 'Linhas de Ajuda',
      alerts: 'Alertas',
      report: 'Reportar',
      rights: 'Direitos',
      faq: 'Perguntas',
      emergency: 'Emergência',
      about: 'Sobre',
      support: 'Apoiar',
      install: 'Instalar App',
      iosTitle: 'Instalar no iPhone/iPad',
      iosStep1: '1. Toque no botão Compartilhar',
      iosStep2: '2. Role para baixo e toque em "Adicionar à Tela de Início"',
      iosStep3: '3. Toque em "Adicionar" para instalar',
      gotIt: 'Entendi',
    },

    // ============================================
    // HOME
    // ============================================
    home: {
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

      askQuestion: 'Faça uma pergunta...',
      locationPlaceholder: 'Cidade ou CEP (opcional)',

      emergencyHotlines: 'Linhas de Emergência',
      bondFunds: 'Fundos de Fiança',
      bondFundsSub: 'Ajuda a pagar fiança',

      youCanSay: 'Você pode dizer:',
      never: 'Nunca:',
      rightSilent: '"Estou exercendo meu direito de permanecer em silêncio."',
      rightLawyer: '"Quero falar com um advogado."',
      rightNoEntry: '"Não autorizo sua entrada."',
      neverOpenDoor: 'Abrir a porta sem mandado judicial',
      neverSign: 'Assinar documentos',
      neverLie: 'Mentir ou mostrar documentos falsos',

      noTracking: 'Sem contas. Sem rastreamento. Localização arredondada para privacidade.',
      precision500m: '~500m de precisão',
      autoExpire8hr: 'Expira em 8hrs',

      howItWorks: 'Como o ICEwhistle Funciona',
      step1Title: 'Aprenda',
      step1Desc: 'Conheça seus direitos antes de precisar deles',
      step2Title: 'Prepare',
      step2Desc: 'Crie um plano de emergência para sua família',
      step3Title: 'Conecte',
      step3Desc: 'Um toque para ligar para linhas de ajuda e contatos de confiança',
      privacyFirst: 'Privacidade Primeiro',
      privacyDesc: 'Sem contas. Sem rastreamento. Todos os dados ficam no seu dispositivo.',

      emergencyPlan: 'Meu Plano de Emergência',
      emergencyPlanSub: 'Contatos e botão de pânico',

      recordingFeature: 'Gravação Integrada',
      recordingFeatureDesc: 'Documente encontros com vídeo ou áudio. Cada gravação inclui uma assinatura criptográfica provando que foi capturada em tempo real.',
      recordingFeature1: 'Câmera frontal ou traseira',
      recordingFeature2: 'Prova de autenticidade criptográfica',
      recordingFeature3: 'Documentação admissível',

      badgeEmergency: 'EMERGÊNCIA',
      badgeReport: 'REPORTAR',
      badgeResources: 'RECURSOS',
      badgeRights: 'SEUS DIREITOS',
      badgeHotlines: 'LIGAR AGORA',

      supportTool: 'Apoie esta ferramenta gratuita',
    },

    // ============================================
    // ALERTS
    // ============================================
    alerts: {
      liveAlerts: 'Alertas ao Vivo',
      reportActivity: 'Reportar Atividade',
      reportActivityAlt: 'Toque para reportar atividade do ICE',
      mapView: 'Ver Mapa',
      listView: 'Ver Lista',
      quickReport: 'Relatório Rápido',
      recentReports: 'Relatórios Recentes',
      noActiveAlerts: 'Sem Alertas Ativos',
      noAlertsDesc: 'Nenhuma atividade do ICE relatada nesta área recentemente.',
      loadingAlerts: 'Carregando alertas...',

      raids: 'Presença',
      checkpoints: 'Postos de Controle',
      vehicles: 'Veículos',
      raid: 'Presença',
      workplace: 'Trabalho',
      residence: 'Residência',
      checkpoint: 'Posto',
      vehicle: 'Veículo',
      transit: 'Trânsito',
      theyveLeft: 'Eles Foram Embora',
      allClear: 'Tudo Livre',

      justNow: 'agora mesmo',
      minsAgo: 'm atrás',
      hoursAgo: 'h atrás',

      reportTitle: 'Reportar Atividade do ICE',
      reportSubtitle: 'Ajude a manter sua comunidade segura',
      whatDidYouSee: 'O que você viu?',
      locationLabel: 'Localização',
      locationAuto: 'Usando sua localização aproximada',
      additionalDetails: 'Detalhes adicionais (opcional)',
      detailsPlaceholder: 'Número de oficiais, veículos, descrições...',
      disclaimer: 'Relatórios são anônimos e a localização é arredondada para ~500m para privacidade.',
      submitting: 'Enviando...',
      submitReport: 'Enviar Relatório',
      reportSuccess: 'Relatório enviado',
      reportSuccessDesc: 'Obrigado por ajudar a manter sua comunidade informada.',
      reportError: 'Falha ao enviar relatório',
      reportErrorDesc: 'Por favor tente novamente.',
      locationRequired: 'Localização necessária',
      locationRequiredDesc: 'Por favor habilite os serviços de localização para enviar um relatório.',
      rateLimited: 'Por favor aguarde',
      rateLimitedDesc: 'Você pode enviar outro relatório em alguns minutos.',
    },

    // ============================================
    // RIGHTS
    // ============================================
    rights: {
      pageTitle: 'Conheça Seus Direitos',
      pageSubtitle: 'Entendendo seus direitos constitucionais durante encontros com agentes de imigração',
      disclaimerTitle: 'Aviso Importante',
      disclaimerText: 'Esta informação é apenas para fins educacionais e não constitui aconselhamento jurídico. Cada situação é diferente. Para conselhos sobre sua situação específica, consulte um advogado de imigração qualificado.',

      coreRightsTitle: 'Seus Direitos Fundamentais',
      rightSilentTitle: 'Direito de Permanecer em Silêncio',
      rightSilentDesc: 'Você não precisa responder perguntas sobre onde nasceu, seu status imigratório ou como entrou nos Estados Unidos.',
      rightSilentPhrase: 'Diga: "Estou exercendo meu direito de permanecer em silêncio."',
      rightAttorneyTitle: 'Direito a um Advogado',
      rightAttorneyDesc: 'Você tem o direito de falar com um advogado antes de responder qualquer pergunta. Se detido, você pode fazer ligações.',
      rightAttorneyPhrase: 'Diga: "Quero falar com um advogado."',
      rightNoSignTitle: 'Não Assine Documentos',
      rightNoSignDesc: 'Não assine nada sem falar com um advogado. Assinar "saída voluntária" pode renunciar ao seu direito a uma audiência.',
      rightNoSignPhrase: 'Diga: "Não quero assinar nada até falar com meu advogado."',
      rightNoLieTitle: 'Não Minta',
      rightNoLieDesc: 'Nunca forneça informações falsas ou documentos falsos. Isso pode resultar em acusações criminais.',
      rightNoLiePhrase: 'Fique em silêncio em vez de inventar respostas.',

      warrantTitle: 'Mandado Judicial vs. Mandado Administrativo',
      warrantSubtitle: 'Entender a diferença pode proteger seus direitos. Apenas um mandado JUDICIAL permite entrada em sua casa.',
      judicialWarrant: 'Mandado Judicial',
      judicialValid: 'VÁLIDO - Permite Entrada',
      adminWarrant: 'Mandado Administrativo (I-200, I-205)',
      adminInvalid: 'NÃO VÁLIDO para Entrada em Casa',

      rightsByLocation: 'Direitos por Local',
      atHome: 'Em Casa',
      atHomeDesc: 'Se o ICE vier à sua porta',
      inPublic: 'Em Público',
      inPublicDesc: 'Seus direitos em espaços públicos',
      whileDriving: 'Dirigindo',
      whileDrivingDesc: 'Paradas de trânsito e pontos de controle',
      atWork: 'No Trabalho',
      atWorkDesc: 'Encontros no local de trabalho',

      detainedTitle: 'Se Você ou um Ente Querido For Detido',
      detainedSubtitle: 'Passos críticos a tomar imediatamente',
      emergencyContacts: 'Contatos de Emergência:',

      consularTitle: 'Seu Direito de Contatar Seu Consulado',
      consularText: 'Sob a Convenção de Viena, se você for detido, tem o direito de contatar o consulado do seu país.',
      consularPhrase: 'Diga: "Quero contatar meu consulado."',

      searchButton: 'Buscar Respostas',
      cardsButton: 'Obter Cartões Imprimíveis',
    },

    // ============================================
    // FAQ
    // ============================================
    faq: {
      title: 'Perguntas Frequentes',
      subtitle: 'Obtenha respostas sobre seus direitos',
      greeting: 'Olá! Posso ajudá-lo a encontrar informações sobre seus direitos. Tente fazer uma pergunta ou toque em uma sugestão abaixo.',
      placeholder: 'Faça uma pergunta...',
      noResults: 'Não encontrei informações específicas sobre isso. Tente a linha de ajuda:',
      suggestedTitle: 'Perguntas comuns:',
      resultsFound: 'resultados encontrados',
      callNow: 'Ligar Agora',
      suggestions: [
        'E se o ICE vier à minha porta?',
        'Como encontro um familiar detido?',
        'Quais são meus direitos em uma parada de trânsito?',
        'Como encontro um advogado de imigração gratuito?',
        'O que devo fazer se for preso?',
        'Como protejo meus filhos?',
      ],
    },

    // ============================================
    // EMERGENCY
    // ============================================
    emergency: {
      title: 'Guia de Emergência',
      subtitle: 'Orientação passo a passo para situações urgentes',
      iceAtDoor: 'ICE na Sua Porta',
      trafficStop: 'Parada de Trânsito',
      workplaceRaid: 'Batida no Trabalho',
      someoneTaken: 'Alguém Foi Levado',
      callHotline: 'Ligar para Linha de Ajuda',
      step: 'Passo',
    },

    // ============================================
    // ABOUT
    // ============================================
    about: {
      title: 'Como o ICEwhistle Funciona',
      subtitle: 'Transparência e Privacidade',
      tagline: 'Sem contas. Sem rastreamento. Localização arredondada para privacidade.',
      taglineDesc: 'ICEwhistle é projetado para proteger sua privacidade enquanto ajuda comunidades a ficarem informadas.',

      locationPrivacy: 'Privacidade de Localização',
      step1Title: 'Arredondado para grade de ~500m',
      step1Desc: 'Suas coordenadas exatas nunca são armazenadas. Arredondamos para uma grade de 500m.',
      step2Title: 'Deslocamento aleatório adicionado',
      step2Desc: 'Adicionamos um deslocamento aleatório de ±100m.',
      step3Title: 'Resultado: Apenas nível de vizinhança',
      step3Desc: 'Relatórios identificam uma área geral, não um endereço específico.',

      whatWeCollect: 'O Que Coletamos',
      dataColumn: 'Dados',
      whenColumn: 'Quando',
      retentionColumn: 'Retenção',
      approxLocation: 'Localização aproximada (~500m)',
      whenReport: 'Quando você envia um relatório',
      retention8hr: '8 horas (excluído automaticamente)',
      alertType: 'Tipo de alerta',
      optional: 'Opcional',
      neverStored: 'Nunca armazenado',

      whatWeNeverCollect: 'O Que Nunca Coletamos',
      neverIP: 'Endereços IP',
      neverDevice: 'Identificadores de dispositivo',
      neverAccounts: 'Contas de usuário ou login',
      neverTracking: 'Rastreamento ou análises',
      neverPrecise: 'Localização precisa',
      neverPersonal: 'Informações pessoais',

      openSource: 'Código Aberto',
      openSourceDesc: 'ICEwhistle é código aberto. Qualquer pessoa pode revisar o código.',
      viewCode: 'Ver Código no GitHub',
    },

    // ============================================
    // SUPPORT
    // ============================================
    support: {
      title: 'Apoie esta ferramenta',
      intro: 'Esta ferramenta é gratuita, sem anúncios e disponível para todos.',
      mission: 'É mantida como um recurso público para ajudar as pessoas a entender seus direitos.',
      howUsed: 'Como o apoio é usado',
      helps: 'O apoio da comunidade ajuda a cobrir:',
      hosting: 'Hospedagem e infraestrutura do site',
      translation: 'Acessibilidade e tradução multilíngue',
      maintenance: 'Manutenção e atualizações contínuas',
      legal: 'Revisão legal e de conteúdo ocasional',
      transparency: 'Colaboradores podem receber modestos estipêndios por trabalho de manutenção ou tradução.',
      privacyTrust: 'Privacidade e confiança',
      donationsOptional: 'Doações são opcionais',
      donationsSecure: 'Doações são processadas de forma segura pelo OpenCollective',
      noStoreDonorInfo: 'Este site não coleta nem armazena informações de doadores',
      accessNeverGated: 'O acesso aos recursos nunca é condicionado ao pagamento',
      closing: 'Apoiar é uma forma de ajudar a manter esta ferramenta disponível — mas as informações aqui sempre serão gratuitas.',
      processed: 'Doações são processadas pelo OpenCollective.',
      preferDirect: 'Prefere doar diretamente no OpenCollective?',
      openInOC: 'Abrir no OpenCollective',
      infrastructure: 'Sua doação apoia infraestrutura, não coleta de dados.',
    },

    // ============================================
    // RECORDING
    // ============================================
    recording: {
      chooseType: 'Escolha o Tipo de Gravação',
      chooseTypeDesc: 'Selecione como você quer documentar este encontro',
      videoRecording: 'Gravação de Vídeo',
      videoDesc: 'Gravar vídeo com áudio',
      audioOnly: 'Apenas Áudio',
      audioDesc: 'Gravar áudio discretamente',
      chooseCamera: 'Escolha a Câmera',
      chooseCameraDesc: 'Selecione qual câmera usar',
      frontCamera: 'Câmera Frontal',
      frontCameraDesc: 'Grave você mesmo',
      backCamera: 'Câmera Traseira',
      backCameraDesc: 'Grave seu ambiente',
      startRecording: 'Iniciar Gravação',
      stopRecording: 'Parar Gravação',
      pauseRecording: 'Pausar',
      resumeRecording: 'Retomar',
      recording: 'Gravando',
      paused: 'Pausado',
      saveRecording: 'Salvar Gravação',
      discardRecording: 'Descartar',
      recordingSaved: 'Gravação Salva',
      recordingSavedDesc: 'Sua gravação foi salva no seu dispositivo.',
      recordingDiscarded: 'Gravação Descartada',
      permissionDenied: 'Permissão de câmera negada',
      legalTip: 'Você tem o direito de gravar encontros com a polícia em público',
    },

    // ============================================
    // HOTLINES
    // ============================================
    hotlines: {
      iceDetaineeLocator: 'Localizador de Detidos',
      iceDetaineeDesc: 'Encontrar alguém sob custódia do ICE',
      unitedWeDream: 'United We Dream',
      unitedWeDreamDesc: 'Reportar atividade de imigração',
      traffickingHotline: 'Linha de Tráfico',
      traffickingDesc: 'Ajuda para vítimas de tráfico',
      crisisLine: 'Linha de Crise',
      crisisDesc: 'Apoio de saúde mental',
      callFree247: 'Linha gratuita 24/7',
    },
  },
}

// Type helper for getting translation type
export type Translations = typeof translations.en

/**
 * Get translations for a language with fallback to English
 * Use this instead of translations[language] to handle all language codes
 */
export function getT(language: string): Translations {
  if (language in translations) {
    return translations[language as TranslatedLanguage]
  }
  return translations.en
}
