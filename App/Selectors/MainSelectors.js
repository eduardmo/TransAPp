import { createSelector } from 'reselect'
/**
 * Direct selector to the todo state domain
 */
const selectGlobalDomain = () => (state) => state.main

const selectShowSearch = () => createSelector(
  selectGlobalDomain(),
  (substate) => substate.showSearch
)

export {
  selectGlobalDomain,
  selectShowSearch
}
