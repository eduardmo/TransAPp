// @flow
import R from 'ramda'
import { StyleSheet } from 'react-native'
import { Colors, Metrics, ApplicationStyles } from '../../Themes/'
import { form as Form } from 'tcomb-form-native'

const formStyles = R.clone(Form.Form.stylesheet)

formStyles.controlLabel.normal = {
  ...formStyles.controlLabel.normal
}

formStyles.textbox.normal = {
  ...formStyles.textbox.normal,
  backgroundColor: Colors.snow,
  fontSize: 14,
  padding: 10
}

formStyles.textbox.error = {
  ...formStyles.textbox.error,
  backgroundColor: Colors.error,
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
  marginBottom: 0,
  flexDirection: 'row',
  justifyContent: 'space-between'
}

formCheckBoxStyles.formGroup.error = {
  ...formCheckBoxStyles.formGroup.error,
  flexDirection: 'row'
}

formCheckBoxStyles.controlLabel.normal = {
  ...formCheckBoxStyles.controlLabel.normal,
  marginBottom: 0,
  fontSize: 14,
  fontWeight: '400',
  flex: 1,
  alignSelf: 'center'
}

formCheckBoxStyles.controlLabel.error = {
  ...formCheckBoxStyles.controlLabel.error,
  marginBottom: 0,
  fontSize: 14,
  fontWeight: '400',
  flex: 1,
  alignSelf: 'center'
}

const Styles = StyleSheet.create({
  ...ApplicationStyles.screen,
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
  formContainer: {
    paddingTop: 10,
    paddingBottom: 40,
    paddingLeft: 5,
    paddingRight: 5,
    margin: Metrics.baseMargin
  },
  languagesButton: {
    ...formStyles.textbox.normal,
    backgroundColor: Colors.snow,
    marginBottom: 15
  },
  buttonRows: {
    flexDirection: 'row'
  },
  buttonWrapper: {
    flex: 1
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
  modalText: {
    padding: Metrics.baseMargin,
    color: Colors.charcoal,
    fontSize: 16,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    letterSpacing: 2
  },
  iconStyle: {
    padding: 8
  }
})

export {
  formStyles,
  formCheckBoxStyles,
  Styles
}
