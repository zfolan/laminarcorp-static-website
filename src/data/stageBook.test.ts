import { describe, expect, it } from 'vitest'
import { stageBook } from './stageBook'

describe('stageBook', () => {
  it('keeps household aggregates and the separate deployment mandate consistent', () => {
    const { featured, rebalance, analytics, proposal, implementation } = stageBook
    const sleeves = ['equity', 'fixedIncome', 'cash'] as const

    expect(sleeves.reduce((sum, sleeve) => sum + rebalance.sleeveValues[sleeve].current, 0)).toBe(featured.aum)
    for (const sleeve of sleeves) {
      const values = rebalance.sleeveValues[sleeve]
      expect(featured.current[sleeve]).toBeCloseTo(values.current / featured.aum)
      expect(analytics.sleeves[sleeve].value).toBe(values.current)
      expect(values.target).toBeCloseTo(featured.target[sleeve] * featured.aum)
      expect(values.projected).toBeCloseTo(featured.target[sleeve] * featured.aum)
      expect(values.projected).toBe(values.current + rebalance.tradeImpact[sleeve])
    }
    expect(rebalance.metrics.netCash).toBe(rebalance.sleeveValues.cash.projected - rebalance.sleeveValues.cash.current)
    expect(implementation.events.reduce((sum, event) => sum + event.weight, 0)).toBeCloseTo(1)
    expect(implementation.events.reduce((sum, event) => sum + event.releaseEstimate, 0)).toBe(proposal.investmentAmount)
  })
})
