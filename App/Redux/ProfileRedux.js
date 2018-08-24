// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  profileRequest: null,
  profileSuccess: null,
  profileFailure: ['error'],
  profileSubmit: ['values'],
  countryRequest: null,
  countrySuccess: ['countries'],
  regionRequest: ['countryId'],
  regionSuccess: ['regions']
})

export const ProfileTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  success: false,
  error: null,
  fetching: false,
  countries: null,
  regions: null
})

/* ------------- Reducers ------------- */
// we're attempting to fetch profile
export const request = (state = Object) => state.merge({ fetching: true })

// we've successfully logged in || we have the user on our session
export const success = (state = Object) =>
  state.merge({ fetching: false, error: null, success: true })

// we've had a problem logging in
export const failure = (state = Object, { error } = Object) =>
  state.merge({ fetching: false, success: false, error })

// Attempting to update profile
export const updateProfileRequest = (state = Object) => state.merge({ fetching: true })

// attempt to get our countries
export const countryRequest = (state = Object) => state.merge({ fetching: true })
// Success Country
export const countrySuccess = (state = Object, { countries } = Object) =>
  state.merge({ fetching: false, error: null, success: true, countries })

// attempt to get our Regions
export const regionRequest = (state = Object) => state.merge({ fetching: true })
// Success Regions
export const regionSuccess = (state = Object, { regions } = Object) =>
  state.merge({ fetching: false, error: null, success: true, regions })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.PROFILE_REQUEST]: request,
  [Types.PROFILE_SUBMIT]: updateProfileRequest,
  [Types.PROFILE_SUCCESS]: success,
  [Types.PROFILE_FAILURE]: failure,
  [Types.COUNTRY_REQUEST]: countryRequest,
  [Types.COUNTRY_SUCCESS]: countrySuccess,
  [Types.REGION_REQUEST]: regionRequest,
  [Types.REGION_SUCCESS]: regionSuccess
})
