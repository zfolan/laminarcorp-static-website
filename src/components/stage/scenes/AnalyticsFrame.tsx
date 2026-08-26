import { stageBook } from '../../../data/stageBook'

export const AnalyticsFrame = () => (
  <div className="scene-frame">
    <p className="scene-frame__title">Overview</p>
    <p>{stageBook.analytics.household}</p>
  </div>
)
