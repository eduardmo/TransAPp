// @flow

import React, { Component } from 'react'
import { Scene, Router } from 'react-native-router-flux'
import I18n from 'react-native-i18n'

import Styles from './Styles/NavigationContainerStyle'
import NavigationDrawer from './NavigationDrawer'
import CustomNavBar from './CustomNavBar'
import NavItems from './NavItems'

// screens identified by the router
import CallInitializer from '../Containers/CallInitializer'
import MainScreen from '../Containers/MainScreen'
import ProfileScreen from '../Containers/ProfileScreen'
import LoginScreen from '../Containers/LoginScreen'
import CreateAccountScreen from '../Containers/CreateAccountScreen'
import ForgotPasswordScreen from '../Containers/ForgotPasswordScreen'

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/

class NavigationRouter extends Component {
  render () {
    return (
      <Router>
        <Scene key='drawer' component={NavigationDrawer} open={false}>
          <Scene key='drawerChildrenWrapper' navigationBarStyle={Styles.navBar} titleStyle={Styles.title} leftButtonIconStyle={Styles.leftButton} rightButtonTextStyle={Styles.rightButton}>
            <Scene key='tabular' tabs tabBarStyle={Styles.tabBar}>
              <Scene key='tab_overview' title={I18n.t('languagesPageTitle')} iconName='grid' icon={NavItems.tabIcon} navigationBarStyle={Styles.navBar} titleStyle={Styles.title} leftButtonIconStyle={Styles.leftButton} rightButtonTextStyle={Styles.rightButton}>
                <Scene initial key='tabMainScreen' component={MainScreen} title={I18n.t('overviewPageTitle')} navBar={CustomNavBar} />
              </Scene>

              <Scene key='tabProfile' title={I18n.t('profilePageTitle')} iconName='user' icon={NavItems.tabIcon} navigationBarStyle={Styles.navBar} titleStyle={Styles.title}>
                <Scene key='profileScreen' component={ProfileScreen} title={I18n.t('profilePageTitle')} renderLeftButton={NavItems.hamburgerButton} />
              </Scene>
            </Scene>
            <Scene key='callInitiate' direction='vertical' component={CallInitializer} title={I18n.t('callPageTitle')} hideNavBar panHandlers={null} />
            <Scene key='login' direction='vertical' component={LoginScreen} title={I18n.t('loginPageTitle')} hideNavBar panHandlers={null} />
            <Scene key='createAccount' schema='modal' component={CreateAccountScreen} title={I18n.t('createAccountPageTitle')} hideNavBar={false} />
            <Scene key='forgotPassword' schema='modal' component={ForgotPasswordScreen} title={I18n.t('forgotPasswordPageTitle')} hideNavBar={false} />
          </Scene>
        </Scene>
      </Router>
    )
  }
}

export default NavigationRouter
