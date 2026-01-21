'use client'

import { useUserStore } from '@/stores/userStore'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Sun, Moon, Pause } from 'lucide-react'

export function AccessibilityControls() {
  const { preferences, updateAccessibilitySettings } = useUserStore()
  const { highContrast, largeText, reducedMotion } = preferences.accessibility

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant={highContrast ? 'default' : 'outline'}
        size="sm"
        onClick={() => updateAccessibilitySettings({ highContrast: !highContrast })}
        aria-pressed={highContrast}
        aria-label="Toggle high contrast mode"
      >
        {highContrast ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        <span className="ml-2 hidden sm:inline">High Contrast</span>
      </Button>

      <Button
        variant={largeText ? 'default' : 'outline'}
        size="sm"
        onClick={() => updateAccessibilitySettings({ largeText: !largeText })}
        aria-pressed={largeText}
        aria-label="Toggle large text"
      >
        {largeText ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        <span className="ml-2 hidden sm:inline">Large Text</span>
      </Button>

      <Button
        variant={reducedMotion ? 'default' : 'outline'}
        size="sm"
        onClick={() => updateAccessibilitySettings({ reducedMotion: !reducedMotion })}
        aria-pressed={reducedMotion}
        aria-label="Toggle reduced motion"
      >
        <Pause className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">Reduce Motion</span>
      </Button>
    </div>
  )
}
