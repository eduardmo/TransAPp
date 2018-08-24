// @flow
import R from 'ramda'
import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics } from '../../Themes'
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
  flex: 1,
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
  ...ApplicationStyles.screen,
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
  loginAdditionalActions: {
    flexDirection: 'row'
  },
  additionalWrapper: {
    flex: 1
  },
  addiitonalText: {
    color: Colors.fire
  },
  createAccountAligment: {
    alignSelf: 'flex-start'
  },
  forgotPassAligment: {
    alignSelf: 'flex-end'
  },
  topLogo: {
    alignSelf: 'center',
    resizeMode: 'contain'
  },
  formContainer: {
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.snow,
    margin: Metrics.baseMargin
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    borderColor: Colors.charcoal,
    backgroundColor: Colors.panther,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  successModal: {
    justifyContent: 'center',
    alignItems: 'center',
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
