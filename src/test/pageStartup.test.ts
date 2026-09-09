import { afterEach, describe, expect, it, vi } from 'vitest'
import html from '../../index.html?raw'

const startup = new DOMParser().parseFromString(html, 'text/html').querySelector('script:not([src])')!.textContent!
const listeners = vi.spyOn(window, 'addEventListener')

afterEach(() => {
  for (const [type, listener] of listeners.mock.calls) window.removeEventListener(type, listener)
  listeners.mockClear()
  vi.unstubAllGlobals()
  vi.mocked(window.scrollTo).mockClear()
  window.history.replaceState(null, '', '/')
})

describe('document startup', () => {
  it('reloads at the top without the section hash while preserving query and history state', () => {
    vi.stubGlobal('performance', { getEntriesByType: () => [{ type: 'reload' }] })
    window.history.replaceState({ key: 'current-entry' }, '', '/?motion=reduce#implementation')

    new Function(startup)()
    window.dispatchEvent(new Event('load'))

    expect(window.location.pathname + window.location.search + window.location.hash).toBe('/?motion=reduce')
    expect(window.history.state).toEqual({ key: 'current-entry' })
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' })
  })

  it('preserves a directly opened section link without forcing the page to the top', () => {
    vi.stubGlobal('performance', { getEntriesByType: () => [{ type: 'navigate' }] })
    window.history.replaceState(null, '', '/?motion=reduce#proposals')

    new Function(startup)()
    window.dispatchEvent(new Event('load'))

    expect(window.location.hash).toBe('#proposals')
    expect(window.scrollTo).not.toHaveBeenCalled()
  })
})
