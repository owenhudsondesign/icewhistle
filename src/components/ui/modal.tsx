'use client'

import { useEffect, useId, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  /** Announced as the dialog's name. Required so the dialog is never unnamed. */
  title: string
  /** Hides the title visually while keeping it available to screen readers. */
  hideTitle?: boolean
  children: ReactNode
  className?: string
  /** Label for the close button, translated by the caller. */
  closeLabel?: string
  /** Set false for a flow the user must resolve rather than dismiss. */
  dismissible?: boolean
}

/**
 * A dialog with the semantics assistive technology needs: a `dialog` role, a
 * name, focus held inside while open, focus restored on close, Escape to
 * dismiss, and the page behind it hidden from the accessibility tree.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  hideTitle = false,
  children,
  className,
  closeLabel = 'Close',
  dismissible = true,
}: ModalProps) {
  const titleId = useId()
  const containerRef = useFocusTrap<HTMLDivElement>(isOpen)

  useEffect(() => {
    if (!isOpen || !dismissible) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, dismissible, onClose])

  // Stop the page behind the dialog scrolling under it on touch devices.
  useEffect(() => {
    if (!isOpen) return

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  if (!isOpen || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-start justify-center pb-4 px-4 overflow-y-auto"
      style={{ paddingTop: 'max(5rem, env(safe-area-inset-top, 5rem))' }}
      onClick={dismissible ? onClose : undefined}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'w-full max-w-sm bg-background rounded-2xl p-6 shadow-xl border border-border',
          className
        )}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2
            id={titleId}
            className={cn('text-lg font-semibold', hideTitle && 'sr-only')}
          >
            {title}
          </h2>
          {dismissible && (
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="-mt-1 -mr-1 h-11 w-11 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}

export default Modal
