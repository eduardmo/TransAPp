import R from 'ramda'
import _ from 'lodash'
import React from 'react'
import ModalPicker from 'react-native-modal-picker'
import t, { form as Form } from 'tcomb-form-native'
import {
  View,
  StyleSheet,
  TextInput
} from 'react-native'

import { Colors } from '../../Themes/'

// extend the base Component
class Select extends Form.Component {
  constructor (props) {
    super(props)

    this.state = {
      regionValue: null
    }

    this.changeRegionsValue = this.changeRegionsValue.bind(this)
  }

  getLocals () {
    const locals = super.getLocals()
    return locals
  }

  changeRegionsValue ({ key, label }, locals) {
    this.setState({
      regionValue: label
    })

    locals.onChange(key)
  }

  initializeValue (data) {
    const { regionValue } = this.state
    const { value } = this.props

    if (value && !regionValue && !_.isEmpty(data)) {
      return _.find(data, { key: value })
    }

    return false
  }

  // this is the only required method to implement
  getTemplate () {
    const { regionValue } = this.state
    const { options } = this.props

    // define here your custom template
    return (locals) => {
      const data = options ? options.options.map((option) => ({
        key: option.value,
        label: option.text
      })) : []
      const initValues = this.initializeValue(data)

      let textBoxStyle = [Styles.button]
      textBoxStyle = locals.hasError ? textBoxStyle.concat(Styles.hasError) : textBoxStyle

      // init data
      initValues && this.changeRegionsValue(initValues, locals)

      return (
        <ModalPicker
          data={data}
          onChange={(option) => this.changeRegionsValue(option, locals)}
        >
          <View>
            <TextInput style={textBoxStyle}
              editable={false}
              placeholder='Select state'
              value={regionValue}
            />
          </View>
        </ModalPicker>
      )
    }
  }
}

// as example of transformer: this is the default transformer for textboxes
Select.transformer = {
  format: value => value || null,
  parse: value => (t.Number.is(value) && value !== 0) || value ? value : null
}

const formStyles = R.clone(Form.Form.stylesheet)
const Styles = StyleSheet.create({
  fieldRows: {
    flexDirection: 'row'
  },
  fieldGroupItem: {
    paddingLeft: 5,
    flex: 1
  },
  fieldGroupItemMain: {
    flex: 3
  },
  button: {
    ...formStyles.textbox.normal,
    fontSize: 14,
    backgroundColor: Colors.snow
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  countryPicker: {
    marginTop: -6
  },
  noValue: {
    flexBasis: 0
  },
  hasError: {
    ...formStyles.textbox.error,
    backgroundColor: Colors.error,
    fontSize: 14,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15
  }
})

export default Select
