/**
 * Session-scoped de-duplication for analytics events.
 *
 * Some browser events (notably `beforeinstallprompt`) re-fire on every page
 * load, which inflates event counts and makes per-visitor rates unreadable.
 * These helpers make an event fire at most once per session (or once per
 * device) without ever storing anything identifying.
 */

const SESSION_PREFIX = 'iw_evt_session:'
const DEVICE_PREFIX = 'iw_evt_device:'

/**
 * Marks a key as seen and reports whether this is the first time.
 * Storage is best-effort: private browsing, blocked storage and SSR all
 * fall back to "first time", so an event is never silently lost.
 */
const claimKey = (storage: () => Storage, key: string): boolean => {
  if (typeof window === 'undefined') return false

  try {
    const store = storage()
    if (store.getItem(key) !== null) return false
    store.setItem(key, '1')
    return true
  } catch {
    // Storage unavailable (Safari private mode, blocked cookies). Allowing the
    // event through is the safer failure mode for a count we still want.
    return true
  }
}

/** Runs `fire` only the first time `name` is claimed in this browser session. */
export const oncePerSession = (name: string, fire: () => void): void => {
  if (claimKey(() => window.sessionStorage, `${SESSION_PREFIX}${name}`)) fire()
}

/** Runs `fire` only the first time `name` is claimed on this device. */
export const oncePerDevice = (name: string, fire: () => void): void => {
  if (claimKey(() => window.localStorage, `${DEVICE_PREFIX}${name}`)) fire()
}
