import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { STAGE_CAPTIONS } from '../data/stageBook'
import { StagePage } from './StagePage'

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
})
