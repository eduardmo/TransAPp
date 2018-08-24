import RNCallKit from 'react-native-callkit'

/**
 * Class specifically for IOS
 * we need some sort of encapsulation since this only work for IOS
 */

export default class IOSCallKit {
  /**
   *
   * @param {*} options setupfor ios callkit
   */
  constructor (options) {
    RNCallKit.setup({
      appName: 'TranslatorApp'
    })
  }

  endCall (uuid = String) {
    return RNCallKit.endCall(uuid)
  }

  displayIncomingCall (uuid = String, title = String) {
    return RNCallKit.displayIncomingCall(uuid, title)
  }

  addEventListener (event = String, fn = Function) {
    return RNCallKit.addEventListener(event, fn)
  }
}
