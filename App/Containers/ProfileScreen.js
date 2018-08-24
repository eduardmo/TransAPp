import React from 'react'
import Spinner from 'react-native-spinkit'
import MultiSelect from 'react-native-multiselect'
import EntypoIcon from 'react-native-vector-icons/Entypo'
// import Flag from 'react-native-flags'
import Modal from 'react-native-modalbox'
import I18n from 'react-native-i18n'
import Toaster, { ToastStyles } from 'react-native-toaster'
import _ from 'lodash'

import { connect } from 'react-redux'
import { Keyboard, KeyboardAvoidingView, LayoutAnimation, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { createStructuredSelector } from 'reselect'
import t, {
  form as Form
} from 'tcomb-form-native'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import { Metrics, Colors } from '../Themes'

import ProfileAction from '../Redux/ProfileRedux'
import ClientAction from '../Redux/ClientRedux'
import FullButton from '../Components/FullButton'

import {
  selectLanguages
} from '../Selectors/ClientSelectors'

import {
  selectSuccess,
  selectError,
  selectFetching,
  selectCountries,
  selectRegions
} from '../Selectors/ProfileSelectors'
// Styles
import {
  formStyles,
  formCheckBoxStyles,
  Styles
} from './Styles/ProfileScreenStyle'
import {
  selectCurrentUser
} from '../Selectors/LoginSelectors'

import isAuthenticated from './Auth'

import UpdateProfileTemplate from './Templates/UpdateProfile'
import SelectCountryFactory from './Templates/SelectCountryFactory'
import SelectFactory from './Templates/SelectFactory'

class ProfileScreen extends React.Component {
  setInitialValue = false
  updatingProfile = false

  keyboardDidShowListener = Object
  keyboardDidHideListener = Object

  constructor () {
    super()
    this.state = {
      visibleHeight: Metrics.screenHeight,
      topLogo: { width: Metrics.screenWidth },
      toaster: null,
      validationError: {},
      serverError: false,
      formValue: {},
      languageSelected: [],
      formOptions: {
        fields: {
          first_name: {
            placeholders: I18n.t('firstName')
          },
          last_name: {
            placeholders: I18n.t('lastname')
          },
          contact: {
            placeholders: I18n.t('contact')
          },
          street: {
            placeholders: I18n.t('street')
          },
          street_no: {
            placeholders: I18n.t('streetNo')
          },
          city: {
            placeholders: I18n.t('city')
          },
          postcode: {
            placeholders: I18n.t('postcode')
          },
          state: {
            placeholders: I18n.t('state'),
            factory: SelectFactory,
            options: []
          },
          country: {
            placeholders: I18n.t('country'),
            factory: SelectCountryFactory,
            options: []
          },
          certified: {
            label: I18n.t('certified'),
            stylesheet: formCheckBoxStyles
          }
        },
        auto: 'placeholders',
        stylesheet: formStyles,
        template: UpdateProfileTemplate
      }
    }

    // we need to get the device country info

    this.onChange = this.onChange.bind(this)
    this.onPress = this.onPress.bind(this)
    this.selectItems = this.selectItems.bind(this)
    this.renderLanguageView = this.renderLanguageView.bind(this)
    this.onToasterHide = this.onToasterHide.bind(this)
  }

  // we remove the toaster after
  onToasterHide () {
    this.setState({
      toaster: null
    })
  }

  getForm () {
    const { currentUser } = this.props
    let form = {
      first_name: t.String,
      last_name: t.String,
      contact: t.String,
      street: t.String,
      street_no: t.String,
      city: t.String,
      postcode: t.String,
      state: t.Number,
      country: t.String
    }

    if (!_.isEmpty(currentUser)) {
      form = Object.assign({}, form,
        currentUser.role.id === 4 ? {
          certified: t.maybe(t.Boolean)
        } : {}
      )
    }

    return t.struct(form)
  }

  onChange (formValue) {
    this.setState({formValue})
  }

  onPress () {
    const { currentUser: { role }, updateProfile, countries } = this.props
    const { languageSelected } = this.state
    const value = this.refs.profileUpdateForm.getValue()
    let serverError = null

    try {
      if (!value || (role.id === 4 && _.isEmpty(languageSelected))) {
        throw new Error('Fields required!')
      }

      const payload = Object.assign({}, value, {
        country: _.find(countries, { iso: value.country }).id
      }, role.id === 4 ? {
        languages: languageSelected,
        certified: +value.certified
      } : {})

      // all fields are good then we just need to request
      updateProfile(payload)

      this.updatingProfile = true
    } catch (e) {
      serverError = e.message
    }

    this.setState({ serverError })
  }

  /**
   * funciton that will simply change the options of our form.
   * @param {*} key
   * @param {*} options
   */
  updateFormOptions (key, options) {
    const { formOptions } = this.state
    const copy = Object.assign({}, formOptions)

    copy.fields[key] = {
      ...copy.fields[key],
      options
    }

    return copy
  }

  componentWillReceiveProps (nextProps) {
    const { currentUser, countries, regions, requestLanguages, error, success } = nextProps
   // we should only request our languas if we already have our current user in place
    if ((!_.isEmpty(currentUser) && !_.isEqual(nextProps.currentUser, this.props.currentUser)) || !this.setInitialValue) {
      const { user, role } = nextProps.currentUser
      this.setState({
        formValue: Object.assign({}, _.omit(user, ['iban', 'image']), role.id === 4 ? {
          certified: user.certified
        } : {}),
        languageSelected: user.languages || []
      })

      // if user is === 4 then we will reqeust for the languages
      if (role.id === 4) {
        requestLanguages()
      }
      this.setInitialValue = true
    }

    if (!_.isEmpty(regions)) {
      const options = regions.map((region) => ({
        value: region.id,
        text: region.name
      }))
      this.setState({
        formOptions: this.updateFormOptions('state', options)
      })
    }

    if (!_.isEmpty(countries)) {
      const options = countries.map((country) => ({
        id: country.id,
        cca2: country.iso,
        name: country.country
      }))
      this.setState({
        formOptions: this.updateFormOptions('country', options)
      })
    }

     // means theres error
    if (error) {
      this.setState({
        serverError: error.message
      })
    }

    if (success === true && this.updatingProfile === true) {
      this.setState({
        toaster: {
          text: I18n.t('updateSuccessfully'),
          styles: ToastStyles.success
        }
      }, () => { this.updatingProfile = false })
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { countries, requestRegion } = this.props
    const { formValue, serverError } = this.state

    if (!_.isEmpty(formValue.country) && !_.isEqual(formValue.country, prevState.formValue.country)) {
      const country = _.find(countries, { iso: formValue.country })
      requestRegion(country.id)
    }

    if (!!serverError && !_.isEqual(serverError, prevState.serverError)) {
      this.setState({
        toaster: {
          text: serverError,
          styles: ToastStyles.error
        }
      })
    }
  }

  componentDidMount () {
    const { requestProfile, requestCountry } = this.props
    requestProfile()
    requestCountry()
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

  keyboardDidShow = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    let newSize = Metrics.screenHeight - (e.endCoordinates.height + 10)
    this.setState({
      visibleHeight: newSize,
      topLogo: {width: 100, height: 0}
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

  renderLoading () {
    const { currentUser, fetching } = this.props

    if (_.isEmpty(currentUser) || fetching) {
      return (
        <View style={Styles.spinnerWrapper}>
          <Spinner
            size={50}
            type='Wave'
            color='#FFFFFF'
          />
        </View>
      )
    }

    return null
  }

  selectItems ({ key }, allSelected) {
    const { languageSelected } = this.state
    let copy = languageSelected.slice()
    if (!copy.includes(key)) {
      copy.push(key)
    } else {
      copy.splice(copy.indexOf(key), 1)
    }

    this.setState({
      languageSelected: copy
    })
  }

  displayLanguageButton () {
    const { currentUser, languages } = this.props
    const { languageSelected } = this.state

    const displayLangSelected = (languageSelected && !_.isEmpty(languages)) ? languageSelected
      .map(lang => _.find(languages, { id: lang }).language)
      .join(', ') : null

    if (!_.isEmpty(currentUser)) {
      const { role } = currentUser

      if (role.id === 4) {
        return (
          <TouchableOpacity style={Styles.languagesButton} onPress={() => this.modal.open()}>
            <Text> { displayLangSelected || I18n.t('languageSelectionHeader') } </Text>
          </TouchableOpacity>
        )
      }
    }

    return null
  }

  renderLanguageView (row, isSelected) {
    return (
      <View key={row.key} style={Styles.listRow} >
        <View style={Styles.flagStyle}>
          {
           // <Flag code={row.code} size={32} />
        }
        </View>
        <Text style={Styles.modalText}>
          {row.name}
        </Text>
        { isSelected && <EntypoIcon style={Styles.iconStyle} name='check' size={Metrics.icons.small} color={Colors.background} /> }
      </View>
    )
  }

  render () {
    const { formOptions, formValue, languageSelected, toaster } = this.state
    const { languages, fetching } = this.props

    return (
      <View style={[Styles.mainContainer, Styles.pagesContainer, {height: this.state.visibleHeight}]}>
        <Toaster message={toaster} onShow={this.onToasterHide} />
        {this.renderLoading()}
        <ScrollView style={Styles.container} keyboardShouldPersistTaps='never'>
          <View style={Styles.formContainer}>
            <KeyboardAvoidingView behavior='position'>
              <Form.Form
                ref='profileUpdateForm'
                type={this.getForm()}
                options={formOptions}
                value={formValue}
                onChange={this.onChange}
                />
              { this.displayLanguageButton() }
            </KeyboardAvoidingView>
            <View style={Styles.buttonRows}>
              <View style={Styles.buttonWrapper} >
                <FullButton onPress={this.onPress} displayActivity activity={fetching}>
                  {I18n.t('update')}
                </FullButton>
              </View>
            </View>
          </View>
        </ScrollView>

        <Modal
          style={Styles.modal}
          ref={(modal) => { this.modal = modal }}
          swipeToClose
          backButtonClose
          position={'bottom'}
          backdrop
        >
          <View style={Styles.modalHeaderSection} >
            <TouchableOpacity style={Styles.modalHeaderLeft} onPress={() => this.modal.close()} >
              <EntypoIcon style={Styles.modalIconLeftStyle} name='chevron-left' size={Metrics.icons.medium} color={Colors.background} />
            </TouchableOpacity>
            <Text style={[Styles.modalHeaderText, Styles.modalHeaderCenter]} >
              { I18n.t('languageSelectionHeader') }
            </Text>
            <View style={Styles.modalHeaderRight} />
          </View>
          <View style={Styles.modalContentSection}>
            <MultiSelect
              options={languages ? languages.map((language) => ({
                key: language.id,
                name: language.language,
                code: language.countries
              })) : []}
              onSelectionChange={this.selectItems}
              selectedOptions={languageSelected}
              renderRow={this.renderLanguageView}
            />
          </View>
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser(),
  success: selectSuccess(),
  error: selectError(),
  fetching: selectFetching(),
  countries: selectCountries(),
  regions: selectRegions(),
  languages: selectLanguages()
})

const mapDispatchToProps = (dispatch) => {
  return {
    requestProfile: () => dispatch(ProfileAction.profileRequest()),
    updateProfile: (payload) => dispatch(ProfileAction.profileSubmit(payload)),
    requestCountry: () => dispatch(ProfileAction.countryRequest()),
    requestRegion: (id) => dispatch(ProfileAction.regionRequest(id)),
    requestLanguages: () => dispatch(ClientAction.languagesRequest()),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(isAuthenticated(ProfileScreen))
