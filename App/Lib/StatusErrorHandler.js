import I18n from 'react-native-i18n'

const StatusHandler = (problem) => {
  switch (problem) {
    case 'CLIENT_ERROR': return I18n.t('CLIENT_ERROR')
    case 'SERVER_ERROR': return I18n.t('SERVER_ERROR')
    case 'TIMEOUT_ERROR': return I18n.t('TIMEOUT_ERROR')
    case 'CONNECTION_ERROR': return I18n.t('CONNECTION_ERROR')
    case 'NETWORK_ERROR': return I18n.t('NETWORK_ERROR')
    case 'CANCEL_ERROR': return I18n.t('CANCEL_ERROR')
    default: return I18n.t('DEFAULT_ERROR')
  }
}

export default StatusHandler
