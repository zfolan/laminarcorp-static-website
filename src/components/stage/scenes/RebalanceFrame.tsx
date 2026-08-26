import { stageBook } from '../../../data/stageBook'

export const RebalanceFrame = () => (
  <div className="scene-frame">
    <p className="scene-frame__title">Rebalance</p>
    <p>{stageBook.rebalance.household}</p>
  </div>
)
