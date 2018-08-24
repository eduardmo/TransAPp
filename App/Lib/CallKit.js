import { Platform } from 'react-native'

export default (Platform.OS === 'ios')
  ? require('./IOSCallkit').default
  : require('./AndroidCallkit').default
