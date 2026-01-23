'use client'

import { Button } from '@/components/ui/button'
import { Camera, FlipHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CameraMode } from '@/stores/recordingStore'

interface CameraSelectorProps {
  selectedMode: CameraMode
  onSelect: (mode: CameraMode) => void
  className?: string
  translations?: {
    front: string
    back: string
    frontDesc: string
    backDesc: string
  }
}

const defaultTranslations = {
  front: 'Front Camera',
  back: 'Back Camera',
  frontDesc: 'Record yourself',
  backDesc: 'Record your surroundings',
}

export function CameraSelector({
  selectedMode,
  onSelect,
  className,
  translations = defaultTranslations,
}: CameraSelectorProps) {
  const options: { mode: CameraMode; icon: typeof Camera; label: string; desc: string }[] = [
    {
      mode: 'back',
      icon: Camera,
      label: translations.back,
      desc: translations.backDesc,
    },
    {
      mode: 'front',
      icon: FlipHorizontal,
      label: translations.front,
      desc: translations.frontDesc,
    },
  ]

  return (
    <div className={cn('grid grid-cols-1 gap-2', className)}>
      {options.map((option) => {
        const Icon = option.icon
        const isSelected = selectedMode === option.mode

        return (
          <button
            key={option.mode}
            onClick={() => onSelect(option.mode)}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border-2 transition-all',
              'text-left',
              isSelected
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-accent/50'
            )}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center',
                isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{option.label}</div>
              <div className="text-sm text-muted-foreground">{option.desc}</div>
            </div>
            {isSelected && (
              <div className="w-2 h-2 rounded-full bg-primary" />
            )}
          </button>
        )
      })}
    </div>
  )
}

// Compact horizontal version
export function CameraSelectorCompact({
  selectedMode,
  onSelect,
  className,
}: Omit<CameraSelectorProps, 'translations'>) {
  const options: { mode: CameraMode; icon: typeof Camera; label: string }[] = [
    { mode: 'back', icon: Camera, label: 'Back' },
    { mode: 'front', icon: FlipHorizontal, label: 'Front' },
  ]

  return (
    <div className={cn('flex gap-2', className)}>
      {options.map((option) => {
        const Icon = option.icon
        const isSelected = selectedMode === option.mode

        return (
          <Button
            key={option.mode}
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelect(option.mode)}
            className="flex-1"
          >
            <Icon className="h-4 w-4 mr-1" />
            {option.label}
          </Button>
        )
      })}
    </div>
  )
}
