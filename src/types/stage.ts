export type SceneId = 'households' | 'rebalance' | 'analytics'
export type AccessStatus = 'closed' | 'open' | 'submitting' | 'success' | 'error'

export type StageState = {
  scene: SceneId | 'none'
  access: AccessStatus
  accessError: string | null
}
