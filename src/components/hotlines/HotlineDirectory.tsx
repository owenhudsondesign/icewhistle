'use client'

import { useState } from 'react'
import { Phone, Globe, Clock, MapPin, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { useUserZip } from '@/hooks/use-user-zip'
import { useLanguage } from '@/hooks/use-language'
import { getHotlinesForZip, Hotline } from '@/data/hotlines'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface HotlineCardProps {
  hotline: Hotline
  language: string
}

function HotlineCard({ hotline, language }: HotlineCardProps) {
  const name = language === 'es' && hotline.nameEs ? hotline.nameEs : hotline.name
  const description = language === 'es' && hotline.descriptionEs ? hotline.descriptionEs : hotline.description

  return (
    <div className="card-glass p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-tight">{name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        {hotline.type === 'national' && (
          <span className="px-2 py-0.5 bg-[#00A6B4]/10 text-[#00A6B4] text-[10px] font-semibold rounded-full whitespace-nowrap">
            National
          </span>
        )}
      </div>

      {/* Call Button - Prominent */}
      <a
        href={`tel:${hotline.phone.replace(/\D/g, '')}`}
        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#DC2626] hover:bg-[#DC2626]/90 text-white rounded-[8px] font-semibold press-scale"
      >
        <Phone className="h-5 w-5" />
        <span>{hotline.phone}</span>
      </a>

      {/* Details */}
      <div className="flex flex-wrap gap-2 text-[10px]">
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full">
          <Clock className="h-3 w-3" />
          {hotline.hours}
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full">
          <Globe className="h-3 w-3" />
          {hotline.languages.slice(0, 3).join(', ').toUpperCase()}
          {hotline.languages.length > 3 && ` +${hotline.languages.length - 3}`}
        </span>
      </div>

      {/* Website Link */}
      {hotline.website && (
        <a
          href={hotline.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-[#00A6B4] hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          Website
        </a>
      )}
    </div>
  )
}

interface HotlineDirectoryProps {
  showZipInput?: boolean
  maxItems?: number
  className?: string
}

export function HotlineDirectory({ showZipInput = true, maxItems, className = '' }: HotlineDirectoryProps) {
  const { zip, updateZip, mounted } = useUserZip()
  const { language, t } = useLanguage()
  const [tempZip, setTempZip] = useState('')
  const [showAll, setShowAll] = useState(false)

  const hotlines = getHotlinesForZip(zip)
  const displayHotlines = maxItems && !showAll ? hotlines.slice(0, maxItems) : hotlines
  const hasMore = maxItems && hotlines.length > maxItems

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleaned = tempZip.replace(/\D/g, '').slice(0, 5)
    if (cleaned.length === 5) {
      updateZip(cleaned)
      setTempZip('')
    }
  }

  if (!mounted) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="h-32 bg-muted/50 animate-pulse rounded-[12px]" />
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* ZIP Input */}
      {showZipInput && (
        <div className="card-glass p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-[#00A6B4]" />
            <span className="text-sm font-medium">
              {language === 'es' ? 'Tu ubicación' : 'Your Location'}
            </span>
          </div>

          {zip ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {language === 'es' ? 'Código postal' : 'ZIP Code'}: <strong>{zip}</strong>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateZip(null)}
                className="text-xs h-8"
              >
                {language === 'es' ? 'Cambiar' : 'Change'}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleZipSubmit} className="flex gap-2">
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={5}
                placeholder={language === 'es' ? 'Ingresa código postal' : 'Enter ZIP code'}
                value={tempZip}
                onChange={(e) => setTempZip(e.target.value.replace(/\D/g, ''))}
                className="flex-1 h-10"
              />
              <Button
                type="submit"
                disabled={tempZip.length !== 5}
                className="h-10 px-4 bg-[#00A6B4] hover:bg-[#00A6B4]/90"
              >
                {language === 'es' ? 'Buscar' : 'Find'}
              </Button>
            </form>
          )}

          <p className="text-[10px] text-muted-foreground mt-2">
            {language === 'es'
              ? 'Tu código postal se guarda solo en este dispositivo'
              : 'Your ZIP is stored only on this device'}
          </p>
        </div>
      )}

      {/* Hotline List */}
      <div className="space-y-3">
        {displayHotlines.map((hotline) => (
          <HotlineCard key={hotline.id} hotline={hotline} language={language} />
        ))}
      </div>

      {/* Show More / Less */}
      {hasMore && (
        <Button
          variant="ghost"
          onClick={() => setShowAll(!showAll)}
          className="w-full h-10 text-sm"
        >
          {showAll ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              {language === 'es' ? 'Mostrar menos' : 'Show less'}
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              {language === 'es' ? `Ver ${hotlines.length - maxItems} más` : `Show ${hotlines.length - maxItems} more`}
            </>
          )}
        </Button>
      )}

      {/* Empty State */}
      {hotlines.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Phone className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">
            {language === 'es'
              ? 'Ingresa tu código postal para ver líneas locales'
              : 'Enter your ZIP code to see local hotlines'}
          </p>
        </div>
      )}
    </div>
  )
}
