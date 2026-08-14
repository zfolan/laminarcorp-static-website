import { Composition } from 'remotion'
import { HouseholdFilm } from './HouseholdFilm'

export const RemotionRoot = () => (
  <Composition id="One-Household-One-Coordinated-Decision" component={HouseholdFilm} durationInFrames={714} fps={30} width={1440} height={900} />
)
