import { Easing, interpolate, useCurrentFrame } from 'remotion'
import { sampleHousehold } from '../../data/samplePortfolio'
import { AllocationBar, DataPill, FilmFrame, FilmTitle } from '../FilmPrimitives'
import { film } from '../filmTokens'

export const HouseholdScene = () => {
  const frame = useCurrentFrame()
  return (
    <FilmFrame step="02" label="ONE HOUSEHOLD PORTFOLIO">
      <FilmTitle eyebrow="COORDINATED VIEW" aside={<DataPill tone="green">4 accounts connected</DataPill>}>One household. One complete portfolio.</FilmTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '420px 80px 1fr', alignItems: 'stretch', paddingTop: 42, minHeight: 430 }}>
        <div style={{ display: 'grid', gap: 10 }}>
          {sampleHousehold.accounts.map((account, index) => <div key={account.id} style={{ padding: '17px 18px', border: `1px solid ${film.border}`, color: film.muted, fontFamily: 'IBM Plex Mono, monospace', fontSize: 18, opacity: interpolate(frame, [0 + index * 3, 20 + index * 3], [0.25, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), translate: interpolate(frame, [0, 28], ['-90px 0px', '0px 0px'], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) }) }}>{account.id}<span style={{ float: 'right', color: film.text }}>{account.value}</span></div>)}
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: '12%', width: '100%', height: '76%', borderTop: `1px solid ${film.blue}`, borderBottom: `1px solid ${film.blue}`, borderRight: `1px solid ${film.blue}`, opacity: interpolate(frame, [18, 42], [0, 0.8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
        </div>
        <div style={{ backgroundColor: film.panel, border: `1px solid ${film.strong}`, padding: 32, opacity: interpolate(frame, [24, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), scale: interpolate(frame, [24, 50], [0.96, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale', easing: Easing.bezier(0.16, 1, 0.3, 1) }) }}>
          <div style={{ color: film.muted, fontFamily: 'IBM Plex Mono, monospace', fontSize: 18 }}>MERIDIAN HOUSEHOLD</div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 54, margin: '18px 0 8px' }}>{sampleHousehold.value}</div>
          <div style={{ color: film.muted, fontSize: 24 }}>{sampleHousehold.model}</div>
          <div style={{ marginTop: 36 }}><AllocationBar equity={75} fixed={22} cash={3} height={24} /></div>
          <div style={{ display: 'flex', gap: 28, marginTop: 18, fontFamily: 'IBM Plex Mono, monospace', fontSize: 18, color: film.muted }}><span><b style={{ color: film.blueBright }}>75%</b> equity</span><span><b style={{ color: film.text }}>22%</b> fixed income</span><span><b style={{ color: film.green }}>3%</b> cash</span></div>
        </div>
      </div>
    </FilmFrame>
  )
}
