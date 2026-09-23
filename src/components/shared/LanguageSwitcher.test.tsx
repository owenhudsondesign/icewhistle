import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useUserStore } from '@/stores/userStore'
import { locales, localeNames } from '@/lib/i18n'

const select = () => screen.getByRole('combobox', { name: /select language/i })

beforeEach(() => {
  useUserStore.getState().updatePreferences({ language: 'en' })
})

describe('LanguageSwitcher', () => {
  it('exposes a labelled language control', () => {
    render(<LanguageSwitcher />)

    expect(select()).toBeInTheDocument()
  })

  it('offers every supported locale', () => {
    render(<LanguageSwitcher />)

    expect(screen.getAllByRole('option')).toHaveLength(locales.length)
  })

  it('names each locale in its own language', () => {
    render(<LanguageSwitcher />)

    expect(screen.getByRole('option', { name: localeNames.es })).toBeInTheDocument()
  })

  it('reflects the stored preference', () => {
    useUserStore.getState().updatePreferences({ language: 'es' })

    render(<LanguageSwitcher />)

    expect(select()).toHaveValue('es')
  })

  it('updates the preference when a language is chosen', async () => {
    render(<LanguageSwitcher />)

    await userEvent.selectOptions(select(), 'es')

    expect(useUserStore.getState().preferences.language).toBe('es')
  })

  it('can switch back to English', async () => {
    useUserStore.getState().updatePreferences({ language: 'es' })
    render(<LanguageSwitcher />)

    await userEvent.selectOptions(select(), 'en')

    expect(useUserStore.getState().preferences.language).toBe('en')
  })
})
