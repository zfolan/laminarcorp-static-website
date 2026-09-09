export type SceneId = 'households' | 'analytics' | 'rebalance' | 'proposals' | 'implementation'
export type AccessStatus = 'closed' | 'open' | 'submitting' | 'success' | 'error'

export type StageState = {
  scene: SceneId | 'none'
  access: AccessStatus
  accessError: string | null
}
