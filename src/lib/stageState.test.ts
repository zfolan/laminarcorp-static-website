import { describe, expect, it } from 'vitest'
import { initialStageState, reduceStage, type StageAction } from './stageState'

const apply = (...actions: StageAction[]) =>
  actions.reduce(reduceStage, initialStageState)

describe('reduceStage', () => {
  it('starts with no scene and closed access', () => {
    expect(initialStageState).toEqual({
      scene: 'none',
      access: 'closed',
      accessError: null,
    })
  })

  it('opens, swaps, and closes scenes', () => {
    expect(apply({ type: 'open-scene', scene: 'households' }).scene).toBe('households')
    expect(apply(
      { type: 'open-scene', scene: 'households' },
      { type: 'open-scene', scene: 'rebalance' },
    ).scene).toBe('rebalance')
    expect(apply(
      { type: 'open-scene', scene: 'analytics' },
      { type: 'close-scene' },
    ).scene).toBe('none')
  })

  it('keeps the scene when access opens and closes', () => {
    const state = apply(
      { type: 'open-scene', scene: 'households' },
      { type: 'open-access' },
    )
    expect(state.scene).toBe('households')
    expect(state.access).toBe('open')
    expect(apply(
      { type: 'open-scene', scene: 'households' },
      { type: 'open-access' },
      { type: 'close-access' },
    )).toEqual({ scene: 'households', access: 'closed', accessError: null })
  })

  it('moves access through submitting, success, and error', () => {
    expect(apply({ type: 'open-access' }, { type: 'submit-access' }).access).toBe('submitting')
    expect(apply(
      { type: 'open-access' },
      { type: 'submit-access' },
      { type: 'access-success' },
    ).access).toBe('success')
    const failed = apply(
      { type: 'open-access' },
      { type: 'submit-access' },
      { type: 'access-error', message: 'Could not send your request. Try again.' },
    )
    expect(failed.access).toBe('error')
    expect(failed.accessError).toBe('Could not send your request. Try again.')
  })

  it('Escape closes access first, then the scene', () => {
    expect(apply(
      { type: 'open-scene', scene: 'rebalance' },
      { type: 'open-access' },
      { type: 'escape' },
    )).toEqual({ scene: 'rebalance', access: 'closed', accessError: null })
    expect(apply(
      { type: 'open-scene', scene: 'rebalance' },
      { type: 'escape' },
    ).scene).toBe('none')
  })
})
