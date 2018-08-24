// Simple React Native specific changes
import Config from 'react-native-config'

export default {
  // font scaling override - RN default is on
  allowTextFontScaling: true,
  REACTRON_HOST: Config.REACTRON_HOST,
  API_BASE_URL: Config.API_BASE_URL,
  APP_BASE_URL: Config.APP_BASE_URL,
  SOCKET_URL: Config.SOCKET_URL,
  SOCKET_PORT: Config.SOCKET_PORT,
  SOCKET_SECURE: Config.SOCKET_SECURE,
  SOCKET_PROTOCOL: Config.SOCKET_PROTOCOL,
  TURN_URL: Config.TURN_URL,
  TURN_IDENT: Config.TURN_IDENT,
  TURN_SECRET: Config.TURN_SECRET,
  TURN_DOMAIN: Config.TURN_DOMAIN,
  TURN_APPLICATION: Config.TURN_APPLICATION,
  TURN_ROOM: Config.TURN_ROOM,
  TURN_SECURE: Config.TURN_SECURE,
  GCM_SENDER_ID: Config.GCM_SENDER_ID
}
