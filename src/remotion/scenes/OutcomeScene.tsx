import { Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { FilmFrame } from '../FilmPrimitives'
import { film } from '../filmTokens'

export const OutcomeScene = () => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  return (
    <FilmFrame step="08" label="TRADE-READY OUTCOME">
      <div style={{ height: '100%', display: 'grid', placeItems: 'center', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: '90px 70px', display: 'grid', gridTemplateRows: 'repeat(4, 1fr)', opacity: interpolate(frame, [durationInFrames - 28, durationInFrames - 1], [0, 0.45], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>{[0,1,2,3].map((row) => <div key={row} style={{ borderTop: `1px solid ${film.border}`, translate: `${row % 2 ? 80 : -80}px 0px` }} />)}</div>
        <div style={{ position: 'relative', opacity: interpolate(frame, [0, 20, durationInFrames - 24, durationInFrames - 1], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), scale: interpolate(frame, [0, 24], [0.96, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1), output: 'perceptual-scale' }) }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 36 }}>{['Reviewed trades', 'Client proposal', 'Order preparation'].map((item, index) => <span key={item} style={{ padding: '12px 16px', border: `1px solid ${index === 0 ? film.green : film.border}`, color: index === 0 ? film.green : film.muted, fontFamily: 'IBM Plex Mono, monospace', fontSize: 17 }}>{item.toUpperCase()}</span>)}</div>
          <div style={{ fontSize: 68, fontWeight: 500, letterSpacing: '-0.04em', lineHeight: 1.02 }}>Portfolio strategy, carried through<br />to implementation.</div>
          <div style={{ marginTop: 34, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.18em', color: film.blueBright, fontSize: 26 }}>LAMINAR</div>
        </div>
      </div>
    </FilmFrame>
  )
}
