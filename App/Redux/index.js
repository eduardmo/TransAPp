// @flow

import { combineReducers } from 'redux'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'

export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const rootReducer = combineReducers({
    login: require('./LoginRedux').reducer,
    search: require('./SearchRedux').reducer,
    createAccount: require('./CreateAccount').reducer,
    forgotPasssword: require('./ForgotPasswordRedux').reducer,
    main: require('./MainRedux').reducer,
    client: require('./ClientRedux').reducer,
    translator: require('./TranslatorRedux').reducer,
    profile: require('./ProfileRedux').reducer,
    callInfo: require('./CallInfoRedux').reducer,
    startup: require('./StartupRedux').reducer
  })

  return configureStore(rootReducer, rootSaga)
}
