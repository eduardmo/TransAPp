import { call, put, select } from 'redux-saga/effects'
import CallInfoActions from '../Redux/CallInfoRedux'
import StatusHandler from '../Lib/StatusErrorHandler'

import {
  selectCurrentUser
} from '../Selectors/LoginSelectors'

// attempts to get all calls
export function * fetchCalls (api, action) {
  const { userId } = action
  const currentUser = yield select(selectCurrentUser())

    // make the call to the api
  // we need to pass the token for sure
  const response = yield call(api(currentUser.token).getCalls, userId)

  // success?
  if (response.ok) {
    const { rows } = response.data.response
    // dispatch
    yield put(CallInfoActions.callInfoSuccess(rows))
  } else {
    let errorMessage
    if (response.data) {
      let message
      if (response.data.response) {
        message = response.data.response
      }

      errorMessage = message || response.data
    }
    // dispatch failure
    yield put(CallInfoActions.callInfoFailure({response: response.data, message: errorMessage || StatusHandler(response.problem)}))
  }
}

// atemps to create the call
export function * createCall (api, action) {
  const currentUser = yield select(selectCurrentUser())
  const { user } = currentUser
  const { values } = action
  // make the call to the api
  const response = yield call(api(currentUser.token).createCall, values)
  // success?
  if (response.ok) {
    // we need to get the latest data!
    // dispatch successful create of account

    yield put(CallInfoActions.callInfoSuccess())
    yield fetchCalls(api, { userId: user.id })
  } else {
    yield put(CallInfoActions.callInfoFailure({response: response.data, message: StatusHandler(response.problem)}))
  }
}

// atemps to get the credentials
export function * requestTurnServer (api, action) {
  // make the call to the api
  const response = yield call(api().turnServer)

  // // success?
  if (response.ok) {
    const { data } = response

    yield put(CallInfoActions.callInfoSuccessTurnServer(data.d))
  } else {
    yield put(CallInfoActions.callInfoFailure({response: response.data, message: StatusHandler(response.problem)}))
  }
}
