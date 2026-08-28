import { describe, expect, it, vi } from 'vitest'
import { blockHitsShimmer, buildIdleLinkPath, chordNearFill, fillIdleDots, lineIntersect, mergeClosePoints, mergeDotBlocks, mouseNearMark, segmentHitsFill, segmentInside, shimmerAlong, sleeveTone, strokeIdleLinks, strokeIdlePath, unboundCap, unboundLinkPairs } from './AetherCanvas'












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

describe('idle mesh batching', () => {
  it('fills every idle dot in one path', () => {
    const ctx = {
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      fillStyle: '',
    }
    fillIdleDots(ctx as unknown as CanvasRenderingContext2D, [
      { x: 0, y: 0, size: 1 },
      { x: 8, y: 4, size: 2 },
    ])
    expect(ctx.beginPath).toHaveBeenCalledTimes(1)
    expect(ctx.arc).toHaveBeenCalledTimes(2)
    expect(ctx.fill).toHaveBeenCalledTimes(1)
    expect(ctx.fillStyle).toBe('rgba(131, 169, 204, 0.72)')
  })

  it('strokes every idle link in one path', () => {
    const ctx = {
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      strokeStyle: '',
      lineWidth: 0,
    }
    strokeIdleLinks(ctx as unknown as CanvasRenderingContext2D, [
      { x1: 0, y1: 0, x2: 4, y2: 4 },
      { x1: 8, y1: 0, x2: 8, y2: 6 },
    ])
    expect(ctx.beginPath).toHaveBeenCalledTimes(1)
    expect(ctx.lineTo).toHaveBeenCalledTimes(2)
    expect(ctx.stroke).toHaveBeenCalledTimes(1)
    expect(ctx.strokeStyle).toBe('rgba(91, 141, 239, 0.42)')
    expect(ctx.lineWidth).toBe(1)
  })
})

describe('mouseNearMark', () => {
  const bounds = { minX: 100, maxX: 200, minY: 40, maxY: 80 }

  it('is false when the pointer is up', () => {
    expect(mouseNearMark(null, null, 200, bounds)).toBe(false)
  })

  it('is true inside the mark plus mouse radius', () => {
    expect(mouseNearMark(150, 60, 200, bounds)).toBe(true)
    expect(mouseNearMark(100 - 200, 60, 200, bounds)).toBe(true)
  })

  it('is false outside the padded mark', () => {
    expect(mouseNearMark(100 - 201, 60, 200, bounds)).toBe(false)
    expect(mouseNearMark(150, 80 + 201, 200, bounds)).toBe(false)
  })
})

describe('idle link path', () => {
  it('builds one path from home positions', () => {
    const moveTo = vi.fn()
    const lineTo = vi.fn()
    vi.stubGlobal('Path2D', class {
      moveTo = moveTo
      lineTo = lineTo
    })
    buildIdleLinkPath(
      [{ home: { x: 0, y: 0 } }, { home: { x: 4, y: 6 } }],
      [[0, 1]],
    )
    expect(moveTo).toHaveBeenCalledWith(0, 0)
    expect(lineTo).toHaveBeenCalledWith(4, 6)
  })

  it('strokes a cached path once', () => {
    const ctx = {
      stroke: vi.fn(),
      strokeStyle: '',
      lineWidth: 0,
    }
    const path = {} as Path2D
    strokeIdlePath(ctx as unknown as CanvasRenderingContext2D, path)
    expect(ctx.stroke).toHaveBeenCalledTimes(1)
    expect(ctx.stroke).toHaveBeenCalledWith(path)
    expect(ctx.strokeStyle).toBe('rgba(91, 141, 239, 0.42)')
    expect(ctx.lineWidth).toBe(1)
  })
})

describe('shimmer blocks', () => {
  const bounds = { minX: 0, maxX: 100, minY: 0, maxY: 100 }

  it('maps home position onto the existing along axis', () => {
    expect(shimmerAlong(0, 0, bounds)).toBe(0)
    expect(shimmerAlong(100, 100, bounds)).toBe(1)
    expect(shimmerAlong(50, 50, bounds)).toBe(0.5)
  })

  it('treats a block as live only when it intersects the 0.13 window', () => {
    expect(blockHitsShimmer(0, 0.1, 0.5)).toBe(false)
    expect(blockHitsShimmer(0.4, 0.45, 0.5)).toBe(true)
    expect(blockHitsShimmer(0.63, 0.8, 0.5)).toBe(true)
    expect(blockHitsShimmer(0.64, 0.8, 0.5)).toBe(false)
  })

  it('merges dots whose idle circles overlap into one block', () => {
    const blocks = mergeDotBlocks([
      { x: 0, y: 0, size: 2, along: 0 },
      { x: 3, y: 0, size: 2, along: 0.1 },
      { x: 80, y: 80, size: 1, along: 0.9 },
    ])
    expect(blocks).toHaveLength(2)
    expect(blocks[0].indices).toEqual([0, 1])
    expect(blocks[1].indices).toEqual([2])
    expect(blocks[0].alongMin).toBe(0)
    expect(blocks[0].alongMax).toBe(0.1)
  })
})

describe('unboundLinkPairs', () => {
  it('returns the same pairs as a nested a<b loop within 18000', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 400, y: 0 },
      { x: 20, y: 5 },
    ]
    const naive: Array<[number, number]> = []
    for (let a = 0; a < points.length; a += 1) {
      for (let b = a + 1; b < points.length; b += 1) {
        const dx = points[a].x - points[b].x
        const dy = points[a].y - points[b].y
        if (dx * dx + dy * dy < 18000) naive.push([a, b])
      }
    }
    expect(unboundLinkPairs(points, Math.sqrt(18000), 18000)).toEqual(naive)
  })
})

describe('unboundCap', () => {
  it('keeps the dense GPU cap', () => {
    expect(unboundCap(18000 * 200, true)).toBe(180)
    expect(unboundCap(18000 * 2, true)).toBe(80)
  })

  it('spawns fewer free nodes on CPU', () => {
    expect(unboundCap(18000 * 200, false)).toBeLessThan(unboundCap(18000 * 200, true))
    expect(unboundCap(18000 * 200, false)).toBe(48)
  })
})

describe('segmentHitsFill', () => {
  it('is true when the chord crosses a filled cell', () => {
    expect(segmentHitsFill(0, 0, 10, 0, (x, y) => x === 5 && y === 0)).toBe(true)
  })

  it('is false when the chord stays in empty space', () => {
    expect(segmentHitsFill(0, 0, 10, 0, () => false)).toBe(false)
  })
})

describe('mergeClosePoints', () => {
  it('collapses near duplicates and remaps links', () => {
    const { points, links } = mergeClosePoints(
      [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 20, y: 0 }],
      [[0, 1], [1, 2]],
      5,
    )
    expect(points).toEqual([{ x: 0, y: 0 }, { x: 20, y: 0 }])
    expect(links).toEqual([[0, 1]])
  })

  it('drops self-links after a collapse', () => {
    const { links } = mergeClosePoints(
      [{ x: 0, y: 0 }, { x: 1, y: 0 }],
      [[0, 1]],
      5,
    )
    expect(links).toEqual([])
  })
})

describe('chordNearFill', () => {
  it('keeps a short edge chord next to the fill', () => {
    expect(chordNearFill(0, 0, 10, 0, (x, y) => x >= 0 && x <= 10 && y >= 0 && y <= 2)).toBe(true)
  })

  it('drops a chord through empty space', () => {
    expect(chordNearFill(0, 0, 40, 0, (x, y) => x <= 2 || x >= 38)).toBe(false)
  })
})

describe('lineIntersect', () => {
  it('finds the miter of two offset edges', () => {
    expect(lineIntersect(0, 1, 1, 0, 1, 0, 0, 1)).toEqual({ x: 1, y: 1 })
  })
})

describe('segmentInside', () => {
  it('rejects a chord that leaves the fill', () => {
    expect(segmentInside(0, 0, 40, 0, (x) => x <= 2 || x >= 38)).toBe(false)
  })

  it('keeps a chord that stays inside', () => {
    expect(segmentInside(0, 0, 10, 0, () => true)).toBe(true)
  })
})













