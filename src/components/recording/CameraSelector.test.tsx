import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CameraSelector } from './CameraSelector'

describe('CameraSelector', () => {
  it('offers both cameras', () => {
    render(<CameraSelector selectedMode="back" onSelect={vi.fn()} />)

    expect(screen.getByText('Back Camera')).toBeInTheDocument()
    expect(screen.getByText('Front Camera')).toBeInTheDocument()
  })

  it('lists the back camera first, since it faces the encounter', () => {
    render(<CameraSelector selectedMode="back" onSelect={vi.fn()} />)

    const labels = screen.getAllByRole('button').map((b) => b.textContent)

    expect(labels[0]).toContain('Back Camera')
  })

  it('explains what each camera records', () => {
    render(<CameraSelector selectedMode="back" onSelect={vi.fn()} />)

    expect(screen.getByText('Record your surroundings')).toBeInTheDocument()
    expect(screen.getByText('Record yourself')).toBeInTheDocument()
  })

  it('reports the back camera when chosen', async () => {
    const onSelect = vi.fn()
    render(<CameraSelector selectedMode="front" onSelect={onSelect} />)

    await userEvent.click(screen.getByText('Back Camera'))

    expect(onSelect).toHaveBeenCalledWith('back')
  })

  it('reports the front camera when chosen', async () => {
    const onSelect = vi.fn()
    render(<CameraSelector selectedMode="back" onSelect={onSelect} />)

    await userEvent.click(screen.getByText('Front Camera'))

    expect(onSelect).toHaveBeenCalledWith('front')
  })

  it('accepts translated labels', () => {
    render(
      <CameraSelector
        selectedMode="back"
        onSelect={vi.fn()}
        translations={{
          front: 'Cámara frontal',
          back: 'Cámara trasera',
          frontDesc: 'Grábate a ti mismo',
          backDesc: 'Graba tu entorno',
        }}
      />
    )

    expect(screen.getByText('Cámara trasera')).toBeInTheDocument()
  })

  it('applies a caller supplied class', () => {
    const { container } = render(
      <CameraSelector selectedMode="back" onSelect={vi.fn()} className="mt-4" />
    )

    expect(container.firstChild).toHaveClass('mt-4')
  })
})
