import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from './switch'

const toggle = () => screen.getByRole('switch')

describe('Switch', () => {
  it('exposes the switch role', () => {
    render(<Switch />)

    expect(toggle()).toBeInTheDocument()
  })

  it('reports an unchecked state', () => {
    render(<Switch checked={false} />)

    expect(toggle()).toHaveAttribute('aria-checked', 'false')
  })

  it('reports a checked state', () => {
    render(<Switch checked />)

    expect(toggle()).toHaveAttribute('aria-checked', 'true')
  })

  it('turns on when clicked', async () => {
    const onCheckedChange = vi.fn()
    render(<Switch checked={false} onCheckedChange={onCheckedChange} />)

    await userEvent.click(toggle())

    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('turns off when clicked again', async () => {
    const onCheckedChange = vi.fn()
    render(<Switch checked onCheckedChange={onCheckedChange} />)

    await userEvent.click(toggle())

    expect(onCheckedChange).toHaveBeenCalledWith(false)
  })

  it('ignores clicks when disabled', async () => {
    const onCheckedChange = vi.fn()
    render(<Switch disabled onCheckedChange={onCheckedChange} />)

    await userEvent.click(toggle())

    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it('can be toggled with the keyboard', async () => {
    const onCheckedChange = vi.fn()
    render(<Switch checked={false} onCheckedChange={onCheckedChange} />)

    toggle().focus()
    await userEvent.keyboard('{Enter}')

    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('can be toggled with the space bar', async () => {
    const onCheckedChange = vi.fn()
    render(<Switch checked={false} onCheckedChange={onCheckedChange} />)

    toggle().focus()
    await userEvent.keyboard(' ')

    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('associates with a label through its id', () => {
    render(
      <>
        <label htmlFor="notify">Notify me</label>
        <Switch id="notify" />
      </>
    )

    expect(screen.getByLabelText('Notify me')).toBeInTheDocument()
  })

  it('does not throw without a change handler', async () => {
    render(<Switch />)

    await expect(userEvent.click(toggle())).resolves.not.toThrow()
  })
})
