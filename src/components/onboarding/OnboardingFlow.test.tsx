import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OnboardingFlow } from './OnboardingFlow'

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}))

const next = () => screen.getByRole('button', { name: /continue|continuar/i })
const finish = () => screen.getByRole('button', { name: /get started|comenzar/i })

const advance = async (times: number) => {
  const user = userEvent.setup()
  for (let i = 0; i < times; i++) {
    await user.click(next())
  }
}

beforeEach(() => localStorage.clear())
afterEach(() => vi.clearAllMocks())

describe('progress', () => {
  it('starts on the first of four steps', () => {
    render(<OnboardingFlow onComplete={vi.fn()} onSkip={vi.fn()} />)

    expect(screen.getByText(/step 1/i)).toBeInTheDocument()
    expect(screen.getByText(/4/)).toBeInTheDocument()
  })

  it('advances to the next step', async () => {
    render(<OnboardingFlow onComplete={vi.fn()} onSkip={vi.fn()} />)

    await advance(1)

    expect(screen.getByText(/step 2/i)).toBeInTheDocument()
  })

  it('goes back to the previous step', async () => {
    const user = userEvent.setup()
    render(<OnboardingFlow onComplete={vi.fn()} onSkip={vi.fn()} />)
    await advance(1)

    await user.click(screen.getByRole('button', { name: /back|atrás/i }))

    expect(screen.getByText(/step 1/i)).toBeInTheDocument()
  })

  it('offers no back button on the first step', () => {
    render(<OnboardingFlow onComplete={vi.fn()} onSkip={vi.fn()} />)

    expect(screen.queryByRole('button', { name: /^back$/i })).not.toBeInTheDocument()
  })

  it('reaches the final step', async () => {
    render(<OnboardingFlow onComplete={vi.fn()} onSkip={vi.fn()} />)

    await advance(3)

    expect(screen.getByText(/step 4/i)).toBeInTheDocument()
  })
})

describe('ZIP validation', () => {
  it('disables Continue while the ZIP is incomplete', async () => {
    const user = userEvent.setup()
    render(<OnboardingFlow onComplete={vi.fn()} onSkip={vi.fn()} />)
    await advance(1)

    await user.type(screen.getByLabelText(/primary area/i), '021')

    expect(next()).toBeDisabled()
  })

  it('re-enables Continue once the ZIP is complete', async () => {
    const user = userEvent.setup()
    render(<OnboardingFlow onComplete={vi.fn()} onSkip={vi.fn()} />)
    await advance(1)

    await user.type(screen.getByLabelText(/primary area/i), '02139')

    expect(next()).toBeEnabled()
  })

  it('leaves Continue enabled when no ZIP is entered, since it is optional', async () => {
    render(<OnboardingFlow onComplete={vi.fn()} onSkip={vi.fn()} />)
    await advance(1)

    expect(next()).toBeEnabled()
  })

  it('stays on the ZIP step when the ZIP is invalid', async () => {
    const user = userEvent.setup()
    render(<OnboardingFlow onComplete={vi.fn()} onSkip={vi.fn()} />)
    await advance(1)

    await user.type(screen.getByLabelText(/primary area/i), '021')
    await user.click(next())

    expect(screen.getByText(/step 2/i)).toBeInTheDocument()
  })

  it('lets a partial ZIP be skipped past', async () => {
    const user = userEvent.setup()
    render(<OnboardingFlow onComplete={vi.fn()} onSkip={vi.fn()} />)
    await advance(1)
    await user.type(screen.getByLabelText(/primary area/i), '021')

    await user.click(screen.getByRole('button', { name: /skip for now/i }))

    expect(screen.getByText(/step 3/i)).toBeInTheDocument()
  })

  it('accepts a complete ZIP', async () => {
    const user = userEvent.setup()
    render(<OnboardingFlow onComplete={vi.fn()} onSkip={vi.fn()} />)
    await advance(1)

    await user.type(screen.getByLabelText(/primary area/i), '02139')
    await user.click(next())

    expect(screen.getByText(/step 3/i)).toBeInTheDocument()
  })

  it('allows skipping the ZIP entirely', async () => {
    render(<OnboardingFlow onComplete={vi.fn()} onSkip={vi.fn()} />)
    await advance(1)

    await advance(1)

    expect(screen.getByText(/step 3/i)).toBeInTheDocument()
  })
})

describe('completion', () => {
  it('reports the collected settings', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<OnboardingFlow onComplete={onComplete} onSkip={vi.fn()} />)
    await advance(1)
    await user.type(screen.getByLabelText(/primary area/i), '02139')
    await advance(2)

    await user.click(finish())

    await waitFor(() =>
      expect(onComplete).toHaveBeenCalledWith(
        expect.objectContaining({ zip: '02139', language: 'en' })
      )
    )
  })

  it('reports an empty ZIP when it was skipped', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<OnboardingFlow onComplete={onComplete} onSkip={vi.fn()} />)
    await advance(3)

    await user.click(finish())

    await waitFor(() =>
      expect(onComplete).toHaveBeenCalledWith(expect.objectContaining({ zip: '' }))
    )
  })

  it('excludes incomplete ZIP entries from the saved list', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<OnboardingFlow onComplete={onComplete} onSkip={vi.fn()} />)
    await advance(3)

    await user.click(finish())

    await waitFor(() =>
      expect(onComplete.mock.calls[0][0].zipEntries).toEqual([])
    )
  })

  it('defaults community alerts to off', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<OnboardingFlow onComplete={onComplete} onSkip={vi.fn()} />)
    await advance(3)

    await user.click(finish())

    await waitFor(() =>
      expect(onComplete).toHaveBeenCalledWith(
        expect.objectContaining({ alertsEnabled: false })
      )
    )
  })
})

describe('skipping', () => {
  it('offers a way out of onboarding', () => {
    render(<OnboardingFlow onComplete={vi.fn()} onSkip={vi.fn()} />)

    expect(screen.getByRole('button', { name: /skip/i })).toBeInTheDocument()
  })

  it('reports a skip', async () => {
    const user = userEvent.setup()
    const onSkip = vi.fn()
    render(<OnboardingFlow onComplete={vi.fn()} onSkip={onSkip} />)

    await user.click(screen.getByRole('button', { name: /skip/i }))

    expect(onSkip).toHaveBeenCalledTimes(1)
  })
})
