import { describe, expect, it } from 'vitest'
import { isSoftwareRenderer } from './aetherGpu'

describe('isSoftwareRenderer', () => {
  it('rejects SwiftShader and llvmpipe', () => {
    expect(isSoftwareRenderer('Google SwiftShader')).toBe(true)
    expect(isSoftwareRenderer('llvmpipe (LLVM 15.0.7)')).toBe(true)
    expect(isSoftwareRenderer('Microsoft Basic Render Driver')).toBe(true)
  })

  it('accepts real GPU names', () => {
    expect(isSoftwareRenderer('NVIDIA GeForce RTX 3090/PCIe/SSE2')).toBe(false)
    expect(isSoftwareRenderer('ANGLE (Apple, ANGLE Metal Renderer: Apple M2)')).toBe(false)
  })
})
