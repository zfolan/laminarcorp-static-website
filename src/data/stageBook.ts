import type { SceneId } from '../types/stage'

export type SleeveWeights = { equity: number; fixedIncome: number; cash: number }

export type HouseholdRow = {
  name: string
  accounts: number
  aum: number
  drift: number
  status: 'At Risk'
  target: SleeveWeights
  current: SleeveWeights
}

export type TradeRow = {
  ticker: string
  name: string
  action: 'BUY' | 'SELL'
  qty: number
  tradeValue: number
  capitalGain: number
}

export type AccountGroup = {
  type: string
  value: number
  trades: TradeRow[]
}

export const STAGE_CAPTIONS: Record<SceneId, string> = {
  households: 'The book, and who needs attention.',
  rebalance: 'Propose the trades, with tax in view.',
  analytics: 'Tax and allocation in one place.',
}

const chen: HouseholdRow = {
  name: 'Chen Family',
  accounts: 5,
  aum: 3_340_000,
  drift: 0.494,
  status: 'At Risk',
  target: { equity: 0.80, fixedIncome: 0.19, cash: 0.01 },
  current: { equity: 0.306, fixedIncome: 0.604, cash: 0.091 },
}

export const stageBook = {
  strip: { atRisk: 5, households: 5, totalAum: 8_390_000 },
  households: [
    chen,
    {
      name: 'Rivera Household',
      accounts: 4,
      aum: 1_500_000,
      drift: 0.274,
      status: 'At Risk' as const,
      target: { equity: 0.80, fixedIncome: 0.19, cash: 0.01 },
      current: { equity: 0.526, fixedIncome: 0.261, cash: 0.213 },
    },
    {
      name: 'Patel Family',
      accounts: 5,
      aum: 2_000_000,
      drift: 0.228,
      status: 'At Risk' as const,
      target: { equity: 0.80, fixedIncome: 0.19, cash: 0.01 },
      current: { equity: 0.572, fixedIncome: 0.403, cash: 0.025 },
    },
    {
      name: 'Okoye Trust',
      accounts: 3,
      aum: 1_060_000,
      drift: 0.322,
      status: 'At Risk' as const,
      target: { equity: 0.80, fixedIncome: 0.19, cash: 0.01 },
      current: { equity: 0.488, fixedIncome: 0.512, cash: 0 },
    },
    {
      name: 'Berg Holdings',
      accounts: 4,
      aum: 490_000,
      drift: 0.20,
      status: 'At Risk' as const,
      target: { equity: 0.80, fixedIncome: 0.19, cash: 0.01 },
      current: { equity: 1, fixedIncome: 0, cash: 0 },
    },
  ],
  featured: chen,
  rebalance: {
    household: 'Chen Family',
    current: chen.current,
    target: chen.target,
    tradeImpact: { equity: 1_650_000, fixedIncome: -1_380_000, cash: -42_000 },
    accounts: [
      {
        type: 'RRSP',
        value: 237_800,
        trades: [
          { ticker: 'ZCS', name: 'BMO Short Corporate Bond ETF', action: 'SELL' as const, qty: -3144, tradeValue: -43_859, capitalGain: 12 },
          { ticker: 'XLV', name: 'Health Care Select Sector SPDR', action: 'BUY' as const, qty: 49, tradeValue: 9_702, capitalGain: 0 },
          { ticker: 'AAPL', name: 'Apple', action: 'BUY' as const, qty: 12, tradeValue: 5_144, capitalGain: 0 },
        ],
      },
      {
        type: 'CAD TAXABLE',
        value: 102_699,
        trades: [
          { ticker: 'DYN6004', name: 'Dynamic Power American Growth', action: 'SELL' as const, qty: -32263, tradeValue: -32_263, capitalGain: 0 },
          { ticker: 'BN', name: 'Brookfield', action: 'BUY' as const, qty: 87, tradeValue: 5_066, capitalGain: 0 },
        ],
      },
    ] satisfies AccountGroup[],
  },
  analytics: {
    household: 'Chen Family',
    total: chen.aum,
    sleeves: {
      equity: { value: 1_022_000, weight: chen.current.equity, target: chen.target.equity },
      fixedIncome: { value: 2_017_000, weight: chen.current.fixedIncome, target: chen.target.fixedIncome },
      cash: { value: 304_000, weight: chen.current.cash, target: chen.target.cash },
      offModel: { value: 110_000, weight: 0.033 },
    },
    drift: chen.drift,
    sectors: [
      { name: 'Other', current: 0.145, model: 0.329, drift: -0.184 },
      { name: 'Utilities', current: 0.156, model: 0.056, drift: 0.10 },
      { name: 'Health Care', current: 0.071, model: 0, drift: 0.071 },
      { name: 'Information Technology', current: 0.13, model: 0.076, drift: 0.054 },
    ],
    currency: { cad: 0.917, usd: 0.083, cadValue: 3_063_000, usdValue: 277_000 },
  },
}
