import React from 'react'
import {
  StyleSheet,
  View
} from 'react-native'
import { Metrics, Colors } from '../../Themes/'

const Certified = ({ certified }) => {
  if (certified) {
    return (
      <View style={Styles.fieldCertified}>
        {certified}
      </View>
    )
  }

  return null
}

const Template = (locals) => {
  // in locals.inputs you find all the rendered fields
  return (
    <View>
      {locals.inputs.first_name}
      {locals.inputs.last_name}
      {locals.inputs.contact}
      {locals.inputs.languages}
      <View style={Styles.fieldRows}>
        <View style={Styles.fieldGroupItemMain}>
          {locals.inputs.street}
        </View>
        <View style={Styles.fieldGroupItem}>
          {locals.inputs.street_no}
        </View>
      </View>
      <View style={Styles.fieldRows}>
        <View style={Styles.flexItems}>
          {locals.inputs.city}
        </View>
        <View style={Styles.fieldGroupItem}>
          {locals.inputs.state}
        </View>
      </View>
      <View style={Styles.fieldRows}>
        <View style={Styles.fieldGroupItemMain}>
          {locals.inputs.country}
        </View>
        <View style={Styles.fieldGroupItem}>
          {locals.inputs.postcode}
        </View>
      </View>
      <Certified certified={locals.inputs.certified} />
    </View>
  )
}

const Styles = StyleSheet.create({
  fieldCertified: {
    backgroundColor: Colors.snow,
    paddingVertical: Metrics.smallMargin,
    paddingHorizontal: Metrics.smallMargin,
    marginBottom: Metrics.baseMargin + Metrics.smallMargin,
    borderRadius: 5
  },
  fieldRows: {
    flexDirection: 'row'
  },
  flexItems: {
    flex: 1
  },
  fieldGroupItem: {
    paddingLeft: 5,
    flex: 1
  },
  fieldGroupItemMain: {
    flex: 3
  },
  country: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    height: 40,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: Colors.snow
  }
})

export default Template
