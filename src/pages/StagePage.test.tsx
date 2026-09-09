import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { StrictMode } from 'react'
import userEvent from '@testing-library/user-event'
import { Link, MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { StagePage } from './StagePage'

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    configurable: true,
    writable: true,
    value: vi.fn(() => null),
  })


  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
})

const renderStage = () => render(
  <StrictMode>
    <MemoryRouter>
      <StagePage />
    </MemoryRouter>
  </StrictMode>,
)

describe('StagePage', () => {

  it('keeps the aether field decorative and still works when canvas context is missing', () => {
    renderStage()
    const field = document.querySelector('[data-aether-field]')
    expect(field).toHaveAttribute('aria-hidden', 'true')
  })

  it('backs the aether canvas with the viewport, not the page height', () => {
    const ctx = {
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      fillRect: vi.fn(),
      stroke: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      setTransform: vi.fn(),

      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
    }
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D)
    vi.stubGlobal('requestAnimationFrame', () => 1)
    vi.stubGlobal('cancelAnimationFrame', () => {})
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function (this: HTMLElement) {
      return this.hasAttribute('data-aether-field') ? 1440 : 100
    })
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function (this: HTMLElement) {
      return this.hasAttribute('data-aether-field') ? 5870 : 100
    })
    const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    Object.defineProperty(Object.getPrototypeOf(svgPath), 'getTotalLength', {
      configurable: true,
      value: () => 0,
    })
    Object.defineProperty(Object.getPrototypeOf(svgPath.ownerSVGElement ?? document.createElementNS('http://www.w3.org/2000/svg', 'svg')), 'getScreenCTM', {
      configurable: true,
      value: () => null,
    })

    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1440 })
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 900 })



    renderStage()
    const canvas = document.querySelector('[data-aether-field] canvas')
    expect(canvas).toBeTruthy()
    expect(canvas).toHaveProperty('width', 1440)
    expect(canvas).toHaveProperty('height', 900)
  })

  it('stops the aether loop while the document is hidden', () => {
    const ctx = {
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      fillRect: vi.fn(),
      stroke: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      setTransform: vi.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
    }
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D)
    vi.stubGlobal('requestAnimationFrame', () => 1)
    const cancel = vi.fn()
    vi.stubGlobal('cancelAnimationFrame', cancel)
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function (this: HTMLElement) {
      return this.hasAttribute('data-aether-field') ? 1440 : 100
    })
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function (this: HTMLElement) {
      return this.hasAttribute('data-aether-field') ? 5870 : 100
    })
    const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    Object.defineProperty(Object.getPrototypeOf(svgPath), 'getTotalLength', {
      configurable: true,
      value: () => 0,
    })
    Object.defineProperty(Object.getPrototypeOf(svgPath.ownerSVGElement ?? document.createElementNS('http://www.w3.org/2000/svg', 'svg')), 'getScreenCTM', {
      configurable: true,
      value: () => null,
    })
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1440 })
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 900 })

    renderStage()
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    document.dispatchEvent(new Event('visibilitychange'))
    expect(cancel).toHaveBeenCalled()
  })




  it('associates validation errors with fields and does not submit invalid input', async () => {
    const user = userEvent.setup()
    const submit = vi.spyOn(window, 'fetch')
    renderStage()
    await user.click(screen.getAllByRole('button', { name: 'Request a Demo' })[0])
    const dialog = screen.getByRole('dialog', { name: 'Request a Demo' })
    expect(within(dialog).getByLabelText(/^name/i)).toHaveFocus()
    await user.click(within(dialog).getByRole('button', { name: 'Send request' }))
    expect(within(dialog).getByRole('alert')).toBeInTheDocument()
    expect(within(dialog).getByLabelText(/^name/i)).toHaveAccessibleDescription('Enter your name.')
    expect(within(dialog).getByLabelText(/^firm/i)).toHaveAccessibleDescription('Enter your firm name.')
    expect(within(dialog).getByLabelText(/email/i)).toHaveAccessibleDescription('Enter a valid work email.')
    expect(submit).not.toHaveBeenCalled()
  })

  it('submits trimmed values and focuses confirmation on success', async () => {
    const user = userEvent.setup()
    const submit = vi.spyOn(window, 'fetch').mockResolvedValue(new Response(null, { status: 204 }))
    renderStage()
    await user.click(screen.getAllByRole('button', { name: 'Request a Demo' })[0])
    await user.type(screen.getByLabelText(/^name/i), ' Example Advisor ')
    await user.type(screen.getByLabelText(/email/i), 'advisor@example.com')
    await user.type(screen.getByLabelText(/^firm/i), ' Example Firm ')
    await user.click(screen.getByRole('button', { name: 'Send request' }))
    const confirmation = await screen.findByRole('status')
    expect(confirmation).toHaveTextContent('Request received.')
    expect(confirmation).toHaveFocus()
    expect(submit).toHaveBeenCalledTimes(1)
    expect(submit).toHaveBeenCalledWith('/api/request-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Example Advisor', email: 'advisor@example.com', firm: 'Example Firm' }),
    })
    await user.click(screen.getByRole('button', { name: 'Close demo request' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('handles native cancellation and dismisses only clicks outside the dialog panel', async () => {
    const user = userEvent.setup()
    renderStage()
    const opener = screen.getAllByRole('button', { name: 'Request a Demo' })[0]
    await user.click(opener)
    const dialog = screen.getByRole('dialog', { name: 'Request a Demo' })
    const cancel = new Event('cancel', { bubbles: false, cancelable: true })
    fireEvent(dialog, cancel)
    expect(cancel.defaultPrevented).toBe(true)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(opener)
    const reopened = screen.getByRole('dialog', { name: 'Request a Demo' })
    vi.spyOn(reopened, 'getBoundingClientRect').mockReturnValue({
      x: 100, y: 100, left: 100, top: 100, right: 500, bottom: 600,
      width: 400, height: 500, toJSON: () => ({}),
    })
    await user.click(within(reopened).getByLabelText(/^name/i))
    fireEvent.click(reopened, { clientX: 110, clientY: 110 })
    expect(reopened).toBeInTheDocument()
    fireEvent.click(reopened, { clientX: 20, clientY: 20 })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it.each(['resolve', 'reject'] as const)('ignores an old submission that will %s after closing and reopening', async (outcome) => {
    const user = userEvent.setup()
    let finish!: () => void
    const pending = new Promise<Response>((resolve, reject) => {
      finish = outcome === 'resolve'
        ? () => resolve(new Response(null, { status: 204 }))
        : () => reject(new Error('Network unavailable'))
    })
    const submit = vi.spyOn(window, 'fetch')
      .mockReturnValueOnce(pending)
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
    renderStage()
    const opener = screen.getAllByRole('button', { name: 'Request a Demo' })[0]
    await user.click(opener)
    await user.type(screen.getByLabelText(/^name/i), 'Previous Advisor')
    await user.type(screen.getByLabelText(/email/i), 'previous@example.com')
    await user.type(screen.getByLabelText(/^firm/i), 'Previous Firm')
    await user.click(screen.getByRole('button', { name: 'Send request' }))
    expect(screen.getByRole('button', { name: 'Sending' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Close demo request' }))
    await user.click(opener)
    const freshDialog = screen.getByRole('dialog', { name: 'Request a Demo' })
    expect(within(freshDialog).getByLabelText(/^name/i)).toHaveValue('')
    await user.type(within(freshDialog).getByLabelText(/^name/i), 'Current Advisor')
    await act(async () => {
      finish()
      await pending.catch(() => {})
    })
    expect(freshDialog).toBeInTheDocument()
    expect(within(freshDialog).getByLabelText(/^name/i)).toHaveValue('Current Advisor')
    expect(within(freshDialog).queryByRole('alert')).not.toBeInTheDocument()
    expect(within(freshDialog).queryByRole('status')).not.toBeInTheDocument()
    expect(within(freshDialog).getByRole('button', { name: 'Send request' })).toBeEnabled()
    await user.type(within(freshDialog).getByLabelText(/email/i), 'current@example.com')
    await user.type(within(freshDialog).getByLabelText(/^firm/i), 'Current Firm')
    await user.click(within(freshDialog).getByRole('button', { name: 'Send request' }))
    expect(await within(freshDialog).findByRole('status')).toHaveTextContent('Request received.')
    expect(submit).toHaveBeenCalledTimes(2)
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

  it('hides an already-visible scroll hint when navigating to a section hash', () => {
    vi.useFakeTimers()
    render(
      <MemoryRouter>
        <StagePage />
        <Link to="/#intro">Navigate to platform</Link>
      </MemoryRouter>,
    )
    act(() => vi.advanceTimersByTime(5000))
    expect(screen.getByRole('button', { name: 'Scroll down' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('link', { name: 'Navigate to platform' }))
    expect(screen.queryByRole('button', { name: 'Scroll down' })).not.toBeInTheDocument()
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
    expect(document.getElementById('intro')).toBeVisible()
    expect(within(screen.getByRole('region', { name: 'Laminar Apex' })).getByRole('button', { name: 'Request a Demo' })).toBeVisible()
  })

  it('retains submitted values and allows retry after a server error', async () => {
    const user = userEvent.setup()
    const submit = vi.spyOn(window, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
    renderStage()
    await user.click(screen.getAllByRole('button', { name: 'Request a Demo' })[0])
    await user.type(screen.getByLabelText(/^name/i), 'Example Advisor')
    await user.type(screen.getByLabelText(/email/i), 'advisor@example.com')
    await user.type(screen.getByLabelText(/^firm/i), 'Example Firm')
    await user.click(screen.getByRole('button', { name: 'Send request' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not send your request. Try again.')
    expect(screen.getByLabelText(/^name/i)).toHaveValue('Example Advisor')
    expect(screen.getByLabelText(/email/i)).toHaveValue('advisor@example.com')
    expect(screen.getByLabelText(/^firm/i)).toHaveValue('Example Firm')
    expect(screen.getByRole('button', { name: 'Send request' })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: 'Send request' }))
    expect(await screen.findByRole('status')).toHaveTextContent('Request received.')
    expect(submit).toHaveBeenCalledTimes(2)
  })
})
