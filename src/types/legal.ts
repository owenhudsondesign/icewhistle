export type OrganizationType = 'attorney' | 'legal_aid' | 'bond_fund' | 'advocacy'

export type CaseType =
  | 'asylum'
  | 'daca'
  | 'detention'
  | 'deportation_defense'
  | 'family_petition'
  | 'work_visa'
  | 'citizenship'
  | 'general'

export type SituationType =
  | 'detained'
  | 'facing_deportation'
  | 'status_question'
  | 'family_separation'
  | 'work_authorization'
  | 'other'

export type UrgencyLevel = 'immediate' | 'within_week' | 'not_urgent'

export interface LegalResource {
  id: string
  name: string
  organizationType: OrganizationType
  jurisdictions: string[]
  languages: string[]
  caseTypes: CaseType[]
  website?: string
  phone?: string
  email?: string
  intakeUrl?: string
  acceptingCases: boolean
  proBonoAvailable: boolean
  createdAt: Date
  updatedAt: Date
  verifiedAt?: Date
}

export interface LegalIntake {
  situationType: SituationType
  urgency: UrgencyLevel
  location: {
    state: string
    county?: string
  }
  language: string
  hasLegalRepresentation: boolean
  canAffordAttorney?: boolean
  additionalInfo?: string
}

export interface LegalMatch {
  resource: LegalResource
  score: number
  matchReasons: string[]
}
