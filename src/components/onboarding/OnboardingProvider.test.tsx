import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, renderHook } from '@testing-library/react'
import { OnboardingProvider, useOnboarding } from './OnboardingProvider'

const ONBOARDING_KEY = 'icewhistle-onboarding-complete'

vi.mock('./OnboardingScreen', () => ({
  OnboardingScreen: ({ onComplete }: { onComplete: () => void }) => (
    <div>
      <p>Welcome</p>
      <button onClick={onComplete}>Finish</button>
    </div>
  ),
}))

beforeEach(() => localStorage.clear())
afterEach(() => vi.clearAllMocks())

describe('OnboardingProvider', () => {
  it('shows onboarding to a first time visitor', async () => {
    render(
      <OnboardingProvider>
        <p>App</p>
      </OnboardingProvider>
    )

    await waitFor(() => expect(screen.getByText('Welcome')).toBeInTheDocument())
  })

  it('hides the app until onboarding is done', async () => {
    render(
      <OnboardingProvider>
        <p>App</p>
      </OnboardingProvider>
    )

    await waitFor(() => expect(screen.getByText('Welcome')).toBeInTheDocument())
    expect(screen.queryByText('App')).not.toBeInTheDocument()
  })

  it('shows the app to a returning visitor', async () => {
    localStorage.setItem(ONBOARDING_KEY, 'true')

    render(
      <OnboardingProvider>
        <p>App</p>
      </OnboardingProvider>
    )

    await waitFor(() => expect(screen.getByText('App')).toBeInTheDocument())
  })

  it('does not re-show onboarding to a returning visitor', async () => {
    localStorage.setItem(ONBOARDING_KEY, 'true')

    render(
      <OnboardingProvider>
        <p>App</p>
      </OnboardingProvider>
    )

    await waitFor(() => expect(screen.getByText('App')).toBeInTheDocument())
    expect(screen.queryByText('Welcome')).not.toBeInTheDocument()
  })

  it('treats any value other than "true" as incomplete', async () => {
    localStorage.setItem(ONBOARDING_KEY, 'false')

    render(
      <OnboardingProvider>
        <p>App</p>
      </OnboardingProvider>
    )

    await waitFor(() => expect(screen.getByText('Welcome')).toBeInTheDocument())
  })

  it('reveals the app once onboarding completes', async () => {
    const { default: userEvent } = await import('@testing-library/user-event')
    render(
      <OnboardingProvider>
        <p>App</p>
      </OnboardingProvider>
    )
    await waitFor(() => expect(screen.getByText('Welcome')).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: 'Finish' }))

    await waitFor(() => expect(screen.getByText('App')).toBeInTheDocument())
  })

  it('remembers completion across sessions', async () => {
    const { default: userEvent } = await import('@testing-library/user-event')
    render(
      <OnboardingProvider>
        <p>App</p>
      </OnboardingProvider>
    )
    await waitFor(() => expect(screen.getByText('Welcome')).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: 'Finish' }))

    await waitFor(() => expect(localStorage.getItem(ONBOARDING_KEY)).toBe('true'))
  })
})

describe('useOnboarding', () => {
  it('assumes onboarding is done outside a provider, so the app still renders', () => {
    const { result } = renderHook(() => useOnboarding())

    expect(result.current.isOnboardingComplete).toBe(true)
  })

  it('does not throw when reset is called outside a provider', () => {
    const { result } = renderHook(() => useOnboarding())

    expect(() => result.current.resetOnboarding()).not.toThrow()
  })
})
