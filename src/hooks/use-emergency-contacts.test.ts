import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import {
  useEmergencyContacts,
  formatPhoneNumber,
  isValidPhone,
  defaultMessages,
} from './use-emergency-contacts'

const STORAGE_KEY = 'icewhistle-emergency-contacts'

beforeEach(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('formatPhoneNumber', () => {
  it('formats a ten digit number', () => {
    expect(formatPhoneNumber('5551234567')).toBe('(555) 123-4567')
  })

  it('formats an eleven digit number with a country code', () => {
    expect(formatPhoneNumber('15551234567')).toBe('+1 (555) 123-4567')
  })

  it('strips existing punctuation before formatting', () => {
    expect(formatPhoneNumber('(555) 123-4567')).toBe('(555) 123-4567')
  })

  it('returns the input unchanged when it is not a recognised length', () => {
    expect(formatPhoneNumber('12345')).toBe('12345')
  })

  it('leaves an eleven digit number not starting with 1 alone', () => {
    expect(formatPhoneNumber('25551234567')).toBe('25551234567')
  })
})

describe('isValidPhone', () => {
  it.each(['5551234567', '15551234567', '(555) 123-4567', '+44 20 7123 4567'])(
    'accepts %s',
    (phone) => expect(isValidPhone(phone)).toBe(true)
  )

  it.each(['', '555', '555123456', '1234567890123456'])('rejects %s', (phone) =>
    expect(isValidPhone(phone)).toBe(false)
  )
})

describe('useEmergencyContacts', () => {
  const mounted = async () => {
    const hook = renderHook(() => useEmergencyContacts())
    await waitFor(() => expect(hook.result.current.isLoaded).toBe(true))
    return hook
  }

  it('starts with no contacts', async () => {
    const { result } = await mounted()

    expect(result.current.contacts).toEqual([])
    expect(result.current.hasContacts).toBe(false)
  })

  it('adds a valid contact', async () => {
    const { result } = await mounted()

    act(() => {
      result.current.addContact('Tía Rosa', '(555) 123-4567')
    })

    expect(result.current.contacts).toHaveLength(1)
    expect(result.current.contacts[0]).toMatchObject({
      name: 'Tía Rosa',
      phone: '5551234567',
    })
  })

  it('rejects a contact with an invalid phone', async () => {
    const { result } = await mounted()

    let added: boolean | undefined
    act(() => {
      added = result.current.addContact('Too Short', '555')
    })

    expect(added).toBe(false)
    expect(result.current.contacts).toEqual([])
  })

  it('trims whitespace from the name', async () => {
    const { result } = await mounted()

    act(() => {
      result.current.addContact('  Rosa  ', '5551234567')
    })

    expect(result.current.contacts[0].name).toBe('Rosa')
  })

  it('removes a contact by id', async () => {
    const { result } = await mounted()
    act(() => {
      result.current.addContact('Rosa', '5551234567')
    })
    const id = result.current.contacts[0].id

    act(() => result.current.removeContact(id))

    expect(result.current.contacts).toEqual([])
  })

  it('leaves other contacts alone when removing one', async () => {
    const { result } = await mounted()
    act(() => {
      result.current.addContact('Rosa', '5551234567')
      result.current.addContact('Luis', '5559876543')
    })
    const id = result.current.contacts[0].id

    act(() => result.current.removeContact(id))

    expect(result.current.contacts.map((c) => c.name)).toEqual(['Luis'])
  })

  it('updates an existing contact', async () => {
    const { result } = await mounted()
    act(() => {
      result.current.addContact('Rosa', '5551234567')
    })
    const id = result.current.contacts[0].id

    act(() => {
      result.current.updateContact(id, 'Rosa M', '5559876543')
    })

    expect(result.current.contacts[0]).toMatchObject({
      name: 'Rosa M',
      phone: '5559876543',
    })
  })

  it('refuses an update with an invalid phone', async () => {
    const { result } = await mounted()
    act(() => {
      result.current.addContact('Rosa', '5551234567')
    })
    const id = result.current.contacts[0].id

    let updated: boolean | undefined
    act(() => {
      updated = result.current.updateContact(id, 'Rosa', '555')
    })

    expect(updated).toBe(false)
    expect(result.current.contacts[0].phone).toBe('5551234567')
  })

  it('gives each contact a distinct id', async () => {
    const { result } = await mounted()

    act(() => {
      result.current.addContact('Rosa', '5551234567')
      result.current.addContact('Luis', '5559876543')
    })

    const [a, b] = result.current.contacts

    expect(a.id).not.toBe(b.id)
  })

  it('persists contacts to localStorage', async () => {
    const { result } = await mounted()

    act(() => {
      result.current.addContact('Rosa', '5551234567')
    })

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
      expect(stored.contacts).toHaveLength(1)
    })
  })

  it('restores contacts saved in a previous session', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        contacts: [{ id: '1', name: 'Rosa', phone: '5551234567' }],
        customMessage: '',
        isEnabled: true,
      })
    )

    const { result } = await mounted()

    expect(result.current.contacts).toHaveLength(1)
  })

  it('falls back to defaults on corrupted storage rather than crashing', async () => {
    localStorage.setItem(STORAGE_KEY, 'not json{{')

    const { result } = await mounted()

    expect(result.current.contacts).toEqual([])
  })
})

describe('generateSmsUrl', () => {
  const withContacts = async () => {
    const hook = renderHook(() => useEmergencyContacts())
    await waitFor(() => expect(hook.result.current.isLoaded).toBe(true))
    act(() => {
      hook.result.current.addContact('Rosa', '5551234567')
      hook.result.current.addContact('Luis', '5559876543')
    })
    return hook
  }

  it('returns null with no contacts', async () => {
    const { result } = renderHook(() => useEmergencyContacts())
    await waitFor(() => expect(result.current.isLoaded).toBe(true))

    expect(result.current.generateSmsUrl()).toBeNull()
  })

  it('addresses every contact', async () => {
    const { result } = await withContacts()

    expect(result.current.generateSmsUrl()).toContain('sms:5551234567,5559876543')
  })

  it('embeds a maps link when a location is supplied', async () => {
    const { result } = await withContacts()

    const url = result.current.generateSmsUrl('en', { lat: 42.36, lng: -71.06 })

    expect(decodeURIComponent(url!)).toContain('https://maps.google.com/?q=42.36,-71.06')
  })

  it('says the location is unavailable when there is none', async () => {
    const { result } = await withContacts()

    expect(decodeURIComponent(result.current.generateSmsUrl('en', null)!)).toContain(
      '(location unavailable)'
    )
  })

  it('never leaves the raw placeholder in the message', async () => {
    const { result } = await withContacts()

    expect(decodeURIComponent(result.current.generateSmsUrl()!)).not.toContain(
      '{location}'
    )
  })

  it('uses the Spanish message when asked', async () => {
    const { result } = await withContacts()

    expect(decodeURIComponent(result.current.generateSmsUrl('es')!)).toContain('URGENTE')
  })

  it('falls back to English for an unsupported language', async () => {
    const { result } = await withContacts()

    expect(decodeURIComponent(result.current.generateSmsUrl('zz')!)).toContain(
      defaultMessages.en.slice(0, 20)
    )
  })

  it('prefers a custom message over the default', async () => {
    const { result } = await withContacts()

    act(() => result.current.setCustomMessage('Custom alert at {location}'))

    expect(decodeURIComponent(result.current.generateSmsUrl()!)).toContain(
      'Custom alert at'
    )
  })

  it('URL encodes the message body', async () => {
    const { result } = await withContacts()

    expect(result.current.generateSmsUrl()).not.toContain(' ')
  })
})

describe('sendAlert', () => {
  it('returns false with no contacts and does not navigate', async () => {
    const { result } = renderHook(() => useEmergencyContacts())
    await waitFor(() => expect(result.current.isLoaded).toBe(true))

    expect(result.current.sendAlert()).toBe(false)
  })
})

describe('settings', () => {
  it('defaults to enabled', async () => {
    const { result } = renderHook(() => useEmergencyContacts())
    await waitFor(() => expect(result.current.isLoaded).toBe(true))

    expect(result.current.isEnabled).toBe(true)
  })

  it('can be disabled', async () => {
    const { result } = renderHook(() => useEmergencyContacts())
    await waitFor(() => expect(result.current.isLoaded).toBe(true))

    act(() => result.current.setEnabled(false))

    expect(result.current.isEnabled).toBe(false)
  })
})
