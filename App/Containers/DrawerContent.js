// @flow

import React, { Component } from 'react'
import I18n from 'react-native-i18n'
import { connect } from 'react-redux'
import { ScrollView, Image, BackAndroid } from 'react-native'

import DrawerButton from '../Components/DrawerButton'
import LoginActions from '../Redux/LoginRedux'
import { Images } from '../Themes'

import styles from './Styles/DrawerContentStyle'

class DrawerContent extends Component {
  constructor () {
    super()

    this.handleLogout = this.handleLogout.bind(this)
  }

  componentDidMount () {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.context.drawer.props.open) {
        this.toggleDrawer()
        return true
      }
      return false
    })
  }

  toggleDrawer () {
    this.context.drawer.toggle()
  }

  handleLogout () {
    const { handleLogout } = this.props
    this.toggleDrawer()
    handleLogout()
  }

  render () {
    // <DrawerButton text='Change Password' onPress={this.toggleDrawer} />
    return (
      <ScrollView style={styles.container}>
        <Image source={Images.logo} style={styles.logo} />
        <DrawerButton text={I18n.t('logOut')} onPress={this.handleLogout} />
      </ScrollView>
    )
  }
}

DrawerContent.contextTypes = {
  drawer: React.PropTypes.object
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleLogout: (value) => dispatch(LoginActions.logoutRequest()),
    dispatch
  }
}

export default connect(null, mapDispatchToProps)(DrawerContent)
