import _ from 'lodash'
import SocketIO from 'socketcluster-client'
import InCallManager from 'react-native-incall-manager'
import I18n from 'react-native-i18n'
import {
  MediaStreamTrack,
  getUserMedia,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription
} from 'react-native-webrtc'

import Config from '../Config/AppConfig'
import CallKit from './CallKit'
import FabricException from './FabricExceptionHandler'
import { Metrics } from '../Themes'

// const TronDebugger = (name, value) => {
//   return console.tron.display({
//     name: name.toUpperCase(),
//     value
//   })
// }

// module.exports = (this._initiator) => {
class Communication {
    /**
     * Main object for the caller.
     */
  _initiator

  /**
   * Callkit handler
   */
  _callkit

    /**
     * socket holder
     */
  socket

    /**
     * Channel holder
     */
  channel

    /**
     * Peer connection handler
     */
  pc

    /**
     * when the call started
     */
  callStart

    /**
     * when the call ended
     */
  callEnd

  /**
   * this is hom many seconds before we consider it as a miscall
   * 20000
   */
  secondsHandlerNotAnswer = 20000
    /**
     * we need to have a holder if the call ended properly
     * @param  caller
     */
  callSuccessfully = false

  constructor (caller) {
    this._initiator = caller
      // please update this to ENV file
    this.socket = SocketIO.connect({
      hostname: Config.SOCKET_URL,
      secure: Config.SOCKET_SECURE,
      port: Config.SOCKET_PORT,
      protocol: Config.SOCKET_PROTOCOL
    })

    this._socketSuccessrHandler = this._socketSuccessrHandler.bind(this)
    this._socketErrorHandler = this._socketErrorHandler.bind(this)
    this._reducer = this._reducer.bind(this)
    this._doAnswer = this._doAnswer.bind(this)
    this._callAccepted = this._callAccepted.bind(this)
    this._callDropped = this._callDropped.bind(this)
    this._shouldEndCall = this._shouldEndCall.bind(this)
    this._doEndCall = this._doEndCall.bind(this)
    this._setLocalAndSendMessage = this._setLocalAndSendMessage.bind(this)
    this._createPeerConnection = this._createPeerConnection.bind(this)
    this._tryToCreatePeer = this._tryToCreatePeer.bind(this)
    this._createdOffer = this._createdOffer.bind(this)
    this._shouldCall = this._shouldCall.bind(this)
    this._shouldAnswer = this._shouldAnswer.bind(this)
    this._addIceCandidate = this._addIceCandidate.bind(this)
    this._handleIceCandidate = this._handleIceCandidate.bind(this)
    this._handleIceConnectionChange = this._handleIceConnectionChange.bind(this)
    this._handleRemoteStreamAdded = this._handleRemoteStreamAdded.bind(this)
    this._initiateCall = this._initiateCall.bind(this)
    this._getMediaTrack = this._getMediaTrack.bind(this)
    this._readyToAcceptCall = this._readyToAcceptCall.bind(this)
    this._shouldRedirectCallee = this._shouldRedirectCallee.bind(this)

      // make sure to connect to the room
    this.socket.on('connect', this._socketSuccessrHandler)
    this.socket.on('connect_error', this._socketErrorHandler)
    this.socket.on('error', this._socketErrorHandler)
    this.socket.on('server_error', this._socketErrorHandler)
      // this.socket.on('created_offer', this._createdOffer)
      // this.socket.on('should_answer', this._shouldAnswer)
      // this.socket.on('request_add_ice_candidate', this._addIceCandidate)
    if (InCallManager.recordPermission !== 'granted' || InCallManager.cameraPermission !== 'granted') {
      InCallManager.requestRecordPermission()
      InCallManager.requestCameraPermission()
    }

    try {
      this._callkit = new CallKit()
    } catch (err) {
        // TronDebugger('ERROR ON CALLKIT', err.message);
    }
    // configure OneSignal
    // OneSignal.configure({})
  }

  _socketSuccessrHandler () {
    // console.tron.log('connected')
    // this._initiator.setState({
    //   toaster: {
    //     text: 'connected!',
    //     styles: ToastStyles.success,
    //   }
    // })
  }

  _socketErrorHandler (error) {
    const { message } = error
    const errorMessage = message || error
    /**
     * we need to double check if our initiator is define since
     * app is using this library and initiator is not really needed
     */
    this._initiator && this._initiator._setToasterError(
      typeof errorMessage === 'object' ? I18n.t('connectionProblem') : errorMessage.toString()
    )
  }

  /**
   * Main function that once the notification is received and accepted the n we will let the other user know that we can accept the call
   * @param {*} payload
   */
  _readyToAcceptCall (payload) {
    this.socket.emit('accept_call_ready', {
      ...payload
    })
  }

  _getMediaTrack (callbackFn) {
    MediaStreamTrack.getSources(sourceInfos => {
      const sourceId = !_.isEmpty(sourceInfos) ? _.find(sourceInfos, {
        kind: 'video',
        facing: 'front'
      }).id : {}

      getUserMedia({
        audio: true,
        // emulator does not support video for ios
        video: // false,
        {
          mandatory: {
            minWidth: Metrics.screenWidth, // Provide your own width, height and frame rate here
            minHeight: Metrics.screenHeight,
            minFrameRate: 30
          },
          facingMode: 'user',
          optional: (sourceId ? [{ sourceId }] : [])
        },
        videoType: 'front'
      }, (localStream) => {
        callbackFn(localStream)
      }, error => {
        this._socketErrorHandler(error)
      })
    })
  }

  _reducer (payload) {
    const { type, data } = payload

    if (payload.id === this.socket.id) {
      return
    }

    switch (type) {
      case 'CALLEE_READY':
        return this._shouldCall(data)
      case 'SHOULD_ANSWER':
        return this._shouldAnswer(data)
      case 'REDIRECT_CALLEE':
        return this._shouldRedirectCallee(data)
      case 'CREATED_OFFER':
        return this._createdOffer(data)
      case 'ADD_ICE_CANDIDATE':
        return this._addIceCandidate(data)
      case 'END_CALL':
        return this._shouldEndCall(data)
      default :
        return null
    }
  }

  _addIceCandidate (icecandidate) {
    // TronDebugger('addicecandidate', icecandidate)
    const candidate = new RTCIceCandidate({
      sdpMLineIndex: icecandidate.label,
      candidate: icecandidate.candidate,
      sdpMid: icecandidate.id
    })
    this.pc.addIceCandidate(candidate)
  }

  _createPeerConnection (cbFn = _.noop) {
    const { configuration } = this._initiator.state
    //  TronDebugger('configuration', configuration)
    try {
      this.pc = new RTCPeerConnection(configuration)
      // TronDebugger('createdpeerconnection', this.pc)
      this.pc.onicecandidate = this._handleIceCandidate
      this.pc.onaddstream = this._handleRemoteStreamAdded
      this.pc.oniceconnectionstatechange = this._handleIceConnectionChange
      this.pc.onremovestream = this._handleRemoveStream
      // this.pc.onremovestream = handleRemoteStreamRemoved
      // we need to make sure that local stream exist
      this._getMediaTrack((localStream) => {
        // TronDebugger('addedstream', localStream)
        this.pc.addStream(localStream)
        this._initiator.setState({ localStream })
        // update reducer
        this._initiator.props.updateLocalVid(localStream.toURL())

        // this call back will make sure that we already stablish our peers before any handshake.
        cbFn && cbFn()
      })
    } catch (e) {
      new FabricException()._exception(`Failed to create PeerConnection, exception: ${e.message}`)
    }
  }

    /**
     * function is a factory whethere to create the peer connection or no
     */
  _tryToCreatePeer (cbFn = _.noop) {
    const pcCreated = (this.pc) ? this.pc.iceConnectionState !== 'closed' : false
    if (!pcCreated) {
      return this._createPeerConnection(cbFn)
    }

    return cbFn && cbFn()
  }

  _handleRemoveStream (event) {
    // console.tron.log(`>>> removing the stream`)
  }

    // this basically handle Ice candidate
  _handleIceConnectionChange (event) {
    if (this.pc) {
      const { iceConnectionState } = this.pc
      // TronDebugger('iceconnectionchange', iceConnectionState)
      switch (iceConnectionState) {
        // meaning call is accepted.
        case 'connected':
          return this._callAccepted()
        // meaning call is droped
        case 'disconnected': case 'closed':
          // passed how the call ended
          // we need to delete also our this.pc since its causing issue with us
          // we need to recreate it.
          return this._callDropped(iceConnectionState)
        default:
          return null
      }
    }
  }

  /**
   * once we accept the call what happen here is simply remove the answer backButton
   * then timer will be initited.
   */
  _callAccepted () {
    const { updateConnected } = this._initiator.props
    // we have to set the time started for the call
    this.callStart = new Date()
    // make sure that inCallmanager starts here.
    InCallManager.start()
    // force to use speaker
    InCallManager.setForceSpeakerphoneOn(true)

    // let the call initialize page that we accepted the call
    updateConnected(true)
  }

  /**
   * handler that will simply trigger the call dropped
   * @param comes from  ICE state
   */
  _callDropped (iceStatus) {
    const { receiver } = this._initiator.state
    const { currentUser: { role, user: { id } }, connected, requestCallHistory, updateConnecting, updateConnected } = this._initiator.props
    let openRating = false

    // if role.id === 5 then they should have a rating
    // and we should also unscribe them from the receiver
    if (role.id === 5 && connected) {
      openRating = true
      this.socket.unsubscribe(receiver)
    }

    // we have to update our iceStatus
    // if the means of the call is disconnected we need to makes sure to save it.
    // and also make surre that the call is connected
    // TronDebugger('ICE STATUS', { iceStatus, success: this.callSuccessfully} )
    if (iceStatus === 'disconnected' && this.callSuccessfully === false) {
      this._initiator._setToasterError(I18n.t('connectionDisconnected'))
      this._initiator._endCall(iceStatus)
    }

    // call ended we have to stop incallmanager
    InCallManager.stop()

    // we have to fetch the call records of the user
    requestCallHistory(id)
    // udpate our reducer
    updateConnecting(false)
    updateConnected(false)
    // close the navigation
    // we need to close our modal.
    this._initiator.setState({ openRating })
  }

  _handleIceCandidate (event) {
    const { room } = this._initiator.state
    // TronDebugger('onicecanditate', event)
    if (event.candidate) {
      this.socket.emit('add_ice_candidate', {
        room: room,
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate
      })
    }
  }

  _handleRemoteStreamAdded (event) {
    // TronDebugger('onstreamadded[REMOTE]', event)
    this._initiator.setState({
      remoteStream: event.stream
    })
    this._initiator.props.updateRemoteVid(event.stream.toURL())
  }

  /**
   * we should able to know if we are done then proceed
   * @param {} payload
   */
  _shouldAnswer (payload) {
    // make sure it should ring
    // TODO: we just need to remove this. since no more ringing will happen since it will be handle by callkit
    // InCallManager.startRingtone('_BUNDLE_')

    this._initiator.setState({
      ...payload
    })

    this._doAnswer()
    // TODO: we should hande the automatic answering here.

    // we will let this stay since
    // we will remove this since we have to put it somewhere where we can see the immediate response
    // this._initiator.props.updateConnecting(true)

    // we will have a setTimeout here
    // we will remove miscall handle here we will put it outside
    // setTimeout(() => {
    //   // we will end the call if not connected
    //   if (!this._initiator.props.connected) {
    //     this._doEndCall()
    //   }
    // }, this.secondsHandlerNotAnswer)
  }

  /**
   * Once call was not answered by the translator we will simply redirect the call automatically
   * @param {*} payload
   */
  _shouldRedirectCallee (payload) {
    const { room } = payload
    const { targets } = this._initiator.state
    const { updateLocalVid, updateRemoteVid, updateConnecting } = this._initiator.props

    // we will remove the targets here since they did not answer the call
    const updateTargets = targets.filter((target) => target.user_id !== room)
    // if there are no more targets then we should close this and let the user know that there is no  targets anymore
    if (_.isEmpty(updateTargets)) {
      this._shouldEndCall()

      updateLocalVid(null)
      updateRemoteVid(null)
      updateConnecting(false)
      this._initiator._setToasterError(I18n.t('noAnswerTranslator'))
    } else {
      // else update targets then reinitiate the call
      this._initiator.setState({
        targets: updateTargets
      }, () => this._initiateCall())
    }
  }
  /**
   * once the handshake is done with both device the we should be able to connect and should call
   * @param {*} payload
   */
  _shouldCall (payload) {
    const { sdpConstraints } = this._initiator.state
    // const { room, caller, language, receiver } = payload

    // we need to make sure that our peer connection is good to go
    this._tryToCreatePeer(() => {
      // we will create the offer
      this.pc.createOffer(
        this._setLocalAndSendMessage,
        (event) => {
          new FabricException()._exception(`Error on CreateOffer(): ${event}`)
        },
        sdpConstraints
      )
    })

    // always recreate peer on call with call back
    // this wil l ensure us that the peer is establish before any handshake
    // this._createPeerConnection(() => {
    //   // update the room
    //   this._initiator.setState({
    //     caller,
    //     language,
    //     room,
    //     receiver
    //   }, () => // then we will create the offer
    //     this.pc.createOffer(
    //       this._setLocalAndSendMessage,
    //       (event) => {
    //         new FabricException()._exception(`Error on CreateOffer(): ${event}`)
    //       },
    //       sdpConstraints
    //     )
    //   )
      // We will moving this to initate call UX wise
      // TODO: please remove this once everything is working smoothly
      // this._initiator.props.updateConnecting(true)
    // })
  }

  _doAnswer () {
    const { sdpConstraints } = this._initiator.state
    // stop the ringing once answered
    // InCallManager.stopRingtone()

    this.pc.createAnswer(
        this._setLocalAndSendMessage,
        (event) => {
          new FabricException()._exception(`CreateAnswer() Error: ${event}`)
        },
        sdpConstraints
      )
  }

    // once the other side request to end the call
  _shouldEndCall () {
    const { localStream, room } = this._initiator.state

    this.pc && this.pc.close() // make sure pc has value

    // we will only delete stream if there is stream
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
      localStream.release()
    }

    // we need to tell them that the  call ended correclty
    this.callSuccessfully = true
    // have to end the callkit call
    this._callkit.endCall(room)
  }

  _doEndCall () {
    const { room } = this._initiator.state
    // const { connected } = this._initiator.props
      // we have to emit that our call will be ended.
      // we need to pass if our call is connected,
    this.socket.emit('end_call', room)
    // should end the call
    this._shouldEndCall()

    // save the end call
    // but we have to make sure that the call was initiated
    // we have to identify if the call was successfull or not
    let entityCall = 'closed'

    // if (!connected) {
    //   entityCall = 'not-answered'
    //   // if not answer we should stop the ringing  as well
    //   InCallManager.stopRingtone()
    // }

    this._initiator._endCall(entityCall)
  }

  _setLocalAndSendMessage (sdp) {
    const { room, receiver, language, caller } = this._initiator.state
    // Set Opus as the preferred codec in SDP if Opus is present.
    //  sessionDescription.sdp = preferOpus(sessionDescription.sdp)
    // TronDebugger('setlocaldescription', sdp)
    this.pc.setLocalDescription(
        sdp,
        () => {
          // we will only emit once description is already successfull
          this.socket.emit('create_offer', {
            sdp,
            room,
            receiver,
            caller,
            language
          })
        },
        (event) => {
          new FabricException()._exception(`CreateAnswer() Error: ${event}`)
        }
      )
  }

    // offer requesting
  _createdOffer (payload) {
    // we need to make sure that we create the peer before setting the remote description
    const { sdp, ...rest } = payload
    const { connected } = this._initiator.props

    this._tryToCreatePeer(() => {
      this.pc.setRemoteDescription(
        new RTCSessionDescription(sdp),
        () => {
          // TronDebugger('offer created', {sdp, connected})
          // if its offer then we have to ring this socket.
          // we need to make sure that the remote description is successfully set up
          if (sdp.type === 'offer' && !connected) {
            this._shouldAnswer(rest)
          }
        },
        (event) => {
          new FabricException()._exception(`Error on Setting SDP: ${JSON.stringify(event)}`)
        }
      )
    })
  }

   /**
    * iniitiating the call
    * big change we need to check first if the the user is on the app or not.
    * so we need to send them first a notification that we are calling
    */
  _initiateCall () {
    const { currentUser } = this._initiator.props
    const { language, caller, targets } = this._initiator.state
    // for now  we will get targets by random
    const receiver = _.sample(targets)
    const { user } = receiver

    // we should move our create peer connection here. from `_shouldCall` fn
    // since need to make sure that before making connection we should have our localVideo ready.
    this._tryToCreatePeer(() => {
      // we need to make sure that they are not calling the same device they're using
      if (user.push_id !== currentUser.user.push_id) {
        // we have t subscribe the user
        this.channel = this.socket.subscribe(receiver.user_id)
        // we only need to listen once.
        if (this.socket.watchers(receiver.user_id).length === 0) {
          this.channel.watch(this._reducer)
        }

        // once call is emitted we dont have to wait to create offer to open our app
        // we will go to where the call is being processed
        this.socket.emit('initiate_call', {
          caller,
          language,
          room: receiver.user_id,
          receiver: receiver.user_id,
          deviceToken: user.push_id,
          platform: user.platform_device
        })

          // we need to set our state and let them know that we initiate the call
        this._initiator.setState({
          caller,
          language,
          room: receiver.user_id,
          receiver: receiver.user_id
        })
          // we should let them see the call immediately
        this._initiator.props.updateConnecting(true)
      } else {
        this._initiator._setToasterError(I18n.t('sameDeviceId'))
      }
    })
  }
}
  // return Communication
export default Communication
// }
