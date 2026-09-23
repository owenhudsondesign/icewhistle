import { describe, it, expect } from 'vitest'
import {
  alertSubmissionSchema,
  contactSchema,
  trustedContactSchema,
  emergencyPlanSchema,
  legalIntakeSchema,
  panicConfigSchema,
  userPreferencesSchema,
} from './validators'

describe('alertSubmissionSchema', () => {
  const valid = { latitude: 42.36, longitude: -71.06, alertType: 'ice_raid' as const }

  it('accepts a minimal valid submission', () => {
    expect(alertSubmissionSchema.safeParse(valid).success).toBe(true)
  })

  it.each([
    ['latitude above range', { ...valid, latitude: 90.1 }],
    ['latitude below range', { ...valid, latitude: -90.1 }],
    ['longitude above range', { ...valid, longitude: 180.1 }],
    ['longitude below range', { ...valid, longitude: -180.1 }],
  ])('rejects %s', (_label, input) => {
    expect(alertSubmissionSchema.safeParse(input).success).toBe(false)
  })

  it('accepts the exact boundary coordinates', () => {
    expect(
      alertSubmissionSchema.safeParse({ ...valid, latitude: 90, longitude: 180 }).success
    ).toBe(true)
  })

  it('rejects an unknown alert type', () => {
    expect(
      alertSubmissionSchema.safeParse({ ...valid, alertType: 'ice_cream' }).success
    ).toBe(false)
  })

  it('rejects a description beyond 500 characters', () => {
    expect(
      alertSubmissionSchema.safeParse({ ...valid, description: 'x'.repeat(501) }).success
    ).toBe(false)
  })

  it('accepts a description at exactly 500 characters', () => {
    expect(
      alertSubmissionSchema.safeParse({ ...valid, description: 'x'.repeat(500) }).success
    ).toBe(true)
  })

  it('rejects coordinates sent as strings', () => {
    expect(
      alertSubmissionSchema.safeParse({ ...valid, latitude: '42.36' }).success
    ).toBe(false)
  })

  it('rejects a non-datetime occurredAt', () => {
    expect(
      alertSubmissionSchema.safeParse({ ...valid, occurredAt: 'yesterday' }).success
    ).toBe(false)
  })
})

describe('contactSchema', () => {
  it('accepts a name-only contact', () => {
    expect(contactSchema.safeParse({ name: 'Tía Rosa' }).success).toBe(true)
  })

  it('rejects an empty name', () => {
    expect(contactSchema.safeParse({ name: '' }).success).toBe(false)
  })

  it('rejects a missing name', () => {
    expect(contactSchema.safeParse({ phone: '5551234567' }).success).toBe(false)
  })

  it('rejects a phone shorter than 10 characters', () => {
    expect(contactSchema.safeParse({ name: 'A', phone: '555123' }).success).toBe(false)
  })

  it('rejects a malformed email', () => {
    expect(contactSchema.safeParse({ name: 'A', email: 'not-an-email' }).success).toBe(
      false
    )
  })

  it('accepts a well formed email', () => {
    expect(
      contactSchema.safeParse({ name: 'A', email: 'help@example.org' }).success
    ).toBe(true)
  })
})

describe('trustedContactSchema', () => {
  it('requires an access level', () => {
    expect(trustedContactSchema.safeParse({ name: 'A' }).success).toBe(false)
  })

  it('rejects an access level outside the allowed set', () => {
    expect(
      trustedContactSchema.safeParse({ name: 'A', accessLevel: 'admin' }).success
    ).toBe(false)
  })

  it('accepts emergency_only', () => {
    expect(
      trustedContactSchema.safeParse({ name: 'A', accessLevel: 'emergency_only' }).success
    ).toBe(true)
  })
})

describe('emergencyPlanSchema', () => {
  it('accepts an entirely empty plan', () => {
    expect(emergencyPlanSchema.safeParse({}).success).toBe(true)
  })

  it('accepts a nested childcare plan', () => {
    const result = emergencyPlanSchema.safeParse({
      childcare: {
        authorizedPickups: [{ name: 'Tía Rosa', phone: '5551234567' }],
        schoolInfo: [{ name: 'PS 12', childName: 'Ana' }],
      },
    })

    expect(result.success).toBe(true)
  })

  it('rejects a nested contact that is itself invalid', () => {
    const result = emergencyPlanSchema.safeParse({
      childcare: { authorizedPickups: [{ name: '' }] },
    })

    expect(result.success).toBe(false)
  })

  it('rejects additionalNotes beyond 2000 characters', () => {
    expect(
      emergencyPlanSchema.safeParse({ additionalNotes: 'x'.repeat(2001) }).success
    ).toBe(false)
  })
})

describe('legalIntakeSchema', () => {
  const valid = {
    situationType: 'detained' as const,
    urgency: 'immediate' as const,
    location: { state: 'MA' },
    language: 'es',
    hasLegalRepresentation: false,
  }

  it('accepts a complete intake', () => {
    expect(legalIntakeSchema.safeParse(valid).success).toBe(true)
  })

  it('requires a two letter state code', () => {
    expect(
      legalIntakeSchema.safeParse({ ...valid, location: { state: 'Mass' } }).success
    ).toBe(false)
  })

  it('rejects an unknown urgency', () => {
    expect(legalIntakeSchema.safeParse({ ...valid, urgency: 'whenever' }).success).toBe(
      false
    )
  })

  it('requires the representation flag', () => {
    const { hasLegalRepresentation, ...withoutFlag } = valid

    expect(legalIntakeSchema.safeParse(withoutFlag).success).toBe(false)
  })
})

describe('panicConfigSchema', () => {
  const contact = { name: 'A', phone: '5551234567' }

  it('caps the contact list at five', () => {
    const result = panicConfigSchema.safeParse({
      enabled: true,
      contacts: Array.from({ length: 6 }, () => contact),
    })

    expect(result.success).toBe(false)
  })

  it('accepts exactly five contacts', () => {
    const result = panicConfigSchema.safeParse({
      enabled: true,
      contacts: Array.from({ length: 5 }, () => contact),
    })

    expect(result.success).toBe(true)
  })

  it('defaults includeLocation to true', () => {
    const result = panicConfigSchema.parse({ enabled: true, contacts: [contact] })

    expect(result.includeLocation).toBe(true)
  })

  it('honours an explicit includeLocation of false', () => {
    const result = panicConfigSchema.parse({
      enabled: true,
      contacts: [contact],
      includeLocation: false,
    })

    expect(result.includeLocation).toBe(false)
  })
})

describe('userPreferencesSchema', () => {
  it('defaults the language to English', () => {
    expect(userPreferencesSchema.parse({}).language).toBe('en')
  })

  it('rejects an alert radius above 50 miles', () => {
    const result = userPreferencesSchema.safeParse({
      notifications: { alertRadius: 51 },
    })

    expect(result.success).toBe(false)
  })

  it('applies notification defaults when the block is present but empty', () => {
    const result = userPreferencesSchema.parse({ notifications: {} })

    expect(result.notifications).toMatchObject({
      alertsEnabled: false,
      alertRadius: 10,
      pushEnabled: false,
    })
  })
})
