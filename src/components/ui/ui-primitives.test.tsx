import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Alert, AlertTitle, AlertDescription } from './alert'
import { Label } from './label'
import { Button } from './button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './card'

describe('Alert', () => {
  it('exposes the alert role to assistive technology', () => {
    render(<Alert>Heads up</Alert>)

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders a title and description together', () => {
    render(
      <Alert>
        <AlertTitle>Offline</AlertTitle>
        <AlertDescription>Some features are limited.</AlertDescription>
      </Alert>
    )

    expect(screen.getByText('Offline')).toBeInTheDocument()
    expect(screen.getByText('Some features are limited.')).toBeInTheDocument()
  })

  it.each(['default', 'destructive', 'warning', 'success'] as const)(
    'renders the %s variant',
    (variant) => {
      render(<Alert variant={variant}>Message</Alert>)

      expect(screen.getByRole('alert')).toBeInTheDocument()
    }
  )

  it('applies a caller supplied class alongside its own', () => {
    render(<Alert className="custom-class">Message</Alert>)

    expect(screen.getByRole('alert')).toHaveClass('custom-class')
  })
})

describe('Label', () => {
  it('renders its text', () => {
    render(<Label>ZIP code</Label>)

    expect(screen.getByText('ZIP code')).toBeInTheDocument()
  })

  it('associates with the control it names', () => {
    render(
      <>
        <Label htmlFor="zip">ZIP code</Label>
        <input id="zip" />
      </>
    )

    expect(screen.getByLabelText('ZIP code')).toBeInTheDocument()
  })
})

describe('Button', () => {
  it('renders as a button by default', () => {
    render(<Button>Call</Button>)

    expect(screen.getByRole('button', { name: 'Call' })).toBeInTheDocument()
  })

  it('calls its handler when clicked', async () => {
    let clicked = false
    render(<Button onClick={() => (clicked = true)}>Call</Button>)

    await userEvent.click(screen.getByRole('button'))

    expect(clicked).toBe(true)
  })

  it('does not fire when disabled', async () => {
    let clicked = false
    render(
      <Button disabled onClick={() => (clicked = true)}>
        Call
      </Button>
    )

    await userEvent.click(screen.getByRole('button'))

    expect(clicked).toBe(false)
  })

  it.each(['default', 'destructive', 'outline', 'ghost'] as const)(
    'renders the %s variant',
    (variant) => {
      render(<Button variant={variant}>Call</Button>)

      expect(screen.getByRole('button')).toBeInTheDocument()
    }
  )

  it('renders its child as the element when asChild is set', () => {
    render(
      <Button asChild>
        <a href="/rights">Know your rights</a>
      </Button>
    )

    expect(screen.getByRole('link', { name: 'Know your rights' })).toBeInTheDocument()
  })
})

describe('Card', () => {
  it('renders a full card composition', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Hotlines</CardTitle>
          <CardDescription>Free and confidential</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    )

    expect(screen.getByText('Hotlines')).toBeInTheDocument()
    expect(screen.getByText('Free and confidential')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})
