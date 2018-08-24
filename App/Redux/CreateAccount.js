// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  createRequest: ['values'],
  createSuccess: ['response'],
  createFailure: ['error']
})

export const CreateAccountTypes = Types
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

// we've successfully logged in
export const success = (state = Object) =>
  state.merge({ fetching: false, error: null, success: true })

// we've had a problem logging in
export const failure = (state = Object, { error } = Object) =>
  state.merge({ fetching: false, error, success: false })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CREATE_REQUEST]: request,
  [Types.CREATE_SUCCESS]: success,
  [Types.CREATE_FAILURE]: failure
})
