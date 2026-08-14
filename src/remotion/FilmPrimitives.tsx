import type { PropsWithChildren, ReactNode } from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { film } from './filmTokens'

export const FilmFrame = ({ step, label, children }: PropsWithChildren<{ step: string; label: string }>) => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  return (
    <AbsoluteFill style={{ backgroundColor: film.canvas, color: film.text, fontFamily: 'Instrument Sans, sans-serif', padding: '64px 72px 54px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 76% 42%, rgba(84,135,182,.12), transparent 42%)' }} />
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${film.border}`, paddingBottom: 20 }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 22, letterSpacing: '0.12em', color: film.muted }}>LAMINAR / HOUSEHOLD WORKFLOW</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'IBM Plex Mono, monospace', fontSize: 20, color: film.muted }}>
          <span style={{ color: film.blueBright }}>{step}</span><span>{label}</span>
        </div>
      </div>
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>{children}</div>
      <div style={{ position: 'relative', height: 3, backgroundColor: film.border }}>
        <div style={{ width: `${interpolate(frame, [0, durationInFrames - 1], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}%`, height: '100%', backgroundColor: film.blue }} />
      </div>
    </AbsoluteFill>
  )
}

export const FilmTitle = ({ eyebrow, children, aside }: PropsWithChildren<{ eyebrow: string; aside?: ReactNode }>) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 48, paddingTop: 42 }}>
    <div>
      <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 20, letterSpacing: '0.1em', color: film.blueBright, marginBottom: 12 }}>{eyebrow}</div>
      <div style={{ fontSize: 58, fontWeight: 500, lineHeight: 1.03, letterSpacing: '-0.035em', maxWidth: 900 }}>{children}</div>
    </div>
    {aside}
  </div>
)

export const DataPill = ({ children, tone = 'blue' }: PropsWithChildren<{ tone?: 'blue' | 'green' | 'amber' | 'red' }>) => {
  const colors = { blue: film.blueBright, green: film.green, amber: film.amber, red: film.red }
  return <span style={{ border: `1px solid ${colors[tone]}66`, color: colors[tone], backgroundColor: `${colors[tone]}12`, padding: '8px 12px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 18 }}>{children}</span>
}

export const AllocationBar = ({ equity, fixed, cash, height = 18 }: { equity: number; fixed: number; cash: number; height?: number }) => (
  <div style={{ display: 'flex', gap: 3, width: '100%', height, backgroundColor: film.raised, overflow: 'hidden' }}>
    <span style={{ width: `${equity}%`, backgroundColor: film.blue }} />
    <span style={{ width: `${fixed}%`, backgroundColor: '#647485' }} />
    <span style={{ width: `${cash}%`, backgroundColor: film.green }} />
  </div>
)
