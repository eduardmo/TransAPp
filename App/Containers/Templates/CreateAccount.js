import React from 'react'
import {
  View
} from 'react-native'

const Template = (locals) => {
  // in locals.inputs you find all the rendered fields
  return (
    <View>
      {locals.inputs.first_name}
      {locals.inputs.last_name}
      {locals.inputs.email}
      {locals.inputs.organization}
      {locals.inputs.translator}
      {locals.inputs.agree}
    </View>
  )
}

export default Template
