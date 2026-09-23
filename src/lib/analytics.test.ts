import { describe, it, expect, vi } from 'vitest'
import { track } from '@vercel/analytics'
import {
  trackEmergencyButtonClick,
  trackPwaInstallAvailable,
  trackPwaInstalled,
  trackPwaInstallPromptResponse,
  trackPwaSessionStandalone,
  trackIosInstallHintShown,
} from './analytics'

const mockTrack = vi.mocked(track)

describe('trackEmergencyButtonClick', () => {
  it('distinguishes the three home screen entry points', () => {
    trackEmergencyButtonClick('near')
    trackEmergencyButtonClick('vehicle')
    trackEmergencyButtonClick('taken')

    const entryPoints = mockTrack.mock.calls
      .filter(([name]) => name === 'emergency_button_click')
      .map(([, props]) => props?.entry_point)

    expect(entryPoints).toEqual(['near', 'vehicle', 'taken'])
  })

  it('only reports the legacy event for the ICE near me button', () => {
    trackEmergencyButtonClick('vehicle')
    trackEmergencyButtonClick('taken')

    expect(mockTrack).not.toHaveBeenCalledWith('emergency_ice_near_me_click')
  })

  it('keeps the legacy event firing for near, so the existing series continues', () => {
    trackEmergencyButtonClick('near')

    expect(mockTrack).toHaveBeenCalledWith('emergency_ice_near_me_click')
  })
})

describe('PWA install events', () => {
  it('reports availability once per session however often the browser re-fires', () => {
    trackPwaInstallAvailable()
    trackPwaInstallAvailable()
    trackPwaInstallAvailable()

    expect(mockTrack).toHaveBeenCalledExactlyOnceWith('pwa_install_available')
  })

  it('counts a completed install once per device', () => {
    trackPwaInstalled()
    trackPwaInstalled()

    expect(mockTrack).toHaveBeenCalledExactlyOnceWith('pwa_installed')
  })

  it('reports a standalone session once, tagged with the platform', () => {
    trackPwaSessionStandalone('ios')
    trackPwaSessionStandalone('ios')

    expect(mockTrack).toHaveBeenCalledExactlyOnceWith('pwa_session_standalone', {
      platform: 'ios',
    })
  })

  it('tags the prompt response with both platform and outcome', () => {
    trackPwaInstallPromptResponse('dismissed')

    expect(mockTrack).toHaveBeenCalledWith('pwa_install_prompt_response', {
      platform: 'native',
      outcome: 'dismissed',
    })
  })

  it('separates the iOS install hint from the native prompt', () => {
    trackIosInstallHintShown()

    expect(mockTrack).toHaveBeenCalledWith('pwa_install_prompt_shown', {
      platform: 'ios',
    })
  })
})
