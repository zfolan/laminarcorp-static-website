export const storyMoments = [
  {
    id: 'product',
    eyebrow: '01 / HOUSEHOLD PRIORITIES',
    title: 'Start with the households that need attention.',
    copy: 'Review household-level drift and priority states across the book, then open the relationship that warrants a closer look.',
    meta: ['Ranked by drift', 'Household status', 'Clear next action'],
  },
  {
    id: 'how-it-works',
    eyebrow: '02 / HOUSEHOLD ANALYTICS',
    title: 'Investigate what is driving the drift.',
    copy: 'Compare household allocation with model intent, then review exposure, currency, holdings, and the context that may change the decision.',
    meta: ['Current vs. target', 'Exposure + currency', 'Account context'],
  },
  {
    eyebrow: '03 / HOUSEHOLD REBALANCE',
    title: 'Turn the analysis into proposed account actions.',
    copy: 'Prepare household-level changes, see the projected allocation, and review where each proposed buy or sell may occur.',
    meta: ['Projected allocation', 'Account-aware trades', 'Cash utilization'],
    note: 'Laminar supports review of relevant tax context. It does not provide tax advice or promise a particular tax outcome.',
  },
  {
    eyebrow: '04 / PORTFOLIO-MANAGER REVIEW',
    title: 'Keep professional judgment in control.',
    copy: 'Review material exceptions, refine proposed changes, and approve only the trades that are ready to move forward.',
    meta: ['Focused exceptions', 'Review + refine', 'Approval control'],
  },
  {
    id: 'why-laminar',
    eyebrow: '05 / DEPLOYMENT CENTER',
    title: 'Stage reviewed trades into clear tranches.',
    copy: 'Organize approved account-level actions into reviewable trade groups while held items remain separate for further attention.',
    meta: ['Reviewed trades', 'Trade tranches', 'Held items separated'],
  },
  {
    eyebrow: '06 / TRADE EXPORT',
    title: 'Prepare approved trades for implementation.',
    copy: 'Confirm the selected tranche, included accounts, and remaining holds before preparing the reviewed trades for export.',
    meta: ['Export review', 'Account-level orders', 'Implementation ready'],
  },
] as const

export const storyFrameBounds = [0, 96, 219, 343, 466, 590, 714] as const
