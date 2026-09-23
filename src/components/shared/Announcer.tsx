'use client'

import { useEffect, useState } from 'react'

interface AnnouncerProps {
  /** The message to announce. Announced again whenever it changes. */
  message: string
  /**
   * `assertive` interrupts the screen reader and is for things the user must
   * know immediately, such as a recording starting or an alert being sent.
   * `polite` waits for a pause and suits status text.
   */
  politeness?: 'polite' | 'assertive'
}

/**
 * Announces a message to screen readers without showing anything on screen.
 *
 * State changes in this app - a recording starting, connectivity dropping, an
 * alert going out - are currently conveyed only by a colour or an icon, which
 * a screen reader user never receives. This puts that information into the
 * accessibility tree.
 */
export function Announcer({ message, politeness = 'polite' }: AnnouncerProps) {
  const [announced, setAnnounced] = useState('')

  useEffect(() => {
    if (!message) {
      setAnnounced('')
      return
    }

    // A live region is only read when its contents change after it is present,
    // so clear first and set on the next tick.
    setAnnounced('')
    const timer = setTimeout(() => setAnnounced(message), 50)
    return () => clearTimeout(timer)
  }, [message])

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {announced}
    </div>
  )
}

export default Announcer
