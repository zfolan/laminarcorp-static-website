import { render, screen } from '@testing-library/react'
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

describe('StagePage first load', () => {
  it('shows wordmark, request access, and three nodes with no scene', () => {
    renderStage()
    expect(screen.getByText('LAMINAR')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /laminar/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Request access' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Households' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Rebalance' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Analytics' })).toBeInTheDocument()
    expect(screen.queryByText(STAGE_CAPTIONS.households)).not.toBeInTheDocument()
    expect(screen.queryByText(STAGE_CAPTIONS.rebalance)).not.toBeInTheDocument()
    expect(screen.queryByText(STAGE_CAPTIONS.analytics)).not.toBeInTheDocument()
  })

  it('keeps the aether field decorative and still works when canvas context is missing', () => {
    renderStage()
    const field = document.querySelector('[data-aether-field]')
    expect(field).toHaveAttribute('aria-hidden', 'true')
  })

  it('opens, swaps, and closes product scenes', async () => {
    const user = userEvent.setup()
    renderStage()
    await user.click(screen.getByRole('button', { name: 'Households' }))
    expect(screen.getByText(STAGE_CAPTIONS.households)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Households' })).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: 'Rebalance' }))
    expect(screen.queryByText(STAGE_CAPTIONS.households)).not.toBeInTheDocument()
    expect(screen.getByText(STAGE_CAPTIONS.rebalance)).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByText(STAGE_CAPTIONS.rebalance)).not.toBeInTheDocument()
  })

  it('closes when the open frame is clicked', async () => {
    const user = userEvent.setup()
    renderStage()
    await user.click(screen.getByRole('button', { name: 'Analytics' }))
    await user.click(screen.getByRole('button', { name: 'Close Analytics preview' }))
    expect(screen.queryByText(STAGE_CAPTIONS.analytics)).not.toBeInTheDocument()
  })

  it('renders the reduced household library', async () => {
    const user = userEvent.setup()
    renderStage()
    await user.click(screen.getByRole('button', { name: 'Households' }))
    expect(screen.getAllByText('At Risk').length).toBeGreaterThan(0)
    expect(screen.getByText('Chen Family')).toBeInTheDocument()
    expect(screen.getByText('Rivera Household')).toBeInTheDocument()
    expect(screen.queryByText('Upload CSV')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /rebalance households/i })).not.toBeInTheDocument()
  })

  it('renders the reduced rebalance workspace', async () => {
    const user = userEvent.setup()
    renderStage()
    await user.click(screen.getByRole('button', { name: 'Rebalance' }))
    expect(screen.getByText('RRSP')).toBeInTheDocument()
    expect(screen.getByText('CAD TAXABLE')).toBeInTheDocument()
    expect(screen.getByText('ZCS')).toBeInTheDocument()
    expect(screen.getAllByText('SELL').length).toBeGreaterThan(0)
    expect(screen.getAllByText('BUY').length).toBeGreaterThan(0)
    expect(screen.queryByText('Review & validate')).not.toBeInTheDocument()
  })

  it('renders the reduced household overview', async () => {
    const user = userEvent.setup()
    renderStage()
    await user.click(screen.getByRole('button', { name: 'Analytics' }))
    expect(screen.getByText('Chen Family')).toBeInTheDocument()
    expect(screen.getByText(/sector allocation drift/i)).toBeInTheDocument()
    expect(screen.getByText(/currency exposure/i)).toBeInTheDocument()
    expect(screen.getByText('CAD')).toBeInTheDocument()
    expect(screen.getByText('USD')).toBeInTheDocument()
    expect(screen.queryByText('Whole Book')).not.toBeInTheDocument()
    expect(screen.queryByText('Add note')).not.toBeInTheDocument()
  })

  it('validates the access form in the overlay without leaving the page', async () => {
    const user = userEvent.setup()
    renderStage()
    await user.click(screen.getByRole('button', { name: 'Households' }))
    await user.click(screen.getByRole('button', { name: 'Request access' }))
    expect(screen.getByRole('dialog', { name: 'Request access' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Send request' }))
    expect(screen.getByText('Enter your name.')).toBeInTheDocument()
    expect(screen.getByText(STAGE_CAPTIONS.households)).toBeInTheDocument()
  })

  it('shows confirmation on success and keeps the scene', async () => {
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
