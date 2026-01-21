'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Moon, Sun, ChevronLeft } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { useLanguage, Language } from '@/hooks/use-language'

interface AppHeaderProps {
  showBack?: boolean
  backHref?: string
  title?: string
  subtitle?: string
}

export function AppHeader({ showBack, backHref = '/', title, subtitle }: AppHeaderProps) {
  const { toggleTheme, isDark, mounted } = useTheme()
  const { language, setLanguage } = useLanguage()

  return (
    <header className="sticky top-0 z-50 glass-subtle border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showBack && (
              <Link href={backHref}>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-[8px] press-scale">
                  <ChevronLeft className="h-5 w-5" strokeWidth={2} />
                </Button>
              </Link>
            )}
            {title ? (
              <div>
                <h1 className="text-headline flex items-center gap-2">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-small text-muted-foreground">{subtitle}</p>
                )}
              </div>
            ) : (
              <Link href="/" className="flex items-center press-scale">
                {/* Show white logo in dark mode, dark logo in light mode */}
                <Image
                  src="/images/icewhistle-logo-white.svg"
                  alt="ICEwhistle"
                  width={140}
                  height={32}
                  className="h-8 w-auto dark:block hidden"
                  priority
                />
                <Image
                  src="/images/icewhistle-logo-dark.svg"
                  alt="ICEwhistle"
                  width={140}
                  height={32}
                  className="h-8 w-auto dark:hidden block"
                  priority
                />
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Language Buttons - Prominent with full names */}
            <div className="flex rounded-[12px] overflow-hidden border border-border/50 bg-muted/30">
              {([
                { code: 'en' as const, label: 'EN', name: 'English' },
                { code: 'es' as const, label: 'ES', name: 'Español' },
                { code: 'pt' as const, label: 'PT', name: 'Português' },
              ]).map(({ code, label, name }) => (
                <button
                  key={code}
                  onClick={() => setLanguage(code)}
                  className={`px-3 py-1.5 transition-all min-h-[44px] min-w-[52px] flex flex-col items-center justify-center ${
                    language === code
                      ? 'bg-[#00A6B4] text-white'
                      : 'hover:bg-muted text-foreground'
                  }`}
                  aria-label={name}
                >
                  <span className="text-caption font-bold">{label}</span>
                  <span className={`text-[10px] ${language === code ? 'text-white/80' : 'text-muted-foreground'}`}>{name}</span>
                </button>
              ))}
            </div>
            {/* Dark Mode Toggle - Bondi accent */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="h-10 w-10 rounded-[8px] border-border/50 press-scale"
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
  )
}

export default AppHeader
