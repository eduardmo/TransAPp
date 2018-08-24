// @flow

import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  listContainer: {
    marginBottom: (Metrics.doubleBaseMargin * 3)
  },
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
  listContent: {
  },
  listRow: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomColor: Colors.charcoal,
    borderBottomWidth: 1
  },
  flagStyle: {
    paddingTop: 8,
    paddingLeft: 8
  },
  rowTextStyle: {
    padding: Metrics.baseMargin,
    color: Colors.snow,
    fontSize: 16,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    letterSpacing: 2
  },
  rowLangTextStyle: {
    color: Colors.charcoal,
    fontWeight: 'bold'
  },
  iconStyle: {
    padding: Metrics.baseMargin
  },
  modal: {
    flex: 1
  },
  modalHeaderSection: {
    flexDirection: 'row',
    borderBottomColor: Colors.frost,
    borderBottomWidth: 1,
    paddingTop: Metrics.smallMargin,
    paddingBottom: Metrics.smallMargin
  },
  modalIconLeftStyle: {

  },
  modalHeaderLeft: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  modalHeaderCenter: {
    flex: 2,
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: Metrics.smallMargin
  },
  modalHeaderRight: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row'
  },
  modalHeaderText: {
    color: Colors.charcoal,
    fontSize: 18,
    fontWeight: 'bold'
  },
  modalContentSection: {
    marginBottom: (Metrics.doubleBaseMargin * 4)
  }
})
