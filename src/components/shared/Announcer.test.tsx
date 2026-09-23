import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Announcer } from './Announcer'

describe('Announcer', () => {
  it('exposes a status role', () => {
    render(<Announcer message="Recording video" />)

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('announces the message', async () => {
    render(<Announcer message="Recording video" />)

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Recording video'))
  })

  it('is polite by default, so it waits for a pause', () => {
    render(<Announcer message="Saved" />)

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  it('can interrupt for urgent state', () => {
    render(<Announcer message="Recording" politeness="assertive" />)

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'assertive')
  })

  it('reads the whole message rather than only what changed', () => {
    render(<Announcer message="Recording paused" />)

    expect(screen.getByRole('status')).toHaveAttribute('aria-atomic', 'true')
  })

  it('stays out of the visual layout', () => {
    render(<Announcer message="Recording" />)

    expect(screen.getByRole('status')).toHaveClass('sr-only')
  })

  it('announces an updated message', async () => {
    const { rerender } = render(<Announcer message="Recording" />)
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Recording'))

    rerender(<Announcer message="Recording paused" />)

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Recording paused')
    )
  })

  it('announces nothing when there is no message', () => {
    render(<Announcer message="" />)

    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })
})
