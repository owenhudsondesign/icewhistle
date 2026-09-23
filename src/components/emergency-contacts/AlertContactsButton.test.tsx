import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AlertContactsButton } from './AlertContactsButton'

const mockLanguage = vi.fn().mockReturnValue('en')
const sendAlert = vi.fn().mockReturnValue(true)
const contactsState = {
  contacts: [{ id: '1', name: 'Rosa', phone: '5551234567' }],
  hasContacts: true,
  isLoaded: true,
  sendAlert,
}

vi.mock('@/hooks/use-language', () => ({
  useLanguage: () => ({ language: mockLanguage(), t: { nav: {} } }),
}))

vi.mock('@/hooks/use-emergency-contacts', () => ({
  useEmergencyContacts: () => contactsState,
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

const setContacts = (overrides: Partial<typeof contactsState>) =>
  Object.assign(contactsState, overrides)

/** Denies location so the component falls through to its no-location path. */
const denyLocation = () =>
  Object.defineProperty(navigator, 'geolocation', {
    value: {
      getCurrentPosition: vi.fn((_ok, fail) => fail?.(new Error('denied'))),
    },
    configurable: true,
  })

const allowLocation = () =>
  Object.defineProperty(navigator, 'geolocation', {
    value: {
      getCurrentPosition: vi.fn((ok) =>
        ok({ coords: { latitude: 42.36, longitude: -71.06 } })
      ),
    },
    configurable: true,
  })

beforeEach(() => {
  mockLanguage.mockReturnValue('en')
  setContacts({ hasContacts: true, isLoaded: true })
  denyLocation()
})

afterEach(() => vi.clearAllMocks())

describe('before contacts load', () => {
  it('renders nothing, to avoid flashing the wrong state', () => {
    setContacts({ isLoaded: false })

    const { container } = render(<AlertContactsButton />)

    expect(container).toBeEmptyDOMElement()
  })
})

describe('with no contacts', () => {
  beforeEach(() => setContacts({ hasContacts: false }))

  it('prompts the user to set contacts up', () => {
    render(<AlertContactsButton />)

    expect(screen.getByText(/set up emergency contacts/i)).toBeInTheDocument()
  })

  it('links to the contacts page', () => {
    render(<AlertContactsButton />)

    expect(screen.getByRole('link')).toHaveAttribute('href', '/emergency-contacts')
  })

  it('links to the contacts page in the compact variant too', () => {
    render(<AlertContactsButton variant="compact" />)

    expect(screen.getByRole('link')).toHaveAttribute('href', '/emergency-contacts')
  })
})

describe('with contacts', () => {
  it('offers to alert them', () => {
    render(<AlertContactsButton />)

    expect(screen.getByText(/alert my contacts/i)).toBeInTheDocument()
  })

  it('sends the alert when clicked', async () => {
    render(<AlertContactsButton />)

    await userEvent.click(screen.getByText(/alert my contacts/i))

    await waitFor(() => expect(sendAlert).toHaveBeenCalled())
  })

  it('sends in the reader\'s language', async () => {
    mockLanguage.mockReturnValue('es')
    render(<AlertContactsButton />)

    await userEvent.click(screen.getByText(/alertar mis contactos/i))

    await waitFor(() => expect(sendAlert.mock.calls[0][0]).toBe('es'))
  })

  it('still sends when location is denied', async () => {
    render(<AlertContactsButton />)

    await userEvent.click(screen.getByText(/alert my contacts/i))

    await waitFor(() => expect(sendAlert).toHaveBeenCalledWith('en', null))
  })

  it('includes location when it is available', async () => {
    allowLocation()
    render(<AlertContactsButton />)

    await userEvent.click(screen.getByText(/alert my contacts/i))

    await waitFor(() =>
      expect(sendAlert).toHaveBeenCalledWith('en', { lat: 42.36, lng: -71.06 })
    )
  })

  it('confirms once the alert is sent', async () => {
    render(<AlertContactsButton />)

    await userEvent.click(screen.getByText(/alert my contacts/i))

    await waitFor(() => expect(screen.getByText(/opening sms/i)).toBeInTheDocument())
  })
})

describe('Spanish', () => {
  it('renders Spanish copy', () => {
    mockLanguage.mockReturnValue('es')

    render(<AlertContactsButton />)

    expect(screen.getByText(/alertar mis contactos/i)).toBeInTheDocument()
  })

  it('falls back to English for an unsupported language', () => {
    mockLanguage.mockReturnValue('zz')

    render(<AlertContactsButton />)

    expect(screen.getByText(/alert my contacts/i)).toBeInTheDocument()
  })
})
