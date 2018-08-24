import { createSelector } from 'reselect'
/**
 * Direct selector to the todo state domain
 */
const selectGlobalDomain = () => (state) => state.search

const selectSearchTerm = () => createSelector(
  selectGlobalDomain(),
  (substate) => substate.searchTerm
)

const selectSearching = () => createSelector(
  selectGlobalDomain(),
  (substate) => substate.searching
)

export {
  selectGlobalDomain,
  selectSearchTerm,
  selectSearching
}
