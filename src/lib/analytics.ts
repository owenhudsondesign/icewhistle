/**
 * Privacy-friendly analytics events for social proof metrics
 *
 * All events are aggregate only - no user identification or tracking.
 * Used to generate metrics like "10,000+ Know Your Rights pages viewed"
 *
 * View these in Vercel Analytics dashboard under "Custom Events"
 */

import { track } from '@vercel/analytics'
import { oncePerSession, oncePerDevice } from './analytics-once'

/** Which of the three emergency entry points on the home screen was tapped. */
export type EmergencyEntryPoint = 'near' | 'vehicle' | 'taken'

// ============================================
// EMERGENCY & CRISIS EVENTS
// ============================================

/**
 * User tapped one of the home screen emergency buttons.
 *
 * All three entry points previously reported as `emergency_ice_near_me_click`,
 * so that event conflated "ICE is near me", traffic stops and detentions.
 * The legacy event is still sent for the "near" button only, which keeps the
 * existing dashboard series continuous.
 */
export const trackEmergencyButtonClick = (entryPoint: EmergencyEntryPoint) => {
  track('emergency_button_click', { entry_point: entryPoint })

  if (entryPoint === 'near') {
    track('emergency_ice_near_me_click')
  }
}

/** User viewed the encounter guide (emergency page) */
export const trackEncounterGuideView = () => {
  track('encounter_guide_view')
}

/** User clicked to call a hotline */
export const trackHotlineCallClick = (hotlineType: 'local' | 'state' | 'national') => {
  track('hotline_call_click', { type: hotlineType })
}

/** User sent an alert to their emergency contacts */
export const trackEmergencyAlertSent = (contactCount: number) => {
  track('emergency_alert_sent', { contacts: Math.min(contactCount, 10) }) // Cap at 10 for privacy
}

/** User started recording during encounter */
export const trackRecordingStarted = (type: 'video' | 'audio') => {
  track('recording_started', { type })
}

/** User saved a recording */
export const trackRecordingSaved = () => {
  track('recording_saved')
}

// ============================================
// PWA INSTALL EVENTS
// ============================================

/**
 * The browser reported this visitor can install the app.
 *
 * `beforeinstallprompt` re-fires on every page load, so this is capped at once
 * per session to keep the event count readable as "eligible visitors".
 */
export const trackPwaInstallAvailable = () => {
  oncePerSession('pwa_install_available', () => track('pwa_install_available'))
}

/** Visitor is running the app from their home screen. Once per session. */
export const trackPwaSessionStandalone = (platform: 'ios' | 'android_or_desktop') => {
  oncePerSession('pwa_session_standalone', () =>
    track('pwa_session_standalone', { platform })
  )
}

/**
 * The browser confirmed an install. Capped per device because `appinstalled`
 * can fire more than once for a single install.
 */
export const trackPwaInstalled = () => {
  oncePerDevice('pwa_installed', () => track('pwa_installed'))
}

/** The native (Chrome/Android) install prompt was opened. */
export const trackPwaInstallPromptShown = () => {
  track('pwa_install_prompt_shown', { platform: 'native' })
}

/** The visitor accepted or dismissed the native install prompt. */
export const trackPwaInstallPromptResponse = (outcome: 'accepted' | 'dismissed') => {
  track('pwa_install_prompt_response', { platform: 'native', outcome })
}

/**
 * The iOS "Share -> Add to Home Screen" instructions were opened. iOS has no
 * install API, so these two events are the only visibility into that path.
 */
export const trackIosInstallHintShown = () => {
  track('pwa_install_prompt_shown', { platform: 'ios' })
}

/** The iOS instructions were closed. */
export const trackIosInstallHintDismissed = () => {
  track('pwa_install_prompt_response', { platform: 'ios', outcome: 'dismissed' })
}

// ============================================
// RIGHTS & EDUCATION EVENTS
// ============================================

/** User viewed Know Your Rights page */
export const trackRightsPageView = () => {
  track('rights_page_view')
}

/** User viewed a specific rights section */
export const trackRightsSectionView = (section: string) => {
  track('rights_section_view', { section })
}

/** User viewed warrant comparison (judicial vs ICE) */
export const trackWarrantInfoView = () => {
  track('warrant_info_view')
}

/** User viewed "What to Say" phrases */
export const trackWhatToSayView = () => {
  track('what_to_say_view')
}

// ============================================
// RESOURCES & HOTLINES EVENTS
// ============================================

/** User viewed hotlines directory */
export const trackHotlinesPageView = () => {
  track('hotlines_page_view')
}

/** User viewed resources page */
export const trackResourcesPageView = () => {
  track('resources_page_view')
}

/** User clicked external resource link */
export const trackExternalResourceClick = (resourceType: string) => {
  track('external_resource_click', { type: resourceType })
}

/** User downloaded/viewed Red Card */
export const trackRedCardView = () => {
  track('red_card_view')
}

// ============================================
// LOCALIZATION EVENTS
// ============================================

/** User entered ZIP code for local resources */
export const trackZipCodeEntered = () => {
  track('zip_code_entered') // Don't track the actual ZIP
}

/** User received local hotline results */
export const trackLocalHotlinesShown = (count: number) => {
  track('local_hotlines_shown', { count: Math.min(count, 10) })
}

/** User changed language */
export const trackLanguageChange = (language: string) => {
  track('language_change', { language })
}

// ============================================
// PREPARATION EVENTS
// ============================================

/** User viewed emergency contacts setup */
export const trackEmergencyContactsView = () => {
  track('emergency_contacts_view')
}

/** User added an emergency contact */
export const trackEmergencyContactAdded = () => {
  track('emergency_contact_added')
}

/** User completed emergency plan setup */
export const trackEmergencyPlanComplete = (contactCount: number) => {
  track('emergency_plan_complete', { contacts: Math.min(contactCount, 10) })
}

// ============================================
// SEARCH & FAQ EVENTS
// ============================================

/** User performed a search */
export const trackSearchPerformed = () => {
  track('search_performed') // Don't track actual query
}

/** User viewed FAQ/search results */
export const trackFaqView = (topic: string) => {
  track('faq_view', { topic })
}

// ============================================
// SHARING & COMMUNITY EVENTS
// ============================================

/** User shared the app */
export const trackAppShared = (method: 'link' | 'qr' | 'social') => {
  track('app_shared', { method })
}

/** User viewed about page */
export const trackAboutPageView = () => {
  track('about_page_view')
}

// ============================================
// ENGAGEMENT EVENTS
// ============================================

/** User completed onboarding */
export const trackOnboardingComplete = () => {
  track('onboarding_complete')
}

/** User returned to app (session start) */
export const trackSessionStart = (isInstalled: boolean) => {
  track('session_start', { installed: isInstalled })
}

/** Traffic stop flow viewed */
export const trackTrafficStopView = () => {
  track('traffic_stop_guide_view')
}

/** Someone taken flow viewed */
export const trackSomeoneTakenView = () => {
  track('someone_taken_guide_view')
}

/** ICE detainee locator clicked */
export const trackDetaineeLocatorClick = () => {
  track('detainee_locator_click')
}
