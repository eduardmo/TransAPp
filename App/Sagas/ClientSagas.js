import { call, put, select } from 'redux-saga/effects'
import ClientAction from '../Redux/ClientRedux'
import StatusHandler from '../Lib/StatusErrorHandler'

import {
  selectCurrentUser
} from '../Selectors/LoginSelectors'

// attempts to get languages
export function * languages (api) {
  const currentUser = yield select(selectCurrentUser())
  const token = currentUser ? currentUser.token : ''
  // make the call to the api
  // we need to pass the token for sure
  const response = yield call(api(token).languages)
  // console.log(response)
  // success?
  if (response.ok) {
    // // save to our storgae
    yield put(ClientAction.languagesSuccess(response.data.response))
  } else {
    let errorMessage
    if (response.data) {
      const { msg } = response.data
      errorMessage = msg
    }
    // dispatch failureN
    yield put(ClientAction.languagesFailure({response: response.data, message: errorMessage || StatusHandler(response.problem)}))
  }
}

// attempts to get translators
export function * translators (api, action) {
  const currentUser = yield select(selectCurrentUser())
  const token = currentUser ? currentUser.token : ''
  const { payload: { id, certified, resolve } } = action

  // make the call to the api
  // we need to pass the token for sure
  const response = yield call(api(token).translators, { id, certified })
  // success?
  if (response.ok) {
    const { rows } = response.data.response
    // save to our storgae
    yield put(ClientAction.translatorSuccess(rows))
    resolve(rows)
  } else {
    let errorMessage
    if (response.data) {
      const { msg } = response.data
      errorMessage = msg
    }
    // dispatch failureN
    yield put(ClientAction.languagesFailure({response: response.data, message: errorMessage || StatusHandler(response.problem)}))
  }
}

export function * submitRatings (api, action) {
  const currentUser = yield select(selectCurrentUser())
  const { values } = action
  // make the call to the api
  const response = yield call(api(currentUser.token).ratings, values)
  // // success?
  if (response.ok) {
    // we need to get the latest data!
    // dispatch successful create of account
    yield put(ClientAction.submitRatingsSuccess())
  } else {
    yield put(ClientAction.languagesFailure({response: response.data, message: StatusHandler(response.problem)}))
  }
}
