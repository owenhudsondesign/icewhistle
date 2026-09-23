import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './modal'

const open = (props = {}) => {
  const onClose = vi.fn()
  render(
    <Modal isOpen onClose={onClose} title="Install on iPhone" {...props}>
      <button>First</button>
      <button>Second</button>
    </Modal>
  )
  return { onClose }
}

describe('rendering', () => {
  it('renders nothing when closed', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Hidden">
        <p>Body</p>
      </Modal>
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('exposes the dialog role', () => {
    open()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('marks itself modal, so the page behind is ignored', () => {
    open()

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('is named by its title', () => {
    open()

    expect(screen.getByRole('dialog')).toHaveAccessibleName('Install on iPhone')
  })

  it('keeps the name available when the title is visually hidden', () => {
    open({ hideTitle: true })

    expect(screen.getByRole('dialog')).toHaveAccessibleName('Install on iPhone')
  })
})

describe('focus management', () => {
  it('moves focus to the dialog itself, so its name is announced', () => {
    open()

    expect(screen.getByRole('dialog')).toHaveFocus()
  })

  it('moves focus to the first control on Tab', async () => {
    open()

    await userEvent.tab()

    expect(screen.getByRole('button', { name: /close/i })).toHaveFocus()
  })

  it('returns focus to the opener on close', async () => {
    const Harness = () => {
      const [isOpen, setIsOpen] = (require('react') as typeof import('react')).useState(false)
      return (
        <>
          <button onClick={() => setIsOpen(true)}>Open</button>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Dialog">
            <button>Inside</button>
          </Modal>
        </>
      )
    }
    render(<Harness />)
    const opener = screen.getByRole('button', { name: 'Open' })

    await userEvent.click(opener)
    await userEvent.keyboard('{Escape}')

    expect(opener).toHaveFocus()
  })

  it('wraps focus forward at the end of the dialog', async () => {
    open()
    const last = screen.getByRole('button', { name: 'Second' })
    last.focus()

    await userEvent.tab()

    // Close is first in DOM order, so focus wraps round to it.
    expect(screen.getByRole('button', { name: /close/i })).toHaveFocus()
  })

  it('wraps focus backward at the start of the dialog', async () => {
    open()
    screen.getByRole('button', { name: /close/i }).focus()

    await userEvent.tab({ shift: true })

    expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus()
  })
})

describe('dismissal', () => {
  it('closes on Escape', async () => {
    const { onClose } = open()

    await userEvent.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes from the close button', async () => {
    const { onClose } = open()

    await userEvent.click(screen.getByRole('button', { name: /close/i }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('uses a translated close label', () => {
    open({ closeLabel: 'Cerrar' })

    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument()
  })

  it('does not close when the content itself is clicked', async () => {
    const { onClose } = open()

    await userEvent.click(screen.getByRole('button', { name: 'First' }))

    expect(onClose).not.toHaveBeenCalled()
  })

  it('offers no close button when not dismissible', () => {
    open({ dismissible: false })

    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
  })

  it('ignores Escape when not dismissible', async () => {
    const { onClose } = open({ dismissible: false })

    await userEvent.keyboard('{Escape}')

    expect(onClose).not.toHaveBeenCalled()
  })
})

describe('page behind the dialog', () => {
  it('locks background scrolling while open', () => {
    open()

    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores scrolling once closed', () => {
    const { unmount } = render(
      <Modal isOpen onClose={vi.fn()} title="Dialog">
        <p>Body</p>
      </Modal>
    )

    unmount()

    expect(document.body.style.overflow).not.toBe('hidden')
  })
})
