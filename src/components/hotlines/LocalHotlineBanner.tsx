'use client'

import { useState } from 'react'
import { Phone, MapPin, Clock, Globe, ChevronRight, X } from 'lucide-react'
import { useUserZip } from '@/hooks/use-user-zip'
import { useLanguage } from '@/hooks/use-language'
import { getHotlinesForZip, Hotline } from '@/data/hotlines'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

// Helper to get translation with fallback
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLocalTranslation = (t: any, key: string, fallback: string): string => {
  const local = t?.local as Record<string, string> | undefined
  return local?.[key] || fallback
}

interface LocalHotlineBannerProps {
  variant?: 'prominent' | 'compact' | 'emergency'
  showZipInput?: boolean
  maxHotlines?: number
  className?: string
}

/**
 * A banner component that displays the user's most relevant local hotline(s)
 * based on their ZIP code. Shows different variants for different contexts.
 */
export function LocalHotlineBanner({
  variant = 'prominent',
  showZipInput = true,
  maxHotlines = 1,
  className = '',
}: LocalHotlineBannerProps) {
  const { zip, updateZip, mounted } = useUserZip()
  const { language, t } = useLanguage()
  const [tempZip, setTempZip] = useState('')
  const [showInput, setShowInput] = useState(false)

  // Translation helpers
  const lt = (key: string, fallback: string) => getLocalTranslation(t, key, fallback)

  if (!mounted) {
    return (
      <div className={`animate-pulse bg-muted/50 rounded-[12px] h-24 ${className}`} />
    )
  }

  const allHotlines = getHotlinesForZip(zip)
  // Get local/state hotlines first, then national
  const localHotlines = allHotlines.filter(h => h.type === 'local' || h.type === 'state')
  const hotlinesToShow = localHotlines.length > 0
    ? localHotlines.slice(0, maxHotlines)
    : allHotlines.filter(h => h.type === 'national').slice(0, maxHotlines)

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleaned = tempZip.replace(/\D/g, '').slice(0, 5)
    if (cleaned.length === 5) {
      updateZip(cleaned)
      setTempZip('')
      setShowInput(false)
    }
  }

  const getName = (hotline: Hotline) =>
    language === 'es' && hotline.nameEs ? hotline.nameEs : hotline.name

  const getDescription = (hotline: Hotline) =>
    language === 'es' && hotline.descriptionEs ? hotline.descriptionEs : hotline.description

  // Emergency variant - large, prominent, for crisis pages
  if (variant === 'emergency') {
    return (
      <div className={`space-y-3 ${className}`}>
        {/* ZIP prompt if no ZIP set */}
        {!zip && showZipInput && (
          <div className="p-4 bg-[#00A6B4]/10 rounded-[12px] border border-[#00A6B4]/20">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-[#00A6B4]" />
              <span className="text-sm font-medium">
                {lt('enterZipToSeeLocal', 'Enter your ZIP code for local resources')}
              </span>
            </div>
            <form onSubmit={handleZipSubmit} className="flex gap-2">
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={5}
                placeholder={lt('zipCode', 'ZIP code')}
                value={tempZip}
                onChange={(e) => setTempZip(e.target.value.replace(/\D/g, ''))}
                className="flex-1 h-10"
              />
              <Button
                type="submit"
                disabled={tempZip.length !== 5}
                className="h-10 px-4 bg-[#00A6B4] hover:bg-[#00A6B4]/90"
              >
                {lt('find', 'Find')}
              </Button>
            </form>
            <p className="text-[10px] text-muted-foreground mt-2">
              {lt('storedOnDevice', 'Stored only on this device')}
            </p>
          </div>
        )}

        {/* Local hotlines */}
        {hotlinesToShow.map((hotline) => (
          <a
            key={hotline.id}
            href={`tel:${hotline.phone.replace(/\D/g, '')}`}
            className="block p-4 rounded-[12px] border-2 border-[#DC2626]/30 bg-[#DC2626]/5 hover:bg-[#DC2626]/10 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {(hotline.type === 'local' || hotline.type === 'state') && (
                    <span className="px-2 py-0.5 bg-[#00A6B4]/10 text-[#00A6B4] text-[10px] font-semibold rounded-full">
                      {lt('local', 'LOCAL')}
                    </span>
                  )}
                  {hotline.hours === '24/7' && (
                    <span className="px-2 py-0.5 bg-[#84CC16]/10 text-[#84CC16] text-[10px] font-semibold rounded-full">
                      24/7
                    </span>
                  )}
                </div>
                <p className="font-semibold">{getName(hotline)}</p>
                <p className="text-sm text-muted-foreground">{getDescription(hotline)}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {hotline.hours}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {hotline.languages.slice(0, 3).join(', ').toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-xl font-bold text-[#DC2626]">
                  <Phone className="h-5 w-5" />
                  {hotline.phone}
                </div>
              </div>
            </div>
          </a>
        ))}

        {/* Link to all hotlines */}
        {zip && (
          <Link
            href="/hotlines"
            className="inline-flex items-center text-xs text-[#00A6B4] hover:underline font-semibold"
          >
            {lt('viewAllHotlines', 'View all hotlines')}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        )}
      </div>
    )
  }

  // Prominent variant - for home page and resources
  if (variant === 'prominent') {
    const hotline = hotlinesToShow[0]
    if (!hotline) return null

    return (
      <div className={`card-glass p-4 ${className}`}>
        {/* Header with ZIP */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#00A6B4]" />
            <span className="text-sm font-medium">
              {lt('yourLocalHotline', 'Your Local Hotline')}
            </span>
            {(hotline.type === 'local' || hotline.type === 'state') && (
              <span className="px-2 py-0.5 bg-[#00A6B4]/10 text-[#00A6B4] text-[10px] font-semibold rounded-full">
                {lt('personalized', 'PERSONALIZED')}
              </span>
            )}
          </div>
          {zip && showZipInput && (
            <button
              onClick={() => setShowInput(!showInput)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ZIP: {zip} ({lt('change', 'change')})
            </button>
          )}
        </div>

        {/* ZIP input */}
        {showInput && (
          <form onSubmit={handleZipSubmit} className="flex gap-2 mb-3">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={5}
              placeholder={lt('zipCode', 'ZIP code')}
              value={tempZip}
              onChange={(e) => setTempZip(e.target.value.replace(/\D/g, ''))}
              className="flex-1 h-9"
            />
            <Button type="submit" disabled={tempZip.length !== 5} size="sm">
              {lt('update', 'Update')}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowInput(false)}>
              <X className="h-4 w-4" />
            </Button>
          </form>
        )}

        {/* No ZIP set - prompt */}
        {!zip && showZipInput && (
          <form onSubmit={handleZipSubmit} className="flex gap-2 mb-3">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={5}
              placeholder={lt('zipCode', 'ZIP code')}
              value={tempZip}
              onChange={(e) => setTempZip(e.target.value.replace(/\D/g, ''))}
              className="flex-1 h-9"
            />
            <Button type="submit" disabled={tempZip.length !== 5} size="sm" className="bg-[#00A6B4] hover:bg-[#00A6B4]/90">
              {lt('find', 'Find')}
            </Button>
          </form>
        )}

        {/* Hotline card */}
        <a
          href={`tel:${hotline.phone.replace(/\D/g, '')}`}
          className="flex items-center justify-between p-3 rounded-[12px] bg-[#DC2626] hover:bg-[#DC2626]/90 text-white transition-colors"
        >
          <div className="flex items-center gap-3">
            <Phone className="h-6 w-6" />
            <div>
              <p className="font-semibold text-sm">{getName(hotline)}</p>
              <p className="text-xs text-white/80">{hotline.hours}</p>
            </div>
          </div>
          <span className="font-bold">{hotline.phone}</span>
        </a>

        {/* Additional hotlines if showing more than 1 */}
        {hotlinesToShow.slice(1).map((h) => (
          <a
            key={h.id}
            href={`tel:${h.phone.replace(/\D/g, '')}`}
            className="flex items-center justify-between p-3 mt-2 rounded-[12px] border hover:bg-accent transition-colors"
          >
            <div>
              <p className="font-medium text-sm">{getName(h)}</p>
              <p className="text-xs text-muted-foreground">{h.hours}</p>
            </div>
            <span className="font-bold text-[#DC2626]">{h.phone}</span>
          </a>
        ))}

        <Link
          href="/hotlines"
          className="inline-flex items-center text-xs text-[#00A6B4] hover:underline mt-3 font-semibold"
        >
          {lt('viewAllHotlines', 'View all hotlines')}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    )
  }

  // Compact variant - for inline use
  const hotline = hotlinesToShow[0]
  if (!hotline) return null

  return (
    <a
      href={`tel:${hotline.phone.replace(/\D/g, '')}`}
      className={`flex items-center justify-between p-3 rounded-[8px] border hover:bg-accent transition-colors ${className}`}
    >
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-[#DC2626]" />
        <div>
          <p className="font-medium text-sm">{getName(hotline)}</p>
          {(hotline.type === 'local' || hotline.type === 'state') && (
            <span className="text-[10px] text-[#00A6B4]">
              {lt('yourLocalHotline', 'Your local hotline')}
            </span>
          )}
        </div>
      </div>
      <span className="font-bold text-sm text-[#DC2626]">{hotline.phone}</span>
    </a>
  )
}
