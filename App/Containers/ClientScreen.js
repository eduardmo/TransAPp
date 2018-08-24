// @flow

import React from 'react'
import Spinner from 'react-native-spinkit'
import _ from 'lodash'
import Flag from 'react-native-flags'
import Modal from 'react-native-modalbox'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import I18n from 'react-native-i18n'
import DialogBox from 'react-native-dialogbox'

import Toaster, { ToastStyles } from 'react-native-toaster'

import { connect } from 'react-redux'
import { ListView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { createStructuredSelector } from 'reselect'

import { Metrics, Colors } from '../Themes'

import isAuthenticated from './Auth'

// Styles
import styles from './Styles/ClientScreenStyle'
import ClientActions from '../Redux/ClientRedux'
import {
  selectSuccess,
  selectError,
  selectFetching,
  selectLanguages,
  selectTranslators
} from '../Selectors/ClientSelectors'

import {
  selectSearchTerm
} from '../Selectors/SearchSelectors'

export class ClientScreen extends React.Component {
  constructor () {
    super()

    // teach how to detect changes
    const rowHasChanged = (r1, r2) => r1 !== r2
    // DataSource configured
    const ds = new ListView.DataSource({rowHasChanged})

    this.state = {
      countriesSource: ds.cloneWithRows([]),
      languagesSource: ds.cloneWithRows([]),
      currentCall: {},
      toaster: null
    }

    this._renderCountryRow = this._renderCountryRow.bind(this)
    this._renderLanguagesRow = this._renderLanguagesRow.bind(this)
    this._requestTranslators = this._requestTranslators.bind(this)
    this._onToasterHide = this._onToasterHide.bind(this)
    this._referenceDialogBox = this._referenceDialogBox.bind(this)
    this._certifiedOrNotTranslators = this._certifiedOrNotTranslators.bind(this)
  }

  _referenceDialogBox (dialogbox) {
    this.dialogbox = dialogbox
  }

   // we remove the toaster after
  _onToasterHide () {
    this.setState({
      toaster: null
    })
  }

  // returns true if the dataSource is empty
  _noRowData () {
    const { countriesSource } = this.state
    return countriesSource.getRowCount() === 0
  }

  _renderLoader () {
    const { fetching } = this.props
    if (fetching) {
      return (
        <View style={styles.spinnerWrapper}>
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
  _changeLanguagesDataSource (countryId) {
    const { languagesSource } = this.state
    const { languages } = this.props
    const cpLanguages = _.filter(languages, (item) =>
      item.country_id.includes(parseInt(countryId))
    )

    this.setState({
      languagesSource: languagesSource.cloneWithRows(cpLanguages)
    }, () => this.LanguagesModal.open())
  }

  _certifiedOrNotTranslators (currentCall) {
    const { id } = currentCall
    this.dialogbox.confirm({
      content: I18n.t('certifiedDialogContent'),
      ok: {
        text: I18n.t('yes'),
        callback: () => {
          this._requestTranslators({id, certified: 1})
        }
      },
      cancel: {
        text: I18n.t('no'),
        callback: () => {
          this._requestTranslators({id, certified: 0})
        }
      }
    })
  }

  _requestTranslators ({ certified, id }) {
    const { updateAuthState, requestTranslators, currentUser: { user }, communication } = this.props
    return new Promise((resolve) =>
      requestTranslators({
        id,
        certified,
        resolve
      })
    ).then((result) => {
      if (!_.isEmpty(result)) {
        this.LanguagesModal.close() // make sure to close the modal
        updateAuthState({
          language: id,
          targets: result,
          caller: user.id
        }, () => communication._initiateCall())
      } else {
        this.setState({
          toaster: {
            text: I18n.t('noTranslator'),
            styles: ToastStyles.error
          }
        })
      }
    })
  }

  _renderCountryRow (row) {
    return (
      <TouchableOpacity key={row.id} style={styles.listRow} onPress={() => this._changeLanguagesDataSource(row.id)}>
        <View style={styles.flagStyle}>
          <Flag code={row.iso} size={32} />
        </View>
        <Text style={styles.rowTextStyle}>
          {row.country}
        </Text>
        <EntypoIcon style={styles.iconStyle} name='chevron-right' size={Metrics.icons.small} color={Colors.snow} />
      </TouchableOpacity>
    )
  }

  _renderLanguagesRow (row) {
    return (
      <TouchableOpacity key={row.id} style={styles.listRow} onPress={() => this._certifiedOrNotTranslators(row)}>
        <Text style={[styles.rowTextStyle, styles.rowLangTextStyle]}>
          {row.language}
        </Text>
        <EntypoIcon style={styles.iconStyle} name='video-camera' size={Metrics.icons.small} color={Colors.charcoal} />
      </TouchableOpacity>
    )
  }

  componentWillReceiveProps (nextProps) {
    const { countriesSource } = this.state
    const { requestLanguages, currentUser, languages, searchTerm, toaster } = nextProps
    const searchItem = searchTerm || ''

    if (!_.isEqual(this.props.toaster, toaster) && !_.isEmpty(toaster)) {
      this.setState({
        toaster
      })
    }

    // additional check if search match on language
    const _searchLanguage = (countryId, haystack) => {
      return !!_.find(haystack, (hay) =>
        (_.startsWith(hay.language.toLowerCase(), searchItem.toLowerCase()) && hay.country_id.includes(countryId))
      )
    }

    // we should only request our languas if we already have our current user in place
    if (!_.isEmpty(currentUser) && _.isEmpty(languages)) {
      requestLanguages()
    }

    if (!_.isEmpty(languages)) {
      const countries = _.uniqBy(_.flatten(languages.map((co) => co.countries)), 'id')
      const filteredCountries = countries.filter((item) =>
        _.startsWith(item.country.toLowerCase(), searchItem.toLowerCase()) || _searchLanguage(item.id, languages)
      )
      this.setState({
        countriesSource: countriesSource.cloneWithRows(filteredCountries)
      })
    }
  }

  render () {
    const { countriesSource, languagesSource, toaster } = this.state

    return (
      <View style={[styles.mainContainer, styles.pagesContainer]}>
        <Toaster message={toaster} onShow={this._onToasterHide} />
        {this._renderLoader()}
        <ScrollView style={[styles.container, styles.listContainer]}>
          <ListView
            contentContainerStyle={styles.listContent}
            dataSource={countriesSource}
            renderRow={this._renderCountryRow}
            pageSize={15}
            enableEmptySections
          />
        </ScrollView>
        <Modal
          style={styles.modal}
          ref={(modal) => { this.LanguagesModal = modal }}
          swipeToClose
          backButtonClose
          position={'bottom'}
          backdrop
        >
          <View style={styles.modalHeaderSection} >
            <TouchableOpacity style={styles.modalHeaderLeft} onPress={() => this.LanguagesModal.close()} >
              <EntypoIcon style={styles.modalIconLeftStyle} name='chevron-left' size={Metrics.icons.medium} color={Colors.background} />
            </TouchableOpacity>
            <Text style={[styles.modalHeaderText, styles.modalHeaderCenter]} >
              { I18n.t('languageSelectionHeader') }
            </Text>
            <View style={styles.modalHeaderRight} />
          </View>
          <View style={styles.modalContentSection}>
            <ListView
              contentContainerStyle={styles.listContent}
              dataSource={languagesSource}
              renderRow={this._renderLanguagesRow}
              pageSize={15}
              enableEmptySections
            />
          </View>
        </Modal>

        <DialogBox ref={this._referenceDialogBox} isOverlayClickClose={false} />
      </View>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  searchTerm: selectSearchTerm(),
  success: selectSuccess(),
  error: selectError(),
  fetching: selectFetching(),
  languages: selectLanguages(),
  translators: selectTranslators()
})

const mapDispatchToProps = (dispatch) => {
  return {
    requestLanguages: (value) => dispatch(ClientActions.languagesRequest()),
    requestTranslators: (language) => dispatch(ClientActions.translatorRequest(language)),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(isAuthenticated(ClientScreen))
