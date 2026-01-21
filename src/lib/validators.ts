import { z } from 'zod'

// Alert types
export const alertTypeSchema = z.enum([
  'ice_raid',
  'ice_checkpoint',
  'ice_vehicle',
  'ice_transit',
  'ice_workplace',
  'ice_residence',
  'unconfirmed',
  'all_clear',
])

export const alertStatusSchema = z.enum([
  'unverified',
  'verified',
  'disputed',
  'resolved',
  'expired',
])

// Alert submission schema
export const alertSubmissionSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  alertType: alertTypeSchema,
  address: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  occurredAt: z.string().datetime().optional(),
})

export type AlertSubmission = z.infer<typeof alertSubmissionSchema>

// Contact schema (for emergency plans)
export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().min(10).max(20).optional(),
  email: z.string().email().optional(),
  relationship: z.string().max(50).optional(),
  notes: z.string().max(500).optional(),
})

export type Contact = z.infer<typeof contactSchema>

// Trusted contact with access level
export const trustedContactSchema = contactSchema.extend({
  accessLevel: z.enum(['emergency_only', 'full_access']),
  role: z.string().max(100).optional(), // "childcare", "legal_contact", etc.
})

export type TrustedContact = z.infer<typeof trustedContactSchema>

// Emergency plan schema
export const emergencyPlanSchema = z.object({
  childcare: z.object({
    authorizedPickups: z.array(contactSchema).optional(),
    schoolInfo: z.array(z.object({
      name: z.string(),
      phone: z.string().optional(),
      address: z.string().optional(),
      childName: z.string().optional(),
    })).optional(),
    medicalAuth: z.string().max(1000).optional(),
  }).optional(),
  powerOfAttorney: z.object({
    designee: contactSchema.optional(),
    documentRef: z.string().optional(),
  }).optional(),
  finances: z.object({
    accountAccess: z.string().max(1000).optional(),
    billPayInfo: z.string().max(1000).optional(),
  }).optional(),
  pets: z.object({
    careInstructions: z.string().max(1000).optional(),
    vetInfo: contactSchema.optional(),
    authorizedCaretaker: contactSchema.optional(),
  }).optional(),
  employer: z.object({
    notifyOnEmergency: z.boolean().optional(),
    contactInfo: contactSchema.optional(),
    notificationMessage: z.string().max(500).optional(),
  }).optional(),
  trustedContacts: z.array(trustedContactSchema).optional(),
  additionalNotes: z.string().max(2000).optional(),
})

export type EmergencyPlan = z.infer<typeof emergencyPlanSchema>

// Legal resource query schema
export const legalResourceQuerySchema = z.object({
  jurisdiction: z.string().optional(),
  caseType: z.string().optional(),
  language: z.string().optional(),
  proBonoOnly: z.boolean().optional(),
})

export type LegalResourceQuery = z.infer<typeof legalResourceQuerySchema>

// Legal intake form schema
export const legalIntakeSchema = z.object({
  situationType: z.enum([
    'detained',
    'facing_deportation',
    'status_question',
    'family_separation',
    'work_authorization',
    'other',
  ]),
  urgency: z.enum(['immediate', 'within_week', 'not_urgent']),
  location: z.object({
    state: z.string().length(2),
    county: z.string().optional(),
  }),
  language: z.string(),
  hasLegalRepresentation: z.boolean(),
  canAffordAttorney: z.boolean().optional(),
  additionalInfo: z.string().max(1000).optional(),
})

export type LegalIntake = z.infer<typeof legalIntakeSchema>

// Panic button configuration
export const panicConfigSchema = z.object({
  enabled: z.boolean(),
  contacts: z.array(z.object({
    name: z.string(),
    phone: z.string(),
  })).max(5),
  customMessage: z.string().max(200).optional(),
  includeLocation: z.boolean().default(true),
})

export type PanicConfig = z.infer<typeof panicConfigSchema>

// User preferences schema
export const userPreferencesSchema = z.object({
  language: z.string().default('en'),
  notifications: z.object({
    alertsEnabled: z.boolean().default(false),
    alertRadius: z.number().min(1).max(50).default(10), // miles
    pushEnabled: z.boolean().default(false),
    smsEnabled: z.boolean().default(false),
  }).optional(),
  accessibility: z.object({
    highContrast: z.boolean().default(false),
    largeText: z.boolean().default(false),
    reducedMotion: z.boolean().default(false),
  }).optional(),
})

export type UserPreferences = z.infer<typeof userPreferencesSchema>
