export interface Contact {
  name: string
  phone?: string
  email?: string
  relationship?: string
  notes?: string
}

export interface TrustedContact extends Contact {
  accessLevel: 'emergency_only' | 'full_access'
  role?: string
}

export interface SchoolContact {
  name: string
  phone?: string
  address?: string
  childName?: string
}

export interface EmergencyPlan {
  childcare?: {
    authorizedPickups?: Contact[]
    schoolInfo?: SchoolContact[]
    medicalAuth?: string
  }
  powerOfAttorney?: {
    designee?: Contact
    documentRef?: string
  }
  finances?: {
    accountAccess?: string
    billPayInfo?: string
  }
  pets?: {
    careInstructions?: string
    vetInfo?: Contact
    authorizedCaretaker?: Contact
  }
  employer?: {
    notifyOnEmergency?: boolean
    contactInfo?: Contact
    notificationMessage?: string
  }
  trustedContacts?: TrustedContact[]
  additionalNotes?: string
}

export interface StoredPlan {
  id: string
  sessionId: string
  encryptedData: string
  encryptionNonce: string
  createdAt: Date
  updatedAt: Date
  lastReviewedAt?: Date
}

export interface PlanState {
  plan: EmergencyPlan | null
  isLoading: boolean
  isSaving: boolean
  error: string | null
  lastSaved: Date | null
}
