import { Easing, interpolate, useCurrentFrame } from 'remotion'
import { sampleHousehold } from '../../data/samplePortfolio'
import { AllocationBar, FilmFrame, FilmTitle } from '../FilmPrimitives'
import { film } from '../filmTokens'

export const IndependentAccountsScene = () => {
  const frame = useCurrentFrame()
  return (
    <FilmFrame step="01" label="INDEPENDENT ACCOUNTS">
      <FilmTitle eyebrow="HOUSEHOLD / 0248">Four accounts. Four partial views.</FilmTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, paddingTop: 40 }}>
        {sampleHousehold.accounts.map((account, index) => (
          <div key={account.id} style={{ opacity: interpolate(frame, [index * 7, index * 7 + 20], [0.35, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) }), translate: interpolate(frame, [index * 7, index * 7 + 20], [index % 2 ? '34px 0px' : '-34px 0px', '0px 0px'], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) }), padding: '20px 22px', backgroundColor: film.panel, border: `1px solid ${film.border}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 14, alignItems: 'start' }}>
              <div><div style={{ fontSize: 26 }}>{account.name}</div><div style={{ marginTop: 6, color: film.muted, fontFamily: 'IBM Plex Mono, monospace', fontSize: 17 }}>{account.id} · {account.registration} · {account.currency}</div></div>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 25 }}>{account.value}</div>
            </div>
            <div style={{ marginTop: 18 }}><AllocationBar equity={account.allocation.equity} fixed={account.allocation.fixedIncome} cash={account.allocation.cash} height={12} /></div>
          </div>
        ))}
      </div>
    </FilmFrame>
  )
}
