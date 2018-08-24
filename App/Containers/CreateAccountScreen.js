// @flow

import React, { PropTypes } from 'react'
import AndroidBackButton from 'react-native-android-back-button'
import I18n from 'react-native-i18n'
import _ from 'lodash'
import Modal from 'react-native-modalbox'

import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import t, {
  form as Form
} from 'tcomb-form-native'

import {
  Image,
  Keyboard,
  LayoutAnimation,
  ScrollView,
  Text,
  View
} from 'react-native'

import {
  formStyles,
  formCheckBoxStyles,
  Styles
} from './Styles/CreateAccountScreenStyle'
import { Images, Metrics } from '../Themes'
import FullButton from '../Components/FullButton'
import AlertMessage from '../Components/AlertMessage'
import CreateAccountAction from '../Redux/CreateAccount'
import {
  selectSuccess,
  selectError,
  selectFetching
} from '../Selectors/CreateAccountSelectors'

import ContactAcccountTemplate from './Templates/CreateAccount'
class CreateAccount extends React.Component {
  static propTypes = {
    fetching: PropTypes.bool,
    success: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    createAccount: PropTypes.func,
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
      validationError: {},
      serverError: false,
      openSuccessModal: false,
      formValue: {},
      formOptions: {
        fields: {
          first_name: {
            placeholder: I18n.t('firstName')
          },
          last_name: {
            placeholder: I18n.t('lastname')
          },
          email: {
            placeholder: I18n.t('email'),
            keyboardType: 'email-address',
            autoCapitalize: 'none'
          },
          contact: {
            placeholder: I18n.t('contact')
          },
          organization: {
            placeholder: I18n.t('organization')
          },
          translator: {
            placeholder: I18n.t('isTranslator'),
            stylesheet: formCheckBoxStyles
          },
          agree: {
            placeholder: I18n.t('agree'),
            stylesheet: formCheckBoxStyles
          }
        },
        auto: 'placeholders',
        stylesheet: formStyles,
        template: ContactAcccountTemplate
      }
    }

    this.onChange = this.onChange.bind(this)
    this.onPress = this.onPress.bind(this)
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

    if (success === true) {
      this.setState({
        openSuccessModal: success,
        serverError: false // making sure that prev problem wont show.
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

  // we just need to simulate our  data here.
  handleArrayToObject (data) {
    return {}
  }

  getForm () {
    const Agree = t.refinement(t.Boolean, bool => bool === true)
    const ValidEmail = t.refinement(t.String, email => {
      const validEmailRegex = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/
      return validEmailRegex.test(email)
    })

    return t.struct({
      first_name: t.String,
      last_name: t.String,
      email: ValidEmail,
      translator: t.Boolean,
      agree: Agree,
      organization: t.String
    })
  }

  onChange (formValue) {
    this.setState({formValue})
  }

  onPress () {
    var value = this.refs.createAccountForm.getValue()
    if (value) {
      // we need to emulate the loading here.
      this.props.createAccount(value)
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
      serverError: false, // make sure to remove the error if they reopen the keyboard.
      visibleHeight: newSize,
      topLogo: {width: 0, height: 0}
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

  render () {
    const { formOptions, formValue, topLogo, serverError, openSuccessModal } = this.state
    const { fetching } = this.props

    return (
      <ScrollView contentContainerStyle={{justifyContent: 'center'}} style={[Styles.container, {height: this.state.visibleHeight}]} keyboardShouldPersistTaps='never'>
        {
          serverError
            ? <AlertMessage show={!!serverError} title={serverError} />
          : <Image source={Images.logo} style={[Styles.topLogo, topLogo]} />
        }
        <View style={Styles.formContainer}>
          <AndroidBackButton
            onPress={() => false}
          />
          <Form.Form
            ref='createAccountForm'
            type={this.getForm()}
            options={formOptions}
            value={formValue}
            onChange={this.onChange}
          />

          <View style={Styles.buttonRows}>
            <View style={Styles.buttonWrapper} >
              <FullButton onPress={this.onPress} displayActivity activity={fetching}>
                {I18n.t('create')}
              </FullButton>
            </View>
          </View>
        </View>
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
              {I18n.t('createAccountSuccessHeader')}
            </Text>
          </View>
          <Text style={Styles.modalText} >
            {I18n.t('createAccountSuccessContent')}
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
    createAccount: (values) => dispatch(CreateAccountAction.createRequest(values)),
    putError: (values) => dispatch(CreateAccountAction.createFailure(values)),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount)
