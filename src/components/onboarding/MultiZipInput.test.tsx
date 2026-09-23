import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MultiZipInput, type ZipEntry } from './MultiZipInput'

const primary = (zipCode = '', label = 'home'): ZipEntry => ({ zipCode, label })

const renderInput = (value: ZipEntry[], props = {}) => {
  const onChange = vi.fn()
  render(<MultiZipInput value={value} onChange={onChange} {...props} />)
  return { onChange }
}

const primaryField = () => screen.getByLabelText(/primary area/i)
const addButton = () => screen.getByRole('button', { name: /add another/i })

describe('primary ZIP', () => {
  it('always renders a primary field', () => {
    renderInput([primary()])

    expect(primaryField()).toBeInTheDocument()
  })

  it('renders even with an empty list', () => {
    renderInput([])

    expect(primaryField()).toBeInTheDocument()
  })

  it('shows the current value', () => {
    renderInput([primary('02139')])

    expect(primaryField()).toHaveValue('02139')
  })

  it('reports a typed digit', async () => {
    const { onChange } = renderInput([primary()])

    await userEvent.type(primaryField(), '0')

    expect(onChange).toHaveBeenCalledWith([{ zipCode: '0', label: 'home' }])
  })

  it('strips non-digits rather than storing them', async () => {
    const { onChange } = renderInput([primary('0213')])

    await userEvent.type(primaryField(), 'a')

    expect(onChange).toHaveBeenCalledWith([{ zipCode: '0213', label: 'home' }])
  })

  it('caps entry at five digits', async () => {
    const { onChange } = renderInput([primary('02139')])

    await userEvent.type(primaryField(), '9')

    const reported = onChange.mock.calls.map((c) => c[0][0].zipCode)

    expect(reported.every((zip: string) => zip.length <= 5)).toBe(true)
  })

  it('offers numeric input on mobile keyboards', () => {
    renderInput([primary()])

    expect(primaryField()).toHaveAttribute('inputMode', 'numeric')
  })

  it('cannot be removed', () => {
    renderInput([primary('02139')])

    expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument()
  })
})

describe('additional locations', () => {
  it('offers to add another location', () => {
    renderInput([primary('02139')])

    expect(addButton()).toBeInTheDocument()
  })

  it('appends an empty entry when adding', async () => {
    const { onChange } = renderInput([primary('02139')])

    await userEvent.click(addButton())

    expect(onChange).toHaveBeenCalledWith([
      { zipCode: '02139', label: 'home' },
      { zipCode: '', label: 'work' },
    ])
  })

  it('suggests family once work is taken', async () => {
    const { onChange } = renderInput([primary('02139'), { zipCode: '10001', label: 'work' }])

    await userEvent.click(addButton())

    expect(onChange.mock.calls[0][0][2].label).toBe('family')
  })

  it('falls back to other once the common labels are used', async () => {
    const { onChange } = renderInput([
      primary('02139'),
      { zipCode: '10001', label: 'work' },
      { zipCode: '60601', label: 'family' },
    ])

    await userEvent.click(addButton())

    expect(onChange.mock.calls[0][0][3].label).toBe('other')
  })

  it('renders each additional entry', () => {
    renderInput([primary('02139'), { zipCode: '10001', label: 'work' }])

    expect(screen.getByDisplayValue('10001')).toBeInTheDocument()
  })

  it('hides the add button at the maximum', () => {
    const entries = Array.from({ length: 5 }, (_, i) => primary(`0213${i}`, 'other'))

    renderInput(entries)

    expect(screen.queryByRole('button', { name: /add another/i })).not.toBeInTheDocument()
  })

  it('respects a custom maximum', () => {
    renderInput([primary('02139'), { zipCode: '10001', label: 'work' }], {
      maxEntries: 2,
    })

    expect(screen.queryByRole('button', { name: /add another/i })).not.toBeInTheDocument()
  })

  it('removes an additional entry', async () => {
    const { onChange } = renderInput([
      primary('02139'),
      { zipCode: '10001', label: 'work' },
    ])

    await userEvent.click(screen.getAllByRole('button', { name: /remove/i })[0])

    expect(onChange).toHaveBeenCalledWith([{ zipCode: '02139', label: 'home' }])
  })
})

describe('translations', () => {
  it('accepts translated labels', () => {
    renderInput([primary('02139')], {
      translations: {
        primaryLabel: 'Tu área principal',
        primaryPlaceholder: 'Código postal',
        primaryHelp: 'Recursos locales',
        addAnother: 'Agregar otra ubicación',
        labelHome: 'Casa',
        labelWork: 'Trabajo',
        labelFamily: 'Familia',
        labelOther: 'Otro',
        remove: 'Eliminar',
        optional: 'Opcional',
      },
    })

    expect(screen.getByText('Tu área principal')).toBeInTheDocument()
  })
})
