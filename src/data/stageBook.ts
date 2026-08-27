import type { SceneId } from '../types/stage'

export type SleeveWeights = { equity: number; fixedIncome: number; cash: number }

export type HouseholdRow = {
  name: string
  code: string
  accounts: number
  aum: number
  drift: number
  equityDrift: number
  fixedIncomeDrift: number
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
  sharesBefore: number
  price: number
  currency: 'CAD' | 'USD'
  tradeValue: number
  capitalGain: number
  deviation: string
  status: 'Ready' | 'Review' | 'Off Model'
}

export type AccountGroup = {
  type: string
  id: string
  value: number
  cash: number
  net: number
  color: string
  trades: TradeRow[]
}

export const STAGE_CAPTIONS: Record<SceneId, string> = {
  households: 'The book, and who needs attention.',
  rebalance: 'Propose the trades, with tax in view.',
  analytics: 'Insights, from every angle.',
}

export const STAGE_INTRO = {
  title: 'An Advanced Portfolio Management System Built for Modern Wealth Management',
  lead: 'Our portfolio management system is designed to transform the way investment portfolios are managed—from portfolio construction and household-level analysis to tax-aware rebalancing, trade generation, and implementation.',
  body: 'Rather than simply identifying portfolio drift, the system helps determine what needs to change, where the change should occur, and how it can be implemented most efficiently.',
}

export type StageBlurb = { title: string; body: string }

export const STAGE_PREFACE: Partial<Record<SceneId, StageBlurb[]>> = {
  households: [
    {
      title: 'One Household. One Portfolio. One Intelligent System.',
      body: 'Traditional portfolio management tools often analyze accounts individually. Our system takes a household-level approach, allowing portfolio managers to view and manage multiple accounts as one integrated investment portfolio.',
    },
  ],
  rebalance: [
    {
      title: 'Intelligent Rebalancing',
      body: 'The system determines what to trade, how much, and in which accounts—working through cash, CAD/USD, and lot sizes, and flagging exceptions so the process stays consistent and controlled.',
    },
    {
      title: 'Tax-Aware Portfolio Management',
      body: 'The system folds estimated capital gains, wash sales, and account-specific tax opportunities into the rebalance—so the question is the most efficient way to implement the change across the household, not only what to sell.',
    },
    {
      title: 'Intelligent Asset Location',
      body: 'The system considers where holdings sit, not only what is owned—registered and non-registered—so placement stays tax-efficient at the household level.',
    },
    {
      title: 'Exception-Based Portfolio Management',
      body: 'The system surfaces the issues that need judgment—concentration, cash, taxable gains, currency, drift, restrictions, model breaks, trading limits, household overlap—so the manager can review, modify, and approve.',
    },
  ],
  analytics: [
    {
      title: 'One View of the Household',
      body: 'The system brings the household together in a single view—so you can see the full picture, not a pile of separate accounts.',
    },
    {
      title: 'See How the Book Stands',
      body: 'The system shows the household as it is, against how it should look—so the gaps are obvious, and so is what matters first.',
    },
  ],
}

export const STAGE_OUTRO: StageBlurb[] = [
  {
    title: 'Designed to Scale',
    body: 'The system lets teams manage more assets and more complex households without a matching rise in workload—so professionals spend time on investment decisions, client relationships, tax and planning, risk, and oversight.',
  },
  {
    title: 'More Than a Rebalancing Tool',
    body: 'It is an intelligent portfolio management and implementation platform—connecting construction, household analysis, risk, tax, and trade execution in one workflow. The goal is better information, better implementation, and more time managing client wealth.',
  },
]

const target80 = { equity: 0.80, fixedIncome: 0.19, cash: 0.01 }
const eqLm = 'Core Equity 1M+'
const eqCore = 'Core Equity 0–500k'
const fiModel = 'Core Fixed Income'

const chen: HouseholdRow = {
  name: 'Chen Family',
  code: 'CH-2041',
  accounts: 5,
  aum: 3_340_000,
  drift: 0.494,
  equityDrift: 0.494,
  fixedIncomeDrift: 0.414,
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
      code: 'RV-1184',
      accounts: 4,
      aum: 1_500_000,
      drift: 0.274,
      equityDrift: 0.274,
      fixedIncomeDrift: 0.071,
      status: 'At Risk' as const,
      equityModel: eqLm,
      fixedIncomeModel: fiModel,
      target: target80,
      current: { equity: 0.526, fixedIncome: 0.261, cash: 0.213 },
    },
    {
      name: 'Patel Family',
      code: 'PT-3308',
      accounts: 5,
      aum: 2_000_000,
      drift: 0.228,
      equityDrift: 0.228,
      fixedIncomeDrift: 0.213,
      status: 'At Risk' as const,
      equityModel: eqCore,
      fixedIncomeModel: fiModel,
      target: target80,
      current: { equity: 0.572, fixedIncome: 0.403, cash: 0.025 },
    },
    {
      name: 'Okoye Trust',
      code: 'OK-0912',
      accounts: 3,
      aum: 1_060_000,
      drift: 0.322,
      equityDrift: 0.312,
      fixedIncomeDrift: 0.322,
      status: 'At Risk' as const,
      equityModel: eqLm,
      fixedIncomeModel: fiModel,
      target: target80,
      current: { equity: 0.488, fixedIncome: 0.512, cash: 0 },
    },
    {
      name: 'Berg Holdings',
      code: 'BG-5520',
      accounts: 4,
      aum: 490_000,
      drift: 0.20,
      equityDrift: 0.20,
      fixedIncomeDrift: 0.19,
      status: 'At Risk' as const,
      equityModel: eqCore,
      fixedIncomeModel: fiModel,
      target: target80,
      current: { equity: 1, fixedIncome: 0, cash: 0 },
    },
  ],
  featured: chen,
  rebalance: {
    household: 'Chen Family',
    accountsInHousehold: chen.accounts,
    current: chen.current,
    target: chen.target,
    tradeImpact: { equity: 1_650_000, fixedIncome: -1_382_000, cash: -40_178 },
    projected: { equity: 0.800, fixedIncome: 0.190, cash: 0.010 },
    sleeveValues: {
      equity: { current: 1_022_000, projected: 2_672_000, target: 2_672_000 },
      fixedIncome: { current: 2_017_000, projected: 635_000, target: 635_000 },
      cash: { current: 304_000, projected: 33_400, target: 33_400 },
    },
    metrics: { trades: 38, buys: 24, sells: 14, netCash: -40_178, usdNet: -2_140 },
    accounts: [
      {
        type: 'RRSP',
        id: '8821',
        value: 237_800,
        cash: 18_420,
        net: -12_386,
        color: '#3b82f6',
        trades: [
          { ticker: 'ZCS', name: 'BMO Short Corporate Bond ETF', action: 'SELL' as const, qty: -3144, sharesBefore: 4200, price: 13.95, currency: 'CAD' as const, tradeValue: -43_859, capitalGain: 12, deviation: 'FI +15.0%', status: 'Review' as const },
          { ticker: 'XLV', name: 'Health Care Select Sector SPDR', action: 'BUY' as const, qty: 49, sharesBefore: 0, price: 197.99, currency: 'USD' as const, tradeValue: 9_702, capitalGain: 0, deviation: 'EQ −2.5%', status: 'Ready' as const },
          { ticker: 'AAPL', name: 'Apple', action: 'BUY' as const, qty: 12, sharesBefore: 0, price: 428.67, currency: 'USD' as const, tradeValue: 5_144, capitalGain: 0, deviation: 'EQ −0.9%', status: 'Ready' as const },
          { ticker: 'GOOG', name: 'Alphabet', action: 'BUY' as const, qty: 35, sharesBefore: 0, price: 475.06, currency: 'USD' as const, tradeValue: 16_627, capitalGain: 0, deviation: 'EQ −4.1%', status: 'Ready' as const },
        ],
      },
      {
        type: 'TFSA',
        id: '4410',
        value: 73_453,
        cash: 8_210,
        net: 51,
        color: '#22c55e',
        trades: [
          { ticker: 'DYN6004', name: 'Dynamic Power American Growth', action: 'SELL' as const, qty: -5015, sharesBefore: 5015, price: 1, currency: 'CAD' as const, tradeValue: -5_015, capitalGain: 0, deviation: 'Off model', status: 'Off Model' as const },
          { ticker: 'BN', name: 'Brookfield', action: 'BUY' as const, qty: 87, sharesBefore: 0, price: 58.23, currency: 'CAD' as const, tradeValue: 5_066, capitalGain: 0, deviation: 'EQ −1.7%', status: 'Ready' as const },
        ],
      },
      {
        type: 'CAD TAXABLE',
        id: '2294',
        value: 102_699,
        cash: 41_200,
        net: 17_186,
        color: '#0891B2',
        trades: [
          { ticker: 'DYN6004', name: 'Dynamic Power American Growth', action: 'SELL' as const, qty: -32263, sharesBefore: 32263, price: 1, currency: 'CAD' as const, tradeValue: -32_263, capitalGain: 0, deviation: 'Off model', status: 'Off Model' as const },
          { ticker: 'ZSP', name: 'BMO S&P 500 Index ETF', action: 'BUY' as const, qty: 425, sharesBefore: 0, price: 116.35, currency: 'CAD' as const, tradeValue: 49_449, capitalGain: 0, deviation: 'EQ −12.9%', status: 'Ready' as const },
        ],
      },
    ] satisfies AccountGroup[],
  },
  analytics: {
    household: 'Chen Family',
    total: chen.aum,
    holdingsCount: 18,
    sleeves: {
      equity: { value: 1_022_000, weight: chen.current.equity, target: chen.target.equity },
      fixedIncome: { value: 2_017_000, weight: chen.current.fixedIncome, target: chen.target.fixedIncome },
      cash: { value: 304_000, weight: chen.current.cash, target: chen.target.cash },
      offModel: { value: 110_000, weight: 0.033, count: 1 },
    },
    drift: chen.drift,
    sectors: [
      { name: 'Other', current: 0.145, model: 0.329, drift: -0.184, color: '#9aa8b6' },
      { name: 'Utilities', current: 0.156, model: 0.056, drift: 0.10, color: '#5b9a8a' },
      { name: 'Health Care', current: 0.071, model: 0, drift: 0.071, color: '#c47a8a' },
      { name: 'Information Technology', current: 0.13, model: 0.076, drift: 0.054, color: '#6a92c4' },
      { name: 'Industrials', current: 0.053, model: 0.086, drift: -0.033, color: '#8a9bb0' },
    ],
    currency: { cad: 0.917, usd: 0.083, cadValue: 3_063_000, usdValue: 277_000 },
    currencySleeves: [
      { id: 'EQ', label: 'Equity', total: 1_022_000, cad: 0.69, usd: 0.31 },
      { id: 'FI', label: 'Fixed income', total: 2_017_000, cad: 1, usd: 0 },
    ],
    holdings: [
      { ticker: 'GIC', name: 'CCSCU GIC 3.45% 19JUL27A', sleeve: 'FI' as const, account: 'RRSP 1', shares: 401_000, avgCost: 1, bookValue: 401_000, weight: 0.12, modelTarget: 0.19, drift: 0.447, status: 'Overweight' as const },
      { ticker: 'ZCS', name: 'BMO Short Corporate Bond ETF', sleeve: 'FI' as const, account: 'RRSP 1', shares: 22_500, avgCost: 13.95, bookValue: 314_000, weight: 0.094, modelTarget: 0.19, drift: 0.447, status: 'Overweight' as const },
      { ticker: 'DYN6004', name: 'Dynamic Power American Growth', sleeve: 'EQ' as const, account: 'CAD TAXABLE', shares: 227_000, avgCost: 1, bookValue: 227_000, weight: 0.068, modelTarget: 0, drift: 0.12, status: 'Off Model' as const },
      { ticker: 'VSC', name: 'Vanguard CDN SHT TRM BD ETF', sleeve: 'FI' as const, account: 'TFSA', shares: 7_840, avgCost: 24.7, bookValue: 194_000, weight: 0.058, modelTarget: 0.19, drift: 0.447, status: 'Overweight' as const },
    ],
    largest: [
      { ticker: 'GIC', name: 'CCSCU GIC 3.45% 19JUL27A', value: 401_000, weight: 0.12 },
      { ticker: 'ZCS', name: 'BMO Short Corporate Bond ETF', value: 314_000, weight: 0.094 },
      { ticker: 'DYN6004', name: 'Dynamic Power American Growth', value: 227_000, weight: 0.068 },
      { ticker: 'XSH', name: 'iShares Core Canadian SHT ETF', value: 201_000, weight: 0.06 },
      { ticker: 'VSC', name: 'Vanguard CDN SHT TRM BD ETF', value: 194_000, weight: 0.058 },
    ],
  },
}
