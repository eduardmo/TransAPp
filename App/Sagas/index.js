import { takeLatest } from 'redux-saga/effects'
// import FixtureAPI from '../Services/FixtureApi'
// import DebugSettings from '../Config/DebugSettings'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { LoginTypes } from '../Redux/LoginRedux'
import { OpenScreenTypes } from '../Redux/OpenScreenRedux'
import { CreateAccountTypes } from '../Redux/CreateAccount'
import { ForgotPasswordTypes } from '../Redux/ForgotPasswordRedux'
import { LanguagesTypes } from '../Redux/ClientRedux'
import { ProfileTypes } from '../Redux/ProfileRedux'
import { CallInfoTypes } from '../Redux/CallInfoRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { getLoginInfo, login, logout } from './LoginSagas'
import { openScreen } from './OpenScreenSagas'
import { createAccount } from './CreateAccountSagas'
import { forgotPassword } from './ForgotPasswordSagas'
import { languages, translators, submitRatings } from './ClientSagas'
import { profile, updateProfile, country, region } from './ProfileSagas'
import { fetchCalls, createCall, requestTurnServer } from './CallinfoSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
import {
  CreateAccountApi,
  LoginApi,
  ForgotPasswordApi,
  ClientApi,
  ProfileApi,
  CallInfoApi
} from '../Services/Api'
// const api = DebugSettings.useFixtures ? FixtureAPI : API.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield [
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),

    takeLatest(LoginTypes.LOGIN_REQUEST, login, LoginApi),
    // we will check if user is login
    takeLatest(LoginTypes.INFO_LOGIN_REQUEST, getLoginInfo),
    takeLatest(LoginTypes.LOGOUT_REQUEST, logout),

    takeLatest(OpenScreenTypes.OPEN_SCREEN, openScreen),

    // saga that will request to create an CreateAccount
    takeLatest(CreateAccountTypes.CREATE_REQUEST, createAccount, CreateAccountApi),

    // saga that will simply request for password reset
    takeLatest(ForgotPasswordTypes.FORGOT_PASSWORD_REQUEST, forgotPassword, ForgotPasswordApi),

    // saga that will simply request for the languages available
    takeLatest(LanguagesTypes.LANGUAGES_REQUEST, languages, ClientApi),

    // saga that will simply request for the translators
    takeLatest(LanguagesTypes.TRANSLATOR_REQUEST, translators, ClientApi),

    // saga that will simply request for ratings submission
    takeLatest(LanguagesTypes.CALL_SUBMIT_RATINGS, submitRatings, ClientApi),

    // saga that will simply request for the lates Profile
    takeLatest(ProfileTypes.PROFILE_REQUEST, profile, ProfileApi),

    // saga that will simply update request
    takeLatest(ProfileTypes.PROFILE_SUBMIT, updateProfile, ProfileApi),

    // saga that will simply request for the lates Profile
    takeLatest(ProfileTypes.COUNTRY_REQUEST, country, ProfileApi),

    // saga that will simply request for the lates Profile
    takeLatest(ProfileTypes.REGION_REQUEST, region, ProfileApi),

    // saga that will simply request all the call info
    takeLatest(CallInfoTypes.CALL_INFO_REQUEST, fetchCalls, CallInfoApi),

    // saga that will simply create call info
    takeLatest(CallInfoTypes.CALL_INFO_REGISTER, createCall, CallInfoApi),

    // saga that will simply request for turn server credentials
    takeLatest(CallInfoTypes.CALL_INFO_REQUEST_TURN_SERVER, requestTurnServer, CallInfoApi)

    // some sagas receive extra parameters in addition to an action
    // takeLatest(TemperatureTypes.TEMPERATURE_REQUEST, getTemperature, api)
  ]
}
