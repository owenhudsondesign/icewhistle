'use client'

/**
 * A skip link, the first thing in the tab order.
 *
 * Every page here puts a header, a language switcher and a theme toggle before
 * the content. Without this, a keyboard or screen reader user tabs through all
 * of it on every page before reaching the emergency buttons, which is the one
 * thing they may be trying to reach in a hurry.
 *
 * It is visually hidden until focused.
 */
export function SkipToContent({ label = 'Skip to main content' }: { label?: string }) {
  return (
    <a
      href="#main-content"
      className="skip-link"
    >
      {label}
    </a>
  )
}

export default SkipToContent
