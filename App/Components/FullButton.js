// @flow

import React from 'react'
import { ActivityIndicator, TouchableOpacity, Text } from 'react-native'
import styles from './Styles/FullButtonStyle'

type FullButtonProps = {
  text: string,
  onPress: () => void,
  styles?: Object
}

export default class FullButton extends React.Component {
  props: FullButtonProps

  getText () {
    const { text, children } = this.props

    const buttonText = text || children || ''
    return buttonText.toUpperCase()
  }

  displayActivity (fetching = Boolean) {
    return (
      <ActivityIndicator
        animating={fetching}
        style={[{justifyContent: 'center'}, {height: 60}]}
      />
    )
  }
  render () {
    const { touchStyle, textStyle, onPress, displayActivity, activity } = this.props
    return (
      <TouchableOpacity style={[styles.button, touchStyle]} onPress={onPress} disabled={activity}>
        {
          (displayActivity && activity) ? this.displayActivity(activity)
          : <Text style={[styles.buttonText, textStyle]}>{this.getText()}</Text>
        }
      </TouchableOpacity>
    )
  }
}
