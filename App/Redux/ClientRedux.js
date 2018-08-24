// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  languagesRequest: null,
  languagesSuccess: ['languages'],
  languagesFailure: ['error'],
  translatorRequest: ['payload'],
  translatorSuccess: ['translators'],
  callSubmitRatings: ['values'],
  submitRatingsSuccess: null
})

export const LanguagesTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  languages: null,
  translators: null,
  success: false,
  error: null,
  fetching: false
})

/* ------------- Reducers ------------- */
// we're attempting to login
export const request = (state = Object) => state.merge({ fetching: true })

// we've successfully logged in || we have the user on our session
export const success = (state = Object, { languages } = Object) =>
  state.merge({ fetching: false, error: null, success: true, languages })

// we've had a problem logging in
export const failure = (state = Object, { error } = Object) =>
  state.merge({ fetching: false, success: false, error })

// Attempting to FETCH all translator that has the language
export const getTranslator = (state = Object) =>
  state.merge({ fetching: true })

// we've successfully fetch all the translators
export const putTranslator = (state = Object, { translators } = Object) =>
  state.merge({ fetching: false, error: null, success: true, translators })

// Attempting to setup ratings
export const submitRatings = (state = Object) =>
  state.merge({ fetching: true })

// if ratings is successfull
export const submitRatingsSuccess = (state = Object) =>
  state.merge({ fetching: false, error: null, success: true })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LANGUAGES_REQUEST]: request,
  [Types.LANGUAGES_SUCCESS]: success,
  [Types.LANGUAGES_FAILURE]: failure,
  [Types.TRANSLATOR_REQUEST]: getTranslator,
  [Types.TRANSLATOR_SUCCESS]: putTranslator,
  [Types.CALL_SUBMIT_RATINGS]: submitRatings,
  [Types.SUBMIT_RATINGS_SUCCESS]: submitRatingsSuccess
})
