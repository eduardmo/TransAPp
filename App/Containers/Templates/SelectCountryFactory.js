import I18n from 'react-native-i18n'
import R from 'ramda'
import _ from 'lodash'
import React from 'react'
import CountryPicker from 'react-native-country-picker-modal'
import t, { form as Form } from 'tcomb-form-native'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native'

import { Colors } from '../../Themes/'

// extend the base Component
class SelectCountry extends Form.Component {
  constructor (props) {
    super(props)

    this.state = {
      cca2: '',
      country: ''
    }
    this.changeCountryValue = this.changeCountryValue.bind(this)
  }

  changeCountryValue (value, locals) {
    this.setState({
      country: value,
      cca2: value.cca2
    })

    locals.onChange(value.cca2)
  }

  initializeValue () {
    const { value, options: { options } } = this.props

    if (value && typeof value !== 'string' && !_.isEmpty(options)) {
      return _.find(options, { id: value })
    }

    return false
  }

  _getTranslation () {
    switch (I18n.locale.substr(0, 2)) {
      case 'de': return 'deu'
      case 'fr': return 'fra'
      case 'hr': return 'hrv'
      case 'it': return 'ita'
      case 'jp': return 'jpn'
      case 'nl': return 'nld'
      case 'pt': return 'por'
      case 'ru': return 'rus'
      case 'es': return 'spa'
      case 'sk': return 'svk'
      case 'fi': return 'fin'
      case 'cn': return 'zho'
      case 'ky': return 'cym'
      // ofc we will default to eng if language is not supported
      default: return 'eng'
    }
  }

  // this is the only required method to implement
  getTemplate () {
    const { cca2, country } = this.state
    const initValues = this.initializeValue()

    let countryPickerStyle = [Styles.countryPicker]
    countryPickerStyle = !country ? countryPickerStyle.concat(Styles.noValue) : countryPickerStyle
    // define here your custom template

    return (locals) => {
      let countryMainContainer = [Styles.countryButton]
      countryMainContainer = locals.hasError ? countryMainContainer.concat(Styles.hasError) : countryMainContainer

       // if value is just initialzie then we will manually call our locals onchange
      initValues && this.changeCountryValue(initValues, locals)

      return (
        <TouchableOpacity style={countryMainContainer} onPress={() => this.countryPicker.openModal()}>
          <View style={Styles.countryContainer}>
            <View style={countryPickerStyle}>
              <CountryPicker
                ref={(countryPicker) => { this.countryPicker = countryPicker }}
                onChange={(value) => this.changeCountryValue(value, locals)}
                cca2={cca2}
                translation={this._getTranslation()}
                closeable
                filterable
              />
            </View>
            <Text> { country ? country.name : 'Select Country'} </Text>
          </View>
        </TouchableOpacity>
      )
    }
  }

  // you can optionally override the default getLocals method
  // it will provide the locals param to your template
  getLocals () {
    // in locals you'll find the default locals:
    // - path
    // - error
    // - hasError
    // - label
    // - onChange
    // - stylesheet
    var locals = super.getLocals()

    // add here your custom locals

    return locals
  }
}

// as example of transformer: this is the default transformer for textboxes
SelectCountry.transformer = {
  format: value => value || null,
  parse: value => (t.String.is(value) && value.trim() === '') || value ? value : null
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
  countryButton: {
    ...formStyles.textbox.normal,
    backgroundColor: Colors.snow
  },
  countryContainer: {
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

export default SelectCountry
