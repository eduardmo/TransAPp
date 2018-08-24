import { createSelector } from 'reselect'
/**
 * Direct selector to the todo state domain
 */
const selectGlobalDomain = () => (state) => state.callInfo

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

const selectCallInfo = () => createSelector(
  selectGlobalDomain(),
  (substate) => substate.callInfo
)

const selectRemoteVid = () => createSelector(
  selectGlobalDomain(),
  (substate) => substate.remoteVidUrl
)

const selectLocalVid = () => createSelector(
  selectGlobalDomain(),
  (substate) => substate.localVidUrl
)

const selectConnecting = () => createSelector(
  selectGlobalDomain(),
  (substate) => substate.connecting
)

const selectConnected = () => createSelector(
  selectGlobalDomain(),
  (substate) => substate.connected
)

const selectIceServer = () => createSelector(
  selectGlobalDomain(),
  (substate) => substate.iceServers
)

export {
  selectGlobalDomain,
  selectSuccess,
  selectError,
  selectFetching,
  selectCallInfo,
  selectRemoteVid,
  selectLocalVid,
  selectConnecting,
  selectConnected,
  selectIceServer
}
