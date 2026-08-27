import { describe, expect, it } from 'vitest'
import { sleeveTone } from './AetherCanvas'

describe('sleeveTone', () => {
  it('is green only when displayed current equals target', () => {
    expect(sleeveTone(0.203, 0.203)).toBe('on')
    expect(sleeveTone(0.2034, 0.203)).toBe('on')
    expect(sleeveTone(0, 0)).toBe('on')
  })

  it('is yellow within two displayed percentage points', () => {
    expect(sleeveTone(0.221, 0.203)).toBe('near')
    expect(sleeveTone(0.223, 0.203)).toBe('near')
    expect(sleeveTone(0.02, 0)).toBe('near')
  })

  it('is red farther than two percentage points', () => {
    expect(sleeveTone(0.224, 0.203)).toBe('off')
    expect(sleeveTone(0.45, 0.203)).toBe('off')
    expect(sleeveTone(0.021, 0)).toBe('off')
  })
})
