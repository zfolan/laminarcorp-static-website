import { Easing, interpolate, useCurrentFrame } from 'remotion'
import { FilmFrame, FilmTitle } from '../FilmPrimitives'
import { film } from '../filmTokens'

export const ReviewScene = () => {
  const frame = useCurrentFrame()
  return (
    <FilmFrame step="07" label="PORTFOLIO-MANAGER REVIEW">
      <FilmTitle eyebrow="PROFESSIONAL CONTROL">Review the context. Refine the recommendation. Approve the plan.</FilmTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 20, paddingTop: 40 }}>
        <div style={{ backgroundColor: film.panel, border: `1px solid ${film.border}`, padding: 28 }}>
          <div style={{ color: film.muted, fontFamily: 'IBM Plex Mono, monospace', fontSize: 18 }}>PROPOSED CHANGE / NR-2901</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 22 }}><span style={{ fontSize: 27 }}>Sell Northfield Equity</span><strong style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 30 }}>$86,000</strong></div>
          <div style={{ marginTop: 28, padding: 20, backgroundColor: film.raised, borderLeft: `3px solid ${film.amber}` }}><span style={{ color: film.amber, fontFamily: 'IBM Plex Mono, monospace', fontSize: 17 }}>TAX CONTEXT</span><p style={{ fontSize: 21, color: film.muted, margin: '10px 0 0' }}>Estimated taxable gain is visible before approval.</p></div>
          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}><button style={{ border: `1px solid ${film.strong}`, color: film.text, backgroundColor: 'transparent', padding: '14px 22px', fontSize: 20 }}>Modify</button><button style={{ border: `1px solid ${film.blue}`, color: film.text, backgroundColor: film.blue, padding: '14px 22px', fontSize: 20, scale: interpolate(frame, [45, 64], [0.94, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.spring({ damping: 200 }), output: 'perceptual-scale' }) }}>Approve recommendation</button></div>
        </div>
        <div style={{ border: `1px solid ${film.blue}`, backgroundColor: film.raised, padding: 28, opacity: interpolate(frame, [18, 42], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
          <div style={{ color: film.blueBright, fontFamily: 'IBM Plex Mono, monospace', fontSize: 17 }}>REVIEW SUMMARY</div>
          {[['Proposed trades', '08'], ['Ready', '05'], ['Exceptions resolved', '03'], ['Approver', 'Portfolio manager']].map(([label, value]) => <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 24, borderBottom: `1px solid ${film.border}`, padding: '20px 0', fontSize: 20 }}><span style={{ color: film.muted }}>{label}</span><span style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{value}</span></div>)}
        </div>
      </div>
    </FilmFrame>
  )
}
