// @flow
import R from 'ramda'
import { StyleSheet } from 'react-native'
import { Colors, Metrics } from '../../Themes'
import { form as Form } from 'tcomb-form-native'

const formStyles = R.clone(Form.Form.stylesheet)

formStyles.controlLabel.normal = {
  ...formStyles.controlLabel.normal,
  color: Colors.charcoal
}

formStyles.textbox.normal = {
  ...formStyles.textbox.normal,
  fontSize: 14,
  padding: 10
}

formStyles.textbox.error = {
  ...formStyles.textbox.error,
  fontSize: 14,
  padding: 10
}

const formCheckBoxStyles = R.clone(formStyles)

formCheckBoxStyles.formGroup.normal = {
  ...formCheckBoxStyles.formGroup.normal,
  flexDirection: 'row'
}

formCheckBoxStyles.formGroup.error = {
  ...formCheckBoxStyles.formGroup.error,
  flexDirection: 'row'
}

formCheckBoxStyles.formGroup.normal = {
  ...formCheckBoxStyles.formGroup.normal,
  flexDirection: 'row',
  justifyContent: 'space-between'
}

formCheckBoxStyles.formGroup.error = {
  ...formCheckBoxStyles.formGroup.error,
  flexDirection: 'row'
}

formCheckBoxStyles.controlLabel.normal = {
  ...formCheckBoxStyles.controlLabel.normal,
  flex: 1
}

formCheckBoxStyles.controlLabel.error = {
  ...formCheckBoxStyles.controlLabel.error,
  flex: 1
}

const Styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    backgroundColor: Colors.background
  },
  form: {
    backgroundColor: Colors.snow,
    margin: Metrics.baseMargin,
    borderRadius: 4
  },
  row: {
    paddingVertical: Metrics.doubleBaseMargin,
    paddingHorizontal: Metrics.doubleBaseMargin
  },
  rowLabel: {
    color: Colors.charcoal
  },
  textInput: {
    height: 40,
    color: Colors.coal
  },
  textInputReadonly: {
    height: 40,
    color: Colors.steel
  },
  buttonRows: {
    flexDirection: 'row'
  },
  buttonWrapper: {
    flex: 1
  },
  topLogo: {
    alignSelf: 'center',
    resizeMode: 'contain'
  },
  formContainer: {
    padding: 20,
    backgroundColor: Colors.snow,
    margin: Metrics.baseMargin
  },
  buttonCancel: {
    backgroundColor: Colors.fire
  },
  successModal: {
    justifyContent: 'center',
    alignSelf: 'center',
    height: 200
  },
  modalHeaderSection: {
    padding: Metrics.baseMargin,
    borderBottomColor: Colors.frost,
    borderBottomWidth: 1
  },
  modalHeaderText: {
    color: Colors.charcoal,
    fontSize: 18,
    fontWeight: 'bold'
  },
  modalText: {
    padding: Metrics.baseMargin,
    color: Colors.charcoal,
    fontSize: 18
  }

})

export {
  formStyles,
  formCheckBoxStyles,
  Styles
}
