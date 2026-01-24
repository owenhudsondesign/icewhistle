'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageWrapper } from '@/components/shared/PageWrapper'
import { useLanguage } from '@/hooks/use-language'
import {
  FileText,
  Phone,
  ExternalLink,
  BookOpen,
  Scale,
  Heart,
  Users,
  Baby,
  AlertTriangle,
  Briefcase,
  Globe,
  Shield,
  Building,
  MapPin,
  Smartphone
} from 'lucide-react'

const printableResources = [
  {
    titleKey: 'redCard',
    descKey: 'redCardDesc',
    title: { en: 'Red Card / Tarjeta Roja (ILRC)', es: 'Tarjeta Roja (ILRC)', pt: 'Cartão Vermelho (ILRC)' },
    description: { en: 'Wallet card explaining your rights - available in 39 languages', es: 'Tarjeta de bolsillo explicando tus derechos - disponible en 39 idiomas', pt: 'Cartão de bolso explicando seus direitos - disponível em 39 idiomas' },
    url: 'https://www.ilrc.org/red-cards',
  },
  {
    title: { en: 'Know Your Rights (ACLU)', es: 'Conoce Tus Derechos (ACLU)', pt: 'Conheça Seus Direitos (ACLU)' },
    description: { en: 'Comprehensive rights information when encountering immigration agents', es: 'Información completa sobre derechos al encontrarse con agentes de inmigración', pt: 'Informações completas sobre direitos ao encontrar agentes de imigração' },
    url: 'https://www.aclu.org/know-your-rights/immigrants-rights',
  },
  {
    title: { en: 'Know Your Rights (NILC)', es: 'Conozca Sus Derechos (NILC)', pt: 'Conheça Seus Direitos (NILC)' },
    description: { en: 'Complete rights guide in multiple languages', es: 'Guía completa de derechos en español', pt: 'Guia completo de direitos em português' },
    url: 'https://www.nilc.org/get-involved/community-education-resources/know-your-rights/',
  },
  {
    title: { en: 'Family Preparedness Plan (ILRC)', es: 'Plan de Preparación Familiar (ILRC)', pt: 'Plano de Preparação Familiar (ILRC)' },
    description: { en: 'Worksheet to prepare your family for emergencies', es: 'Hoja de trabajo para preparar a tu familia para emergencias', pt: 'Planilha para preparar sua família para emergências' },
    url: 'https://www.ilrc.org/family-preparedness-plan',
  },
  {
    title: { en: 'ICE Warrant Guide (CLINIC)', es: 'Guía de Órdenes de ICE (CLINIC)', pt: 'Guia de Mandados do ICE (CLINIC)' },
    description: { en: 'How to identify judicial vs. administrative warrants', es: 'Cómo identificar órdenes judiciales vs. administrativas', pt: 'Como identificar mandados judiciais vs. administrativos' },
    url: 'https://www.cliniclegal.org/resources/enforcement-and-detention/ice-warrants',
  },
  {
    title: { en: 'Power of Attorney Info', es: 'Información sobre Poder Notarial', pt: 'Informações sobre Procuração' },
    description: { en: 'Guide to designating emergency childcare authority', es: 'Guía para designar autoridad de cuidado de niños en emergencias', pt: 'Guia para designar autoridade de cuidado infantil em emergências' },
    url: 'https://www.informedimmigrant.com/guides/power-of-attorney/',
  },
  {
    title: { en: 'ICE Raids Toolkit (IDP)', es: 'Kit de Herramientas para Redadas (IDP)', pt: 'Kit de Ferramentas para Batidas (IDP)' },
    description: { en: 'Step-by-step guidance during enforcement activities', es: 'Guía paso a paso durante actividades de aplicación', pt: 'Guia passo a passo durante atividades de fiscalização' },
    url: 'https://www.immigrantdefenseproject.org/raids-toolkit/',
  },
  {
    title: { en: 'DACA Renewal Guide', es: 'Guía de Renovación de DACA', pt: 'Guia de Renovação DACA' },
    description: { en: 'How to renew DACA and advance parole information', es: 'Cómo renovar DACA e información sobre permiso adelantado', pt: 'Como renovar o DACA e informações sobre liberdade antecipada' },
    url: 'https://www.informedimmigrant.com/guides/daca/',
  },
  {
    title: { en: '"We Have Rights" Videos', es: 'Videos "Tenemos Derechos"', pt: 'Vídeos "Temos Direitos"' },
    description: { en: 'Know your rights videos in 8 languages', es: 'Videos de conoce tus derechos en 8 idiomas', pt: 'Vídeos sobre seus direitos em 8 idiomas' },
    url: 'https://weareheretostay.org',
  },
]

const emergencyHotlines = [
  {
    name: { en: 'ICE Detainee Locator', es: 'Localizador de Detenidos de ICE', pt: 'Localizador de Detidos do ICE' },
    phone: '1-888-351-4024',
    description: { en: 'Find someone in ICE custody', es: 'Encontrar a alguien bajo custodia de ICE', pt: 'Encontrar alguém sob custódia do ICE' },
    available: '24/7',
    url: 'https://locator.ice.gov',
    priority: true,
  },
  {
    name: { en: 'United We Dream MigraWatch', es: 'United We Dream MigraWatch', pt: 'United We Dream MigraWatch' },
    phone: '1-844-363-1423',
    description: { en: 'Immigration enforcement hotline', es: 'Línea de emergencia de inmigración', pt: 'Linha de emergência de imigração' },
    available: '24/7',
    priority: true,
  },
  {
    name: { en: 'National Human Trafficking Hotline', es: 'Línea Nacional contra el Tráfico Humano', pt: 'Linha Nacional contra Tráfico Humano' },
    phone: '1-888-373-7888',
    description: { en: 'Help for trafficking victims (T-visa eligible)', es: 'Ayuda para víctimas de tráfico (elegibles para visa T)', pt: 'Ajuda para vítimas de tráfico (elegíveis para visto T)' },
    available: '24/7',
    priority: true,
  },
  {
    name: { en: 'National Domestic Violence Hotline', es: 'Línea Nacional de Violencia Doméstica', pt: 'Linha Nacional de Violência Doméstica' },
    phone: '1-800-799-7233',
    description: { en: 'Support for survivors (VAWA eligible) - 200+ languages', es: 'Apoyo para sobrevivientes (elegibles para VAWA) - 200+ idiomas', pt: 'Apoio para sobreviventes (elegíveis para VAWA) - 200+ idiomas' },
    available: '24/7',
    priority: true,
  },
  {
    name: { en: '988 Suicide & Crisis Lifeline', es: 'Línea 988 de Crisis y Suicidio', pt: 'Linha 988 de Crise e Suicídio' },
    phone: '988',
    description: { en: 'Mental health crisis support', es: 'Apoyo en crisis de salud mental', pt: 'Apoio em crise de saúde mental' },
    available: '24/7',
    priority: true,
  },
  {
    name: { en: 'Crisis Text Line', es: 'Línea de Texto de Crisis', pt: 'Linha de Texto de Crise' },
    phone: 'Text HOME to 741741',
    description: { en: 'Mental health support via text', es: 'Apoyo de salud mental por texto', pt: 'Apoio de saúde mental por texto' },
    available: '24/7',
    isText: true,
  },
  {
    name: { en: 'SAMHSA National Helpline', es: 'Línea Nacional de SAMHSA', pt: 'Linha Nacional SAMHSA' },
    phone: '1-800-662-4357',
    description: { en: 'Substance abuse and mental health', es: 'Abuso de sustancias y salud mental', pt: 'Abuso de substâncias e saúde mental' },
    available: '24/7',
  },
  {
    name: { en: 'RAICES', es: 'RAICES', pt: 'RAICES' },
    phone: '1-800-898-4424',
    description: { en: 'Legal services and bond assistance', es: 'Servicios legales y asistencia con fianzas', pt: 'Serviços legais e assistência com fiança' },
    available: { en: 'Mon-Fri 9am-5pm CT', es: 'Lun-Vie 9am-5pm CT', pt: 'Seg-Sex 9am-5pm CT' },
  },
  {
    name: { en: 'National Immigrant Justice Center', es: 'Centro Nacional de Justicia Inmigrante', pt: 'Centro Nacional de Justiça Imigrante' },
    phone: '312-660-1370',
    description: { en: 'Legal assistance and referrals', es: 'Asistencia legal y referencias', pt: 'Assistência legal e referências' },
    available: { en: 'Mon-Fri 9am-5pm CT', es: 'Lun-Vie 9am-5pm CT', pt: 'Seg-Sex 9am-5pm CT' },
  },
  {
    name: { en: 'Immigration Equality (LGBTQ+)', es: 'Immigration Equality (LGBTQ+)', pt: 'Immigration Equality (LGBTQ+)' },
    phone: '917-654-9696',
    description: { en: 'LGBTQ+ immigration legal services', es: 'Servicios legales de inmigración LGBTQ+', pt: 'Serviços legais de imigração LGBTQ+' },
    available: { en: 'Mon/Wed 9:30am-5:30pm, Tue 11am-5:30pm ET', es: 'Lun/Mié 9:30am-5:30pm, Mar 11am-5:30pm ET', pt: 'Seg/Qua 9:30am-5:30pm, Ter 11am-5:30pm ET' },
    url: 'https://immigrationequality.org',
    priority: true,
  },
  {
    name: { en: 'Freedom for Immigrants', es: 'Freedom for Immigrants', pt: 'Freedom for Immigrants' },
    phone: '9233#',
    description: { en: 'Call from detention (free)', es: 'Llamar desde detención (gratis)', pt: 'Ligar da detenção (grátis)' },
    available: '24/7',
    url: 'https://freedomforimmigrants.org',
    isDetention: true,
  },
]

const vulnerablePopulationResources = [
  {
    title: { en: 'Trafficking Victims', es: 'Víctimas de Tráfico', pt: 'Vítimas de Tráfico' },
    description: { en: 'T-visa protection for human trafficking survivors. You may not need to cooperate with law enforcement if under 18 or traumatized.', es: 'Protección de visa T para sobrevivientes de tráfico humano. No necesitas cooperar con la policía si eres menor de 18 o estás traumatizado.', pt: 'Proteção de visto T para sobreviventes de tráfico humano. Você pode não precisar cooperar com a polícia se for menor de 18 ou traumatizado.' },
    phone: '1-888-373-7888',
    icon: AlertTriangle,
  },
  {
    title: { en: 'Crime Victims (U-Visa)', es: 'Víctimas de Crímenes (Visa U)', pt: 'Vítimas de Crimes (Visto U)' },
    description: { en: 'Victims of domestic violence, assault, or other serious crimes who assist law enforcement may qualify for U-visa protection.', es: 'Víctimas de violencia doméstica, asalto u otros crímenes graves que ayuden a la policía pueden calificar para protección de visa U.', pt: 'Vítimas de violência doméstica, agressão ou outros crimes graves que ajudem a polícia podem se qualificar para proteção de visto U.' },
    icon: Shield,
  },
  {
    title: { en: 'VAWA Self-Petition', es: 'Auto-Petición VAWA', pt: 'Auto-Petição VAWA' },
    description: { en: 'Domestic violence survivors can self-petition for status without abuser knowing. Male survivors also eligible.', es: 'Sobrevivientes de violencia doméstica pueden auto-peticionar sin que el abusador sepa. Sobrevivientes masculinos también son elegibles.', pt: 'Sobreviventes de violência doméstica podem fazer auto-petição sem que o agressor saiba. Sobreviventes masculinos também são elegíveis.' },
    phone: '1-800-799-7233',
    icon: Heart,
  },
  {
    title: { en: 'Unaccompanied Minors', es: 'Menores No Acompañados', pt: 'Menores Desacompanhados' },
    description: { en: 'Special protections for children. Contact KIND for free legal services.', es: 'Protecciones especiales para niños. Contacta a KIND para servicios legales gratuitos.', pt: 'Proteções especiais para crianças. Contate KIND para serviços legais gratuitos.' },
    url: 'https://supportkind.org',
    icon: Baby,
  },
]

export default function ResourcesPage() {
  const { language, t } = useLanguage()
  const resources_t = t.resources || {}

  const getTranslated = (obj: Record<string, string>) => obj[language] || obj.en

  const organizationCategories = [
    {
      id: 'legal',
      title: resources_t.legalAidOrgs || 'Legal Aid Organizations',
      icon: Scale,
      description: resources_t.legalAidDesc || 'Free and low-cost legal help',
      organizations: [
        { name: 'Immigration Advocates Network', url: 'https://www.immigrationadvocates.org/nonprofit/legaldirectory/', description: { en: 'National directory of free legal services', es: 'Directorio nacional de servicios legales gratuitos', pt: 'Diretório nacional de serviços legais gratuitos' } },
        { name: 'National Immigrant Justice Center (NIJC)', url: 'https://immigrantjustice.org', description: { en: 'Direct legal services, nationwide', es: 'Servicios legales directos, a nivel nacional', pt: 'Serviços legais diretos, em todo o país' } },
        { name: 'Catholic Legal Immigration Network (CLINIC)', url: 'https://cliniclegal.org', description: { en: '400+ nonprofit programs', es: 'Más de 400 programas sin fines de lucro', pt: 'Mais de 400 programas sem fins lucrativos' } },
        { name: 'American Immigration Lawyers Association', url: 'https://aila.org', description: { en: 'Find a licensed attorney', es: 'Encuentra un abogado licenciado', pt: 'Encontre um advogado licenciado' } },
        { name: 'National Immigration Law Center', url: 'https://nilc.org', description: { en: 'Policy and legal expertise', es: 'Experiencia en políticas y leyes', pt: 'Experiência em políticas e leis' } },
        { name: 'Immigrant Legal Resource Center (ILRC)', url: 'https://ilrc.org', description: { en: 'Red Cards and training', es: 'Tarjetas Rojas y capacitación', pt: 'Cartões Vermelhos e treinamento' } },
        { name: 'Informed Immigrant', url: 'https://informedimmigrant.com', description: { en: 'Find Legal Help directory', es: 'Directorio de Ayuda Legal', pt: 'Diretório de Ajuda Legal' } },
        { name: 'RAICES Texas', url: 'https://raicestexas.org', description: { en: 'Texas legal services, 5 cities', es: 'Servicios legales en Texas, 5 ciudades', pt: 'Serviços legais no Texas, 5 cidades' } },
      ],
    },
    {
      id: 'rapid-response',
      title: resources_t.rapidResponse || 'Rapid Response & Enforcement Tracking',
      icon: AlertTriangle,
      description: resources_t.rapidResponseDesc || 'Real-time community support and tracking',
      organizations: [
        { name: 'Immigrant Defense Project', url: 'https://immigrantdefenseproject.org', description: { en: 'Rapid response network, ICEWatch map', es: 'Red de respuesta rápida, mapa ICEWatch', pt: 'Rede de resposta rápida, mapa ICEWatch' } },
        { name: 'United We Dream MigraWatch', url: 'https://unitedwedream.org', description: { en: 'Report enforcement: 1-844-363-1423', es: 'Reportar operativos: 1-844-363-1423', pt: 'Reportar operações: 1-844-363-1423' } },
        { name: 'Freedom for Immigrants', url: 'https://freedomforimmigrants.org', description: { en: 'Detention map, 200+ facilities tracked', es: 'Mapa de detención, 200+ instalaciones rastreadas', pt: 'Mapa de detenção, 200+ instalações rastreadas' } },
      ],
    },
    {
      title: resources_t.childrenYouth || 'Children & Youth',
      icon: Baby,
      description: resources_t.childrenYouthDesc || 'Support for minors and young people',
      organizations: [
        { name: 'Kids in Need of Defense (KIND)', url: 'https://supportkind.org', description: { en: 'Free legal help for unaccompanied minors', es: 'Ayuda legal gratuita para menores no acompañados', pt: 'Ajuda legal gratuita para menores desacompanhados' } },
        { name: 'Young Center for Immigrant Children\'s Rights', url: 'https://theyoungcenter.org', description: { en: 'Child advocates', es: 'Defensores de niños', pt: 'Defensores de crianças' } },
        { name: 'United We Dream', url: 'https://unitedwedream.org', description: { en: 'Immigrant youth-led organization', es: 'Organización liderada por jóvenes inmigrantes', pt: 'Organização liderada por jovens imigrantes' } },
      ],
    },
    {
      title: resources_t.lgbtqSupport || 'LGBTQ+ Support',
      icon: Heart,
      description: resources_t.lgbtqSupportDesc || 'Resources for LGBTQ+ immigrants',
      organizations: [
        { name: 'Immigration Equality', url: 'https://immigrationequality.org', description: { en: 'LGBTQ+ immigration legal services', es: 'Servicios legales de inmigración LGBTQ+', pt: 'Serviços legais de imigração LGBTQ+' } },
        { name: 'Transgender Law Center', url: 'https://transgenderlawcenter.org', description: { en: 'Transgender immigrant advocacy', es: 'Defensa de inmigrantes transgénero', pt: 'Defesa de imigrantes transgênero' } },
        { name: 'LGBTQ Freedom Fund', url: 'https://lgbtqfund.org', description: { en: 'Bond assistance for LGBTQ+ individuals', es: 'Asistencia con fianzas para personas LGBTQ+', pt: 'Assistência com fiança para pessoas LGBTQ+' } },
      ],
    },
    {
      id: 'bond',
      title: resources_t.bondFunds || 'Bond Funds',
      icon: Building,
      description: resources_t.bondFundsDesc || 'Help paying immigration bonds (avg. $8,176)',
      organizations: [
        { name: 'National Bail Fund Network', url: 'https://communitybailout.org', description: { en: 'Find local bond funds', es: 'Encuentra fondos de fianza locales', pt: 'Encontre fundos de fiança locais' } },
        { name: 'Black Immigrants Bail Fund', url: 'https://blackimmigrantsbailfund.org', description: { en: 'Support for Black immigrants', es: 'Apoyo para inmigrantes negros', pt: 'Apoio para imigrantes negros' } },
        { name: 'Freedom for Immigrants', url: 'https://freedomforimmigrants.org', description: { en: 'Bond assistance and detention visitation', es: 'Asistencia con fianzas y visitas en detención', pt: 'Assistência com fiança e visitas em detenção' } },
      ],
    },
    {
      title: resources_t.communityOrgs || 'Community Organizations',
      icon: Users,
      organizations: [
        { name: 'National Immigration Project', url: 'https://nipnlg.org', description: { en: 'Criminal-immigration defense', es: 'Defensa criminal-inmigratoria', pt: 'Defesa criminal-imigratória' } },
        { name: 'Immigrant Defense Project', url: 'https://immigrantdefenseproject.org', description: { en: 'Rapid response network', es: 'Red de respuesta rápida', pt: 'Rede de resposta rápida' } },
        { name: 'Informed Immigrant', url: 'https://informedimmigrant.com', description: { en: 'Resource guides and toolkits', es: 'Guías de recursos y kits de herramientas', pt: 'Guias de recursos e kits de ferramentas' } },
      ],
    },
    {
      title: resources_t.kyrResources || 'Know Your Rights Resources',
      icon: BookOpen,
      organizations: [
        { name: 'ACLU Know Your Rights', url: 'https://aclu.org/know-your-rights', description: { en: 'Constitutional rights guides', es: 'Guías de derechos constitucionales', pt: 'Guias de direitos constitucionais' } },
        { name: '"We Have Rights" Videos', url: 'https://weareheretostay.org', description: { en: 'Available in 8 languages', es: 'Disponible en 8 idiomas', pt: 'Disponível em 8 idiomas' } },
        { name: 'National Immigration Forum', url: 'https://immigrationforum.org', description: { en: 'Education and advocacy', es: 'Educación y defensa', pt: 'Educação e defesa' } },
      ],
    },
  ]

  const locationApps = {
    whatsapp: {
      title: 'WhatsApp',
      subtitle: { en: 'Share for 15 min, 1 hr, or 8 hrs', es: 'Compartir por 15 min, 1 hr u 8 hrs', pt: 'Compartilhar por 15 min, 1 hr ou 8 hrs' },
      color: 'text-green-600',
      steps: {
        en: ['Open a chat with your trusted contact', 'Tap the + (attach) button', 'Select Location → Share live location', 'Choose duration and tap Send'],
        es: ['Abre un chat con tu contacto de confianza', 'Toca el botón + (adjuntar)', 'Selecciona Ubicación → Compartir ubicación en tiempo real', 'Elige la duración y toca Enviar'],
        pt: ['Abra um chat com seu contato de confiança', 'Toque no botão + (anexar)', 'Selecione Localização → Compartilhar localização em tempo real', 'Escolha a duração e toque em Enviar'],
      },
    },
    signal: {
      title: 'Signal',
      subtitle: { en: 'Most private option - encrypted', es: 'Opción más privada - encriptado', pt: 'Opção mais privada - criptografado' },
      color: 'text-blue-600',
      steps: {
        en: ['Open a chat with your trusted contact', 'Tap the + button next to the message field', 'Select Location', 'Choose to share once or as live location'],
        es: ['Abre un chat con tu contacto de confianza', 'Toca el botón + junto al campo de mensaje', 'Selecciona Ubicación', 'Elige compartir una vez o como ubicación en tiempo real'],
        pt: ['Abra um chat com seu contato de confiança', 'Toque no botão + ao lado do campo de mensagem', 'Selecione Localização', 'Escolha compartilhar uma vez ou como localização em tempo real'],
      },
    },
    google: {
      title: 'Google Maps',
      subtitle: { en: 'Works on Android & iPhone', es: 'Funciona en Android e iPhone', pt: 'Funciona no Android e iPhone' },
      color: 'text-red-500',
      steps: {
        en: ['Open Google Maps and tap your profile picture', 'Select Location sharing', 'Tap Share location and choose duration', 'Select contacts to share with via text or email'],
        es: ['Abre Google Maps y toca tu foto de perfil', 'Selecciona Compartir ubicación', 'Toca Compartir ubicación y elige la duración', 'Selecciona contactos para compartir por texto o email'],
        pt: ['Abra o Google Maps e toque na sua foto de perfil', 'Selecione Compartilhamento de localização', 'Toque em Compartilhar localização e escolha a duração', 'Selecione contatos para compartilhar por texto ou email'],
      },
    },
    findmy: {
      title: 'Find My (Apple)',
      subtitle: { en: 'iPhone, iPad, Mac only', es: 'Solo iPhone, iPad, Mac', pt: 'Apenas iPhone, iPad, Mac' },
      color: 'text-gray-600',
      steps: {
        en: ['Open the Find My app', 'Go to the People tab', 'Tap Start Sharing Location', 'Enter contact name and tap Send'],
        es: ['Abre la app Buscar', 'Ve a la pestaña Personas', 'Toca Comenzar a compartir ubicación', 'Ingresa el nombre del contacto y toca Enviar'],
        pt: ['Abra o app Buscar', 'Vá para a aba Pessoas', 'Toque em Começar a compartilhar localização', 'Digite o nome do contato e toque em Enviar'],
      },
      tip: { en: 'Tip: Go to Settings → [Your Name] → Find My to enable "Share My Location"', es: 'Consejo: Ve a Configuración → [Tu Nombre] → Buscar para activar "Compartir mi ubicación"', pt: 'Dica: Vá para Configurações → [Seu Nome] → Buscar para ativar "Compartilhar minha localização"' },
    },
  }

  return (
    <PageWrapper title={resources_t.pageTitle || 'Resources'}>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{resources_t.pageTitle || 'Resources'}</h1>
          <p className="text-lg text-muted-foreground">
            {resources_t.pageSubtitle || 'Legal resources, emergency contacts, and support organizations'}
          </p>
        </div>

        {/* Search CTA */}
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">{resources_t.needQuickAnswers || 'Need Quick Answers?'}</h2>
                <p className="text-muted-foreground">
                  {resources_t.searchKnowledgeBase || 'Search our knowledge base for rights information, legal resources, and guidance.'}
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/search">{resources_t.searchResources || 'Search Resources'}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Hotlines */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Phone className="h-6 w-6 text-destructive" />
            {resources_t.emergencyHotlines || 'Emergency Hotlines'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {emergencyHotlines.map((hotline) => (
              <Card key={hotline.phone} className={hotline.priority ? 'border-destructive/30' : ''}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getTranslated(hotline.name)}
                    {hotline.priority && (
                      <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded">
                        {resources_t.priority || 'Priority'}
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>{getTranslated(hotline.description)}</CardDescription>
                </CardHeader>
                <CardContent>
                  {hotline.isText ? (
                    <p className="text-lg font-semibold text-primary">{hotline.phone}</p>
                  ) : (
                    <a
                      href={`tel:${hotline.phone.replace(/[^0-9]/g, '')}`}
                      className="text-xl font-semibold text-primary hover:underline block"
                    >
                      {hotline.phone}
                    </a>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    {typeof hotline.available === 'string' ? hotline.available : getTranslated(hotline.available)}
                  </p>
                  {hotline.url && (
                    <a
                      href={hotline.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1 mt-2"
                    >
                      <Globe className="h-3 w-3" />
                      {resources_t.onlineLocator || 'Online locator'}
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Vulnerable Populations */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6" />
            {resources_t.specialProtections || 'Special Protections'}
          </h2>
          <p className="text-muted-foreground mb-4">
            {resources_t.specialProtectionsDesc || 'Some individuals may qualify for special immigration protections'}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {vulnerablePopulationResources.map((resource) => (
              <Card key={getTranslated(resource.title)}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <resource.icon className="h-5 w-5 text-primary" />
                    {getTranslated(resource.title)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {getTranslated(resource.description)}
                  </p>
                  {resource.phone && (
                    <a
                      href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`}
                      className="text-primary font-medium hover:underline flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      {resource.phone}
                    </a>
                  )}
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-medium hover:underline flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {t.common?.learnMore || 'Learn more'}
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Printable Resources */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6" />
            {resources_t.printableMaterials || 'Printable Materials'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {printableResources.map((resource) => (
              <Card key={resource.url}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1 mr-4">
                    <h3 className="font-medium">{getTranslated(resource.title)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {getTranslated(resource.description)}
                    </p>
                  </div>
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${getTranslated(resource.title)}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Live Location Sharing */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            {resources_t.liveLocationSharing || 'Live Location Sharing'}
          </h2>
          <p className="text-muted-foreground mb-4">
            {resources_t.liveLocationDesc || 'During an emergency, share your real-time location with trusted family members or friends using apps you already have. We recommend setting this up before an emergency happens.'}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(locationApps).map(([key, app]) => (
              <Card key={key}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Smartphone className={`h-5 w-5 ${app.color}`} />
                    {app.title}
                  </CardTitle>
                  <CardDescription>{getTranslated(app.subtitle)}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    {app.steps[language as keyof typeof app.steps]?.map((step, i) => (
                      <li key={i}>{step}</li>
                    )) || app.steps.en.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                  {'tip' in app && app.tip && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {getTranslated(app.tip as Record<string, string>)}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm">
              <strong>{resources_t.tip || 'Tip'}:</strong> {resources_t.setupTip || 'Set up location sharing with a trusted contact now so it\'s ready when you need it. Practice with a family member so everyone knows how to use it.'}
            </p>
          </div>
        </section>

        {/* Organization Directory */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{resources_t.organizationDirectory || 'Organization Directory'}</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {organizationCategories.map((category) => (
              <Card key={category.title} id={category.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <category.icon className="h-5 w-5 text-primary" />
                    {category.title}
                  </CardTitle>
                  {category.description && (
                    <CardDescription>{category.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.organizations.map((org) => (
                      <li key={org.url}>
                        <a
                          href={org.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group"
                        >
                          <div className="flex items-start gap-2">
                            <ExternalLink className="h-4 w-4 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                            <div>
                              <span className="font-medium text-sm group-hover:text-primary transition-colors">
                                {org.name}
                              </span>
                              {org.description && (
                                <p className="text-xs text-muted-foreground">
                                  {typeof org.description === 'string' ? org.description : getTranslated(org.description)}
                                </p>
                              )}
                            </div>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Workplace Rights */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                {resources_t.workplaceRights || 'Workplace Rights'}
              </CardTitle>
              <CardDescription>
                {resources_t.workplaceRightsDesc || 'All workers have rights regardless of immigration status'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>{resources_t.workplaceRight1 || 'Right to minimum wage, overtime pay, and safe working conditions'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>{resources_t.workplaceRight2 || 'Workers\' compensation for workplace injuries'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>{resources_t.workplaceRight3 || 'Protection from discrimination'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>{resources_t.workplaceRight4 || 'Employers cannot threaten to call ICE as retaliation'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>{resources_t.workplaceRight5 || 'In California (AB 450) employers cannot allow ICE access without a warrant'}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Fraud Warning */}
        <section className="mb-12">
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="h-5 w-5" />
                {resources_t.fraudWarning || 'Warning: Notario Fraud'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-3">
                {resources_t.fraudWarningText || 'In the U.S., "notarios" are NOT attorneys and cannot give legal advice. Only hire licensed attorneys for immigration help.'}
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• {resources_t.fraudTip1 || 'Verify any attorney at your state bar association website'}</li>
                <li>• {resources_t.fraudTip2 || 'Report fraud to your state attorney general or the FTC'}</li>
                <li>• {resources_t.fraudTip3 || 'Use AILA\'s lawyer search to find qualified attorneys'}</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Find Legal Help CTA */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">{resources_t.needLegalHelp || 'Need Legal Help?'}</h2>
            <p className="text-muted-foreground mb-4">
              {resources_t.needLegalHelpDesc || 'Use our legal support connector to find immigration attorneys and legal aid organizations in your area.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild>
                <Link href="#legal">{resources_t.findLegalSupport || 'Find Legal Support'}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/rights">{resources_t.knowYourRights || 'Know Your Rights'}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}
