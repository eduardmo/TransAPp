import { createSelector } from 'reselect'
/**
 * Direct selector to the todo state domain
 */
const selectGlobalDomain = () => (state) => state.startup

const selectUpdateNetwork = () => createSelector(
  selectGlobalDomain(),
  (substate) => substate.networkChange
)

export {
  selectGlobalDomain,
  selectUpdateNetwork
}
