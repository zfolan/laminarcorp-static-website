export type NavigationItem = {
  label: string
  href: string
}

export type ContextSource = {
  label: string
  value: string
  side: 'left' | 'right'
}

export type DecisionRecord = {
  household: string
  signal: string
  impact: string
  state: 'review' | 'ready' | 'watch' | 'new'
}

export type TrustStatement = {
  title: string
  description: string
}

export type LandingContent = {
  navigation: NavigationItem[]
  hero: {
    eyebrow: string
    title: string
    description: string
  }
  context: {
    eyebrow: string
    title: string
    description: string
    sources: ContextSource[]
  }
  decision: {
    eyebrow: string
    title: string
    description: string
    records: DecisionRecord[]
  }
  output: {
    eyebrow: string
    title: string
    description: string
  }
  trust: TrustStatement[]
}

export type RequestAccessFormData = {
  name: string
  email: string
  firm: string
  role: string
  workflow: string
}
