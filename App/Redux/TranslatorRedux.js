// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  translatorRequest: null,
  translatorSuccess: ['translator'],
  translatorFailure: ['error']
})

export const LanguagesTypes = Types
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
export const failure = (state = Object, { error } = Object) => {
  console.log('REDUX', error)
  return state.merge({ fetching: false, success: false, error })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.TRANSLATOR_REQUEST]: request,
  [Types.TRANSLATOR_SUCCESS]: success,
  [Types.TRANSLATOR_FAILURE]: failure
})
