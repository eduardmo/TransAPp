import _ from 'lodash'
import { call, put, select } from 'redux-saga/effects'
import ProfileAction from '../Redux/ProfileRedux'
import LoginActions from '../Redux/LoginRedux'
import StatusHandler from '../Lib/StatusErrorHandler'
import Storage from '../Storage'

import {
  selectCurrentUser
} from '../Selectors/LoginSelectors'

// attempts to get profile
export function * profile (api) {
  const currentUser = yield select(selectCurrentUser())
  const copyUser = Object.assign({}, currentUser)

  // make the call to the api
  // we need to pass the token for sure
  const response = yield call(api(currentUser.token).profile, currentUser)

  // success?
  if (response.ok) {
    const { languages, user, online, certified } = response.data.response
    const updatedUser = Object.assign(copyUser, {
      user: Object.assign(_.omit(user, ['role', 'role_id', 'iban']), {
        languages,
        online,
        certified,
        organization: user.role_id === 4 ? response.data.response.translation_organization : response.data.response.client_organization
      })
    })
    // save to our storgae
    yield call(Storage.setItem, 'currentUser', updatedUser)
    yield put(LoginActions.loginSuccess(JSON.stringify(updatedUser)))
    yield put(ProfileAction.profileSuccess())
  } else {
    let errorMessage
    if (response.data) {
      const { msg } = response.data
      errorMessage = msg
    }
    // dispatch failureN
    yield put(ProfileAction.profileFailure({response: response.data, message: errorMessage || StatusHandler(response.problem)}))
  }
}

// attempts to updateprofile
export function * updateProfile (api, action) {
  const currentUser = yield select(selectCurrentUser())
  const { user } = currentUser
  const { values } = action
  // make the call to the api
  const response = yield call(api(currentUser.token).update, user.id, values)
  // success?
  if (response.ok) {
    // we need to get the latest data!
    yield * profile(api)
    // dispatch successful create of account
    yield put(ProfileAction.profileSuccess())
  } else {
    yield put(ProfileAction.profileFailure({response: response.data, message: StatusHandler(response.problem)}))
  }
}

// attempts to get country
export function * country (api) {
  const currentUser = yield select(selectCurrentUser())

  // fist we will check if it exist on our local stroge
  let countries = yield call(Storage.getItem, 'countries')
  try {
    if (_.isEmpty(countries)) {
      const response = yield call(api(currentUser.token).countries)
      if (!response.ok) {
        let errorMessage
        if (response.data) {
          const { msg } = response.data
          errorMessage = msg
        }

        throw new Error({
          response: response.data,
          message: errorMessage,
          problem: response.problem
        })
      } else {
        const { data } = response.data
        yield call(Storage.setItem, 'countries', data)
        countries = data
      }
    }

    yield put(ProfileAction.countrySuccess(countries))
  } catch (e) {
    // dispatch failureN
    yield put(ProfileAction.profileFailure({response: e.response, message: e.message || StatusHandler(e.problem)}))
  }
}

// attempts to get region
export function * region (api, action) {
  const currentUser = yield select(selectCurrentUser())
  const { countryId } = action
  // make the call to the api
  // we need to pass the token for sure
  const response = yield call(api(currentUser.token).regions, countryId)

  // success?
  if (response.ok) {
    const { data } = response.data
    yield put(ProfileAction.regionSuccess(data))
  } else {
    let errorMessage
    if (response.data) {
      const { msg } = response.data
      errorMessage = msg
    }
    // dispatch failureN
    yield put(ProfileAction.profileFailure({response: response.data, message: errorMessage || StatusHandler(response.problem)}))
  }
}
