// @flow

import React, { PropTypes } from 'react'
import AndroidBackButton from 'react-native-android-back-button'
import I18n from 'react-native-i18n'
import _ from 'lodash'
import Modal from 'react-native-modalbox'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import t, { form as Form } from 'tcomb-form-native'
import {
  Keyboard,
  LayoutAnimation,
  ScrollView,
  Text,
  View
} from 'react-native'

import ForgotPasswordActions from '../Redux/ForgotPasswordRedux'
import { formStyles, Styles } from './Styles/ForgotPasswordScreenStyle'
import { Metrics } from '../Themes'
import {
  selectSuccess,
  selectError,
  selectFetching
} from '../Selectors/ForgotPasswordSelectors'

import FullButton from '../Components/FullButton'
import AlertMessage from '../Components/AlertMessage'

class ForgotPasswordScreen extends React.Component {
  options = {
    fields: {
      email: {
        label: I18n.t('email'),
        keyboardType: 'email-address',
        autoCapitalize: 'none'
      }
    },
    stylesheet: formStyles
  }

  static propTypes= {
    fetching: PropTypes.bool,
    success: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    attemptForgotPassword: PropTypes.func,
    putError: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ])
  }

  keyboardDidShowListener = Object
  keyboardDidHideListener = Object

  constructor () {
    super()
    this.state = {
      visibleHeight: Metrics.screenHeight,
      topLogo: { width: Metrics.screenWidth },
      serverError: false,
      openSuccessModal: false,
      formValues: {}
    }

    this.onChange = this.onChange.bind(this)
    this.onPress = this.onPress.bind(this)
    this.handleCreateAccount = this.handleCreateAccount.bind(this)
    this.onCloseModal = this.onCloseModal.bind(this)
  }

  componentWillReceiveProps (newProps) {
    const { error, success } = newProps
    /**
     * make sure that we will utilize and not trigger if they are the same props
     */
    if (_.isEqual(this.props, newProps)) {
      return
    }

    // means theres error
    if (error) {
      this.setState({
        serverError: error.message
      })
    }

    // means we successfully ForgotPassword ang just return back
    if (success === true) {
      this.setState({
        openSuccessModal: success
      })
    }
  }

  componentWillMount () {
    // Using keyboardWillShow/Hide looks 1,000 times better, but doesn't work on Android
    // TODO: Revisit this if Android begins to support - https://github.com/facebook/react-native/issues/3468
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()

    // we will set back all this to default
    this.props.putError(null)
  }

  getForm () {
    const ValidEmail = t.refinement(t.String, email => {
      const validEmailRegex = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/
      return validEmailRegex.test(email)
    })

    return t.struct({
      email: ValidEmail
    })
  }

  onChange (formValues) {
    this.setState({formValues})
  }

  onPress () {
    var value = this.refs.forgotPasswordForm.getValue()
    if (value) {
      this.props.attemptForgotPassword(value)
    }
  }

  onCloseModal () {
    this.setState({
      openSuccessModal: false
    }, () => NavigationActions.pop())
  }

  keyboardDidShow = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    let newSize = Metrics.screenHeight - e.endCoordinates.height
    this.setState({
      visibleHeight: newSize,
      topLogo: {width: 100, height: 70}
    })
  }

  keyboardDidHide = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({
      visibleHeight: Metrics.screenHeight,
      topLogo: {width: Metrics.screenWidth}
    })
  }

  handleCreateAccount () {
    NavigationActions.createAccount()
  }

  render () {
    const { serverError, formValues, openSuccessModal } = this.state
    const { fetching } = this.props
    return (
      <ScrollView contentContainerStyle={{justifyContent: 'center'}} style={[Styles.container, {height: this.state.visibleHeight}]} keyboardShouldPersistTaps>
        <AndroidBackButton
          onPress={() => true}
        />
        <View style={Styles.section} >
          <Text style={Styles.sectionText} >
            {I18n.t('forgotPasswordInfo')}
          </Text>
        </View>

        <View style={Styles.formContainer}>
          <Form.Form
            ref='forgotPasswordForm'
            type={this.getForm()}
            options={this.options}
            onChange={this.onChange}
            value={formValues}
          />

          <FullButton onPress={this.onPress} displayActivity activity={fetching}>
            {I18n.t('forgotPasswordButton')}
          </FullButton>
        </View>
        <AlertMessage show={!!serverError} title={serverError} />
        <Modal
          isOpen={openSuccessModal}
          swipeToClose
          backButtonClose
          onClosed={this.onCloseModal}
          style={Styles.successModal}
          position={'center'}
          backdrop
        >
          <View style={Styles.modalHeaderSection} >
            <Text style={Styles.modalHeaderText} >
              {I18n.t('forgotPasswordSuccessHeader')}
            </Text>
          </View>
          <Text style={Styles.modalText} >
            {I18n.t('forgotPasswordSuccessContent')}
          </Text>
        </Modal>
      </ScrollView>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  success: selectSuccess(),
  error: selectError(),
  fetching: selectFetching()
})

const mapDispatchToProps = (dispatch) => {
  return {
    attemptForgotPassword: (value) => dispatch(ForgotPasswordActions.forgotPasswordRequest(value)),
    putError: (value) => dispatch(ForgotPasswordActions.forgotPasswordFailure(value)),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordScreen)
