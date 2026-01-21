import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EmergencyPlan, TrustedContact } from '@/types/plan'

interface PlanState {
  plan: EmergencyPlan | null
  isLoading: boolean
  isSaving: boolean
  error: string | null
  lastSaved: number | null
  encryptionSalt: string | null
  hasUnsavedChanges: boolean
}

interface PlanActions {
  setPlan: (plan: EmergencyPlan) => void
  updatePlan: (updates: Partial<EmergencyPlan>) => void
  addTrustedContact: (contact: TrustedContact) => void
  removeTrustedContact: (index: number) => void
  updateTrustedContact: (index: number, updates: Partial<TrustedContact>) => void
  setLoading: (loading: boolean) => void
  setSaving: (saving: boolean) => void
  setError: (error: string | null) => void
  markSaved: () => void
  setEncryptionSalt: (salt: string) => void
  clearPlan: () => void
  reset: () => void
}

const initialPlan: EmergencyPlan = {
  childcare: {},
  powerOfAttorney: {},
  finances: {},
  pets: {},
  employer: {},
  trustedContacts: [],
  additionalNotes: '',
}

export const usePlanStore = create<PlanState & PlanActions>()(
  persist(
    (set, get) => ({
      // State
      plan: null,
      isLoading: false,
      isSaving: false,
      error: null,
      lastSaved: null,
      encryptionSalt: null,
      hasUnsavedChanges: false,

      // Actions
      setPlan: (plan) =>
        set({ plan, error: null, hasUnsavedChanges: false }),

      updatePlan: (updates) =>
        set((state) => ({
          plan: state.plan ? { ...state.plan, ...updates } : { ...initialPlan, ...updates },
          hasUnsavedChanges: true,
        })),

      addTrustedContact: (contact) =>
        set((state) => ({
          plan: {
            ...state.plan,
            trustedContacts: [...(state.plan?.trustedContacts || []), contact],
          },
          hasUnsavedChanges: true,
        })),

      removeTrustedContact: (index) =>
        set((state) => ({
          plan: {
            ...state.plan,
            trustedContacts: state.plan?.trustedContacts?.filter(
              (_, i) => i !== index
            ),
          },
          hasUnsavedChanges: true,
        })),

      updateTrustedContact: (index, updates) =>
        set((state) => ({
          plan: {
            ...state.plan,
            trustedContacts: state.plan?.trustedContacts?.map((contact, i) =>
              i === index ? { ...contact, ...updates } : contact
            ),
          },
          hasUnsavedChanges: true,
        })),

      setLoading: (isLoading) => set({ isLoading }),

      setSaving: (isSaving) => set({ isSaving }),

      setError: (error) => set({ error, isLoading: false, isSaving: false }),

      markSaved: () =>
        set({ lastSaved: Date.now(), hasUnsavedChanges: false, isSaving: false }),

      setEncryptionSalt: (salt) => set({ encryptionSalt: salt }),

      clearPlan: () =>
        set({
          plan: null,
          lastSaved: null,
          hasUnsavedChanges: false,
          error: null,
        }),

      reset: () =>
        set({
          plan: null,
          isLoading: false,
          isSaving: false,
          error: null,
          lastSaved: null,
          encryptionSalt: null,
          hasUnsavedChanges: false,
        }),
    }),
    {
      name: 'icewhistle-plan',
      partialize: (state) => ({
        encryptionSalt: state.encryptionSalt,
        lastSaved: state.lastSaved,
      }),
    }
  )
)

// Selectors
export const selectTrustedContacts = (state: PlanState): TrustedContact[] =>
  state.plan?.trustedContacts || []

export const selectEmergencyContacts = (state: PlanState): TrustedContact[] =>
  state.plan?.trustedContacts?.filter(
    (contact) => contact.accessLevel === 'emergency_only'
  ) || []

export const selectPlanCompleteness = (state: PlanState): number => {
  if (!state.plan) return 0

  let completed = 0
  let total = 6 // Total sections

  if (state.plan.trustedContacts && state.plan.trustedContacts.length > 0) completed++
  if (state.plan.childcare?.authorizedPickups?.length) completed++
  if (state.plan.powerOfAttorney?.designee) completed++
  if (state.plan.finances?.accountAccess) completed++
  if (state.plan.pets?.authorizedCaretaker) completed++
  if (state.plan.employer?.contactInfo) completed++

  return Math.round((completed / total) * 100)
}
