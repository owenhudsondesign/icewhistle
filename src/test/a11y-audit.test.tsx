import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { auditComponent } from './a11y'
import { AppHeader } from '@/components/shared/AppHeader'
import { ZipPromptCard } from '@/components/shared/ZipPromptCard'
import { HotlineDirectory } from '@/components/hotlines/HotlineDirectory'
import { EmergencyContactsManager } from '@/components/emergency-contacts/EmergencyContactsManager'
import { SearchBox } from '@/components/search/SearchBox'
import { FAQChat } from '@/components/faq/FAQChat'
import { CameraSelector } from '@/components/recording/CameraSelector'
import { MultiZipInput } from '@/components/onboarding/MultiZipInput'
import { LegalDisclaimer } from '@/components/shared/LegalDisclaimer'
import { LanguageSelector } from '@/components/shared/LanguageSelector'
import { Modal } from '@/components/ui/modal'
import { waitFor } from '@testing-library/react'

vi.mock('@/hooks/use-pwa-install', () => ({
  usePWAInstall: () => ({
    canInstall: true,
    isIOS: false,
    isInstalled: false,
    installState: 'available',
    promptInstall: vi.fn(),
  }),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn() }),
}))

beforeEach(() => {
  localStorage.clear()
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as unknown as typeof window.matchMedia
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, json: async () => ({ flags: {} }) })
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

describe('accessibility audits', () => {
  it('AppHeader has no violations', async () => {
    const { container } = render(<AppHeader />)

    await auditComponent(container)
  })

  it('ZipPromptCard has no violations', async () => {
    const { container } = render(
      <ZipPromptCard onSubmit={vi.fn()} />
    )

    await auditComponent(container)
  })

  it('HotlineDirectory has no violations', async () => {
    const { container } = render(<HotlineDirectory />)

    await waitFor(() => expect(container.querySelector('a[href^="tel:"]')).toBeTruthy())
    await auditComponent(container)
  })

  it('EmergencyContactsManager has no violations', async () => {
    const { container } = render(<EmergencyContactsManager />)

    await waitFor(() => expect(container.querySelector('button')).toBeTruthy())
    await auditComponent(container)
  })

  it('SearchBox has no violations', async () => {
    const { container } = render(<SearchBox />)

    await auditComponent(container)
  })

  it('FAQChat has no violations', async () => {
    const { container } = render(<FAQChat />)

    await auditComponent(container)
  })

  it('CameraSelector has no violations', async () => {
    const { container } = render(
      <CameraSelector selectedMode="back" onSelect={vi.fn()} />
    )

    await auditComponent(container)
  })

  it('MultiZipInput has no violations', async () => {
    const { container } = render(
      <MultiZipInput value={[{ zipCode: '', label: 'home' }]} onChange={vi.fn()} />
    )

    await auditComponent(container)
  })

  it('LegalDisclaimer has no violations', async () => {
    const { container } = render(<LegalDisclaimer variant="full" />)

    await auditComponent(container)
  })

  it('LanguageSelector has no violations', async () => {
    const { container } = render(<LanguageSelector />)

    await auditComponent(container)
  })

  it('an open Modal has no violations', async () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="Install on iPhone">
        <p>Instructions</p>
      </Modal>
    )

    const dialog = document.querySelector('[role="dialog"]')!.parentElement!

    await auditComponent(dialog)
  })
})
