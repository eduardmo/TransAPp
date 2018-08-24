// @flow
import { StyleSheet } from 'react-native'
import { Colors, Metrics } from '../../Themes'

export default StyleSheet.create({
  callContainer: {
    flex: 1,
    backgroundColor: Colors.transparent
  },
  callHeaderSection: {
    padding: Metrics.baseMargin,
    borderBottomColor: Colors.frost,
    borderBottomWidth: 1,
    alignSelf: 'stretch',
    alignItems: 'center'
  },
  callHeaderText: {
    color: Colors.charcoal,
    fontSize: 18,
    fontWeight: 'bold'
  },
  callText: {
    padding: Metrics.baseMargin,
    color: Colors.snow,
    fontSize: 18
  },
  spinnerWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  callVideoContainer: {
    borderColor: Colors.charcoal,
    borderWidth: 0.2,
    width: Metrics.screenWidth - Metrics.doubleBaseMargin,
    height: Metrics.screenHeight - (Metrics.icons.large * 4),
    backgroundColor: Colors.charcoal
  },
  streamVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Metrics.screenWidth + 110,
    height: Metrics.screenHeight
  },
  remoteStreamVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Metrics.screenWidth + 110,
    height: Metrics.screenHeight
  },
  localStreamVideo: {
    marginTop: -180,
    left: Metrics.screenWidth - 110,
    width: 100
  },
  callModalControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
    // marginTop: -50,
    // flexDirection: 'row',
    // justifyContent: 'center'
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
    flex: 1,
    alignSelf: 'center',
    marginTop: Metrics.doubleBaseMargin,
    padding: Metrics.baseMargin,
    borderRadius: 50,
    backgroundColor: Colors.fire
  }
})
