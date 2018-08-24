// @flow

import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import styles from './Styles/NavItemsStyle'
import { Actions as NavigationActions } from 'react-native-router-flux'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import OcticonsIcon from 'react-native-vector-icons/Octicons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { Colors, Metrics } from '../Themes'

const openDrawer = () => {
  NavigationActions.refresh({
    key: 'drawer',
    open: true
  })
}

export default {
  tabIcon ({ iconName, selected, title }) {
    let iconType = iconName || 'rocket'
    let tabStyles = [styles.tabContent]
    let iconStyles = [styles.tabIcon]

    if (selected) {
      tabStyles = [styles.tabContent, styles.selectedTab]
      iconStyles = [styles.tabIcon, styles.selectedFont]
    }

    return (
      <View style={tabStyles}>
        <EntypoIcon style={iconStyles} name={iconType} size={Metrics.icons.medium} color={Colors.background} />
      </View>
    )
  },

  backButton () {
    return (
      <TouchableOpacity onPress={NavigationActions.pop}>
        <FontAwesomeIcon name='angle-left'
          size={Metrics.icons.small}
          color={Colors.snow}
          style={styles.backButton}
        />
      </TouchableOpacity>
    )
  },

  hamburgerButton () {
    return (
      <TouchableOpacity onPress={openDrawer}>
        <FontAwesomeIcon name='bars'
          size={Metrics.icons.small}
          color={Colors.snow}
          style={styles.navButtonLeft}
        />
      </TouchableOpacity>
    )
  },

  searchButton (callback: Function) {
    return (
      <TouchableOpacity onPress={callback}>
        <OcticonsIcon name='search'
          size={Metrics.icons.small}
          color={Colors.snow}
          style={styles.searchButton}
        />
      </TouchableOpacity>
    )
  }

}
