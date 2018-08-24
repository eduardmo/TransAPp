import R from 'ramda'
import React from 'react'
import Spinner from 'react-native-spinkit'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import {
  TouchableOpacity,
  View,
  LayoutAnimation
} from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { createStructuredSelector } from 'reselect'
import {
  RTCView
} from 'react-native-webrtc'

import Styles from './Styles/CallInitializerStyle'

import CallInfoActions from '../Redux/CallInfoRedux'

import {
  selectCurrentUser
} from '../Selectors/LoginSelectors'

import {
  selectLocalVid,
  selectRemoteVid,
  selectConnecting,
  selectConnected
} from '../Selectors/CallsSelectors'

import { Metrics, Colors } from '../Themes'

import isAuthenticated from './Auth'

class CallInitializer extends React.Component {
  constructor () {
    super()

    this.state = {
      // we need to disable answer button once they clicked it.
      // since it has a delay on connection we need to have a safeguard not to let them double click it.
      disableAnswer: false
    }
    this._endCallInitializer = this._endCallInitializer.bind(this)
    this._renderRemoveVid = this._renderRemoveVid.bind(this)
    this._renderLocalVid = this._renderLocalVid.bind(this)
  }

  _endCallInitializer () {
    const { communication: { _doEndCall } } = this.props
    // end the call
    _doEndCall()
    // pop navigation
    // NavigationActions.pop()
  }

  _renderLoader () {
    const { connecting, connected } = this.props
    if (connecting && !connected) {
      return (
        <View style={Styles.spinnerWrapper}>
          <Spinner
            size={50}
            type='Wave'
            color='#000000'
          />
        </View>
      )
    }

    return null
  }

  _displayAnswerButton () {
    const { disableAnswer } = this.state
    const { currentUser, connected, communication: { _doAnswer } } = this.props
    let component

    try {
      if (!currentUser) {
        throw new Error('no user')
      }

      // allow role 4 only to answer the phone
      if (!connected && currentUser.role.id === 4 && !disableAnswer) {
        component = (
          <TouchableOpacity style={[Styles.callAnswer, Styles.callButtons]} onPress={() => {
            this.setState({ disableAnswer: true })
            _doAnswer()
          }}>
            <MaterialIcons style={Styles.callIcons} name='call' size={Metrics.icons.large} color={Colors.snow} />
          </TouchableOpacity>
        )
      }
    } catch (e) {
      component = null
    }

    return component
  }

  _renderRemoveVid () {
    const { remoteVidUrl } = this.props

    if (!remoteVidUrl) {
      return null
    }

    return (
      <RTCView streamURL={remoteVidUrl} style={Styles.streamVideo} />
    )
  }

  _renderLocalVid () {
    const { remoteVidUrl, localVidUrl } = this.props
    const localVidUrlClass = R.ifElse(
      R.isNil || R.isEmpty,
      () => Styles.streamVideo,
      () => R.append(Styles.localStreamVideo, [Styles.streamVideo])
    )

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    return (
      <RTCView streamURL={localVidUrl} style={localVidUrlClass(remoteVidUrl)} />
    )
  }

  componentWillReceiveProps (nextProps) {
    const { connecting, connected } = nextProps

    if (connecting === false && connected === false) {
      NavigationActions.pop()
    }
  }

  render () {
    return (
      <View style={Styles.callContainer}>
        {this._renderRemoveVid()}
        {this._renderLocalVid()}
        {this._renderLoader()}
        <View style={Styles.callModalControls}>
          <TouchableOpacity style={[Styles.callEnd, Styles.callButtons]} onPress={this._endCallInitializer}>
            <MaterialIcons style={Styles.callIcons} name='call-end' size={Metrics.icons.large} color={Colors.snow} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser(),
  localVidUrl: selectLocalVid(),
  remoteVidUrl: selectRemoteVid(),
  connecting: selectConnecting(),
  connected: selectConnected()
})

const mapDispatchToProps = (dispatch) => {
  return {
    updateConnecting: (values) => dispatch(CallInfoActions.callInfoConnecting(values)),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(isAuthenticated(CallInitializer))
