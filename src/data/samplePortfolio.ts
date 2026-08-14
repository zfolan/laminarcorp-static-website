export type PortfolioAccount = {
  id: string
  name: string
  registration: string
  currency: 'CAD' | 'USD'
  value: string
  allocation: { equity: number; fixedIncome: number; cash: number }
}

export type ProposedTrade = {
  side: 'Buy' | 'Sell'
  ticker: string
  security: string
  account: string
  amount: string
  reason: string
  status: 'Ready' | 'Review'
}

export const sampleHousehold = {
  name: 'Meridian Household',
  value: '$4,286,400',
  model: 'Balanced Growth 70/30',
  drift: '4.8%',
  accounts: [
    { id: 'RSP-1842', name: 'Retirement', registration: 'Registered', currency: 'CAD', value: '$1,482,600', allocation: { equity: 68, fixedIncome: 29, cash: 3 } },
    { id: 'NR-2901', name: 'Investment', registration: 'Non-registered', currency: 'CAD', value: '$1,934,200', allocation: { equity: 77, fixedIncome: 20, cash: 3 } },
    { id: 'USD-0834', name: 'US investment', registration: 'Non-registered', currency: 'USD', value: '$652,400', allocation: { equity: 84, fixedIncome: 12, cash: 4 } },
    { id: 'TF-4410', name: 'Tax-free', registration: 'Registered', currency: 'CAD', value: '$217,200', allocation: { equity: 73, fixedIncome: 23, cash: 4 } },
  ] satisfies PortfolioAccount[],
  currentAllocation: { equity: 75, fixedIncome: 22, cash: 3 },
  targetAllocation: { equity: 70, fixedIncome: 27, cash: 3 },
}

export const proposedTrades: ProposedTrade[] = [
  { side: 'Sell', ticker: 'NTH', security: 'Northfield Equity', account: 'NR-2901', amount: '$86,000', reason: 'Reduce concentration', status: 'Review' },
  { side: 'Buy', ticker: 'CDB', security: 'Core Bond Fund', account: 'RSP-1842', amount: '$74,500', reason: 'Restore fixed income', status: 'Ready' },
  { side: 'Buy', ticker: 'GLB', security: 'Global Equity Fund', account: 'TF-4410', amount: '$24,300', reason: 'Close model gap', status: 'Ready' },
  { side: 'Sell', ticker: 'UST', security: 'US Treasury Fund', account: 'USD-0834', amount: 'US$18,600', reason: 'Fund USD purchase', status: 'Review' },
]

export const exceptionQueue = [
  { type: 'Tax', title: 'Estimated taxable gain', detail: 'NR-2901 · Northfield Equity', value: '$14,820', tone: 'amber' },
  { type: 'Currency', title: 'USD cash required', detail: 'USD-0834 · Proposed purchase', value: 'US$6,400', tone: 'amber' },
  { type: 'Restriction', title: 'Account restriction', detail: 'TF-4410 · Security not permitted', value: 'Review', tone: 'red' },
]

export const workflowStages = [
  'Model',
  'Household analysis',
  'Drift & risk',
  'Optimization',
  'Trade recommendations',
  'Review',
  'Implementation',
]

export const demoHouseholdQueue = [
  { name: 'Alder Household', accounts: 4, value: '$3.84M', current: '68 / 28 / 4', target: '72 / 25 / 3', drift: '4.2%', status: 'At risk' },
  { name: 'Westbridge Household', accounts: 3, value: '$2.15M', current: '64 / 31 / 5', target: '67 / 29 / 4', drift: '3.1%', status: 'Review' },
  { name: 'Northstar Family', accounts: 6, value: '$5.60M', current: '73 / 24 / 3', target: '72 / 25 / 3', drift: '1.8%', status: 'Review' },
  { name: 'Juniper Household', accounts: 2, value: '$1.29M', current: '70 / 27 / 3', target: '70 / 27 / 3', drift: '0.4%', status: 'On target' },
]

export const demoAnalytics = {
  value: '$3.84M',
  holdings: '61',
  equity: '68%',
  fixedIncome: '28%',
  cash: '4%',
  currency: [
    { label: 'CAD', value: 73 },
    { label: 'USD', value: 27 },
  ],
  drift: [
    { label: 'Canadian equity', current: 24, target: 20, difference: '+4.0%' },
    { label: 'Global equity', current: 30, target: 34, difference: '−4.0%' },
    { label: 'Fixed income', current: 28, target: 25, difference: '+3.0%' },
    { label: 'Cash', current: 4, target: 3, difference: '+1.0%' },
  ],
}

export const demoDeployment = {
  reviewedTrades: 12,
  accounts: 4,
  tranches: [
    { name: 'Core rebalance', orders: 7, currency: 'CAD', status: 'Ready' },
    { name: 'USD funding', orders: 3, currency: 'USD', status: 'Ready' },
    { name: 'Tax-sensitive review', orders: 2, currency: 'CAD', status: 'Held' },
  ],
}
