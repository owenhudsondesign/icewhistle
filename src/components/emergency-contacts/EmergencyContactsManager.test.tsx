import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmergencyContactsManager } from './EmergencyContactsManager'

const mockLanguage = vi.fn().mockReturnValue('en')

vi.mock('@/hooks/use-language', () => ({
  useLanguage: () => ({ language: mockLanguage(), t: { nav: {} } }),
}))

const addButton = () => screen.getByRole('button', { name: /add contact|agregar contacto/i })
const saveButton = () => screen.getByRole('button', { name: /^save$|^guardar$/i })
const nameField = () => screen.getByPlaceholderText(/Mom, Lawyer/i)
const phoneField = () => screen.getByPlaceholderText(/555/i)

const addContact = async (name: string, phone: string) => {
  const user = userEvent.setup()
  await user.click(addButton())
  await user.type(nameField(), name)
  await user.type(phoneField(), phone)
  await user.click(saveButton())
}

beforeEach(() => {
  localStorage.clear()
  mockLanguage.mockReturnValue('en')
})

afterEach(() => vi.clearAllMocks())

describe('empty state', () => {
  it('explains there are no contacts yet', async () => {
    render(<EmergencyContactsManager />)

    await waitFor(() => expect(screen.getByText(/no emergency contacts yet/i)).toBeInTheDocument())
  })

  it('offers to add one', async () => {
    render(<EmergencyContactsManager />)

    await waitFor(() => expect(addButton()).toBeInTheDocument())
  })

  it('states that contacts never leave the device', async () => {
    render(<EmergencyContactsManager />)

    await waitFor(() =>
      expect(screen.getByText(/stored only on your device/i)).toBeInTheDocument()
    )
  })
})

describe('adding a contact', () => {
  it('opens a form', async () => {
    render(<EmergencyContactsManager />)
    await waitFor(() => expect(addButton()).toBeInTheDocument())

    await userEvent.click(addButton())

    expect(nameField()).toBeInTheDocument()
  })

  it('saves a valid contact', async () => {
    render(<EmergencyContactsManager />)
    await waitFor(() => expect(addButton()).toBeInTheDocument())

    await addContact('Rosa', '5551234567')

    await waitFor(() => expect(screen.getByText('Rosa')).toBeInTheDocument())
  })

  it('formats the saved phone number for display', async () => {
    render(<EmergencyContactsManager />)
    await waitFor(() => expect(addButton()).toBeInTheDocument())

    await addContact('Rosa', '5551234567')

    await waitFor(() => expect(screen.getByText('(555) 123-4567')).toBeInTheDocument())
  })

  it('explains that a name is required', async () => {
    render(<EmergencyContactsManager />)
    await waitFor(() => expect(addButton()).toBeInTheDocument())
    await userEvent.click(addButton())

    await userEvent.type(phoneField(), '5551234567')
    await userEvent.click(saveButton())

    expect(screen.getByRole('alert')).toHaveTextContent(/please enter a name/i)
  })

  it('ties the error to the field for screen readers', async () => {
    render(<EmergencyContactsManager />)
    await waitFor(() => expect(addButton()).toBeInTheDocument())
    await userEvent.click(addButton())

    await userEvent.type(phoneField(), '5551234567')
    await userEvent.click(saveButton())

    expect(nameField()).toHaveAttribute('aria-invalid', 'true')
    expect(nameField()).toHaveAccessibleDescription(/please enter a name/i)
  })

  it('does not save a contact with no name', async () => {
    render(<EmergencyContactsManager />)
    await waitFor(() => expect(addButton()).toBeInTheDocument())
    await userEvent.click(addButton())

    await userEvent.type(phoneField(), '5551234567')
    await userEvent.click(saveButton())

    expect(localStorage.getItem('icewhistle-emergency-contacts')).not.toContain(
      '5551234567'
    )
  })

  it('rejects an invalid phone number', async () => {
    render(<EmergencyContactsManager />)
    await waitFor(() => expect(addButton()).toBeInTheDocument())
    await userEvent.click(addButton())

    await userEvent.type(nameField(), 'Rosa')
    await userEvent.type(phoneField(), '555')
    await userEvent.click(saveButton())

    expect(screen.getByText(/valid phone number/i)).toBeInTheDocument()
  })

  it('persists the contact across reloads', async () => {
    render(<EmergencyContactsManager />)
    await waitFor(() => expect(addButton()).toBeInTheDocument())

    await addContact('Rosa', '5551234567')

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('icewhistle-emergency-contacts')!)
      expect(stored.contacts[0].name).toBe('Rosa')
    })
  })

  it('can be cancelled', async () => {
    render(<EmergencyContactsManager />)
    await waitFor(() => expect(addButton()).toBeInTheDocument())
    await userEvent.click(addButton())

    await userEvent.click(screen.getByRole('button', { name: /^cancel$/i }))

    expect(screen.queryByPlaceholderText(/Mom, Lawyer/i)).not.toBeInTheDocument()
  })
})

describe('managing existing contacts', () => {
  const withContact = async () => {
    render(<EmergencyContactsManager />)
    await waitFor(() => expect(addButton()).toBeInTheDocument())
    await addContact('Rosa', '5551234567')
    await waitFor(() => expect(screen.getByText('Rosa')).toBeInTheDocument())
  }

  it('offers edit and delete for each contact', async () => {
    await withContact()

    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('removes a contact', async () => {
    await withContact()

    await userEvent.click(screen.getByRole('button', { name: /delete/i }))

    await waitFor(() => expect(screen.queryByText('Rosa')).not.toBeInTheDocument())
  })

  it('edits a contact', async () => {
    await withContact()

    await userEvent.click(screen.getByRole('button', { name: /edit/i }))
    await userEvent.clear(nameField())
    await userEvent.type(nameField(), 'Rosa M')
    await userEvent.click(saveButton())

    await waitFor(() => expect(screen.getByText('Rosa M')).toBeInTheDocument())
  })
})

describe('Spanish', () => {
  it('renders Spanish copy', async () => {
    mockLanguage.mockReturnValue('es')

    render(<EmergencyContactsManager />)

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /agregar contacto/i })).toBeInTheDocument()
    )
  })
})
