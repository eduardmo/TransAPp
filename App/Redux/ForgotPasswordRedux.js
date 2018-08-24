// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  forgotPasswordRequest: ['values'],
  forgotPasswordSuccess: null,
  forgotPasswordFailure: ['error']
})

export const ForgotPasswordTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  success: false,
  error: null,
  fetching: false
})

/* ------------- Reducers ------------- */
// we're attempting to login
export const request = (state = Object) => state.merge({ fetching: true })

// we've successfully logged in || we have the user on our session
export const success = (state = Object) =>
  state.merge({ fetching: false, error: null, success: true })

// we've had a problem logging in
export const failure = (state = Object, { error } = Object) =>
  state.merge({ fetching: false, success: false, error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FORGOT_PASSWORD_REQUEST]: request,
  [Types.FORGOT_PASSWORD_SUCCESS]: success,
  [Types.FORGOT_PASSWORD_FAILURE]: failure
})
