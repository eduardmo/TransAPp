import { createSelector } from 'reselect'
/**
 * Direct selector to the todo state domain
 */
const selectGlobalDomain = () => (state) => state.login

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

const selectCurrentUser = () => createSelector(
  selectGlobalDomain(),
  (substate) => typeof substate.currentUser === 'string' ? JSON.parse(substate.currentUser) : substate.currentUser
)

const selectIsLogin = () => createSelector(
  selectGlobalDomain(),
  (substate) => substate.isLogin
)

export {
  selectGlobalDomain,
  selectSuccess,
  selectError,
  selectFetching,
  selectCurrentUser,
  selectIsLogin
}
