import { describe, expect, it } from 'vitest'
import { STAGE_CAPTIONS, stageBook } from './stageBook'

describe('stageBook', () => {
  it('is one book: five households, all used by library, Chen used by the other scenes', () => {
    expect(stageBook.households).toHaveLength(5)
    expect(stageBook.households.every((row) => row.status === 'At Risk')).toBe(true)
    expect(stageBook.featured.name).toBe('Chen Family')
    expect(stageBook.featured.aum).toBe(stageBook.households[0].aum)
    expect(stageBook.rebalance.household).toBe('Chen Family')
    expect(stageBook.analytics.household).toBe('Chen Family')
  })

  it('exposes one-line captions', () => {
    expect(STAGE_CAPTIONS.households).toBe('The book, and who needs attention.')
    expect(STAGE_CAPTIONS.rebalance).toBe('Propose the trades, with tax in view.')
    expect(STAGE_CAPTIONS.analytics).toBe('Tax and allocation in one place.')
  })
})
