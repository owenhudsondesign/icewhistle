'use client'

import { useState } from 'react'
import { useLanguage, Language } from '@/hooks/use-language'
import { Globe, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const languages: { code: Language; label: string; name: string }[] = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'pt', label: 'PT', name: 'Português' },
]

export function LanguageSelector({ className }: { className?: string }) {
  const { language, setLanguage, mounted } = useLanguage()

  if (!mounted) {
    return (
      <div className={cn("flex items-center gap-1 text-sm", className)}>
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">EN</span>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Globe className="h-4 w-4 text-muted-foreground" />
      <div className="flex rounded-md overflow-hidden border border-border">
        {languages.map(({ code, label }) => (
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
      </div>
    </div>
  )
}

// Floating language selector for pages without AppHeader
export function FloatingLanguageSelector() {
  const { language, setLanguage, mounted } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  if (!mounted) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-background/95 backdrop-blur-lg border rounded-xl shadow-lg p-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 mb-2 px-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium flex-1">Language</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {languages.map(({ code, label, name }) => (
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
                <span className="font-bold">{label}</span>
                <span className={language === code ? "text-primary-foreground/80" : "text-muted-foreground"}>{name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-background/95 backdrop-blur-lg border rounded-full shadow-lg hover:bg-muted transition-colors"
          aria-label="Change language"
        >
          <Globe className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold">{language.toUpperCase()}</span>
        </button>
      )}
    </div>
  )
}
