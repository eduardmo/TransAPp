import { Crashlytics } from 'react-native-fabric'
import { Platform } from 'react-native'

class CrashException {
  devicesHandler = {
    ios: Crashlytics.recordError,
    android: Crashlytics.logException
  }

  logger

  constructor () {
    this.logger = this.devicesHandler[Platform.OS]
  }

  _exception (err) {
    let errorMessage = err
    if (typeof errorMessage === 'object') {
      errorMessage = JSON.stringify(errorMessage)
    }
    // console.log({ fabricException: errorMessage })
    return this.logger(errorMessage)
  }
}

export default CrashException
