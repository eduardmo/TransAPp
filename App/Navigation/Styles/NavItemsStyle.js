// @flow

import {StyleSheet} from 'react-native'
import { Metrics, Colors, Fonts } from '../../Themes/'

const navButton = {
  backgroundColor: Colors.transparent,
  justifyContent: 'center'
}

export default StyleSheet.create({
  selectedTab: {
    alignSelf: 'stretch',
    backgroundColor: Colors.limeGreen
    // borderTopWidth: 0.5,
    // borderTopColor: Colors.fire,
  },
  selectedFont: {
    color: Colors.snow
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  tabIcon: {
    ...navButton,
    textAlign: 'center',
    color: Colors.background
  },
  tabText: {
    fontFamily: Fonts.type.bold,
    fontSize: Fonts.size.small,
    color: Colors.background
  },
  backButton: {
    ...navButton,
    marginTop: Metrics.baseMargin,
    marginLeft: Metrics.baseMargin
  },
  searchButton: {
    ...navButton,
    marginTop: Metrics.section,
    marginRight: Metrics.baseMargin,
    alignItems: 'center'
  }
})
