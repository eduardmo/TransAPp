import { createSelector } from 'reselect'
/**
 * Direct selector to the todo state domain
 */
const selectGlobalDomain = () => (state) => state.client

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

const selectLanguages = () => createSelector(
  selectGlobalDomain(),
  (substate) => substate.languages
)

const selectTranslators = () => createSelector(
  selectGlobalDomain(),
  (substate) => substate.translators
)

export {
  selectGlobalDomain,
  selectSuccess,
  selectError,
  selectFetching,
  selectLanguages,
  selectTranslators
}
