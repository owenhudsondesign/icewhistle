import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Alert, AlertTitle, AlertDescription } from './alert'
import { Card, CardHeader, CardTitle } from './card'

/**
 * Card and alert titles label a container; they are not levels in the document
 * outline. Emitting headings from them skipped levels on pages whose cards sat
 * directly under the h1, which makes heading-based navigation misreport the
 * page structure.
 */
describe('container titles are not headings', () => {
  it('CardTitle renders no heading', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Hotlines</CardTitle>
        </CardHeader>
      </Card>
    )

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.getByText('Hotlines')).toBeInTheDocument()
  })

  it('AlertTitle renders no heading', () => {
    render(
      <Alert>
        <AlertTitle>Important Disclaimer</AlertTitle>
        <AlertDescription>Not legal advice.</AlertDescription>
      </Alert>
    )

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.getByText('Important Disclaimer')).toBeInTheDocument()
  })

  it('keeps the alert announced as an alert', () => {
    render(
      <Alert>
        <AlertTitle>Offline</AlertTitle>
      </Alert>
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Offline')
  })
})
