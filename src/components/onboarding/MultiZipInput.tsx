'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Plus, X, Home, Briefcase, Users, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ZipEntry {
  zipCode: string
  label: string
}

interface MultiZipInputProps {
  value: ZipEntry[]
  onChange: (entries: ZipEntry[]) => void
  maxEntries?: number
  className?: string
  translations?: {
    primaryLabel: string
    primaryPlaceholder: string
    primaryHelp: string
    addAnother: string
    labelHome: string
    labelWork: string
    labelFamily: string
    labelOther: string
    remove: string
    optional: string
  }
}

const defaultTranslations = {
  primaryLabel: 'Your primary area',
  primaryPlaceholder: 'Enter ZIP code',
  primaryHelp: 'Get alerts for ICE activity near this location',
  addAnother: 'Add another location',
  labelHome: 'Home',
  labelWork: 'Work',
  labelFamily: 'Family',
  labelOther: 'Other',
  remove: 'Remove',
  optional: 'Optional',
}

const PRESET_LABELS = [
  { value: 'home', icon: Home },
  { value: 'work', icon: Briefcase },
  { value: 'family', icon: Users },
  { value: 'other', icon: MapPin },
]

export function MultiZipInput({
  value,
  onChange,
  maxEntries = 5,
  className,
  translations = defaultTranslations,
}: MultiZipInputProps) {
  const t = translations

  const validateZip = (zip: string): boolean => {
    return /^\d{5}$/.test(zip)
  }

  const handleZipChange = (index: number, zipCode: string) => {
    // Only allow digits, max 5
    const cleaned = zipCode.replace(/\D/g, '').slice(0, 5)
    const newEntries = [...value]
    newEntries[index] = { ...newEntries[index], zipCode: cleaned }
    onChange(newEntries)
  }

  const handleLabelChange = (index: number, label: string) => {
    const newEntries = [...value]
    newEntries[index] = { ...newEntries[index], label }
    onChange(newEntries)
  }

  const addEntry = () => {
    if (value.length < maxEntries) {
      // Suggest a label based on what's already used
      const usedLabels = value.map((e) => e.label.toLowerCase())
      let suggestedLabel = 'work'
      if (!usedLabels.includes('work')) suggestedLabel = 'work'
      else if (!usedLabels.includes('family')) suggestedLabel = 'family'
      else suggestedLabel = 'other'

      onChange([...value, { zipCode: '', label: suggestedLabel }])
    }
  }

  const removeEntry = (index: number) => {
    if (index === 0) return // Can't remove primary
    const newEntries = value.filter((_, i) => i !== index)
    onChange(newEntries)
  }

  const getLabelText = (label: string): string => {
    switch (label.toLowerCase()) {
      case 'home':
        return t.labelHome
      case 'work':
        return t.labelWork
      case 'family':
        return t.labelFamily
      default:
        return t.labelOther
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Primary ZIP (always shown, required) */}
      <div className="space-y-2">
        <Label htmlFor="zip-primary" className="flex items-center gap-2">
          <Home className="h-4 w-4 text-primary" />
          {t.primaryLabel}
        </Label>
        <Input
          id="zip-primary"
          type="text"
          inputMode="numeric"
          placeholder={t.primaryPlaceholder}
          value={value[0]?.zipCode || ''}
          onChange={(e) => handleZipChange(0, e.target.value)}
          className="text-center text-lg h-12"
          maxLength={5}
        />
        <p className="text-xs text-muted-foreground text-center">{t.primaryHelp}</p>
      </div>

      {/* Additional ZIP entries */}
      {value.slice(1).map((entry, idx) => {
        const index = idx + 1
        return (
          <div key={index} className="space-y-2 p-3 rounded-lg bg-muted/30 relative">
            <button
              type="button"
              onClick={() => removeEntry(index)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
              aria-label={t.remove}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex gap-2 pr-6">
              {/* Label selector */}
              <div className="flex gap-1">
                {PRESET_LABELS.map((preset) => {
                  const Icon = preset.icon
                  const isSelected = entry.label.toLowerCase() === preset.value
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => handleLabelChange(index, preset.value)}
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background hover:bg-accent'
                      )}
                      title={getLabelText(preset.value)}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium min-w-[60px]">
                {getLabelText(entry.label)}
              </span>
              <Input
                type="text"
                inputMode="numeric"
                placeholder={t.primaryPlaceholder}
                value={entry.zipCode}
                onChange={(e) => handleZipChange(index, e.target.value)}
                className="flex-1 text-center"
                maxLength={5}
              />
            </div>

            <p className="text-xs text-muted-foreground">{t.optional}</p>
          </div>
        )
      })}

      {/* Add another button */}
      {value.length < maxEntries && (
        <Button
          type="button"
          variant="outline"
          onClick={addEntry}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t.addAnother}
        </Button>
      )}
    </div>
  )
}
