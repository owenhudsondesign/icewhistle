'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Moon, Sun, ChevronLeft, Download, Share, Plus, ChevronDown, Check, Globe } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { useLanguage, LANGUAGE_META, SUPPORTED_LANGUAGES } from '@/hooks/use-language'
import { usePWAInstall } from '@/hooks/use-pwa-install'

interface AppHeaderProps {
  showBack?: boolean
  backHref?: string
}

export function AppHeader({ showBack, backHref = '/' }: AppHeaderProps) {
  const { toggleTheme, isDark, mounted } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { canInstall, isIOS, isInstalled, promptInstall } = usePWAInstall()
  const [showIOSModal, setShowIOSModal] = useState(false)
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)
  const nav = t.nav

  // All languages except EN/ES for the dropdown
  const otherLanguages = SUPPORTED_LANGUAGES.filter(code => code !== 'en' && code !== 'es').map(code => ({
    code,
    ...LANGUAGE_META[code]
  }))
  const currentLang = LANGUAGE_META[language]
  const isOtherLanguage = language !== 'en' && language !== 'es'

  useEffect(() => {
    setPortalRoot(document.body)
  }, [])

  const handleInstallClick = async () => {
    if (canInstall) {
      await promptInstall()
    } else if (isIOS) {
      setShowIOSModal(true)
    }
  }

  const showInstallButton = (canInstall || isIOS) && !isInstalled

  return (
    <>
    <header className="sticky top-0 z-50 glass-subtle border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Left - Logo/Back */}
          <div className="flex items-center gap-2 sm:flex-1 flex-shrink-0">
            {showBack && (
              <Link href={backHref}>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-[8px] press-scale">
                  <ChevronLeft className="h-5 w-5" strokeWidth={2} />
                </Button>
              </Link>
            )}
            <Link href="/" className="flex items-center press-scale">
              {/* Show white logo in dark mode, dark logo in light mode */}
              <Image
                src="/images/icewhistle-logo-white.svg"
                alt="ICEwhistle"
                width={140}
                height={32}
                className="h-6 sm:h-8 w-auto dark:block hidden"
                priority
              />
              <Image
                src="/images/icewhistle-logo-dark.svg"
                alt="ICEwhistle"
                width={140}
                height={32}
                className="h-6 sm:h-8 w-auto dark:hidden block"
                priority
              />
            </Link>
          </div>

          {/* Center - Language Selector: EN | ES | Dropdown */}
          <div className="flex justify-center relative">
            <div className="flex rounded-[12px] overflow-hidden border border-border/50 bg-muted/30">
              {/* English */}
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-2 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
                  language === 'en'
                    ? 'bg-[#00A6B4] text-white'
                    : 'hover:bg-muted text-foreground'
                }`}
                aria-label="English"
              >
                <span className="text-sm font-bold">EN</span>
              </button>
              {/* Spanish */}
              <button
                onClick={() => setLanguage('es')}
                className={`px-3 py-2 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center border-l border-border/50 ${
                  language === 'es'
                    ? 'bg-[#00A6B4] text-white'
                    : 'hover:bg-muted text-foreground'
                }`}
                aria-label="Español"
              >
                <span className="text-sm font-bold">ES</span>
              </button>
              {/* More languages dropdown */}
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className={`px-3 py-2 transition-all min-h-[44px] flex items-center justify-center gap-1 border-l border-border/50 ${
                  isOtherLanguage
                    ? 'bg-[#00A6B4] text-white'
                    : 'hover:bg-muted text-foreground'
                }`}
                aria-label="More languages"
              >
                <span className="text-sm font-bold">{isOtherLanguage ? currentLang.label : '+'}</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Dropdown */}
            {showLangDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLangDropdown(false)}
                />
                <div className="absolute top-full mt-2 right-0 z-50 bg-background border rounded-xl shadow-xl max-h-80 overflow-y-auto min-w-[200px]">
                  <div className="p-2 border-b sticky top-0 bg-background">
                    <span className="text-xs text-muted-foreground font-medium">Select Language</span>
                  </div>
                  <div className="p-1">
                    {otherLanguages.map(({ code, nativeName, label }) => (
                      <button
                        key={code}
                        onClick={() => {
                          setLanguage(code)
                          setShowLangDropdown(false)
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                          language === code
                            ? 'bg-[#00A6B4] text-white'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <span className="font-bold shrink-0">{label}</span>
                        <span className="flex-1 break-words">{nativeName}</span>
                        {language === code && <Check className="h-4 w-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right - Install button (desktop only) & Dark Mode Toggle */}
          <div className="flex items-center gap-2 sm:flex-1 justify-end flex-shrink-0">
            {/* Install button - desktop only */}
            {showInstallButton && (
              <Button
                variant="outline"
                onClick={handleInstallClick}
                className="hidden sm:flex h-10 rounded-[8px] border-border/50 press-scale gap-2 px-3"
              >
                <Download className="h-4 w-4 text-[#00A6B4]" strokeWidth={2} />
                <span className="text-sm">{nav.install}</span>
              </Button>
            )}
            {/* Dark mode toggle - always visible */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-10 w-10 rounded-[8px] press-scale"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {mounted && isDark ? (
                <Sun className="h-5 w-5 text-[#FF8C42]" strokeWidth={2} />
              ) : (
                <Moon className="h-5 w-5 text-[#8B5CF6]" strokeWidth={2} />
              )}
            </Button>
          </div>
        </div>
      </div>

    </header>

      {/* iOS Install Instructions Modal - rendered via portal to escape header stacking context */}
      {showIOSModal && portalRoot && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 pb-4 px-4 overflow-y-auto"
          style={{ paddingTop: 'max(5rem, env(safe-area-inset-top, 5rem))' }}
          onClick={() => setShowIOSModal(false)}
        >
          <div
            className="w-full max-w-sm bg-background rounded-2xl p-6 shadow-xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">{nav.iosTitle}</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Share className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-sm text-muted-foreground pt-1">{nav.iosStep1}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Plus className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-sm text-muted-foreground pt-1">{nav.iosStep2}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Download className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-sm text-muted-foreground pt-1">{nav.iosStep3}</p>
              </div>
            </div>
            <Button
              onClick={() => setShowIOSModal(false)}
              className="w-full"
            >
              {nav.gotIt}
            </Button>
          </div>
        </div>,
        portalRoot
      )}
    </>
  )
}

export default AppHeader
