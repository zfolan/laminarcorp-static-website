import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { STAGE_CAPTIONS } from '../data/stageBook'
import { StagePage } from './StagePage'

afterEach(() => vi.restoreAllMocks())

const renderStage = () => render(
  <MemoryRouter>
    <StagePage />
  </MemoryRouter>,
)

describe('StagePage', () => {
  it('shows the aether hero without expanding a product panel', () => {
    renderStage()
    expect(screen.getByText('LAMINAR')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /laminar/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Request access' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Households' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Rebalance' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Analytics' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /close .* preview/i })).not.toBeInTheDocument()
    expect(document.getElementById('households')).toBeInTheDocument()
    expect(document.getElementById('rebalance')).toBeInTheDocument()
    expect(document.getElementById('analytics')).toBeInTheDocument()
  })

  it('keeps the aether field decorative and still works when canvas context is missing', () => {
    renderStage()
    const field = document.querySelector('[data-aether-field]')
    expect(field).toHaveAttribute('aria-hidden', 'true')
  })

  it('scrolls to a product section instead of expanding a panel', async () => {
    const user = userEvent.setup()
    const scrollSpy = vi.spyOn(Element.prototype, 'scrollIntoView')
    renderStage()
    await user.click(screen.getByRole('button', { name: 'Households' }))
    expect(scrollSpy).toHaveBeenCalled()
    expect(document.getElementById('households')).toContainElement(screen.getByText(STAGE_CAPTIONS.households))
  })

  it('renders the household library in the page', () => {
    renderStage()
    const library = within(document.getElementById('households') as HTMLElement)
    expect(library.getByText('Chen Family')).toBeInTheDocument()
    expect(library.getByText('Rivera Household')).toBeInTheDocument()
    expect(library.getAllByText('At Risk').length).toBeGreaterThan(0)
    expect(library.getByText('On Target')).toBeInTheDocument()
    expect(screen.queryByText('Upload CSV')).not.toBeInTheDocument()
  })

  it('renders the rebalance workspace in the page', () => {
    renderStage()
    const rebalance = within(document.getElementById('rebalance') as HTMLElement)
    expect(rebalance.getByText(/RRSP/)).toBeInTheDocument()
    expect(rebalance.getByText(/TFSA/)).toBeInTheDocument()
    expect(rebalance.getByText(/CAD TAXABLE/)).toBeInTheDocument()
    expect(rebalance.getByText('ZCS')).toBeInTheDocument()
    expect(rebalance.getAllByText('SELL').length).toBeGreaterThan(0)
    expect(rebalance.getAllByText('BUY').length).toBeGreaterThan(0)
    expect(screen.queryByText('Review & validate')).not.toBeInTheDocument()
  })

  it('renders the household overview in the page', () => {
    renderStage()
    expect(screen.getByText(/sector allocation drift/i)).toBeInTheDocument()
    expect(screen.getByText(/currency exposure/i)).toBeInTheDocument()
    expect(screen.getByText(/largest holdings/i)).toBeInTheDocument()
    expect(screen.getByText('CAD')).toBeInTheDocument()
    expect(screen.getByText('USD')).toBeInTheDocument()
    expect(screen.queryByText('Whole Book')).not.toBeInTheDocument()
    expect(screen.queryByText('Add note')).not.toBeInTheDocument()
  })

  it('validates the access form in the overlay without leaving the page', async () => {
    const user = userEvent.setup()
    renderStage()
    await user.click(screen.getByRole('button', { name: 'Request access' }))
    expect(screen.getByRole('dialog', { name: 'Request access' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Send request' }))
    expect(screen.getByText('Enter your name.')).toBeInTheDocument()
    expect(screen.getByText(STAGE_CAPTIONS.households)).toBeInTheDocument()
  })

  it('shows confirmation on success', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'fetch').mockResolvedValue(new Response(null, { status: 204 }))
    renderStage()
    await user.click(screen.getByRole('button', { name: 'Request access' }))
    await user.type(screen.getByLabelText(/^name/i), 'Nolan Patel')
    await user.type(screen.getByLabelText(/email/i), 'nolan@example.com')
    await user.type(screen.getByLabelText(/^firm/i), 'Northstar Advisory')
    await user.click(screen.getByRole('button', { name: 'Send request' }))
    expect(await screen.findByText(/request received/i)).toBeInTheDocument()
  })

  it('still shows product sections when reduced motion is forced', () => {
    window.history.pushState({}, '', '/?motion=reduce')
    render(
      <MemoryRouter initialEntries={['/?motion=reduce']}>
        <StagePage />
      </MemoryRouter>,
    )
    expect(document.querySelector('[data-aether-field]')).toHaveClass('aether-field--still')
    expect(document.getElementById('households')).toBeInTheDocument()
  })

  it('keeps the form and shows a retryable error when submit fails', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))
    renderStage()
    await user.click(screen.getByRole('button', { name: 'Request access' }))
    await user.type(screen.getByLabelText(/^name/i), 'Nolan Patel')
    await user.type(screen.getByLabelText(/email/i), 'nolan@example.com')
    await user.type(screen.getByLabelText(/^firm/i), 'Northstar Advisory')
    await user.click(screen.getByRole('button', { name: 'Send request' }))
    expect(await screen.findByText('Could not send your request. Try again.')).toBeInTheDocument()
    expect(screen.getByLabelText(/^name/i)).toBeInTheDocument()
  })
})
