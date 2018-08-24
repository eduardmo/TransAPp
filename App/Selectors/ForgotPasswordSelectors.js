import { createSelector } from 'reselect'
/**
 * Direct selector to the todo state domain
 */
const selectGlobalDomain = () => (state) => state.forgotPasssword

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

export {
  selectGlobalDomain,
  selectSuccess,
  selectError,
  selectFetching
}
