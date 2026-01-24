'use client'

import { useState } from 'react'
import { useLanguage, Language, LANGUAGE_META, PRIMARY_LANGUAGES, SUPPORTED_LANGUAGES } from '@/hooks/use-language'
import { Globe, X, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// Get primary and extended languages
const primaryLanguages = PRIMARY_LANGUAGES.map(code => ({
  code,
  ...LANGUAGE_META[code]
}))

const allLanguages = SUPPORTED_LANGUAGES.map(code => ({
  code,
  ...LANGUAGE_META[code]
}))

export function LanguageSelector({ className }: { className?: string }) {
  const { language, setLanguage, mounted } = useLanguage()
  const [showMore, setShowMore] = useState(false)

  if (!mounted) {
    return (
      <div className={cn("flex items-center gap-1 text-sm", className)}>
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">EN</span>
      </div>
    )
  }

  const isPrimaryLanguage = PRIMARY_LANGUAGES.includes(language as typeof PRIMARY_LANGUAGES[number])
  const currentLang = LANGUAGE_META[language]

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center gap-1">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <div className="flex rounded-md overflow-hidden border border-border">
          {/* Big three */}
          {primaryLanguages.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              className={cn(
                "px-2 py-1 text-xs font-medium transition-colors",
                language === code
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              )}
            >
              {label}
            </button>
          ))}
          {/* More button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className={cn(
              "px-2 py-1 text-xs font-medium transition-colors flex items-center gap-0.5 border-l border-border",
              !isPrimaryLanguage
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted"
            )}
          >
            {!isPrimaryLanguage ? currentLang.label : 'More'}
            <ChevronDown className={cn("h-3 w-3 transition-transform", showMore && "rotate-180")} />
          </button>
        </div>
      </div>

      {/* Dropdown for all languages */}
      {showMore && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMore(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 bg-background border rounded-lg shadow-xl max-h-80 overflow-y-auto min-w-[200px]">
            <div className="p-2 border-b sticky top-0 bg-background">
              <span className="text-xs text-muted-foreground font-medium">Select Language</span>
            </div>
            <div className="p-1">
              {allLanguages.map(({ code, name, nativeName, label }) => (
                <button
                  key={code}
                  onClick={() => {
                    setLanguage(code)
                    setShowMore(false)
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left",
                    language === code
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <span className="font-bold min-w-[2.5rem]">{label}</span>
                  <span className="flex-1">{nativeName}</span>
                  {language === code && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Floating language selector for pages without AppHeader
export function FloatingLanguageSelector() {
  const { language, setLanguage, mounted } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  if (!mounted) return null

  const isPrimaryLanguage = PRIMARY_LANGUAGES.includes(language as typeof PRIMARY_LANGUAGES[number])
  const currentLang = LANGUAGE_META[language]

  return (
    <div className="fixed top-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-background/95 backdrop-blur-lg border rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2 max-h-[80vh] overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 p-3 border-b">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium flex-1">Language</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Primary languages */}
          <div className="p-2 border-b">
            <div className="text-xs text-muted-foreground px-2 pb-1">Popular</div>
            <div className="flex flex-col gap-1">
              {primaryLanguages.map(({ code, label, nativeName }) => (
                <button
                  key={code}
                  onClick={() => {
                    setLanguage(code)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                    language === code
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <span className="font-bold min-w-[2rem]">{label}</span>
                  <span className={language === code ? "text-primary-foreground/80" : "text-muted-foreground"}>{nativeName}</span>
                  {language === code && <Check className="h-4 w-4 ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* All languages */}
          <div className="p-2 overflow-y-auto flex-1">
            <div className="text-xs text-muted-foreground px-2 pb-1">All Languages</div>
            <div className="flex flex-col gap-1">
              {allLanguages.filter(l => !PRIMARY_LANGUAGES.includes(l.code as typeof PRIMARY_LANGUAGES[number])).map(({ code, label, nativeName }) => (
                <button
                  key={code}
                  onClick={() => {
                    setLanguage(code)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                    language === code
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <span className="font-bold min-w-[2rem]">{label}</span>
                  <span className={language === code ? "text-primary-foreground/80" : "text-muted-foreground"}>{nativeName}</span>
                  {language === code && <Check className="h-4 w-4 ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-background/95 backdrop-blur-lg border rounded-full shadow-lg hover:bg-muted transition-colors"
          aria-label="Change language"
        >
          <Globe className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold">{currentLang.label}</span>
        </button>
      )}
    </div>
  )
}
