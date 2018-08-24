// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  infoLoginRequest: null,
  loginRequest: ['values'],
  loginSuccess: ['currentUser'],
  loginFailure: ['error'],
  logoutRequest: null,
  logoutSuccess: null
})

export const LoginTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  currentUser: null,
  success: false,
  error: null,
  fetching: false,
  isLogin: false
})

/* ------------- Reducers ------------- */
// Requesting to check if user is login
export const getLoginInfo = (state = Object) => state.merge({ fetching: true })

// we're attempting to login
export const request = (state = Object) => state.merge({ fetching: true })

// we've successfully logged in || we have the user on our session
export const success = (state = Object, { currentUser } = Object) =>
  state.merge({ fetching: false, error: null, success: true, isLogin: true, currentUser })

// we've had a problem logging in
export const failure = (state = Object, { error } = Object) =>
  state.merge({ fetching: false, success: false, currentUser: null, isLogin: false, error })

// we've logged out
export const logoutProcess = (state = Object) => state.merge({ fetching: true })
export const logoutDone = (state = Object) => INITIAL_STATE

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INFO_LOGIN_REQUEST]: getLoginInfo,
  [Types.LOGIN_REQUEST]: request,
  [Types.LOGIN_SUCCESS]: success,
  [Types.LOGIN_FAILURE]: failure,
  [Types.LOGOUT_REQUEST]: logoutProcess,
  [Types.LOGOUT_SUCCESS]: logoutDone
})
