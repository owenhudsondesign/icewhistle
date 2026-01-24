'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Shield, Heart, ArrowRight } from 'lucide-react'
import { useLanguage, Language, PRIMARY_LANGUAGES } from '@/hooks/use-language'

type GatewayTranslation = {
  title: string
  subtitle: string
  urgentButton: string
  urgentDesc: string
  supportButton: string
  supportDesc: string
  languageLabel: string
  tagline: string
}

const translations: Record<string, GatewayTranslation> = {
  en: {
    title: 'ICEWHISTLE',
    subtitle: 'Know Your Rights. Protect Your Community.',
    urgentButton: 'I Need Help Now',
    urgentDesc: 'Access emergency resources, know your rights, and find legal help',
    supportButton: 'Support the Cause',
    supportDesc: 'Get a whistle. 100% of profits fund immigrant bail bonds.',
    languageLabel: 'Language',
    tagline: 'By the community. For the community.',
  },
  es: {
    title: 'ICEWHISTLE',
    subtitle: 'Conoce Tus Derechos. Protege Tu Comunidad.',
    urgentButton: 'Necesito Ayuda Ahora',
    urgentDesc: 'Accede a recursos de emergencia, conoce tus derechos y encuentra ayuda legal',
    supportButton: 'Apoya la Causa',
    supportDesc: 'Obtén un silbato. 100% de las ganancias financian fianzas de inmigrantes.',
    languageLabel: 'Idioma',
    tagline: 'Por la comunidad. Para la comunidad.',
  },
  pt: {
    title: 'ICEWHISTLE',
    subtitle: 'Conheça Seus Direitos. Proteja Sua Comunidade.',
    urgentButton: 'Preciso de Ajuda Agora',
    urgentDesc: 'Acesse recursos de emergência, conheça seus direitos e encontre ajuda legal',
    supportButton: 'Apoie a Causa',
    supportDesc: 'Obtenha um apito. 100% dos lucros financiam fianças de imigrantes.',
    languageLabel: 'Idioma',
    tagline: 'Pela comunidade. Para a comunidade.',
  },
}

// Get translation with fallback to English
const getTranslation = (lang: Language): GatewayTranslation => {
  return translations[lang] || translations.en
}

const heroWords = [
  { text: 'KNOW YOUR RIGHTS', lang: 'en' },
  { text: 'CONOCE TUS DERECHOS', lang: 'es' },
  { text: 'CONHEÇA SEUS DIREITOS', lang: 'pt' },
  { text: 'CONNAISSEZ VOS DROITS', lang: 'fr' },
  { text: '了解你的权利', lang: 'zh' },
  { text: 'اعرف حقوقك', lang: 'ar' },
  { text: 'अपने अधिकार जानें', lang: 'hi' },
  { text: 'BIẾT QUYỀN CỦA BẠN', lang: 'vi' },
  { text: '자신의 권리를 알아라', lang: 'ko' },
  { text: 'ЗНАЙ СВОИ ПРАВА', lang: 'ru' },
]

// Split-flap letter component
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
      className="inline-block relative"
      style={{
        transform: isFlipping ? 'rotateX(90deg)' : 'rotateX(0deg)',
        transition: 'transform 150ms ease-in-out',
        transformStyle: 'preserve-3d',
        minWidth: char === ' ' ? '0.3em' : undefined,
      }}
    >
      {displayChar}
    </span>
  )
}

// Animated split-flap display
function SplitFlapDisplay({ text }: { text: string }) {
  const maxLength = Math.max(...heroWords.map(w => w.text.length))
  const paddedText = text.padEnd(maxLength, ' ')

  return (
    <div className="flex justify-center flex-wrap" style={{ perspective: '500px' }}>
      {paddedText.split('').map((char, i) => (
        <SplitFlapChar key={i} char={char} delay={i * 30} />
      ))}
    </div>
  )
}

export default function GatewayPage() {
  const { language, setLanguage } = useLanguage()
  const t = getTranslation(language)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % heroWords.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00A6B4] rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#DC2626] rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Language selector - shows primary languages with current selection */}
      <div className="absolute top-4 right-4 z-20">
        <select
          value={PRIMARY_LANGUAGES.includes(language as typeof PRIMARY_LANGUAGES[number]) ? language : 'en'}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00A6B4]"
        >
          <option value="en" className="bg-gray-900">English</option>
          <option value="es" className="bg-gray-900">Español</option>
          <option value="pt" className="bg-gray-900">Português</option>
        </select>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
            <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
              ICE
            </span>
            <span className="bg-gradient-to-r from-[#00A6B4] to-[#00D4E5] bg-clip-text text-transparent">
              WHISTLE
            </span>
          </h1>

          {/* Animated split-flap display */}
          <div className="h-12 md:h-16 flex items-center justify-center overflow-hidden">
            <p className="text-xl md:text-3xl font-bold font-mono tracking-wide">
              <SplitFlapDisplay text={heroWords[currentWordIndex].text} />
            </p>
          </div>

          <p className="text-gray-400 mt-4 text-lg max-w-md mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Two main buttons */}
        <div className="w-full max-w-2xl grid md:grid-cols-2 gap-6 mt-8">
          {/* Urgent Resources Button */}
          <Link href="/" className="group">
            <div className="relative h-full">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#DC2626] to-[#FF4444] rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />

              <div className="relative h-full bg-gradient-to-br from-[#DC2626] to-[#B91C1C] rounded-2xl p-6 border border-red-500/30 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                      {t.urgentButton}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </h2>
                    <p className="text-red-100/80 text-sm">
                      {t.urgentDesc}
                    </p>
                  </div>
                </div>

                {/* Pulsing indicator */}
                <div className="absolute top-4 right-4">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Support / Shop Button */}
          <Link href="/landing" className="group">
            <div className="relative h-full">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00A6B4] to-[#00D4E5] rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />

              <div className="relative h-full bg-gradient-to-br from-[#00A6B4] to-[#008891] rounded-2xl p-6 border border-cyan-500/30 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                      {t.supportButton}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </h2>
                    <p className="text-cyan-100/80 text-sm">
                      {t.supportDesc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom tagline */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            {t.tagline}
          </p>
        </div>
      </div>
    </div>
  )
}
