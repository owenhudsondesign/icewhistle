import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FAQChat } from './FAQChat'

const mockLanguage = vi.fn().mockReturnValue('en')

vi.mock('@/hooks/use-language', () => ({
  useLanguage: () => ({ language: mockLanguage(), t: { nav: {} } }),
}))

const askBox = () => screen.getByPlaceholderText(/ask a question|haz una pregunta/i)

const ask = async (question: string) => {
  const user = userEvent.setup()
  await user.type(askBox(), question)
  await user.keyboard('{Enter}')
}

beforeEach(() => mockLanguage.mockReturnValue('en'))
afterEach(() => vi.clearAllMocks())

describe('initial state', () => {
  it('offers a question box', () => {
    render(<FAQChat />)

    expect(askBox()).toBeInTheDocument()
  })

  it('suggests common questions to start from', () => {
    render(<FAQChat />)

    expect(screen.getByText(/common questions/i)).toBeInTheDocument()
  })

  it('starts with no conversation', () => {
    render(<FAQChat />)

    expect(screen.queryByText(/no results/i)).not.toBeInTheDocument()
  })
})

describe('asking a question', () => {
  it('echoes the question back as a message', async () => {
    render(<FAQChat />)

    await ask('What are my rights?')

    await waitFor(() => expect(screen.getByText('What are my rights?')).toBeInTheDocument())
  })

  it('clears the input after sending', async () => {
    render(<FAQChat />)

    await ask('warrant')

    await waitFor(() => expect(askBox()).toHaveValue(''))
  })

  it('answers with knowledge base results', async () => {
    render(<FAQChat />)

    await ask('warrant')

    await waitFor(
      () => expect(screen.getAllByRole('heading').length).toBeGreaterThan(0),
      { timeout: 3000 }
    )
  })

  it('says so when it has no answer', async () => {
    render(<FAQChat />)

    await ask('zzzqqqxxwv')

    await waitFor(() => expect(screen.getByText(/no results|couldn't find/i)).toBeInTheDocument(), {
      timeout: 3000,
    })
  })

  it('ignores an empty submission', async () => {
    const user = userEvent.setup()
    render(<FAQChat />)

    await user.click(askBox())
    await user.keyboard('{Enter}')

    expect(screen.getByText(/common questions/i)).toBeInTheDocument()
  })
})

describe('suggested questions', () => {
  it('asks a suggestion when it is clicked', async () => {
    const user = userEvent.setup()
    render(<FAQChat />)
    const suggestions = screen.getAllByRole('button')
    const first = suggestions.find((b) => (b.textContent || '').length > 15)!
    const text = first.textContent!

    await user.click(first)

    await waitFor(() => expect(screen.getByText(text)).toBeInTheDocument())
  })
})

describe('translations', () => {
  it('renders Spanish copy', () => {
    mockLanguage.mockReturnValue('es')

    render(<FAQChat />)

    expect(screen.getByPlaceholderText(/haz una pregunta/i)).toBeInTheDocument()
  })

  it('falls back to English for an unsupported language', () => {
    mockLanguage.mockReturnValue('zz')

    render(<FAQChat />)

    expect(screen.getByPlaceholderText(/ask a question/i)).toBeInTheDocument()
  })
})
