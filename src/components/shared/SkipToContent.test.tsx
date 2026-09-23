import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SkipToContent } from './SkipToContent'

describe('SkipToContent', () => {
  it('links to the main content landmark', () => {
    render(<SkipToContent />)

    expect(screen.getByRole('link')).toHaveAttribute('href', '#main-content')
  })

  it('names itself clearly by default', () => {
    render(<SkipToContent />)

    expect(screen.getByRole('link', { name: /skip to main content/i })).toBeInTheDocument()
  })

  it('accepts a translated label', () => {
    render(<SkipToContent label="Saltar al contenido" />)

    expect(screen.getByRole('link', { name: 'Saltar al contenido' })).toBeInTheDocument()
  })

  it('uses the skip-link styling, which hides it until focused', () => {
    render(<SkipToContent />)

    expect(screen.getByRole('link')).toHaveClass('skip-link')
  })

  it('is reachable with the keyboard', async () => {
    render(<SkipToContent />)

    await userEvent.tab()

    expect(screen.getByRole('link')).toHaveFocus()
  })
})
