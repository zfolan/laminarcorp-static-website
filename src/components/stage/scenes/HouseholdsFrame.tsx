import { stageBook } from '../../../data/stageBook'

export const HouseholdsFrame = () => (
  <div className="scene-frame">
    <p className="scene-frame__title">Household Library</p>
    <p>{stageBook.featured.name}</p>
  </div>
)
