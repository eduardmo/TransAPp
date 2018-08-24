// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  startup: null,
  userRequest: null,
  userSuccess: ['user'],
  userFail: null,
  networkChange: ['networkConnected']
})

export const StartupTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  currentUser: null,
  fetching: null,
  error: null,
  isLogin: null,
  networkConnected: true
})

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state) => state.merge({ fetching: true, currentUser: null })

// successful api lookup
export const success = (state, action) => {
  const { user } = action
  return state.merge({ fetching: false, error: null, currentUser: user, isLogin: true })
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({ fetching: false, error: true, currentUser: null, isLogin: false })

// Update network
export const updateNetwork = (state, { networkConnected } = Object) =>
  state.merge({ networkConnected })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.USER_REQUEST]: request,
  [Types.USER_SUCCESS]: success,
  [Types.USER_FAIL]: failure,
  [Types.NETWORK_CHANGE]: updateNetwork
})
