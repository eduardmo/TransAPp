// @flow

import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import { connect } from 'react-redux'

import NavigationRouter from '../Navigation/NavigationRouter'
import StartupActions from '../Redux/StartupRedux'
import ReduxPersist from '../Config/ReduxPersist'

// Styles
import styles from './Styles/RootContainerStyle'

class RootContainer extends Component {
  componentDidMount () {
    const { startup } = this.props
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      startup()
    }
  }

  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
        <NavigationRouter />
      </View>
    )
  }
}
// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup())
})

export default connect(null, mapDispatchToProps)(RootContainer)
