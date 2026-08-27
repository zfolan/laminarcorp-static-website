import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { STAGE_CAPTIONS, STAGE_INTRO, STAGE_OUTRO, STAGE_PREFACE } from '../data/stageBook'
import { StagePage } from './StagePage'

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
})

const renderStage = () => render(
  <MemoryRouter>
    <StagePage />
  </MemoryRouter>,
)

describe('StagePage', () => {
  it('shows the aether hero without expanding a product panel', () => {
    renderStage()
    expect(screen.getByRole('heading', { name: 'LAMINAR' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /laminar/i })).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Request access' })).toHaveLength(2)
    expect(screen.getByRole('heading', { name: STAGE_OUTRO[0].title })).toBeInTheDocument()
    expect(screen.getByText(STAGE_OUTRO[0].body)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: STAGE_OUTRO[1].title })).toBeInTheDocument()
    expect(screen.getByText(STAGE_OUTRO[1].body)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Households' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Rebalance' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Analytics' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /close .* preview/i })).not.toBeInTheDocument()
    expect(document.getElementById('households')).toBeInTheDocument()
    expect(document.getElementById('rebalance')).toBeInTheDocument()
    expect(document.getElementById('analytics')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: STAGE_INTRO.title })).toBeInTheDocument()
    expect(screen.getByText(STAGE_INTRO.lead)).toBeInTheDocument()
    expect(screen.getByText(STAGE_INTRO.body)).toBeInTheDocument()
  })

  it('keeps the aether field decorative and still works when canvas context is missing', () => {
    renderStage()
    const field = document.querySelector('[data-aether-field]')
    expect(field).toHaveAttribute('aria-hidden', 'true')
  })

  it('keeps product sections in the page without hero shortcuts', () => {
    renderStage()
    expect(document.getElementById('households')).toContainElement(screen.getByText(STAGE_CAPTIONS.households))
    expect(document.getElementById('rebalance')).toContainElement(screen.getByText(STAGE_CAPTIONS.rebalance))
    expect(document.getElementById('analytics')).toContainElement(screen.getByText(STAGE_CAPTIONS.analytics))
  })

  it('renders the household library in the page', () => {
    renderStage()
    const library = within(document.getElementById('households') as HTMLElement)
    expect(library.getByRole('heading', { name: STAGE_PREFACE.households![0].title })).toBeInTheDocument()
    expect(library.getByText(STAGE_PREFACE.households![0].body)).toBeInTheDocument()
    expect(library.getByText('Chen Family')).toBeInTheDocument()
    expect(library.getByText('Rivera Household')).toBeInTheDocument()
    expect(library.getAllByText('At Risk').length).toBeGreaterThan(0)
    expect(library.getByText(/on target/i)).toBeInTheDocument()
    expect(screen.queryByText('Upload CSV')).not.toBeInTheDocument()
    expect(library.queryByText(/drift bands/i)).not.toBeInTheDocument()
    expect(library.queryByText(/all ias/i)).not.toBeInTheDocument()
  })

  it('renders the rebalance workspace in the page', () => {
    renderStage()
    const rebalance = within(document.getElementById('rebalance') as HTMLElement)
    expect(rebalance.getByRole('heading', { name: STAGE_PREFACE.rebalance![0].title })).toBeInTheDocument()
    expect(rebalance.getByRole('heading', { name: 'Tax-Aware Portfolio Management' })).toBeInTheDocument()
    expect(rebalance.getByRole('heading', { name: 'Intelligent Asset Location' })).toBeInTheDocument()
    expect(rebalance.getByRole('heading', { name: 'Exception-Based Portfolio Management' })).toBeInTheDocument()
    expect(rebalance.getByText(STAGE_PREFACE.rebalance![0].body)).toBeInTheDocument()
    expect(rebalance.getByText('Allocation & cash')).toBeInTheDocument()
    expect(rebalance.getByText(/RRSP/)).toBeInTheDocument()
    expect(rebalance.getByText(/TFSA/)).toBeInTheDocument()
    expect(rebalance.getByText(/CAD TAXABLE/)).toBeInTheDocument()
    expect(rebalance.getByText('ZCS')).toBeInTheDocument()
    expect(rebalance.getAllByText('SELL').length).toBeGreaterThan(0)
    expect(rebalance.getAllByText('BUY').length).toBeGreaterThan(0)
    expect(rebalance.getAllByText('Account value').length).toBeGreaterThan(0)
    expect(rebalance.queryByText('Review & validate')).not.toBeInTheDocument()
    expect(rebalance.queryByText('Save adjustments')).not.toBeInTheDocument()
  })

  it('renders the household overview in the page', () => {
    renderStage()
    const overview = within(document.getElementById('analytics') as HTMLElement)
    expect(overview.getByRole('heading', { name: STAGE_PREFACE.analytics![0].title })).toBeInTheDocument()
    expect(overview.getByText(STAGE_PREFACE.analytics![0].body)).toBeInTheDocument()
    expect(overview.getByRole('heading', { name: STAGE_PREFACE.analytics![1].title })).toBeInTheDocument()
    expect(overview.getByText(/sector allocation drift/i)).toBeInTheDocument()
    expect(overview.getByText(/currency exposure/i)).toBeInTheDocument()
    expect(overview.getByText(/largest exposures/i)).toBeInTheDocument()
    expect(overview.getByText(/all holdings/i)).toBeInTheDocument()
    expect(overview.getAllByText('CAD').length).toBeGreaterThan(0)
    expect(overview.getAllByText('USD').length).toBeGreaterThan(0)
    expect(overview.getByText('Chen Family')).toBeInTheDocument()
    expect(screen.queryByText('Whole Book')).not.toBeInTheDocument()
    expect(screen.queryByText('Add note')).not.toBeInTheDocument()
  })

  it('validates the access form in the overlay without leaving the page', async () => {
    const user = userEvent.setup()
    renderStage()
    await user.click(screen.getAllByRole('button', { name: 'Request access' })[0])
    expect(screen.getByRole('dialog', { name: 'Request access' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Send request' }))
    expect(screen.getByText('Enter your name.')).toBeInTheDocument()
    expect(screen.getByText(STAGE_CAPTIONS.households)).toBeInTheDocument()
  })

  it('shows confirmation on success', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'fetch').mockResolvedValue(new Response(null, { status: 204 }))
    renderStage()
    await user.click(screen.getAllByRole('button', { name: 'Request access' })[0])
    await user.type(screen.getByLabelText(/^name/i), 'Nolan Patel')
    await user.type(screen.getByLabelText(/email/i), 'nolan@example.com')
    await user.type(screen.getByLabelText(/^firm/i), 'Northstar Advisory')
    await user.click(screen.getByRole('button', { name: 'Send request' }))
    expect(await screen.findByText(/request received/i)).toBeInTheDocument()
  })

  it('reveals an aether scroll hint after five seconds at the top of the page', () => {
    vi.useFakeTimers()
    renderStage()
    expect(screen.queryByRole('button', { name: 'Scroll down' })).not.toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByRole('button', { name: 'Scroll down' })).toBeInTheDocument()
  })

  it('does not show the scroll hint if the page has already moved', () => {
    vi.useFakeTimers()
    renderStage()
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 48 })
    act(() => {
      window.dispatchEvent(new Event('scroll'))
      vi.advanceTimersByTime(5000)
    })
    expect(screen.queryByRole('button', { name: 'Scroll down' })).not.toBeInTheDocument()
  })

  it('hides the scroll hint as soon as the user scrolls', () => {
    vi.useFakeTimers()
    renderStage()
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByRole('button', { name: 'Scroll down' })).toBeInTheDocument()
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 48 })
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    expect(screen.queryByRole('button', { name: 'Scroll down' })).not.toBeInTheDocument()
  })

  it('scrolls to the intro when the hint is used', () => {
    vi.useFakeTimers()
    renderStage()
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    screen.getByRole('button', { name: 'Scroll down' }).click()
    expect(document.getElementById('intro')?.scrollIntoView).toHaveBeenCalled()
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
    expect(screen.getByRole('heading', { name: STAGE_INTRO.title })).toBeInTheDocument()
  })

  it('keeps the form and shows a retryable error when submit fails', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))
    renderStage()
    await user.click(screen.getAllByRole('button', { name: 'Request access' })[1])
    await user.type(screen.getByLabelText(/^name/i), 'Nolan Patel')
    await user.type(screen.getByLabelText(/email/i), 'nolan@example.com')
    await user.type(screen.getByLabelText(/^firm/i), 'Northstar Advisory')
    await user.click(screen.getByRole('button', { name: 'Send request' }))
    expect(await screen.findByText('Could not send your request. Try again.')).toBeInTheDocument()
    expect(screen.getByLabelText(/^name/i)).toBeInTheDocument()
  })
})
