'use client'

import { useEffect, useRef } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Filters on semantics rather than layout. An `offsetParent` check would be the
 * usual way to skip hidden controls, but it depends on a layout engine, so it
 * excludes everything in a test environment and silently disables the trap.
 */
const focusableWithin = (root: HTMLElement): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('hidden') && el.getAttribute('aria-hidden') !== 'true'
  )

/**
 * Traps keyboard focus inside a container while it is active.
 *
 * Without this, tabbing out of an open dialog lands on the page behind it: the
 * dialog stays visible but the keyboard is somewhere else entirely, which is
 * disorienting for a sighted keyboard user and leaves a screen reader user with
 * no way to tell where they are. On close, focus returns to whatever opened the
 * dialog so the reading position is not lost.
 */
export function useFocusTrap<T extends HTMLElement>(active: boolean) {
  const containerRef = useRef<T | null>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return

    previouslyFocused.current = document.activeElement as HTMLElement | null

    // Focus the container itself rather than its first control, so a screen
    // reader announces the dialog's name and contents before the user starts
    // moving through it.
    containerRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const current = containerRef.current
      if (!current) return

      const focusables = focusableWithin(current)
      if (focusables.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const activeEl = document.activeElement

      if (event.shiftKey && (activeEl === first || !current.contains(activeEl))) {
        event.preventDefault()
        last.focus()
        return
      }

      if (!event.shiftKey && activeEl === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused.current?.focus?.()
    }
  }, [active])

  return containerRef
}
