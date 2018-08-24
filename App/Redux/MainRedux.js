// @flow
import Immutable from 'seamless-immutable'
import { createReducer, createActions } from 'reduxsauce'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  show: ['showSearch']
})

export const TemperatureTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  showSearch: false
})

/* ------------- Reducers ------------- */

export const showSearch = (state = Object, { showSearch } = Object) => {
  return state.merge({ showSearch })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SHOW]: showSearch
})
