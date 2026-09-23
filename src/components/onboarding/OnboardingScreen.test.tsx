import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OnboardingScreen } from './OnboardingScreen'

const setLanguage = vi.fn()
const setSavedLocation = vi.fn()
const geocodeZipCode = vi.fn()
const languageState = { language: 'en' }

vi.mock('@/hooks/use-language', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/hooks/use-language')>()
  return {
    ...actual,
    useLanguage: () => ({ ...languageState, setLanguage, mounted: true, t: { nav: {} } }),
  }
})

vi.mock('@/hooks/use-location', () => ({
  useLocation: () => ({ setSavedLocation }),
  geocodeZipCode: (zip: string) => geocodeZipCode(zip),
}))

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}))

const getStarted = () => screen.getByRole('button', { name: /get started|comenzar/i })
const skip = () => screen.getByRole('button', { name: /skip|saltar/i })
const zipField = () => screen.getByRole('textbox')

beforeEach(() => {
  languageState.language = 'en'
  geocodeZipCode.mockResolvedValue({ lat: 42.36, lng: -71.06, city: 'Cambridge' })
})

afterEach(() => vi.clearAllMocks())

describe('OnboardingScreen', () => {
  it('welcomes the visitor', () => {
    render(<OnboardingScreen onComplete={vi.fn()} />)

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('offers a way to continue', () => {
    render(<OnboardingScreen onComplete={vi.fn()} />)

    expect(getStarted()).toBeInTheDocument()
  })

  it('offers a way to skip, so nothing is required to use the app', () => {
    render(<OnboardingScreen onComplete={vi.fn()} />)

    expect(skip()).toBeInTheDocument()
  })

  it('completes immediately when skipped', async () => {
    const onComplete = vi.fn()
    render(<OnboardingScreen onComplete={onComplete} />)

    await userEvent.click(skip())

    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('saves no location when skipped', async () => {
    render(<OnboardingScreen onComplete={vi.fn()} />)

    await userEvent.click(skip())

    expect(setSavedLocation).not.toHaveBeenCalled()
  })
})

describe('language selection', () => {
  it('lets the visitor pick a language before anything else', async () => {
    render(<OnboardingScreen onComplete={vi.fn()} />)

    await userEvent.click(screen.getByText('Español'))

    expect(setLanguage).toHaveBeenCalledWith('es')
  })

  it('renders Spanish copy when Spanish is active', () => {
    languageState.language = 'es'

    render(<OnboardingScreen onComplete={vi.fn()} />)

    expect(screen.getByRole('button', { name: /comenzar/i })).toBeInTheDocument()
  })

  it('falls back to English for an unsupported language', () => {
    languageState.language = 'zz'

    render(<OnboardingScreen onComplete={vi.fn()} />)

    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument()
  })
})

describe('ZIP entry', () => {
  it('completes without a ZIP', async () => {
    const onComplete = vi.fn()
    render(<OnboardingScreen onComplete={onComplete} />)

    await userEvent.click(getStarted())

    await waitFor(() => expect(onComplete).toHaveBeenCalled())
  })

  it('does not geocode when no ZIP is entered', async () => {
    render(<OnboardingScreen onComplete={vi.fn()} />)

    await userEvent.click(getStarted())

    expect(geocodeZipCode).not.toHaveBeenCalled()
  })

  it('rejects a short ZIP with a message', async () => {
    render(<OnboardingScreen onComplete={vi.fn()} />)

    await userEvent.type(zipField(), '021')
    await userEvent.click(getStarted())

    expect(screen.getByText(/valid 5-digit ZIP/i)).toBeInTheDocument()
  })

  it('does not complete onboarding on an invalid ZIP', async () => {
    const onComplete = vi.fn()
    render(<OnboardingScreen onComplete={onComplete} />)

    await userEvent.type(zipField(), '021')
    await userEvent.click(getStarted())

    expect(onComplete).not.toHaveBeenCalled()
  })

  it('geocodes a valid ZIP', async () => {
    render(<OnboardingScreen onComplete={vi.fn()} />)

    await userEvent.type(zipField(), '02139')
    await userEvent.click(getStarted())

    await waitFor(() => expect(geocodeZipCode).toHaveBeenCalledWith('02139'))
  })

  it('saves the resolved location', async () => {
    render(<OnboardingScreen onComplete={vi.fn()} />)

    await userEvent.type(zipField(), '02139')
    await userEvent.click(getStarted())

    await waitFor(() =>
      expect(setSavedLocation).toHaveBeenCalledWith({
        zipCode: '02139',
        lat: 42.36,
        lng: -71.06,
        city: 'Cambridge',
      })
    )
  })

  it('completes even when the ZIP cannot be resolved', async () => {
    geocodeZipCode.mockResolvedValue(null)
    const onComplete = vi.fn()
    render(<OnboardingScreen onComplete={onComplete} />)

    await userEvent.type(zipField(), '02139')
    await userEvent.click(getStarted())

    await waitFor(() => expect(onComplete).toHaveBeenCalled())
  })

  it('saves nothing when the ZIP cannot be resolved', async () => {
    geocodeZipCode.mockResolvedValue(null)
    render(<OnboardingScreen onComplete={vi.fn()} />)

    await userEvent.type(zipField(), '02139')
    await userEvent.click(getStarted())

    await waitFor(() => expect(setSavedLocation).not.toHaveBeenCalled())
  })
})
