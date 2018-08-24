import React from 'react'
import _ from 'lodash'
import Spinner from 'react-native-spinkit'
import I18n from 'react-native-i18n'
import Modal from 'react-native-modalbox'
import StarRating from 'react-native-star-rating'
import moment from 'moment'
import VoipPushNotification from 'react-native-voip-push-notification'
import FCM, { FCMEvent } from 'react-native-fcm'

import Toaster, { ToastStyles } from 'react-native-toaster'

import {
  NetInfo,
  Platform,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { createStructuredSelector } from 'reselect'

import Styles from './Styles/AuthStyle'
import CallInfoActions from '../Redux/CallInfoRedux'
import ProfileAction from '../Redux/ProfileRedux'
import LoginActions from '../Redux/LoginRedux'
import ClientActions from '../Redux/ClientRedux'
import StartupActions from '../Redux/StartupRedux'
import Communication from '../Lib/Communication'

import {
  selectCurrentUser,
  selectIsLogin,
  selectFetching
} from '../Selectors/LoginSelectors'

import {
  selectConnecting,
  selectConnected,
  selectIceServer
} from '../Selectors/CallsSelectors'

import {
  selectUpdateNetwork
} from '../Selectors/StartupSelectors'

// const TronDebugger = (name, value) => {
//   return console.tron.display({
//     name: name.toUpperCase(),
//     value
//   })
// }

/**
 *
 */
let __communication = null

/**
 * HOC where we wrap our object to have extra layer of verification
 * @param {*} WrapperComponent
 */
export default function isAuthenticated (WrapperComponent) {
  class AppAuthenticated extends React.Component {
    // static communication // main handler for our communication module

    requesting = false

    _refreshTokenListener

    constructor () {
      super()

      this.state = {
        targets: null, // list of all possbile receivers
        caller: null, // identifier who is calling,
        receiver: null, // indetifier who receive the call,
        language: null, // what language it is
        toaster: null,
        room: null,
        connecting: false,
        connected: false,
        openRating: false,
        localStream: null,
        remoteStream: null,
        rating: 0,
        deviceToken: null,
        configuration: {
          iceServers: [
            { url: 'stun:turn.bitmonkeys.nl:3478' },
            {
              url: 'turn:turn.bitmonkeys.nl:3478',
              username: 'joshua',
              credential: 'letstrythis'
            }
          ]
        },
        sdpConstraints: {
          optional: [],
          mandatory: {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true
          }
        }
      }

      __communication = __communication || new Communication(this)
      this._endCall = this._endCall.bind(this)
      this._updateAuthState = this._updateAuthState.bind(this)
      this._onStarRatingPress = this._onStarRatingPress.bind(this)
      this._setToasterError = this._setToasterError.bind(this)
      this._handleConnectionInfoChange = this._handleConnectionInfoChange.bind(this)
      this._onRegister = this._onRegister.bind(this)
      this._updateUserToken = this._updateUserToken.bind(this)
    }

    _updateAuthState (key, cb = _.noop) {
      this.setState(key, cb)
    }

    _setToasterError (msg) {
      // make sure msg has an error
      msg && this._updateAuthState({
        toaster: {
          text: msg,
          styles: ToastStyles.error
        }
      })
    }

    _endCall (iceStatus) {
      const { createCallInfo, updateLocalVid, updateRemoteVid, updateConnecting } = this.props
      const { caller, receiver, language } = this.state

      // we end the call
      // if no call start then create a new date.
      __communication.callStart = __communication.callStart || new Date()
      __communication.callEnd = new Date()
      // we will determin how the call end by mix and matching state { connecting & connected }
      // call the initiator remove
      // once remove the call// @TODO
      createCallInfo({
        call_start: moment(__communication.callStart).format(),
        call_end: moment(__communication.callEnd).format(),
        status: iceStatus,
        caller,
        receiver,
        language
      })

      // we have to reset
      __communication.callStart = null
      __communication.callEnd = null
      __communication.callSuccessfully = false // on end call reset

      updateLocalVid(null)
      updateRemoteVid(null)
      updateConnecting(false)
    }

    _handleSubscribeTranslator (props) {
      const { currentUser } = props
      const { role, user: { id, online } } = currentUser
      if (online && role.id === 4) {
        // we have to make sure that our room is the email address.
        this.setState({
          room: id
        })
        __communication.channel = __communication.socket.subscribe(id)
        // we need to make sure that we will only watch to single functions
        if (__communication.socket.watchers(id).length === 0) {
          __communication.channel.watch(__communication._reducer)
        }
      } else {
        __communication.socket.unsubscribe(id)
      }
    }

    _renderLoader () {
      const { connecting, connected } = this.props
      if (connecting && !connected) {
        return (
          <View style={Styles.spinnerWrapper}>
            <Spinner
              size={50}
              type='Wave'
              color='#FFFFFF'
            />
          </View>
        )
      }

      return null
    }

    _onStarRatingPress (rate) {
      // then we will save it to our action
      const { createRatings } = this.props
      const { caller, receiver, language } = this.state

      // create createRatings
      createRatings({
        rater: caller,
        ratee: receiver,
        language,
        rate
      })

      this.setState({
        openRating: false
      })
    }

    _handleConnectionInfoChange = (connectionInfo) => {
      const { updateNetworkStatus } = this.props
      updateNetworkStatus(connectionInfo)
    }

    _onRegister (token, cb = _.noop) {
      this.setState({
        deviceToken: token
      }, () => cb())
    }

    _updateUserToken (props) {
      const { deviceToken } = this.state
      const { currentUser: { user }, updateProfile } = props
      if (deviceToken && ((deviceToken !== user.push_id) || (Platform.OS !== user.platform_device))) {
        updateProfile(
         Object.assign({}, _.omit(user, ['email', 'image', 'organization', 'iban']), {
           push_id: deviceToken,
           platform_device: Platform.OS
         })
        )
      }
    }

    componentDidMount () {
      const { getLoginInfo, currentUser } = this.props
      this.requesting = true
      getLoginInfo()
      // requestCallTurnServer()

      // We need to add an event listener
      NetInfo.isConnected.fetch().then(this._handleConnectionInfoChange)
      NetInfo.isConnected.addEventListener('change', this._handleConnectionInfoChange)

      // if ios then we have to use VOIP event listener
      // else just the push notification
      if (Platform.OS === 'ios') {
        VoipPushNotification.addEventListener('register', this._onRegister)
      } else {
        // PushNotification.configure({
        //   // onError: (onError) => console.tron.log({ onError }),
        //   // senderID: AppConfig.GCM_SENDER_ID,
        //   requestPermissions: true,
        //   popInitialNotification: true,
        //   onRegister: (token) => {
        //     console.tron.log(token)
        //     this._onRegister(token)
        //   },
        // })
        FCM.requestPermissions()
        FCM.getFCMToken().then((token) =>
          this._onRegister(token, () => !_.isEmpty(currentUser) && this._updateUserToken(this.props))
        )

        this._refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) =>
          this._onRegister(token, () => !_.isEmpty(currentUser) && this._updateUserToken(this.props))
        )

        // PushNotification.requestPermissions(AppConfig.GCM_SENDER_ID)
      }
    }

    componentWillUnmount () {
      NetInfo.isConnected.removeEventListener(
        'change',
        this._handleConnectionInfoChange
      )
      VoipPushNotification.removeEventListener('register', this._onRegister)

      if (Platform.OS === 'android') {
        this._refreshTokenListener.remove()
      }
    }

    componentWillReceiveProps (nextProps) {
      const { isLogin, fetching, currentUser, iceServers } = nextProps

      if (this.requesting && !fetching && !isLogin) {
        NavigationActions.login()
      }

      if (!_.isEmpty(currentUser) && !_.isEqual(currentUser, this.props.currentUser)) {
        this._handleSubscribeTranslator(nextProps)
        // we have to check the token
        this._updateUserToken(nextProps)
      }

      if (!_.isEmpty(iceServers) && !_.isEqual(this.props.iceServers, iceServers)) {
        // this._updateAuthState({
        //   configuration: iceServers
        // })
      }
    }

    componentDidUpdate (prevProps, prevState) {
      const { connecting, networkStatus } = this.props

      if (connecting === true && !_.isEqual(connecting, prevProps.connecting)) {
        NavigationActions.callInitiate()
      }

      if (networkStatus === false && !_.isEqual(networkStatus, prevProps.networkStatus)) {
        this._setToasterError(I18n.t('noInternet'))
      }
    }

    render () {
      const { toaster, rating, openRating } = this.state
      const { isLogin, currentUser } = this.props
      return (
        <View style={[Styles.authContainer]}>
          <Toaster message={toaster} onShow={this.onToasterHide} />
          <WrapperComponent
            isLogin={isLogin}
            currentUser={currentUser}
            toaster={toaster}
            updateAuthState={this._updateAuthState}
            communication={__communication}
            {...this.props}
          />

          <Modal
            isOpen={openRating}
            swipeToClose
            backButtonClose
            style={Styles.successModal}
            position={'center'}
            backdrop
          >
            <View style={Styles.modalHeaderSection} >
              <Text style={Styles.modalHeaderText} >
                {I18n.t('rateThisCall')}
              </Text>
            </View>
            <StarRating
              disabled={false}
              maxStars={5}
              rating={rating}
              selectedStar={this._onStarRatingPress}
          />
          </Modal>
        </View>
      )
    }
  }

  const mapStateToProps = createStructuredSelector({
    fetching: selectFetching(),
    isLogin: selectIsLogin(),
    currentUser: selectCurrentUser(),
    connecting: selectConnecting(),
    connected: selectConnected(),
    networkStatus: selectUpdateNetwork(),
    iceServers: selectIceServer()
  })

  const mapDispatchToProps = (dispatch) => {
    return {
      requestCallHistory: (payload) => dispatch(CallInfoActions.callInfoRequest(payload)),
      requestCallTurnServer: () => dispatch(CallInfoActions.callInfoRequestTurnServer()),
      updateRemoteVid: (values) => dispatch(CallInfoActions.callInfoRemoteVid(values)),
      updateLocalVid: (values) => dispatch(CallInfoActions.callInfoLocalVid(values)),
      updateConnecting: (values) => dispatch(CallInfoActions.callInfoConnecting(values)),
      updateConnected: (values) => dispatch(CallInfoActions.callInfoConnected(values)),
      updateNetworkStatus: (values) => dispatch(StartupActions.networkChange(values)),
      createCallInfo: (values) => dispatch(CallInfoActions.callInfoRegister(values)),
      createRatings: (values) => dispatch(ClientActions.callSubmitRatings(values)),
      getLoginInfo: () => dispatch(LoginActions.infoLoginRequest()),
      updateProfile: (payload) => dispatch(ProfileAction.profileSubmit(payload)),
      dispatch
    }
  }
  return connect(mapStateToProps, mapDispatchToProps)(AppAuthenticated)
}
