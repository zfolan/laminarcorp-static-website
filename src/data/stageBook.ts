import type { SceneId } from '../types/stage'

export type SleeveWeights = { equity: number; fixedIncome: number; cash: number }

export type HouseholdRow = {
  name: string
  accounts: number
  aum: number
  drift: number
  status: 'At Risk'
  equityModel: string
  fixedIncomeModel: string
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
  deviation: string
  status: 'Ready' | 'Review' | 'Off Model'
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

const target80 = { equity: 0.80, fixedIncome: 0.19, cash: 0.01 }
const eqLm = 'equity-model-1m-plus'
const fiModel = 'Nice-Fixed-Income-Model'

const chen: HouseholdRow = {
  name: 'Chen Family',
  accounts: 5,
  aum: 3_340_000,
  drift: 0.494,
  status: 'At Risk',
  equityModel: eqLm,
  fixedIncomeModel: fiModel,
  target: target80,
  current: { equity: 0.306, fixedIncome: 0.604, cash: 0.091 },
}

export const stageBook = {
  strip: { atRisk: 5, review: 0, onTarget: 0, households: 5, totalAum: 8_390_000 },
  households: [
    chen,
    {
      name: 'Rivera Household',
      accounts: 4,
      aum: 1_500_000,
      drift: 0.274,
      status: 'At Risk' as const,
      equityModel: eqLm,
      fixedIncomeModel: fiModel,
      target: target80,
      current: { equity: 0.526, fixedIncome: 0.261, cash: 0.213 },
    },
    {
      name: 'Patel Family',
      accounts: 5,
      aum: 2_000_000,
      drift: 0.228,
      status: 'At Risk' as const,
      equityModel: 'equity-model-0-500k',
      fixedIncomeModel: fiModel,
      target: target80,
      current: { equity: 0.572, fixedIncome: 0.403, cash: 0.025 },
    },
    {
      name: 'Okoye Trust',
      accounts: 3,
      aum: 1_060_000,
      drift: 0.322,
      status: 'At Risk' as const,
      equityModel: eqLm,
      fixedIncomeModel: fiModel,
      target: target80,
      current: { equity: 0.488, fixedIncome: 0.512, cash: 0 },
    },
    {
      name: 'Berg Holdings',
      accounts: 4,
      aum: 490_000,
      drift: 0.20,
      status: 'At Risk' as const,
      equityModel: 'equity-model-0-500k',
      fixedIncomeModel: fiModel,
      target: target80,
      current: { equity: 1, fixedIncome: 0, cash: 0 },
    },
  ],
  featured: chen,
  rebalance: {
    household: 'Chen Family',
    current: chen.current,
    target: chen.target,
    tradeImpact: { equity: 1_650_000, fixedIncome: -1_380_000, cash: -42_000 },
    projected: { equity: 0.800, fixedIncome: 0.190, cash: 0.010 },
    metrics: { trades: 38, buys: 24, sells: 14, netCash: -40_178 },
    accounts: [
      {
        type: 'RRSP',
        value: 237_800,
        trades: [
          { ticker: 'ZCS', name: 'BMO Short Corporate Bond ETF', action: 'SELL' as const, qty: -3144, tradeValue: -43_859, capitalGain: 12, deviation: 'FI +15.0%', status: 'Review' as const },
          { ticker: 'XLV', name: 'Health Care Select Sector SPDR', action: 'BUY' as const, qty: 49, tradeValue: 9_702, capitalGain: 0, deviation: 'EQ −2.5%', status: 'Ready' as const },
          { ticker: 'AAPL', name: 'Apple', action: 'BUY' as const, qty: 12, tradeValue: 5_144, capitalGain: 0, deviation: 'EQ −0.9%', status: 'Ready' as const },
          { ticker: 'GOOG', name: 'Alphabet', action: 'BUY' as const, qty: 35, tradeValue: 16_627, capitalGain: 0, deviation: 'EQ −4.1%', status: 'Ready' as const },
        ],
      },
      {
        type: 'TFSA',
        value: 73_453,
        trades: [
          { ticker: 'DYN6004', name: 'Dynamic Power American Growth', action: 'SELL' as const, qty: -5015, tradeValue: -5_015, capitalGain: 0, deviation: 'Off model', status: 'Off Model' as const },
          { ticker: 'BN', name: 'Brookfield', action: 'BUY' as const, qty: 87, tradeValue: 5_066, capitalGain: 0, deviation: 'EQ −1.7%', status: 'Ready' as const },
        ],
      },
      {
        type: 'CAD TAXABLE',
        value: 102_699,
        trades: [
          { ticker: 'DYN6004', name: 'Dynamic Power American Growth', action: 'SELL' as const, qty: -32263, tradeValue: -32_263, capitalGain: 0, deviation: 'Off model', status: 'Off Model' as const },
          { ticker: 'ZSP', name: 'BMO S&P 500 Index ETF', action: 'BUY' as const, qty: 425, tradeValue: 49_449, capitalGain: 0, deviation: 'EQ −12.9%', status: 'Ready' as const },
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
    holdings: [
      { ticker: 'GIC', name: 'CCSCU GIC 3.45% 19JUL27A', sleeve: 'FI', account: 'RRSP 1', weight: 0.12, drift: 0.447, status: 'Overweight' },
      { ticker: 'ZCS', name: 'BMO Short Corporate Bond ETF', sleeve: 'FI', account: 'RRSP 1', weight: 0.094, drift: 0.447, status: 'Overweight' },
      { ticker: 'DYN6004', name: 'Dynamic Power American Growth', sleeve: 'EQ', account: 'CAD TAXABLE', weight: 0.068, drift: 0.12, status: 'Off Model' },
      { ticker: 'VSC', name: 'Vanguard CDN SHT TRM BD ETF', sleeve: 'FI', account: 'TFSA', weight: 0.058, drift: 0.447, status: 'Overweight' },
    ],
    largest: [
      { ticker: 'GIC', name: 'CCSCU GIC 3.45% 19JUL27A', value: 401_000, weight: 0.12 },
      { ticker: 'ZCS', name: 'BMO Short Corporate Bond ETF', value: 314_000, weight: 0.094 },
      { ticker: 'DYN6004', name: 'Dynamic Power American Growth', value: 227_000, weight: 0.068 },
      { ticker: 'XSH', name: 'iShares Core Canadian SHT ETF', value: 201_000, weight: 0.06 },
    ],
  },
}
