import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

const renderAt = (path: string) => {
  window.history.pushState({}, '', path)
  return render(<App />)
}

describe('public routes', () => {
  it('renders the Apex landing page and its anchor navigation', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1, name: 'Know what needs you next.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Platform' })).toHaveAttribute('href', '/#platform')
    expect(document.getElementById('security')).toBeInTheDocument()
    expect(document.getElementById('company')).toBeInTheDocument()
  })

  it('previews and pins the four-stage advisor workflow', async () => {
    const user = userEvent.setup()
    renderAt('/')

    const workflow = screen.getByRole('group', { name: 'Advisor workflow stages' })
    const coverage = within(workflow).getByRole('button', { name: /book coverage/i })
    const priority = within(workflow).getByRole('button', { name: /priority queue/i })
    const decision = within(workflow).getByRole('button', { name: /decision review/i })
    const action = within(workflow).getByRole('button', { name: /client action/i })

    expect(within(workflow).getAllByRole('button')).toHaveLength(4)

    expect(priority).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('heading', { name: 'Find the households that need attention.' })).toBeInTheDocument()

    await user.hover(decision)
    expect(screen.getByRole('heading', { name: 'Review the recommendation in context.' })).toBeInTheDocument()
    await user.unhover(decision)
    expect(screen.getByRole('heading', { name: 'Find the households that need attention.' })).toBeInTheDocument()

    await user.click(action)
    expect(action).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('heading', { name: 'Carry the reviewed decision forward.' })).toBeInTheDocument()

    fireEvent.focus(coverage)
    expect(screen.getByRole('heading', { name: 'Know which client book is active.' })).toBeInTheDocument()
    fireEvent.blur(coverage)
    expect(screen.getByRole('heading', { name: 'Carry the reviewed decision forward.' })).toBeInTheDocument()
  })

  it('opens and closes the accessible mobile navigation', () => {
    renderAt('/')
    const toggle = screen.getByRole('button', { name: 'Open navigation' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(toggle)
    expect(screen.getByRole('button', { name: 'Close navigation' })).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(screen.getByRole('link', { name: 'Platform' }))
    expect(screen.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('renders a recovery route for unknown paths', () => {
    renderAt('/missing-page')
    expect(screen.getByRole('heading', { name: 'This path does not need you next.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /return home/i })).toHaveAttribute('href', '/')
  })


  it('uses the linear narrative when reduced motion is forced', () => {
    renderAt('/?motion=reduce')
    expect(screen.getByText('01 / PRIORITIZE')).toBeInTheDocument()
    expect(screen.getByText('02 / REVIEW')).toBeInTheDocument()
    expect(screen.getByText('03 / APPROVE')).toBeInTheDocument()
  })

  it('updates reusable route metadata', () => {
    renderAt('/request-access')
    expect(document.title).toBe('Request access | Laminar Apex')
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Request access to Laminar Apex and tell us how your team manages portfolio decisions today.',
    )
  })
})

describe('request access prototype', () => {
  it('validates required fields without sending a request', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue(new Response())
    renderAt('/request-access')
    await user.click(screen.getByRole('button', { name: /validate request/i }))
    expect(screen.getByText('Enter your name.')).toBeInTheDocument()
    expect(screen.getByText('Enter a valid work email.')).toBeInTheDocument()
    expect(screen.getByText('Enter your firm name.')).toBeInTheDocument()
    expect(fetchSpy).not.toHaveBeenCalled()
    fetchSpy.mockRestore()
  })

  it('clears valid form data and shows the honest prototype confirmation', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue(new Response())
    renderAt('/request-access')
    await user.type(screen.getByLabelText(/^name/i), 'Nolan Patel')
    await user.type(screen.getByLabelText(/work email/i), 'nolan@example.com')
    await user.type(screen.getByLabelText(/^firm/i), 'Northstar Advisory')
    await user.selectOptions(screen.getByLabelText(/^role/i), 'portfolio-manager')
    await user.click(screen.getByRole('button', { name: /validate request/i }))
    expect(screen.getByRole('heading', { name: 'Submission delivery will be connected before launch.' })).toBeInTheDocument()
    expect(screen.getByText('No information was sent or stored. The form is ready for its future delivery service.')).toBeInTheDocument()
    expect(fetchSpy).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: /start again/i }))
    expect(screen.getByLabelText(/^name/i)).toHaveValue('')
    fetchSpy.mockRestore()
  })

  it('rejects malformed email while allowing the workflow note to remain optional', async () => {
    const user = userEvent.setup()
    renderAt('/request-access')
    await user.type(screen.getByLabelText(/^name/i), 'Nolan Patel')
    await user.type(screen.getByLabelText(/work email/i), 'not-an-email')
    await user.type(screen.getByLabelText(/^firm/i), 'Northstar Advisory')
    await user.selectOptions(screen.getByLabelText(/^role/i), 'advisor')
    await user.click(screen.getByRole('button', { name: /validate request/i }))
    expect(screen.getByText('Enter a valid work email.')).toBeInTheDocument()
    expect(screen.getByLabelText(/what would you like to improve/i)).toHaveValue('')
  })
})
