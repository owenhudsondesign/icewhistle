'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/hooks/use-language'
import { AppHeader } from '@/components/shared/AppHeader'
import {
  ChevronLeft,
  Shield,
  MapPin,
  Eye,
  EyeOff,
  Video,
  Bell,
  Map,
  Lock
} from 'lucide-react'

const aboutTranslations = {
  en: {
    backToHome: 'Back to Home',
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
    pushToken: 'Push notification token',
    whenNotifications: 'If you enable notifications',
    untilOptOut: 'Until you opt out',
    zipCode: 'ZIP code preference',
    whenSetArea: 'If you set alert area',
    untilChange: 'Until you change it',
    langPref: 'Language preference',
    whenSelectLang: 'When you select language',
    deviceOnly: 'Stored on device only',

    whatWeDontCollect: "What We Don't Collect",
    noName: 'Your name, email, or phone number',
    noGPS: 'Precise GPS coordinates',
    noDeviceID: 'Device identifiers or advertising IDs',
    noBrowsing: 'Browsing history or app usage patterns',
    noAnalytics: 'Analytics data (no Google Analytics, Mixpanel, etc.)',
    noCrash: 'Crash reports (no Sentry, Crashlytics, etc.)',

    recordings: 'Recordings',
    recordingsTitle: 'Recordings never leave your device',
    recordingsDesc: "When you record video or audio, it saves directly to your device's storage. We never upload, access, or store your recordings. They are 100% yours.",

    alertReports: 'Alert Reports',
    anonymous: 'Anonymous:',
    anonymousDesc: 'No account required. No identifying information attached.',
    autoExpire: 'Auto-expire:',
    autoExpireDesc: 'Reports automatically delete after 8 hours.',
    communityVerified: 'Community verified:',
    communityVerifiedDesc: 'Other users can confirm reports to increase visibility.',
    sharedPublicly: 'Shared publicly:',
    sharedPubliclyDesc: 'Reports appear on the community map for others to see.',

    thirdParty: 'Third-Party Services',
    mapsTitle: 'OpenFreeMap (Maps)',
    mapsDesc: 'We use OpenFreeMap with MapLibre to display maps. OpenFreeMap is privacy-focused: no tracking, no API keys, no data collection. Map tiles are served anonymously.',
    mapsPolicy: 'OpenFreeMap Info →',
    supabaseTitle: 'Supabase (Database)',
    supabaseDesc: 'Alert data and notification preferences are stored on Supabase servers. All data is encrypted in transit and at rest.',

    security: 'Security',
    encrypted: 'All connections encrypted (HTTPS/TLS)',
    autoDelete: 'Data automatically deleted after 8 hours',
    noSale: 'No data sold to third parties',
    openSource: 'Open source (code available for audit)',

    fullPrivacy: 'Full Privacy Policy →',
    terms: 'Terms of Service →',
    disclaimer: 'ICEwhistle is a community project providing general information for educational purposes. It is not affiliated with any government agency and does not provide legal advice. For advice about your specific situation, please consult a qualified immigration attorney.',
  },
  es: {
    backToHome: 'Volver al Inicio',
    title: 'Cómo Funciona ICEwhistle',
    subtitle: 'Transparencia y Privacidad',
    tagline: 'Sin cuentas. Sin rastreo. Ubicación redondeada para privacidad.',
    taglineDesc: 'ICEwhistle está diseñado para proteger tu privacidad mientras ayuda a las comunidades a mantenerse informadas. Recopilamos los datos mínimos necesarios y nunca te rastreamos.',

    locationPrivacy: 'Privacidad de Ubicación',
    step1Title: 'Redondeado a cuadrícula de ~500 metros',
    step1Desc: 'Tus coordenadas exactas nunca se almacenan. Redondeamos a una cuadrícula de 500m, que cubre aproximadamente 4-6 cuadras.',
    step2Title: 'Se añade desplazamiento aleatorio',
    step2Desc: 'Añadimos un desplazamiento aleatorio de ±100m para que incluso la posición en la cuadrícula sea impredecible. Esto hace imposible determinar tu ubicación exacta.',
    step3Title: 'Resultado: Solo nivel de vecindario',
    step3Desc: 'Los reportes identifican un área general, no una dirección específica. No puedes ser identificado por la ubicación de tu reporte.',

    whatWeCollect: 'Qué Recopilamos',
    dataColumn: 'Datos',
    whenColumn: 'Cuándo',
    retentionColumn: 'Retención',
    approxLocation: 'Ubicación aproximada (~500m)',
    whenReport: 'Cuando envías un reporte',
    retention8hr: '8 horas (auto-eliminado)',
    pushToken: 'Token de notificaciones push',
    whenNotifications: 'Si activas notificaciones',
    untilOptOut: 'Hasta que desactives',
    zipCode: 'Preferencia de código postal',
    whenSetArea: 'Si configuras área de alertas',
    untilChange: 'Hasta que lo cambies',
    langPref: 'Preferencia de idioma',
    whenSelectLang: 'Cuando seleccionas idioma',
    deviceOnly: 'Solo en tu dispositivo',

    whatWeDontCollect: 'Qué NO Recopilamos',
    noName: 'Tu nombre, correo o número de teléfono',
    noGPS: 'Coordenadas GPS precisas',
    noDeviceID: 'Identificadores de dispositivo o publicidad',
    noBrowsing: 'Historial de navegación o patrones de uso',
    noAnalytics: 'Datos de análisis (no Google Analytics, Mixpanel, etc.)',
    noCrash: 'Reportes de errores (no Sentry, Crashlytics, etc.)',

    recordings: 'Grabaciones',
    recordingsTitle: 'Las grabaciones nunca salen de tu dispositivo',
    recordingsDesc: 'Cuando grabas video o audio, se guarda directamente en el almacenamiento de tu dispositivo. Nunca subimos, accedemos ni almacenamos tus grabaciones. Son 100% tuyas.',

    alertReports: 'Reportes de Alertas',
    anonymous: 'Anónimo:',
    anonymousDesc: 'No se requiere cuenta. Sin información identificable adjunta.',
    autoExpire: 'Auto-expiración:',
    autoExpireDesc: 'Los reportes se eliminan automáticamente después de 8 horas.',
    communityVerified: 'Verificado por la comunidad:',
    communityVerifiedDesc: 'Otros usuarios pueden confirmar reportes para aumentar visibilidad.',
    sharedPublicly: 'Compartido públicamente:',
    sharedPubliclyDesc: 'Los reportes aparecen en el mapa comunitario para que otros los vean.',

    thirdParty: 'Servicios de Terceros',
    mapsTitle: 'OpenFreeMap (Mapas)',
    mapsDesc: 'Usamos OpenFreeMap con MapLibre para mostrar mapas. OpenFreeMap está enfocado en la privacidad: sin rastreo, sin claves API, sin recolección de datos. Los tiles del mapa se sirven de forma anónima.',
    mapsPolicy: 'Información de OpenFreeMap →',
    supabaseTitle: 'Supabase (Base de datos)',
    supabaseDesc: 'Los datos de alertas y preferencias de notificaciones se almacenan en servidores de Supabase. Todos los datos están encriptados en tránsito y en reposo.',

    security: 'Seguridad',
    encrypted: 'Todas las conexiones encriptadas (HTTPS/TLS)',
    autoDelete: 'Datos eliminados automáticamente después de 8 horas',
    noSale: 'No se venden datos a terceros',
    openSource: 'Código abierto (disponible para auditoría)',

    fullPrivacy: 'Política de Privacidad Completa →',
    terms: 'Términos de Servicio →',
    disclaimer: 'ICEwhistle es un proyecto comunitario que proporciona información general con fines educativos. No está afiliado con ninguna agencia gubernamental y no proporciona asesoramiento legal. Para consejos sobre tu situación específica, consulta con un abogado de inmigración calificado.',
  },
  pt: {
    backToHome: 'Voltar ao Início',
    title: 'Como o ICEwhistle Funciona',
    subtitle: 'Transparência e Privacidade',
    tagline: 'Sem contas. Sem rastreamento. Localização arredondada para privacidade.',
    taglineDesc: 'O ICEwhistle foi projetado para proteger sua privacidade enquanto ajuda as comunidades a se manterem informadas. Coletamos o mínimo de dados necessários e nunca rastreamos você.',

    locationPrivacy: 'Privacidade de Localização',
    step1Title: 'Arredondado para grade de ~500 metros',
    step1Desc: 'Suas coordenadas exatas nunca são armazenadas. Arredondamos para uma grade de 500m, que cobre aproximadamente 4-6 quarteirões.',
    step2Title: 'Deslocamento aleatório adicionado',
    step2Desc: 'Adicionamos um deslocamento aleatório de ±100m para que mesmo a posição na grade seja imprevisível. Isso torna impossível determinar sua localização exata.',
    step3Title: 'Resultado: Apenas nível de bairro',
    step3Desc: 'Os relatórios identificam uma área geral, não um endereço específico. Você não pode ser identificado pela localização do seu relatório.',

    whatWeCollect: 'O Que Coletamos',
    dataColumn: 'Dados',
    whenColumn: 'Quando',
    retentionColumn: 'Retenção',
    approxLocation: 'Localização aproximada (~500m)',
    whenReport: 'Quando você envia um relatório',
    retention8hr: '8 horas (auto-deletado)',
    pushToken: 'Token de notificação push',
    whenNotifications: 'Se você ativar notificações',
    untilOptOut: 'Até você desativar',
    zipCode: 'Preferência de CEP',
    whenSetArea: 'Se você definir área de alertas',
    untilChange: 'Até você alterar',
    langPref: 'Preferência de idioma',
    whenSelectLang: 'Quando você seleciona idioma',
    deviceOnly: 'Armazenado apenas no dispositivo',

    whatWeDontCollect: 'O Que NÃO Coletamos',
    noName: 'Seu nome, email ou número de telefone',
    noGPS: 'Coordenadas GPS precisas',
    noDeviceID: 'Identificadores de dispositivo ou publicidade',
    noBrowsing: 'Histórico de navegação ou padrões de uso',
    noAnalytics: 'Dados de análise (sem Google Analytics, Mixpanel, etc.)',
    noCrash: 'Relatórios de falhas (sem Sentry, Crashlytics, etc.)',

    recordings: 'Gravações',
    recordingsTitle: 'Gravações nunca saem do seu dispositivo',
    recordingsDesc: 'Quando você grava vídeo ou áudio, salva diretamente no armazenamento do seu dispositivo. Nunca fazemos upload, acessamos ou armazenamos suas gravações. Elas são 100% suas.',

    alertReports: 'Relatórios de Alertas',
    anonymous: 'Anônimo:',
    anonymousDesc: 'Não é necessária conta. Sem informações identificáveis anexadas.',
    autoExpire: 'Auto-expiração:',
    autoExpireDesc: 'Os relatórios são deletados automaticamente após 8 horas.',
    communityVerified: 'Verificado pela comunidade:',
    communityVerifiedDesc: 'Outros usuários podem confirmar relatórios para aumentar a visibilidade.',
    sharedPublicly: 'Compartilhado publicamente:',
    sharedPubliclyDesc: 'Os relatórios aparecem no mapa comunitário para outros verem.',

    thirdParty: 'Serviços de Terceiros',
    mapsTitle: 'OpenFreeMap (Mapas)',
    mapsDesc: 'Usamos OpenFreeMap com MapLibre para exibir mapas. OpenFreeMap é focado em privacidade: sem rastreamento, sem chaves de API, sem coleta de dados. Os tiles do mapa são servidos anonimamente.',
    mapsPolicy: 'Informações do OpenFreeMap →',
    supabaseTitle: 'Supabase (Banco de dados)',
    supabaseDesc: 'Dados de alertas e preferências de notificação são armazenados em servidores Supabase. Todos os dados são criptografados em trânsito e em repouso.',

    security: 'Segurança',
    encrypted: 'Todas as conexões criptografadas (HTTPS/TLS)',
    autoDelete: 'Dados deletados automaticamente após 8 horas',
    noSale: 'Nenhum dado vendido a terceiros',
    openSource: 'Código aberto (disponível para auditoria)',

    fullPrivacy: 'Política de Privacidade Completa →',
    terms: 'Termos de Serviço →',
    disclaimer: 'O ICEwhistle é um projeto comunitário que fornece informações gerais para fins educacionais. Não é afiliado a nenhuma agência governamental e não fornece aconselhamento jurídico. Para conselhos sobre sua situação específica, consulte um advogado de imigração qualificado.',
  },
}

export default function AboutPage() {
  const { language } = useLanguage()
  const t = aboutTranslations[language as keyof typeof aboutTranslations] || aboutTranslations.en

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* TL;DR */}
          <section>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="font-bold text-primary text-lg mb-2">{t.tagline}</p>
              <p className="text-sm text-muted-foreground">{t.taglineDesc}</p>
            </div>
          </section>

          {/* Location Privacy */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{t.locationPrivacy}</h2>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">{t.step1Title}</p>
                  <p className="text-sm text-muted-foreground">{t.step1Desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">{t.step2Title}</p>
                  <p className="text-sm text-muted-foreground">{t.step2Desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">{t.step3Title}</p>
                  <p className="text-sm text-muted-foreground">{t.step3Desc}</p>
                </div>
              </div>
            </div>
          </section>

          {/* What We Collect */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{t.whatWeCollect}</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-medium">{t.dataColumn}</th>
                    <th className="text-left py-2 pr-4 font-medium">{t.whenColumn}</th>
                    <th className="text-left py-2 font-medium">{t.retentionColumn}</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">{t.approxLocation}</td>
                    <td className="py-3 pr-4">{t.whenReport}</td>
                    <td className="py-3">{t.retention8hr}</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">{t.pushToken}</td>
                    <td className="py-3 pr-4">{t.whenNotifications}</td>
                    <td className="py-3">{t.untilOptOut}</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">{t.zipCode}</td>
                    <td className="py-3 pr-4">{t.whenSetArea}</td>
                    <td className="py-3">{t.untilChange}</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">{t.langPref}</td>
                    <td className="py-3 pr-4">{t.whenSelectLang}</td>
                    <td className="py-3">{t.deviceOnly}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* What We DON'T Collect */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <EyeOff className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{t.whatWeDontCollect}</h2>
            </div>

            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <span>{t.noName}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <span>{t.noGPS}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <span>{t.noDeviceID}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <span>{t.noBrowsing}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <span>{t.noAnalytics}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <span>{t.noCrash}</span>
              </li>
            </ul>
          </section>

          {/* Recordings */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{t.recordings}</h2>
            </div>

            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="font-medium text-green-600 dark:text-green-400 mb-2">{t.recordingsTitle}</p>
              <p className="text-sm text-muted-foreground">{t.recordingsDesc}</p>
            </div>
          </section>

          {/* Alert Reports */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{t.alertReports}</h2>
            </div>

            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong className="text-foreground">{t.anonymous}</strong> {t.anonymousDesc}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong className="text-foreground">{t.autoExpire}</strong> {t.autoExpireDesc}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong className="text-foreground">{t.communityVerified}</strong> {t.communityVerifiedDesc}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong className="text-foreground">{t.sharedPublicly}</strong> {t.sharedPubliclyDesc}</span>
              </li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{t.thirdParty}</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="font-medium mb-1">{t.mapsTitle}</p>
                <p className="text-sm text-muted-foreground mb-2">{t.mapsDesc}</p>
                <a
                  href="https://openfreemap.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {t.mapsPolicy}
                </a>
              </div>

              <div className="p-4 rounded-lg bg-muted/30">
                <p className="font-medium mb-1">{t.supabaseTitle}</p>
                <p className="text-sm text-muted-foreground">{t.supabaseDesc}</p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{t.security}</h2>
            </div>

            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>{t.encrypted}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>{t.autoDelete}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>{t.noSale}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>{t.openSource}</span>
              </li>
            </ul>
          </section>

          {/* Links */}
          <section className="pt-6 border-t border-border">
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy" className="text-primary hover:underline text-sm">
                {t.fullPrivacy}
              </Link>
              <Link href="/terms" className="text-primary hover:underline text-sm">
                {t.terms}
              </Link>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground italic">{t.disclaimer}</p>
          </section>
        </div>
      </div>
    </div>
    </>
  )
}
