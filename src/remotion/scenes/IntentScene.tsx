import { Easing, interpolate, useCurrentFrame } from 'remotion'
import { AllocationBar, FilmFrame, FilmTitle } from '../FilmPrimitives'
import { film } from '../filmTokens'

export const IntentScene = () => {
  const frame = useCurrentFrame()
  const rows = [{ label: 'Equity', current: 75, target: 70 }, { label: 'Fixed income', current: 22, target: 27 }, { label: 'Cash', current: 3, target: 3 }]
  return (
    <FilmFrame step="03" label="INVESTMENT INTENT">
      <FilmTitle eyebrow="BALANCED GROWTH 70/30">Compare the household with its strategic target.</FilmTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, paddingTop: 48 }}>
        {[{ title: 'Current household', a: [75, 22, 3] }, { title: 'Target model', a: [70, 27, 3] }].map((item, index) => <div key={item.title} style={{ backgroundColor: index ? film.raised : film.panel, border: `1px solid ${index ? film.blue : film.border}`, padding: 30, opacity: interpolate(frame, [index * 14, index * 14 + 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), translate: interpolate(frame, [index * 14, index * 14 + 24], ['0px 40px', '0px 0px'], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) }) }}><div style={{ color: film.muted, fontFamily: 'IBM Plex Mono, monospace', fontSize: 19 }}>{item.title.toUpperCase()}</div><div style={{ marginTop: 28 }}><AllocationBar equity={item.a[0]} fixed={item.a[1]} cash={item.a[2]} height={34} /></div></div>)}
      </div>
      <div style={{ marginTop: 22, borderTop: `1px solid ${film.border}` }}>
        {rows.map((row, index) => <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1fr 180px 180px 180px', alignItems: 'center', borderBottom: `1px solid ${film.border}`, padding: '17px 20px', fontFamily: index ? 'IBM Plex Mono, monospace' : 'Instrument Sans, sans-serif', fontSize: 20 }}><span>{row.label}</span><span style={{ color: film.muted }}>CURRENT {row.current}%</span><span>TARGET {row.target}%</span><span style={{ color: row.current === row.target ? film.green : film.amber }}>{row.current === row.target ? 'ON TARGET' : `${row.current - row.target > 0 ? '+' : ''}${row.current - row.target}% DRIFT`}</span></div>)}
      </div>
    </FilmFrame>
  )
}
