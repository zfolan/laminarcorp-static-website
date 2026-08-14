import { Easing, interpolate, useCurrentFrame } from 'remotion'
import { DataPill, FilmFrame, FilmTitle } from '../FilmPrimitives'
import { film } from '../filmTokens'

export const AnalysisScene = () => {
  const frame = useCurrentFrame()
  const signals = [
    { label: 'Allocation drift', value: '4.8%', note: 'Above review threshold', tone: 'amber' as const },
    { label: 'Single-security exposure', value: '11.2%', note: 'Household concentration', tone: 'red' as const },
    { label: 'Available cash', value: '$96,400', note: 'CAD + USD', tone: 'green' as const },
    { label: 'Unrealized gain', value: '$14,820', note: 'Relevant proposed sale', tone: 'amber' as const },
  ]
  return (
    <FilmFrame step="04" label="COMPLETE ANALYSIS">
      <FilmTitle eyebrow="DECISION-RELEVANT CONTEXT" aside={<DataPill>6 dimensions assessed</DataPill>}>Surface what changes the decision.</FilmTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18, paddingTop: 48 }}>
        {signals.map((signal, index) => <div key={signal.label} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', backgroundColor: film.panel, border: `1px solid ${film.border}`, borderLeft: `3px solid ${signal.tone === 'amber' ? film.amber : signal.tone === 'red' ? film.red : film.green}`, padding: '25px 28px', opacity: interpolate(frame, [index * 8, index * 8 + 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), translate: interpolate(frame, [index * 8, index * 8 + 22], ['0px 36px', '0px 0px'], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) }) }}><div><div style={{ fontSize: 25 }}>{signal.label}</div><div style={{ color: film.muted, marginTop: 8, fontSize: 19 }}>{signal.note}</div></div><strong style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 35 }}>{signal.value}</strong></div>)}
      </div>
      <div style={{ marginTop: 22, padding: '22px 28px', border: `1px solid ${film.blue}66`, color: film.blueBright, fontSize: 23 }}>Portfolio context is brought forward only where it affects the recommendation.</div>
    </FilmFrame>
  )
}
