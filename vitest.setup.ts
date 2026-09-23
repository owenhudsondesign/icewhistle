import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

// Vercel Analytics posts to a real endpoint and warns loudly outside a Vercel
// deployment. Tests assert on what we ask it to send, not on the network call.
vi.mock('@vercel/analytics', () => ({ track: vi.fn() }))

// jsdom implements no layout, so scrollIntoView is missing entirely. Components
// that scroll a chat or list into view would otherwise throw on render.
Element.prototype.scrollIntoView = vi.fn()

beforeEach(() => {
  window.sessionStorage.clear()
  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
