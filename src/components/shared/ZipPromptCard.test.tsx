import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ZipPromptCard } from './ZipPromptCard'

const setup = () => {
  const onSubmit = vi.fn()
  render(<ZipPromptCard onSubmit={onSubmit} />)

  return {
    onSubmit,
    user: userEvent.setup(),
    input: screen.getByRole('textbox', { name: /ZIP/i }),
    submit: screen.getByRole('button', { name: /find/i }),
  }
}

describe('ZipPromptCard', () => {
  it('submits a complete five digit ZIP', async () => {
    const { user, input, submit, onSubmit } = setup()

    await user.type(input, '02139')
    await user.click(submit)

    expect(onSubmit).toHaveBeenCalledWith('02139')
  })

  it('keeps a leading zero rather than treating the ZIP as a number', async () => {
    const { user, input, submit, onSubmit } = setup()

    await user.type(input, '02139')
    await user.click(submit)

    expect(onSubmit).toHaveBeenCalledWith(expect.stringMatching(/^0/))
  })

  it('blocks submission until five digits are entered', async () => {
    const { user, input, submit } = setup()

    await user.type(input, '0213')

    expect(submit).toBeDisabled()
  })

  it('strips non-digits as the user types', async () => {
    const { user, input, onSubmit, submit } = setup()

    await user.type(input, '0a2-1b3 9')

    expect(input).toHaveValue('02139')

    await user.click(submit)

    expect(onSubmit).toHaveBeenCalledWith('02139')
  })

  it('never submits more than five digits', async () => {
    const { user, input, submit, onSubmit } = setup()

    await user.type(input, '021391234')
    await user.click(submit)

    expect(onSubmit).toHaveBeenCalledWith('02139')
  })

  it('clears the field after a successful submit', async () => {
    const { user, input, submit } = setup()

    await user.type(input, '02139')
    await user.click(submit)

    expect(input).toHaveValue('')
  })

  it('describes the field with the privacy promise, not just a visual hint', () => {
    const { input } = setup()

    expect(input).toHaveAccessibleDescription(/stored only on this device/i)
  })

  it('marks an incomplete ZIP as invalid for assistive technology', async () => {
    const { user, input } = setup()

    await user.type(input, '021')

    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('is not marked invalid once complete', async () => {
    const { user, input } = setup()

    await user.type(input, '02139')

    expect(input).toHaveAttribute('aria-invalid', 'false')
  })
})
