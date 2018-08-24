import { call, put } from 'redux-saga/effects'
import CreateAccountActions from '../Redux/CreateAccount'
import StatusHandler from '../Lib/StatusErrorHandler'

// attempts to createAccount
export function * createAccount (api, action) {
  const { values } = action
  // make the call to the api
  const response = yield call(api().post, values)
  // success?
  if (response.ok) {
    // dispatch successful create of account
    yield put(CreateAccountActions.createSuccess())
  } else {
    let errorMessage
    if (response.data) {
      const { message } = response.data.response
      errorMessage = (typeof message === 'string') ? message : null
    }

    // dispatch failure
    yield put(CreateAccountActions.createFailure({response: response.data, message: errorMessage || StatusHandler(response.problem)}))
  }
}
