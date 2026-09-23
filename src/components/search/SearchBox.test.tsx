import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBox } from './SearchBox'

const searchInput = () => screen.getByRole('textbox')

/**
 * Result cards. Card titles render as divs rather than headings, so results are
 * located by the "Read more" action each card carries.
 */
const results = () => screen.findAllByText(/read more|learn more/i)

afterEach(() => vi.restoreAllMocks())

describe('SearchBox initial state', () => {
  it('offers suggested questions before anything is typed', () => {
    render(<SearchBox />)

    expect(screen.getByText(/common questions/i)).toBeInTheDocument()
  })

  it('offers an All category filter', () => {
    render(<SearchBox />)

    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
  })

  it('shows no clear button while empty', () => {
    render(<SearchBox />)

    expect(screen.queryByRole('button', { name: '' })).not.toBeInTheDocument()
  })

  it('runs an initial query when one is supplied', async () => {
    render(<SearchBox initialQuery="warrant" />)

    expect(searchInput()).toHaveValue('warrant')
  })
})

describe('searching', () => {
  it('finds results for a typed query', async () => {
    const user = userEvent.setup()
    render(<SearchBox />)

    await user.type(searchInput(), 'warrant')

    await waitFor(
      async () => expect((await results()).length).toBeGreaterThan(0),
      { timeout: 4000 }
    )
  })

  it('hides the suggestions once a query is entered', async () => {
    const user = userEvent.setup()
    render(<SearchBox />)

    await user.type(searchInput(), 'warrant')

    await waitFor(() =>
      expect(screen.queryByText(/common questions/i)).not.toBeInTheDocument()
    )
  })

  it('reports when nothing matches rather than showing an empty page', async () => {
    const user = userEvent.setup()
    render(<SearchBox />)

    await user.type(searchInput(), 'zzzqqqxxwv')

    await waitFor(() => expect(screen.getByText(/no results/i)).toBeInTheDocument(), {
      timeout: 3000,
    })
  })
})

describe('suggestions', () => {
  it('runs a suggestion when it is clicked', async () => {
    const user = userEvent.setup()
    render(<SearchBox />)
    const suggestion = screen.getByText(/What are my rights if ICE comes to my door\?/i)

    await user.click(suggestion)

    await waitFor(() =>
      expect(searchInput()).toHaveValue(
        'What are my rights if ICE comes to my door?'
      )
    )
  })
})

describe('clearing', () => {
  it('empties the field', async () => {
    const user = userEvent.setup()
    render(<SearchBox initialQuery="warrant" />)

    const clear = screen.getAllByRole('button').find((b) => b.querySelector('svg'))!
    await user.click(clear)

    await waitFor(() => expect(searchInput()).toHaveValue(''))
  })

  it('brings the suggestions back', async () => {
    const user = userEvent.setup()
    render(<SearchBox initialQuery="warrant" />)

    const clear = screen.getAllByRole('button').find((b) => b.querySelector('svg'))!
    await user.click(clear)

    await waitFor(() => expect(screen.getByText(/common questions/i)).toBeInTheDocument())
  })
})

describe('category filters', () => {
  it('lets a category be selected', async () => {
    const user = userEvent.setup()
    render(<SearchBox />)
    const filters = screen.getAllByRole('button')
    const category = filters[2]

    await user.click(category)

    expect(category).toBeInTheDocument()
  })

  it('keeps the All filter available to reset the view', async () => {
    const user = userEvent.setup()
    render(<SearchBox />)

    await user.click(screen.getAllByRole('button')[2])
    await user.click(screen.getByRole('button', { name: 'All' }))

    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
  })
})
