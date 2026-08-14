import { Easing, interpolate, useCurrentFrame } from 'remotion'
import { proposedTrades } from '../../data/samplePortfolio'
import { FilmFrame, FilmTitle } from '../FilmPrimitives'
import { film } from '../filmTokens'

export const ImplementationScene = () => {
  const frame = useCurrentFrame()
  return (
    <FilmFrame step="05" label="COORDINATED IMPLEMENTATION">
      <FilmTitle eyebrow="HOUSEHOLD DECISION → ACCOUNT ACTION">Resolve one strategy into precise proposed changes.</FilmTitle>
      <div style={{ marginTop: 40, border: `1px solid ${film.border}`, backgroundColor: film.panel }}>
        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 190px 150px 130px', padding: '15px 20px', borderBottom: `1px solid ${film.border}`, color: film.muted, fontFamily: 'IBM Plex Mono, monospace', fontSize: 16 }}><span>ACTION</span><span>SECURITY</span><span>ACCOUNT</span><span>AMOUNT</span><span>STATE</span></div>
        {proposedTrades.map((trade, index) => <div key={`${trade.ticker}-${trade.account}`} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 190px 150px 130px', alignItems: 'center', padding: '20px', borderBottom: index < proposedTrades.length - 1 ? `1px solid ${film.border}` : undefined, opacity: interpolate(frame, [index * 8, index * 8 + 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), translate: interpolate(frame, [index * 8, index * 8 + 24], ['90px 0px', '0px 0px'], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) }) }}><span style={{ color: trade.side === 'Buy' ? film.green : film.amber, fontFamily: 'IBM Plex Mono, monospace' }}>{trade.side.toUpperCase()}</span><span style={{ fontSize: 22 }}>{trade.ticker} <small style={{ color: film.muted }}>· {trade.security}</small></span><span style={{ fontFamily: 'IBM Plex Mono, monospace', color: film.muted }}>{trade.account}</span><span style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{trade.amount}</span><span style={{ color: trade.status === 'Ready' ? film.green : film.amber, fontFamily: 'IBM Plex Mono, monospace' }}>{trade.status.toUpperCase()}</span></div>)}
      </div>
    </FilmFrame>
  )
}
