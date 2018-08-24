// @flow

import React, { PropTypes } from 'react'
import AndroidBackButton from 'react-native-android-back-button'
import I18n from 'react-native-i18n'
import _ from 'lodash'

import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import t, { form as Form } from 'tcomb-form-native'
import {
  Image,
  Keyboard,
  LayoutAnimation,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

import LoginActions from '../Redux/LoginRedux'
import { formStyles, formCheckBoxStyles, Styles } from './Styles/LoginScreenStyle'
import { Images, Metrics } from '../Themes'
import {
  selectSuccess,
  selectError,
  selectFetching
} from '../Selectors/LoginSelectors'

import FullButton from '../Components/FullButton'
import AlertMessage from '../Components/AlertMessage'

class LoginScreen extends React.Component {
  options = {
    fields: {
      email: {
        label: I18n.t('email'),
        keyboardType: 'email-address',
        autoCapitalize: 'none'
      },
      password: {
        label: I18n.t('password'),
        secureTextEntry: true
      },
      rememberMe: {
        label: I18n.t('rememberMe'),
        stylesheet: formCheckBoxStyles
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
    attemptLogin: PropTypes.func,
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
      formValues: {},
      pushId: null
    }

    this.onChange = this.onChange.bind(this)
    this.onPress = this.onPress.bind(this)
    this.handleCreateAccount = this.handleCreateAccount.bind(this)
    this.handleForgotPassword = this.handleForgotPassword.bind(this)
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

    // means we successfully login ang just return back
    if (success === true) {
      NavigationActions.pop()
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
  }
  getForm () {
    const ValidEmail = t.refinement(t.String, email => {
      const validEmailRegex = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/
      return validEmailRegex.test(email)
    })

    return t.struct({
      email: ValidEmail,
      password: t.String,
      rememberMe: t.Boolean
    })
  }

  onChange (formValues) {
    this.setState({formValues})
  }

  onPress () {
    const { pushId } = this.state
    var value = this.refs.loginForm.getValue()
    if (value) {
      this.props.attemptLogin(Object.assign({}, value, {
        push_id: pushId
      }))
    }
  }

  keyboardDidShow = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    let newSize = Metrics.screenHeight - (e.endCoordinates.height + 10)
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

  handleForgotPassword () {
    NavigationActions.forgotPassword()
  }

  render () {
    const { serverError, formValues } = this.state
    const { fetching } = this.props
    return (
      <ScrollView contentContainerStyle={{justifyContent: 'center'}} style={[Styles.container, {height: this.state.visibleHeight}]} keyboardShouldPersistTaps='never'>
        <AndroidBackButton
          onPress={() => true}
        />
        <Image source={Images.logo} style={[Styles.topLogo, this.state.topLogo]} />
        <View style={Styles.formContainer}>
          <Form.Form
            ref='loginForm'
            type={this.getForm()}
            options={this.options}
            onChange={this.onChange}
            value={formValues}
          />

          <FullButton onPress={this.onPress} displayActivity activity={fetching}>
            {I18n.t('signIn')}
          </FullButton>

          <View style={Styles.loginAdditionalActions}>
            <TouchableOpacity style={Styles.additionalWrapper} onPress={this.handleCreateAccount}>
              <Text style={[Styles.addiitonalText, Styles.createAccountAligment]}>{I18n.t('createAccount')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={Styles.additionalWrapper} onPress={this.handleForgotPassword}>
              <Text style={[Styles.addiitonalText, Styles.forgotPassAligment]}>{I18n.t('forgotPassword')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <AlertMessage show={!!serverError} title={serverError} />
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
    attemptLogin: (value) => dispatch(LoginActions.loginRequest(value)),
    putError: (value) => dispatch(LoginActions.loginFailure(value)),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
