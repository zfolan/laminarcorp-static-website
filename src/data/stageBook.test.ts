import { describe, expect, it } from 'vitest'
import { STAGE_CAPTIONS, STAGE_INTRO, STAGE_OUTRO, STAGE_PREFACE, stageBook } from './stageBook'

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
    expect(STAGE_CAPTIONS.analytics).toBe('Insights, from every angle.')
  })

  it('exposes the system intro copy', () => {
    expect(STAGE_INTRO.title).toMatch(/portfolio management system/i)
    expect(STAGE_INTRO.lead).toMatch(/household-level analysis/i)
    expect(STAGE_INTRO.body).toMatch(/what needs to change/i)
  })

  it('exposes household preface copy', () => {
    expect(STAGE_PREFACE.households?.[0].title).toMatch(/one household/i)
    expect(STAGE_PREFACE.households?.[0].body).toMatch(/household-level approach/i)
  })

  it('exposes rebalance preface copy', () => {
    expect(STAGE_PREFACE.rebalance?.map((blurb) => blurb.title)).toEqual([
      'Intelligent Rebalancing',
      'Tax-Aware Portfolio Management',
      'Intelligent Asset Location',
      'Exception-Based Portfolio Management',
    ])
    expect(STAGE_PREFACE.rebalance?.[0].body).toMatch(/what to trade/i)
    expect(STAGE_PREFACE.rebalance?.every((blurb) => !/traditional/i.test(blurb.body))).toBe(true)
  })

  it('exposes analytics preface copy', () => {
    expect(STAGE_PREFACE.analytics?.map((blurb) => blurb.title)).toEqual([
      'One View of the Household',
      'See How the Book Stands',
    ])
    expect(STAGE_PREFACE.analytics?.[0].body).toMatch(/full picture/i)
  })

  it('exposes closing blurbs', () => {
    expect(STAGE_OUTRO.map((blurb) => blurb.title)).toEqual([
      'Designed to Scale',
      'More Than a Rebalancing Tool',
    ])
  })
})
