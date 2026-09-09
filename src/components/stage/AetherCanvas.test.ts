import { describe, expect, it } from 'vitest'
import { ambientOpacityAt, chordNearFill, diskTouchesSegment, mergeClosePoints, mouseNearMark, sampleInteriorMesh, sampleLogoOutline, segmentHitsFill, sleeveTone, unboundCap, unboundLinkPairs } from './AetherCanvas'

describe('ambient entrance', () => {
  it('stays hidden for the logo, fades alongside the text, and stays visible afterward', () => {
    expect(ambientOpacityAt(0)).toBe(0)
    expect(ambientOpacityAt(1120)).toBe(0)
    expect(ambientOpacityAt(1985)).toBeCloseTo(0.5)
    expect(ambientOpacityAt(2850)).toBe(1)
    expect(ambientOpacityAt(10_000)).toBe(1)
  })
})












describe('node disk clearance', () => {
  it('checks the whole segment and its endpoints, not just the node center', () => {
    const a = { x: 0, y: 0 }
    const b = { x: 100, y: 0 }
    expect(diskTouchesSegment({ x: 50, y: 3 }, a, b, 3)).toBe(true)
    expect(diskTouchesSegment({ x: 50, y: 3.01 }, a, b, 3)).toBe(false)
    expect(diskTouchesSegment({ x: -2, y: -2 }, a, b, 3)).toBe(true)
    expect(diskTouchesSegment({ x: -4, y: 0 }, a, b, 3)).toBe(false)
  })

  it('handles diagonal and collapsed simulated edges', () => {
    const a = { x: 0, y: 0 }
    const b = { x: 10, y: 10 }
    expect(diskTouchesSegment({ x: 5, y: 6 }, a, b, 1)).toBe(true)
    expect(diskTouchesSegment({ x: 5, y: 7 }, a, b, 1)).toBe(false)
    expect(diskTouchesSegment({ x: 10, y: 12 }, b, b, 2)).toBe(true)
    expect(diskTouchesSegment({ x: 10, y: 12.01 }, b, b, 2)).toBe(false)
  })
})

describe('logo outline', () => {
  it('samples one closed contour without inset rings or cross-links', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.classList.add('hero-logo')
    const path = document.createElementNS(svg.namespaceURI, 'path')
    Object.assign(path, {
      getBBox: () => ({ x: -100, y: -100, width: 200, height: 200 }),
      getTotalLength: () => 200 * Math.PI,
      getPointAtLength: (at: number) => ({
        x: 100 * Math.cos(at / 100),
        y: 100 * Math.sin(at / 100),
      }),
      isPointInFill: ({ x, y }: { x: number; y: number }) => Math.hypot(x, y) <= 100,
    })
    svg.append(path)
    document.body.append(svg)
    try {
      for (const sparse of [false, true]) {
        const { points, links } = sampleLogoOutline(sparse)
        expect(points.length).toBeGreaterThan(2)
        for (const point of points) expect(Math.hypot(point.x, point.y)).toBeCloseTo(100)
        const neighbors = points.map(() => [] as number[])
        for (const [a, b] of links) {
          neighbors[a].push(b)
          neighbors[b].push(a)
        }
        for (const adjacent of neighbors) expect(adjacent).toHaveLength(2)
        const visited = new Set<number>()
        let current = 0
        while (!visited.has(current)) {
          visited.add(current)
          current = neighbors[current].find((next) => !visited.has(next)) ?? 0
        }
        expect(visited.size).toBe(points.length)
      }
    } finally {
      svg.remove()
    }
  })

  it('keeps polygon corners exact while leaving the wave gap open', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.classList.add('hero-logo')
    const empty = document.createElementNS(svg.namespaceURI, 'path')
    Object.assign(empty, { getTotalLength: () => 0, isPointInFill: () => false })
    const base = document.createElementNS(svg.namespaceURI, 'polygon')
    const corners = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 20 }, { x: 0, y: 20 }]
    Object.assign(base, {
      points: { numberOfItems: corners.length, getItem: (index: number) => corners[index] },
      getBBox: () => ({ x: 0, y: 0, width: 100, height: 20 }),
      getTotalLength: () => 240,
      getPointAtLength: (at: number) => at <= 100 ? { x: at, y: 0 }
        : at <= 120 ? { x: 100, y: at - 100 }
          : at <= 220 ? { x: 220 - at, y: 20 } : { x: 0, y: 240 - at },
      isPointInFill: ({ x, y }: { x: number; y: number }) => x >= 0 && x <= 100 && y >= 0 && y <= 20,
    })
    const wave = document.createElementNS(svg.namespaceURI, 'path')
    Object.assign(wave, {
      getTotalLength: () => 0,
      isPointInFill: ({ x, y }: { x: number; y: number }) => x >= 48 && x <= 52 && Math.abs(y) <= 3,
      isPointInStroke: ({ x, y }: { x: number; y: number }) => x >= 42 && x <= 58 && Math.abs(y) <= 9,
    })
    svg.append(empty, base, wave)
    document.body.append(svg)
    try {
      for (const sparse of [false, true]) {
        const { points, links } = sampleLogoOutline(sparse)
        for (const corner of corners) {
          expect(points.some((point) => Math.hypot(point.x - corner.x, point.y - corner.y) < 0.001)).toBe(true)
        }
        const bottom = links.map(([a, b]) => [points[a], points[b]]).filter(([a, b]) => a.y === 0 || b.y === 0)
        expect(bottom.some(([a, b]) => Math.max(a.x, b.x) < 42)).toBe(true)
        expect(bottom.some(([a, b]) => Math.min(a.x, b.x) > 58)).toBe(true)
        expect(bottom.some(([a, b]) => Math.min(a.x, b.x) <= 58 && Math.max(a.x, b.x) >= 42)).toBe(false)
      }
    } finally {
      svg.remove()
    }
  })
})

describe('interior mesh', () => {
  it('clips a uniform triangular grid to the glyph and its cutouts', () => {
    const inside = (x: number, y: number) => x > 0 && x < 120 && y > 0 && y < 100
      && !(x > 45 && x < 75 && y < 65)
    for (const spacing of [22, 28]) {
      const { points, links, nodeIndices } = sampleInteriorMesh(
        { x: 0, y: 0, width: 120, height: 100 }, inside, spacing,
      )
      const nodes = new Set(nodeIndices)
      expect(nodeIndices.some((index) => points[index].x < 45)).toBe(true)
      expect(nodeIndices.some((index) => points[index].x > 75)).toBe(true)
      expect(Math.min(...points.map((point) => point.y))).toBeCloseTo(0, 2)
      expect(Math.max(...points.map((point) => point.y))).toBeCloseTo(100, 2)
      expect(Math.min(...points.map((point) => point.x))).toBeCloseTo(0, 2)
      expect(Math.max(...points.map((point) => point.x))).toBeCloseTo(120, 2)
      expect(links.some(([a, b]) => nodes.has(a) && nodes.has(b) && points[a].x < 45 && points[b].x < 45)).toBe(true)
      expect(links.some(([a, b]) => nodes.has(a) && nodes.has(b) && points[a].x > 75 && points[b].x > 75)).toBe(true)
      for (const point of points) expect(inside(point.x, point.y)).toBe(true)
      for (const [a, b] of links) {
        const left = points[a]
        const right = points[b]
        if (nodes.has(a) && nodes.has(b)) {
          expect(Math.hypot(right.x - left.x, right.y - left.y)).toBeCloseTo(spacing, 10)
        }
        for (let t = 0; t <= 1; t += 0.01) {
          expect(inside(left.x + (right.x - left.x) * t, left.y + (right.y - left.y) * t)).toBe(true)
        }
      }
    }
  })
})


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
    expect(chordNearFill(0, 0, 40, 0, (x) => x <= 2 || x >= 38)).toBe(false)

  })
})














