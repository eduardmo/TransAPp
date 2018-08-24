// @flow
import { StyleSheet } from 'react-native'
import { Colors, Metrics } from '../../Themes'

export default StyleSheet.create({
  authContainer: {
    flex: 1,
    backgroundColor: Colors.pageContainer
  },
  wrapper: {
    backgroundColor: Colors.background,
    // paddingTop: 50,
    flex: 1
  },
  successModal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    width: Metrics.screenWidth - Metrics.doubleBaseMargin
  },
  modalHeaderSection: {
    padding: Metrics.baseMargin,
    borderBottomColor: Colors.frost,
    borderBottomWidth: 1
  },
  modalHeaderText: {
    color: Colors.charcoal,
    fontSize: 18,
    fontWeight: 'bold'
  },
  modalText: {
    padding: Metrics.baseMargin,
    color: Colors.charcoal,
    fontSize: 18
  },
  callModal: {
    flex: 1,
    paddingTop: 20
  },
  callModalHeaderSection: {
    alignSelf: 'stretch',
    alignItems: 'center'
  },
  spinnerWrapper: {
    flex: 1,
    alignItems: 'center'
  },
  callVideoContainer: {
    borderColor: Colors.charcoal,
    borderWidth: 0.2,
    width: Metrics.screenWidth - Metrics.doubleBaseMargin,
    height: Metrics.screenHeight - Metrics.screenWidth,
    backgroundColor: Colors.transparent
  },
  remoteStreamVideo: {
    width: Metrics.screenWidth - Metrics.doubleBaseMargin,
    height: Metrics.screenHeight - Metrics.screenWidth
  },
  callModalControls: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  callButtons: {
    margin: Metrics.doubleBaseMargin
  },
  callAnswer: {
    marginTop: Metrics.doubleBaseMargin,
    padding: Metrics.baseMargin,
    borderRadius: 50,
    backgroundColor: Colors.limeGreen
  },
  callEnd: {
    marginTop: Metrics.doubleBaseMargin,
    padding: Metrics.baseMargin,
    borderRadius: 50,
    backgroundColor: Colors.fire
  }
})
