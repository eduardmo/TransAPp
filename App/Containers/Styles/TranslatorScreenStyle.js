// @flow

import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  logo: {
    height: Metrics.images.logo,
    width: Metrics.images.logo,
    resizeMode: 'contain'
  },
  centered: {
    alignItems: 'center'
  },
  spinnerWrapper: {
    flex: 1,
    alignItems: 'center'
  },
  toggleButton: {
    height: 36,
    borderColor: Colors.charcoal,
    borderWidth: 1,
    borderRadius: 8,
    margin: Metrics.doubleBaseMargin,
    alignSelf: 'stretch',
    justifyContent: 'center',
    zIndex: 1
  },
  toggleButtonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  onlineButton: {
    backgroundColor: Colors.limeGreen
  },
  offineButton: {
    backgroundColor: Colors.fire
  },
  modal: {
    flex: 1,
    paddingTop: 20
  },
  modalHeaderSection: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: Metrics.baseMargin,
    borderBottomColor: Colors.frost,
    borderBottomWidth: 1
  },
  modalHeaderText: {
    color: Colors.charcoal,
    fontSize: 18,
    fontWeight: 'bold'
  },
  videoContainer: {
    marginTop: Metrics.doubleBaseMargin,
    alignSelf: 'center',
    width: Metrics.screenWidth - Metrics.doubleBaseMargin,
    height: Metrics.screenHeight - Metrics.screenWidth,
    borderColor: Colors.charcoal,
    borderWidth: 1,
    backgroundColor: Colors.charcoal
  },
  modalControls: {
    alignSelf: 'center',
    justifyContent: 'center'
  },
  callEnd: {
    marginTop: Metrics.doubleBaseMargin,
    padding: Metrics.baseMargin,
    borderRadius: 50,
    backgroundColor: Colors.fire
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomColor: Colors.charcoal,
    borderBottomWidth: 1
  },
  iconCallHistory: {
    paddingTop: 8,
    paddingLeft: 8
  },
  rowTextStyle: {
    padding: Metrics.baseMargin,
    paddingTop: (Metrics.baseMargin + Metrics.smallMargin),
    color: Colors.snow,
    letterSpacing: 2
  },
  durationTextStyle: {
    flex: 1,
    justifyContent: 'flex-start',
    fontSize: 16
  },
  createdTextStyle: {
    fontSize: 12
  },
  iconStyle: {
    padding: Metrics.baseMargin
  }
})
