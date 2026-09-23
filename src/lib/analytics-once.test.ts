import { describe, it, expect, vi } from 'vitest'
import { oncePerSession, oncePerDevice } from './analytics-once'

describe('oncePerSession', () => {
  it('fires the first time and not again', () => {
    const fire = vi.fn()

    oncePerSession('pwa_install_available', fire)
    oncePerSession('pwa_install_available', fire)
    oncePerSession('pwa_install_available', fire)

    expect(fire).toHaveBeenCalledTimes(1)
  })

  it('tracks each event name independently', () => {
    const available = vi.fn()
    const standalone = vi.fn()

    oncePerSession('pwa_install_available', available)
    oncePerSession('pwa_session_standalone', standalone)

    expect(available).toHaveBeenCalledTimes(1)
    expect(standalone).toHaveBeenCalledTimes(1)
  })

  it('fires again once the session is cleared', () => {
    const fire = vi.fn()

    oncePerSession('pwa_install_available', fire)
    window.sessionStorage.clear()
    oncePerSession('pwa_install_available', fire)

    expect(fire).toHaveBeenCalledTimes(2)
  })

  it('does not persist across sessions via localStorage', () => {
    oncePerSession('pwa_install_available', vi.fn())

    expect(window.localStorage.length).toBe(0)
  })

  it('fires when storage throws, so the count is never silently lost', () => {
    const fire = vi.fn()
    const getItem = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('storage disabled')
      })

    oncePerSession('pwa_install_available', fire)

    expect(fire).toHaveBeenCalledTimes(1)
    getItem.mockRestore()
  })
})

describe('oncePerDevice', () => {
  it('survives a session reset', () => {
    const fire = vi.fn()

    oncePerDevice('pwa_installed', fire)
    window.sessionStorage.clear()
    oncePerDevice('pwa_installed', fire)

    expect(fire).toHaveBeenCalledTimes(1)
  })

  it('does not collide with the session-scoped key of the same name', () => {
    const session = vi.fn()
    const device = vi.fn()

    oncePerSession('pwa_installed', session)
    oncePerDevice('pwa_installed', device)

    expect(session).toHaveBeenCalledTimes(1)
    expect(device).toHaveBeenCalledTimes(1)
  })
})
