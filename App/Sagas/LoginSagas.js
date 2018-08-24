import { call, put } from 'redux-saga/effects'
import LoginActions from '../Redux/LoginRedux'
import StatusHandler from '../Lib/StatusErrorHandler'
// import FabricException from '../Lib/FabricExceptionHandler'
import Storage from '../Storage'

// attempts to login
export function * login (api, action) {
  const { values: { email, password, push_id } } = action
  // make the call to the api
  const response = yield call(api().login, { email, password, push_id })
  // we need to know whats going on.
  // we confirm that this is not the issue.
  // but somehow issue with iphone 5s 9.2 ** but for now we will comment this out
  // new FabricException()._exception(JSON.stringify(response))
  // success?
  if (response.ok) {
    const currentUser = response.data.response
    // dispatch successful login
    // save to our storgae
    yield call(Storage.setItem, 'currentUser', currentUser)
    yield put(LoginActions.loginSuccess(currentUser))
  } else {
    let errorMessage
    if (response.data) {
      const { message } = response.data.response
      errorMessage = message
    }
    // dispatch failure
    yield put(LoginActions.loginFailure({response: response.data, message: errorMessage || StatusHandler(response.problem)}))
  }
}

export function * logout (action) {
  yield call(Storage.removeItem, 'currentUser')
  yield put(LoginActions.logoutSuccess({}))
}

// attempts to if we have currentuser
export function * getLoginInfo () {
  const user = yield call(Storage.getItem, 'currentUser')
  if (user) {
    yield put(LoginActions.loginSuccess(user))
  } else {
    yield put(LoginActions.loginFailure(null))
  }
}
