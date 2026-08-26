import { afterEach, describe, expect, it, vi } from 'vitest'
import { submitRequestAccess, validateRequestAccess } from './requestAccess'

afterEach(() => vi.restoreAllMocks())

describe('validateRequestAccess', () => {
  it('requires name, firm, and a valid email', () => {
    expect(validateRequestAccess({ name: '', email: '', firm: '' })).toEqual({
      name: 'Enter your name.',
      email: 'Enter a valid work email.',
      firm: 'Enter your firm name.',
    })
    expect(validateRequestAccess({ name: 'Nolan', email: 'nolan@example.com', firm: 'Northstar' })).toEqual({})
  })

  it('does not mention role', () => {
    expect(validateRequestAccess({ name: 'Nolan', email: 'bad', firm: 'Northstar' })).toEqual({
      email: 'Enter a valid work email.',
    })
  })
})

describe('submitRequestAccess', () => {
  it('POSTs JSON and resolves on ok', async () => {
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue(new Response(null, { status: 204 }))
    await submitRequestAccess({ name: 'Nolan', email: 'nolan@example.com', firm: 'Northstar' })
    expect(fetchSpy).toHaveBeenCalledWith('/api/request-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Nolan', email: 'nolan@example.com', firm: 'Northstar' }),
    })
  })

  it('throws a retryable message when the request fails', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))
    await expect(
      submitRequestAccess({ name: 'Nolan', email: 'nolan@example.com', firm: 'Northstar' }),
    ).rejects.toThrow('Could not send your request. Try again.')
  })
})
