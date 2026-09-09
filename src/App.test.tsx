import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

const renderAt = (path: string) => {
  window.history.pushState({}, '', path)
  return render(<App />)
}

describe('public routes', () => {
  it('renders the stage at /', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { name: 'LAMINAR' })).toBeInTheDocument()
  })

  it('renders a recovery route for unknown paths', () => {
    renderAt('/missing-page')
    expect(screen.getByRole('heading', { name: 'Page not found.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /return home/i })).toHaveAttribute('href', '/')
  })
})
