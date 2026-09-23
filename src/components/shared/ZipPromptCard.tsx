'use client'

import { useId, useState } from 'react'
import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/hooks/use-language'

const ZIP_LENGTH = 5

/**
 * English wording used only if a key is missing from the active locale file,
 * so the card always has readable text rather than a blank control.
 */
const FALLBACK = {
  heading: 'Enter your ZIP code for local resources',
  placeholder: 'ZIP code',
  submit: 'Find',
  privacy: 'Stored only on this device',
  incomplete: 'Enter all 5 digits.',
}

interface ZipPromptCardProps {
  /** Called with a validated 5-digit ZIP. */
  onSubmit: (zip: string) => void
}

/**
 * Compact ZIP capture. Kept as its own component so it can be placed above the
 * fold: buried inside the hotlines section it reached almost no one, which left
 * every ZIP-localized hotline and resource undelivered.
 *
 * Copy comes from the active locale rather than a hardcoded pair of languages,
 * so it reads correctly in all twenty-odd languages the app ships.
 */
export function ZipPromptCard({ onSubmit }: ZipPromptCardProps) {
  const { t } = useLanguage()
  const [value, setValue] = useState('')
  const inputId = useId()
  const hintId = useId()

  const local = (t.local ?? {}) as Record<string, string>
  const copy = {
    heading: local.enterZipToSeeLocal || FALLBACK.heading,
    placeholder: local.zipCode || FALLBACK.placeholder,
    submit: local.find || FALLBACK.submit,
    privacy: local.storedOnDevice || FALLBACK.privacy,
    incomplete: FALLBACK.incomplete,
  }

  const isValid = value.length === ZIP_LENGTH
  const isIncomplete = value.length > 0 && !isValid

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    onSubmit(value)
    setValue('')
  }

  return (
    <div className="p-3 mb-4 rounded-[12px] bg-[#00A6B4]/10 border border-[#00A6B4]/20">
      <label
        htmlFor={inputId}
        className="text-xs font-medium mb-2 flex items-center gap-1"
      >
        <MapPin className="h-3 w-3 text-[#00A6B4] flex-shrink-0" aria-hidden="true" />
        <span className="break-words">{copy.heading}</span>
      </label>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          id={inputId}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="postal-code"
          maxLength={ZIP_LENGTH}
          placeholder={copy.placeholder}
          value={value}
          aria-describedby={hintId}
          aria-invalid={isIncomplete}
          onChange={(e) =>
            setValue(e.target.value.replace(/\D/g, '').slice(0, ZIP_LENGTH))
          }
          className="flex-1 h-11 text-sm"
        />
        <Button
          type="submit"
          disabled={!isValid}
          size="sm"
          className="h-11 px-4 bg-[#00A6B4] hover:bg-[#00A6B4]/90"
        >
          {copy.submit}
        </Button>
      </form>
      {/* Announced as the field's description, so the requirement and the
          privacy promise both reach a screen reader rather than only the eye. */}
      <p id={hintId} className="text-[9px] text-muted-foreground mt-1">
        <span aria-live="polite">{isIncomplete ? `${copy.incomplete} ` : ''}</span>
        {copy.privacy}
      </p>
    </div>
  )
}

export default ZipPromptCard
