import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AccessibilityControls } from './AccessibilityControls'
import { useUserStore } from '@/stores/userStore'

const control = (name: RegExp) => screen.getByRole('button', { name })

beforeEach(() => {
  useUserStore.getState().updateAccessibilitySettings({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
  })
})

describe('AccessibilityControls', () => {
  it('offers all three accommodations', () => {
    render(<AccessibilityControls />)

    expect(control(/high contrast/i)).toBeInTheDocument()
    expect(control(/large text/i)).toBeInTheDocument()
    expect(control(/reduced motion/i)).toBeInTheDocument()
  })

  it.each([/high contrast/i, /large text/i, /reduced motion/i])(
    'reports %s as off by default',
    (name) => {
    render(<AccessibilityControls />)

      expect(control(name)).toHaveAttribute('aria-pressed', 'false')
    }
  )

  it('turns high contrast on', async () => {
    render(<AccessibilityControls />)

    await userEvent.click(control(/high contrast/i))

    expect(useUserStore.getState().preferences.accessibility.highContrast).toBe(true)
  })

  it('turns large text on', async () => {
    render(<AccessibilityControls />)

    await userEvent.click(control(/large text/i))

    expect(useUserStore.getState().preferences.accessibility.largeText).toBe(true)
  })

  it('turns reduced motion on', async () => {
    render(<AccessibilityControls />)

    await userEvent.click(control(/reduced motion/i))

    expect(useUserStore.getState().preferences.accessibility.reducedMotion).toBe(true)
  })

  it('reflects the new state to assistive technology', async () => {
    render(<AccessibilityControls />)

    await userEvent.click(control(/high contrast/i))

    expect(control(/high contrast/i)).toHaveAttribute('aria-pressed', 'true')
  })

  it('toggles back off', async () => {
    render(<AccessibilityControls />)

    await userEvent.click(control(/large text/i))
    await userEvent.click(control(/large text/i))

    expect(useUserStore.getState().preferences.accessibility.largeText).toBe(false)
  })

  it('leaves the other settings alone when one is toggled', async () => {
    render(<AccessibilityControls />)

    await userEvent.click(control(/high contrast/i))

    const { accessibility } = useUserStore.getState().preferences

    expect(accessibility.largeText).toBe(false)
    expect(accessibility.reducedMotion).toBe(false)
  })
})
