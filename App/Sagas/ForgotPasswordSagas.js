import { call, put } from 'redux-saga/effects'
import ForgotPasswordActions from '../Redux/ForgotPasswordRedux'
import StatusHandler from '../Lib/StatusErrorHandler'

// attempts to forgotPassword
export function * forgotPassword (api, action) {
  const { values: { email } } = action
  // make the call to the api
  const response = yield call(api().forgotPassword, { email })

  // success?
  if (response.ok) {
    // save to our storgae
    yield put(ForgotPasswordActions.forgotPasswordSuccess())
  } else {
    let errorMessage
    if (response.data) {
      const { msg } = response.data
      errorMessage = msg
    }
    // dispatch failureN
    yield put(ForgotPasswordActions.forgotPasswordFailure({response: response.data, message: errorMessage || StatusHandler(response.problem)}))
  }
}
