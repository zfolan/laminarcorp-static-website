import { render, screen } from '@testing-library/react'
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
})
