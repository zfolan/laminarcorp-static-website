import type { AccessStatus, SceneId, StageState } from '../types/stage'

export type StageAction =
  | { type: 'open-scene'; scene: SceneId }
  | { type: 'close-scene' }
  | { type: 'open-access' }
  | { type: 'close-access' }
  | { type: 'submit-access' }
  | { type: 'access-success' }
  | { type: 'access-error'; message: string }
  | { type: 'escape' }

export const initialStageState: StageState = {
  scene: 'none',
  access: 'closed',
  accessError: null,
}

export const reduceStage = (state: StageState, action: StageAction): StageState => {
  switch (action.type) {
    case 'open-scene':
      return { ...state, scene: action.scene }
    case 'close-scene':
      return { ...state, scene: 'none' }
    case 'open-access':
      return { ...state, access: 'open', accessError: null }
    case 'close-access':
      return { ...state, access: 'closed', accessError: null }
    case 'submit-access':
      return { ...state, access: 'submitting', accessError: null }
    case 'access-success':
      return { ...state, access: 'success', accessError: null }
    case 'access-error':
      return { ...state, access: 'error', accessError: action.message }
    case 'escape':
      if (state.access !== 'closed') return { ...state, access: 'closed', accessError: null }
      if (state.scene !== 'none') return { ...state, scene: 'none' }
      return state
  }
}

export type { AccessStatus, SceneId, StageState }
