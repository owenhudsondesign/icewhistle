'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/hooks/use-language'
import {
  Shield,
  Users,
  Lock,
  ArrowRight,
  Smartphone,
  Heart,
  Globe,
  ChevronDown
} from 'lucide-react'

// Multilingual "Know Your Rights" hero phrases (cycles through all languages)
const heroTranslations = [
  { text: 'KNOW YOUR RIGHTS', lang: 'English' },
  { text: 'CONOCE TUS DERECHOS', lang: 'Español' },
  { text: 'CONHEÇA SEUS DIREITOS', lang: 'Português' },
  { text: 'CONNAISSEZ VOS DROITS', lang: 'Français' },
  { text: '了解你的权利', lang: '中文' },
  { text: 'اعرف حقوقك', lang: 'العربية' },
  { text: 'BIẾT QUYỀN CỦA BẠN', lang: 'Tiếng Việt' },
  { text: '당신의 권리를 알아라', lang: '한국어' },
  { text: 'ALAMIN ANG IYONG MGA KARAPATAN', lang: 'Tagalog' },
  { text: 'KONNEN DWA OU', lang: 'Kreyòl Ayisyen' },
]

// Split-flap character component with smooth rotation
function SplitFlapChar({ char, delay }: { char: string; delay: number }) {
  const [displayChar, setDisplayChar] = useState(char)
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    if (char !== displayChar) {
      const timeout = setTimeout(() => {
        setIsFlipping(true)
        setTimeout(() => {
          setDisplayChar(char)
          setIsFlipping(false)
        }, 150)
      }, delay)
      return () => clearTimeout(timeout)
    }
  }, [char, delay, displayChar])

  return (
    <span
      className="inline-block"
      style={{
        transform: isFlipping ? 'rotateX(90deg)' : 'rotateX(0deg)',
        transition: 'transform 150ms ease-in-out',
        transformStyle: 'preserve-3d',
        minWidth: char === ' ' ? '0.25em' : undefined,
      }}
    >
      {displayChar}
    </span>
  )
}

// Animated split-flap display for hero text
function SplitFlapDisplay({ text, className }: { text: string; className?: string }) {
  const maxLength = Math.max(...heroTranslations.map(h => h.text.length))
  const paddedText = text.padEnd(maxLength, ' ')

  return (
    <span className={className} style={{ perspective: '1000px' }}>
      {paddedText.split('').map((char, i) => (
        <SplitFlapChar key={i} char={char} delay={i * 25} />
      ))}
    </span>
  )
}

// Page content translations
const pageTranslations = {
  en: {
    shop: 'Shop',
    transparency: 'Transparency',
    openApp: 'Open App',
    subheadline: 'A free, anonymous app to protect immigrant communities.',
    subheadlineHighlight: 'No tracking. No data collection. No fear.',
    openWebApp: 'Open Web App',
    appStoreComingSoon: 'App Store (Coming Soon)',
    anonymous: '100% Anonymous',
    offlineCapable: 'Offline Capable',
    communityBuilt: 'Community Built',
    builtFor: 'BUILT FOR',
    protection: 'PROTECTION',
    featuresSubheadline: 'Everything you need to know your rights and protect your community, in one app that works even without internet.',
    knowYourRights: 'Know Your Rights',
    knowYourRightsDesc: 'Comprehensive legal information about your constitutional rights during immigration encounters. In your language.',
    communityAlerts: 'Community Alerts',
    communityAlertsDesc: 'Real-time, anonymous reports of immigration enforcement activity in your area. Help protect your neighbors.',
    privacyFirst: 'Privacy First',
    privacyFirstDesc: 'No accounts. No tracking. No data collection. Works offline. Your safety is not a product.',
    supportTheCause: 'SUPPORT THE CAUSE',
    carryThe: 'CARRY THE',
    whistle: 'WHISTLE',
    productDesc: '100% of profits go directly to immigrant bail funds and legal aid organizations. Made from recycled ocean plastic. Every purchase is public and transparent.',
    shopNow: 'Shop Now',
    viewFinances: 'View Finances',
    profitsSupport: '100% of profits support immigrant communities',
    rightsTopics: 'Rights Topics',
    languages: 'Languages',
    costToUse: 'Cost to Use',
    dataCollected: 'Data Collected',
    protectCommunity: 'PROTECT YOUR COMMUNITY',
    ctaSubheadline: 'Download the app. Share with your neighbors. Know your rights.',
    getStarted: 'GET STARTED',
    builtWithSolidarity: 'Built with solidarity',
    app: 'App',
    privacy: 'Privacy',
    terms: 'Terms',
  },
  es: {
    shop: 'Tienda',
    transparency: 'Transparencia',
    openApp: 'Abrir App',
    subheadline: 'Una aplicación gratuita y anónima para proteger a las comunidades inmigrantes.',
    subheadlineHighlight: 'Sin rastreo. Sin recolección de datos. Sin miedo.',
    openWebApp: 'Abrir App Web',
    appStoreComingSoon: 'App Store (Próximamente)',
    anonymous: '100% Anónimo',
    offlineCapable: 'Funciona Sin Internet',
    communityBuilt: 'Hecho por la Comunidad',
    builtFor: 'CONSTRUIDO PARA',
    protection: 'PROTECCIÓN',
    featuresSubheadline: 'Todo lo que necesitas para conocer tus derechos y proteger a tu comunidad, en una app que funciona incluso sin internet.',
    knowYourRights: 'Conoce Tus Derechos',
    knowYourRightsDesc: 'Información legal completa sobre tus derechos constitucionales durante encuentros con inmigración. En tu idioma.',
    communityAlerts: 'Alertas Comunitarias',
    communityAlertsDesc: 'Reportes anónimos en tiempo real de actividad de inmigración en tu área. Ayuda a proteger a tus vecinos.',
    privacyFirst: 'Privacidad Primero',
    privacyFirstDesc: 'Sin cuentas. Sin rastreo. Sin recolección de datos. Funciona sin internet. Tu seguridad no es un producto.',
    supportTheCause: 'APOYA LA CAUSA',
    carryThe: 'LLEVA EL',
    whistle: 'SILBATO',
    productDesc: 'El 100% de las ganancias van directamente a fondos de fianza para inmigrantes y organizaciones de ayuda legal. Hecho de plástico oceánico reciclado. Cada compra es pública y transparente.',
    shopNow: 'Comprar Ahora',
    viewFinances: 'Ver Finanzas',
    profitsSupport: 'El 100% de las ganancias apoyan a comunidades inmigrantes',
    rightsTopics: 'Temas de Derechos',
    languages: 'Idiomas',
    costToUse: 'Costo de Uso',
    dataCollected: 'Datos Recolectados',
    protectCommunity: 'PROTEGE A TU COMUNIDAD',
    ctaSubheadline: 'Descarga la app. Comparte con tus vecinos. Conoce tus derechos.',
    getStarted: 'COMENZAR',
    builtWithSolidarity: 'Construido con solidaridad',
    app: 'App',
    privacy: 'Privacidad',
    terms: 'Términos',
  },
  pt: {
    shop: 'Loja',
    transparency: 'Transparência',
    openApp: 'Abrir App',
    subheadline: 'Um aplicativo gratuito e anônimo para proteger comunidades imigrantes.',
    subheadlineHighlight: 'Sem rastreamento. Sem coleta de dados. Sem medo.',
    openWebApp: 'Abrir App Web',
    appStoreComingSoon: 'App Store (Em Breve)',
    anonymous: '100% Anônimo',
    offlineCapable: 'Funciona Offline',
    communityBuilt: 'Feito pela Comunidade',
    builtFor: 'CONSTRUÍDO PARA',
    protection: 'PROTEÇÃO',
    featuresSubheadline: 'Tudo que você precisa para conhecer seus direitos e proteger sua comunidade, em um app que funciona mesmo sem internet.',
    knowYourRights: 'Conheça Seus Direitos',
    knowYourRightsDesc: 'Informação legal completa sobre seus direitos constitucionais durante encontros com imigração. No seu idioma.',
    communityAlerts: 'Alertas Comunitários',
    communityAlertsDesc: 'Relatórios anônimos em tempo real de atividade de imigração na sua área. Ajude a proteger seus vizinhos.',
    privacyFirst: 'Privacidade Primeiro',
    privacyFirstDesc: 'Sem contas. Sem rastreamento. Sem coleta de dados. Funciona offline. Sua segurança não é um produto.',
    supportTheCause: 'APOIE A CAUSA',
    carryThe: 'CARREGUE O',
    whistle: 'APITO',
    productDesc: '100% dos lucros vão diretamente para fundos de fiança para imigrantes e organizações de ajuda jurídica. Feito de plástico oceânico reciclado. Cada compra é pública e transparente.',
    shopNow: 'Comprar Agora',
    viewFinances: 'Ver Finanças',
    profitsSupport: '100% dos lucros apoiam comunidades imigrantes',
    rightsTopics: 'Tópicos de Direitos',
    languages: 'Idiomas',
    costToUse: 'Custo de Uso',
    dataCollected: 'Dados Coletados',
    protectCommunity: 'PROTEJA SUA COMUNIDADE',
    ctaSubheadline: 'Baixe o app. Compartilhe com seus vizinhos. Conheça seus direitos.',
    getStarted: 'COMEÇAR',
    builtWithSolidarity: 'Construído com solidariedade',
    app: 'App',
    privacy: 'Privacidade',
    terms: 'Termos',
  },
}

export default function LandingPage() {
  const { language } = useLanguage()
  const t = pageTranslations[language]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroTranslations.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/landing" className="flex items-center gap-2">
            <Image
              src="/images/icewhistle-logo-white.svg"
              alt="ICEwhistle"
              width={140}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/shop" className="text-sm text-white/70 hover:text-white transition-colors hidden sm:block">
              {t.shop}
            </Link>
            <Link href="/transparency" className="text-sm text-white/70 hover:text-white transition-colors hidden sm:block">
              {t.transparency}
            </Link>
            <Link href="/">
              <Button className="bg-[#DC2626] hover:bg-[#DC2626]/90 text-white rounded-full px-6">
                {t.openApp}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#DC2626]/20 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00A6B4]/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8B5CF6]/10 rounded-full blur-[128px]" />
        </div>

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
            backgroundSize: '64px 64px'
          }}
        />

        <div className="relative z-10 container mx-auto px-6 text-center">
          {/* Animated Language Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-8">
            <Globe className="h-4 w-4 text-[#00A6B4]" />
            <span className="text-sm text-white/70 transition-all duration-300">
              {heroTranslations[currentIndex].lang}
            </span>
          </div>

          {/* Main Hero Text - Split-Flap Animation */}
          <h1 className="relative">
            <SplitFlapDisplay
              text={heroTranslations[currentIndex].text}
              className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none"
            />
          </h1>

          {/* Subheadline */}
          <p className="mt-8 text-lg sm:text-xl md:text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed px-4">
            {t.subheadline}
            <span className="text-white"> {t.subheadlineHighlight}</span>
          </p>

          {/* CTA Button */}
          <div className="mt-12 flex items-center justify-center px-4">
            <Link href="/">
              <Button size="lg" className="bg-[#DC2626] hover:bg-[#DC2626]/90 text-white rounded-full px-8 py-6 text-lg font-semibold gap-2 press-scale">
                <Smartphone className="h-5 w-5" />
                {t.openWebApp}
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-white/40 px-4">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>{t.anonymous}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>{t.offlineCapable}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{t.communityBuilt}</span>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-8 w-8 text-white/30" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-b from-[#0A0A0B] to-[#111113]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-4">
            {t.builtFor} <span className="text-[#DC2626]">{t.protection}</span>
          </h2>
          <p className="text-white/60 text-center max-w-2xl mx-auto mb-16 px-4">
            {t.featuresSubheadline}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Shield,
                color: '#84CC16',
                title: t.knowYourRights,
                description: t.knowYourRightsDesc
              },
              {
                icon: Users,
                color: '#FF8C42',
                title: t.communityAlerts,
                description: t.communityAlertsDesc
              },
              {
                icon: Lock,
                color: '#00A6B4',
                title: t.privacyFirst,
                description: t.privacyFirstDesc
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon className="h-7 w-7" style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#DC2626]/5 to-transparent" />

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-[#DC2626]/10 text-[#DC2626] rounded-full text-sm font-semibold mb-6">
                {t.supportTheCause}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6">
                {t.carryThe} <span className="text-[#DC2626]">{t.whistle}</span>
              </h2>
              <p className="text-lg sm:text-xl text-white/60 mb-8 leading-relaxed">
                {t.productDesc}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/shop">
                  <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-lg font-semibold gap-2 w-full sm:w-auto">
                    {t.shopNow}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/transparency">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg font-semibold w-full sm:w-auto">
                    {t.viewFinances}
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-3 text-white/40">
                <Heart className="h-5 w-5 text-[#DC2626]" />
                <span>{t.profitsSupport}</span>
              </div>
            </div>

            <div className="relative">
              {/* Product Images */}
              <div className="relative aspect-square max-w-md mx-auto lg:max-w-none">
                <Image
                  src="/icewhistle-render-01.png"
                  alt="ICEwhistle - Recycled Plastic Whistle"
                  fill
                  className="object-contain"
                />
              </div>
              {/* Floating Packaging Image */}
              <div className="absolute -bottom-4 left-4 sm:-bottom-8 sm:-left-8 w-32 h-32 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src="/icewhistle-packaging-01.png"
                  alt="ICEwhistle Packaging"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Impact Section */}
      <section className="py-24 sm:py-32 bg-[#111113]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '55+', label: t.rightsTopics },
              { value: '3', label: t.languages },
              { value: '$0', label: t.costToUse },
              { value: '0', label: t.dataCollected },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#DC2626] mb-2">{stat.value}</div>
                <div className="text-white/60 text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#DC2626]/20 to-transparent" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6">
            {t.protectCommunity}
          </h2>
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-12 px-4">
            {t.ctaSubheadline}
          </p>
          <Link href="/">
            <Button size="lg" className="bg-[#DC2626] hover:bg-[#DC2626]/90 text-white rounded-full px-8 sm:px-12 py-6 text-lg sm:text-xl font-bold gap-3 press-scale">
              {t.getStarted}
              <ArrowRight className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Image
              src="/images/icewhistle-logo-white.svg"
              alt="ICEwhistle"
              width={120}
              height={28}
              className="h-6 w-auto opacity-50"
            />
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-white/40">
              <Link href="/" className="hover:text-white transition-colors">{t.app}</Link>
              <Link href="/shop" className="hover:text-white transition-colors">{t.shop}</Link>
              <Link href="/transparency" className="hover:text-white transition-colors">{t.transparency}</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">{t.privacy}</Link>
              <Link href="/terms" className="hover:text-white transition-colors">{t.terms}</Link>
            </div>
            <div className="text-sm text-white/40">
              {t.builtWithSolidarity}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
