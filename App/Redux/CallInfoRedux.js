// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  callInfoRequest: ['userId'],
  callInfoSuccess: ['callInfo'],
  callInfoFailure: ['error'],
  callInfoRegister: ['values'],
  callInfoRemoteVid: ['remoteVidUrl'],
  callInfoLocalVid: ['localVidUrl'],
  callInfoConnecting: ['connecting'],
  callInfoConnected: ['connected'],
  callInfoRequestTurnServer: null,
  callInfoSuccessTurnServer: ['iceServers']
})

export const CallInfoTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  callInfo: null,
  success: false,
  error: null,
  fetching: false,
  localVidUrl: null,
  remoteVidUrl: null,
  connecting: false,
  connected: false,
  // temporary
  iceServers: {}
})

/* ------------- Reducers ------------- */

// getting our callInfo
export const request = (state = Object) => state.merge({ fetching: true })

// mean we are able to fetch teh call info
export const success = (state = Object, { callInfo } = Object) =>
  state.merge({ fetching: false, error: null, success: true, callInfo })

// we've had a problem logging in
export const failure = (state = Object, { error } = Object) =>
  state.merge({ fetching: false, success: false, callInfo: null, error })

// Attempting to update profile
export const createCallInfo = (state = Object) =>
  state.merge({ fetching: true })

// Attempting to create remote vid url
export const createRemoteVidUrl = (state = Object, { remoteVidUrl } = String) =>
  state.merge({ remoteVidUrl })

// Attempting to create remote vid url
export const createLocalVidUrl = (state = Object, { localVidUrl } = String) =>
  state.merge({ localVidUrl })

// Attempting to create remote connecting
export const updateConnecting = (state = Object, { connecting } = String) =>
  state.merge({ connecting })

// Attempting to create remote connected
export const updateConnected = (state = Object, { connected } = String) =>
  state.merge({ connected })

// Attempting to request for turn server
export const requestTurnServer = (state = Object) =>
  state.merge({ fetching: true })

// success for turn server
export const successTurnServer = (state = Object, { iceServers } = Object) =>
  state.merge({ fetching: false, iceServers })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CALL_INFO_REQUEST]: request,
  [Types.CALL_INFO_SUCCESS]: success,
  [Types.CALL_INFO_FAILURE]: failure,
  [Types.CALL_INFO_REGISTER]: createCallInfo,
  [Types.CALL_INFO_REMOTE_VID]: createRemoteVidUrl,
  [Types.CALL_INFO_LOCAL_VID]: createLocalVidUrl,
  [Types.CALL_INFO_CONNECTING]: updateConnecting,
  [Types.CALL_INFO_CONNECTED]: updateConnected,
  [Types.CALL_INFO_REQUEST_TURN_SERVER]: requestTurnServer,
  [Types.CALL_INFO_SUCCESS_TURN_SERVER]: successTurnServer
})
