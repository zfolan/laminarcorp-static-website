import { Easing, interpolate, useCurrentFrame } from 'remotion'
import { exceptionQueue } from '../../data/samplePortfolio'
import { DataPill, FilmFrame, FilmTitle } from '../FilmPrimitives'
import { film } from '../filmTokens'

export const ExceptionsScene = () => {
  const frame = useCurrentFrame()
  return (
    <FilmFrame step="06" label="MANAGE BY EXCEPTION">
      <FilmTitle eyebrow="FOCUSED REVIEW QUEUE" aside={<DataPill tone="amber">3 need judgment</DataPill>}>Separate routine recommendations from material exceptions.</FilmTitle>
      <div style={{ display: 'grid', gap: 16, paddingTop: 46 }}>
        {exceptionQueue.map((item, index) => <div key={item.title} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 220px 34px', alignItems: 'center', backgroundColor: film.panel, border: `1px solid ${film.border}`, padding: '23px 26px', opacity: interpolate(frame, [index * 12, index * 12 + 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), translate: interpolate(frame, [index * 12, index * 12 + 24], ['0px 38px', '0px 0px'], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) }) }}><span style={{ fontFamily: 'IBM Plex Mono, monospace', color: item.tone === 'red' ? film.red : film.amber }}>{item.type.toUpperCase()}</span><span><b style={{ fontSize: 24, fontWeight: 500 }}>{item.title}</b><small style={{ display: 'block', color: film.muted, marginTop: 6, fontSize: 18 }}>{item.detail}</small></span><strong style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 26 }}>{item.value}</strong><span style={{ color: film.muted, fontSize: 30 }}>→</span></div>)}
      </div>
      <div style={{ marginTop: 28, color: film.muted, fontSize: 22 }}>Routine changes remain ready. Exceptions carry their context into portfolio-manager review.</div>
    </FilmFrame>
  )
}
