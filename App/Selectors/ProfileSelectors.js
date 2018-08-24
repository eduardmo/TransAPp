import { createSelector } from 'reselect'
/**
 * Direct selector to the todo state domain
 */
const selectGlobalDomain = () => (state) => state.profile

const selectSuccess = () => createSelector(
  selectGlobalDomain(),
  (substate) => substate.success
)

const selectError = () => createSelector(
  selectGlobalDomain(),
  (substate) => substate.error
)

const selectFetching = () => createSelector(
  selectGlobalDomain(),
  (substate) => substate.fetching
)

const selectCountries = () => createSelector(
  selectGlobalDomain(),
  (substate) => substate.countries
)

const selectRegions = () => createSelector(
  selectGlobalDomain(),
  (substate) => substate.regions
)

export {
  selectGlobalDomain,
  selectSuccess,
  selectError,
  selectFetching,
  selectCountries,
  selectRegions
}
