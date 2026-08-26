import type { LandingContent } from '../types/content'

export const landingContent: LandingContent = {
  navigation: [
    { label: 'Platform', href: '/#platform' },
    { label: 'Security', href: '/#security' },
    { label: 'Company', href: '/#company' },
  ],
  hero: {
    eyebrow: 'PORTFOLIO DECISIONS / CARRIED THROUGH',
    title: 'Know what needs you next.',
    description: 'Apex turns connected portfolio context into a clear, controlled path from attention to client-ready action.',
  },
  context: {
    eyebrow: '01 / CONNECT',
    title: 'Every signal lands in one decision system.',
    description: 'Identity, holdings, mandate rules, tax context, and market movement arrive as a single reviewable thread—not another dashboard to reconcile.',
    sources: [
      { label: 'HOUSEHOLDS', value: '148', side: 'left' },
      { label: 'ACCOUNTS', value: '412', side: 'left' },
      { label: 'MANDATES', value: '37', side: 'left' },
      { label: 'MARKET SIGNALS', value: 'LIVE', side: 'right' },
      { label: 'TAX CONTEXT', value: 'SYNCED', side: 'right' },
      { label: 'POLICY RULES', value: '23', side: 'right' },
    ],
  },
  decision: {
    eyebrow: '02 / DECIDE',
    title: 'Attention becomes a reviewable decision.',
    description: 'One priority stays in view while context, allocation, and policy checks resolve around it.',
    records: [
      { household: 'Northbridge Household', signal: 'Cash drift', impact: '$248k', state: 'review' },
      { household: 'Arbor Ridge Family', signal: 'Concentration', impact: '$1.2m', state: 'ready' },
      { household: 'Westlake Foundation', signal: 'Tax-loss', impact: '$86k', state: 'watch' },
      { household: 'Cedar Point Trust', signal: 'Policy exception', impact: '$410k', state: 'new' },
    ],
  },
  output: {
    eyebrow: '03 / CARRY FORWARD',
    title: 'Review once. Carry the context forward.',
    description: 'The approved decision becomes a client-ready proposal without losing rationale, approvals, or history.',
  },
  trust: [
    { title: 'Permission-aware workflows', description: 'Keep portfolio work aligned to each team member’s operating role.' },
    { title: 'Review and approval controls', description: 'Professional judgment remains visible at every decision point.' },
    { title: 'Traceable decision history', description: 'Carry rationale, checks, and approvals into the client conversation.' },
  ],
}
