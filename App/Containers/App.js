// @flow

import React, { Component } from 'react'
import VoipPushNotification from 'react-native-voip-push-notification'

import FCM, { FCMEvent } from 'react-native-fcm'
import { Provider } from 'react-redux'
import { AppState, Platform } from 'react-native'

import '../I18n/I18n' // keep before root container
import RootContainer from './RootContainer'

import createStore from '../Redux'
import CallInfoActions from '../Redux/CallInfoRedux'
import applyConfigSettings from '../Config'
import Communication from '../Lib/Communication'

// Apply config overrides
applyConfigSettings()
// create our store
const store = createStore()

/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * We separate like this to play nice with React Native's hot reloading.
 */
class App extends Component {
  _fcmNotificationHandler

  // Handler if notification is receive but the app is not active
  notification = null

  // we need to identify if the call is answered or not.
  _answered = false

  /**
   * call id handler so we know whos call to end this usually comes from the notification
   */
  _uuid
  /**
   * _data whole object from notification that we pass to our communication object
   */
  _data

  _callkit

  // communication handler
  __communication

  // to emit dispatches
  __auth
  constructor () {
    super()

    // so we can initiate emit
    this.__communication = new Communication()
    this._onNotification = this._onNotification.bind(this)
    this._handleAppStateChange = this._handleAppStateChange.bind(this)
    this._appOpenCanCall = this._appOpenCanCall.bind(this)
    this._onRNCallKitPerformAnswerCallAction = this._onRNCallKitPerformAnswerCallAction.bind(this)
    this._onRNCallKitPerformEndCallAction = this._onRNCallKitPerformEndCallAction.bind(this)
  }

  // TODO: we need to make sure that we hande the end call of call kits
  _onRNCallKitPerformAnswerCallAction ({ callUUID }) {
    this._answered = true
    // You will get this event when the user answer the incoming call
    this.__communication._readyToAcceptCall(this._data)
    store.dispatch(CallInfoActions.callInfoConnecting(true))
  }

  // ending call
  _onRNCallKitPerformEndCallAction ({ callUUID }) {
    const { caller, language, receiver } = this._data
    const missedDate = new Date()
    this._answered && store.dispatch(
      CallInfoActions.callInfoRegister({
        call_start: missedDate,
        call_end: missedDate,
        status: 'not-answered',
        caller,
        receiver,
        language
      })
    )

    // we have to reset it back
    this._answered = false
  }

  _appOpenCanCall ({ _data }) {
    const { room } = _data
    this._uuid = room
    this._data = _data
    this.notification = null

    // we will handle here if theres no answer
  }

  _onNotification ({ _data }) {
    const { room } = _data
    // we cannot simply use the id since once there's issue with the uuid it wont show the call correctly
    this._uuid = room
    this._data = _data
    this.notification = null

    this.__communication._callkit.displayIncomingCall(this._uuid, 'Translator')
    // Timeout to determine if the call is missed.
    setTimeout(() => {
      if (!this._answered) {
        this.__communication.socket.emit('call_missed', { room })
        this.__communication._callkit.endCall(this._uuid)
      }
    }, this.__communication.secondsHandlerNotAnswer)
  }

  _handleAppStateChange (nextAppState) {
    if (nextAppState === 'active' && this.notification !== null) {
      // we exactly know that our app is open from the background
      this._appOpenCanCall(this.notification)
    }
  }

  componentDidMount () {
    // if ios then we have to use VOIP and callKit
    // else just regular push thing for android
    if (Platform.OS === 'ios') {
      VoipPushNotification.requestPermissions() // required
      VoipPushNotification.addEventListener('notification', this._onNotification)

      this.__communication._callkit.addEventListener('answerCall', this._onRNCallKitPerformAnswerCallAction)
      this.__communication._callkit.addEventListener('endCall', this._onRNCallKitPerformEndCallAction)
    } else {
      // android notifications events
      // PushNotification.configure({
      //   onNotification: (data) => this._onNotification({ _data: data }),
      //   popInitialNotification: false,
      //   requestPermissions: true
      // })

      this._fcmNotificationHandler = FCM.on(FCMEvent.Notification, async (data) => {
        if (!data.local_notification) {
          this._onNotification({ _data: data })
        }
        if (data.opened_from_tray) {
          // app is open/resumed because user clicked banner
          this._onRNCallKitPerformAnswerCallAction({ callUUID: '' })
        }
      })
    }

    AppState.addEventListener('change', this._handleAppStateChange)
  }

  componentWillUnmount () {
    // memory leak
    if (Platform.OS === 'ios') {
      VoipPushNotification.removeEventListener('notification', this._onNotification)

      this.__communication._callkit.removeEventListener('answerCall', this._onRNCallKitPerformAnswerCallAction)
      this.__communication._callkit.removeEventListener('endCall', this._onRNCallKitPerformEndCallAction)
    } else {
      // android notifications unregister events
      this._fcmNotificationHandler.remove()
    }

    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  render () {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    )
  }
}

export default App
