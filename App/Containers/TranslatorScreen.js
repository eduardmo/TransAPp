// @flow

import React from 'react'
import Spinner from 'react-native-spinkit'
import I18n from 'react-native-i18n'
import Toaster, { ToastStyles } from 'react-native-toaster'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Moment from 'moment'
import _ from 'lodash'

import { connect } from 'react-redux'
import { ListView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { createStructuredSelector } from 'reselect'

import { Metrics, Colors } from '../Themes'

import isAuthenticated from './Auth'

// Styles
import styles from './Styles/TranslatorScreenStyle'

import ProfileAction from '../Redux/ProfileRedux'
import CallInfoActions from '../Redux/CallInfoRedux'

import {
  selectSuccess,
  selectFetching
} from '../Selectors/TranslatorSelectors'

import {
  selectCallInfo,
  selectError
} from '../Selectors/CallsSelectors'

import {
  selectCurrentUser
} from '../Selectors/LoginSelectors'

export class TranslatorScreen extends React.Component {
  constructor () {
    super()

    const rowHasChanged = (r1, r2) => r1 !== r2
    // DataSource configured
    const ds = new ListView.DataSource({rowHasChanged})

    this.state = {
      dataSource: ds.cloneWithRows([]),
      toaster: null
    }

    this._requestUpdate = this._requestUpdate.bind(this)
    this._onToasterHide = this._onToasterHide.bind(this)
    this._renderRow = this._renderRow.bind(this)
  }

   // we remove the toaster after
  _onToasterHide () {
    this.setState({
      toaster: null
    })
  }

    // returns true if the dataSource is empty
  _noRowData () {
    const { dataSource } = this.state
    return dataSource.getRowCount() === 0
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

  _renderRow (row) {
    const { status } = row
    const iconName = status === 'closed' ? 'call-received' : 'call-missed'
    const start = new Moment(row.call_start)
    const end = new Moment(row.call_end)
    let timezone = ((new Date().getTimezoneOffset() / 60) * -1)

    return (
      <TouchableOpacity key={row.id} style={styles.listRow} >
        <View style={styles.iconCallHistory}>
          <MaterialCommunityIcons style={styles.iconStyle} name={iconName} size={Metrics.icons.small} color={Colors.snow} />
        </View>
        <Text style={[styles.rowTextStyle, styles.durationTextStyle]}>
          { Moment.utc(end.diff(start)).format('HH:mm:ss') }
        </Text>
        <Text style={[styles.rowTextStyle, styles.createdTextStyle]}>
          { Moment.utc(row.created_at).utcOffset(timezone).format('HH:mm') }
        </Text>
      </TouchableOpacity>
    )
  }

  _requestUpdate () {
    const { currentUser: { user }, updateProfile } = this.props

    if (_.isEmpty(user)) {
      this.setState({
        toaster: {
          text: I18n.t('networkError'),
          styles: ToastStyles.error
        }
      })
      return
    }

    // update our profile
    return updateProfile(
      Object.assign({}, _.omit(user, ['email', 'image', 'organization', 'iban']), {
        online: +!user.online
      })
    )
  }

  _isUserOnline () {
    const { currentUser } = this.props
    if (currentUser) {
      const { user: { online } } = currentUser
      return online
    }

    return false
  }

  componentWillReceiveProps (nextProps) {
    const { dataSource } = this.state
    const { toaster, callHistory, error } = this.props

    if (!_.isEqual(toaster, nextProps.toaster) && nextProps.toaster) {
      this.setState({
        toaster: nextProps.toaster
      })
    }

    // we will fetch this aslong as call history is not emtpy
    if (!_.isEmpty(nextProps.callHistory) && !_.isEqual(callHistory, nextProps.callHistory)) {
      this.setState({
        dataSource: dataSource.cloneWithRows(nextProps.callHistory)
      })
    }

    if (!!nextProps.error && !_.isEqual(error, nextProps.error)) {
      const { message } = nextProps.error
      this.setState({
        toaster: {
          text: message,
          styles: ToastStyles.error
        }
      })
    }
  }

  componentDidMount () {
    const { dataSource } = this.state
    const { requestProfile, requestCallHistory, currentUser: { user: { id } }, callHistory } = this.props

    // if call hisotry is not empty then we just need to load it.
    if (!_.isEmpty(callHistory)) {
      this.setState({
        dataSource: dataSource.cloneWithRows(callHistory)
      })
    }

    requestProfile()
    requestCallHistory(id)
  }

  render () {
    const { toaster, dataSource } = this.state
    const buttonStyle = this._isUserOnline() ? styles.onlineButton : styles.offineButton
    const textMessage = this._isUserOnline() ? I18n.t('translatorIsActive') : I18n.t('translatorIsNotActive')

    return (
      <View style={[styles.mainContainer, styles.pagesContainer]}>
        <Toaster message={toaster} onShow={this._onToasterHide} />
        {this._renderLoader()}
        <ScrollView style={styles.container}>
          <TouchableOpacity style={[styles.toggleButton, buttonStyle]} onPress={this._requestUpdate}>
            <Text style={styles.toggleButtonText}> { textMessage } </Text>
          </TouchableOpacity>

          <ListView
            contentContainerStyle={styles.listContent}
            dataSource={dataSource}
            renderRow={this._renderRow}
            pageSize={5}
            enableEmptySections
          />

        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser(),
  success: selectSuccess(),
  error: selectError(),
  fetching: selectFetching(),
  callHistory: selectCallInfo()
})

const mapDispatchToProps = (dispatch) => {
  return {
    requestCallHistory: (payload) => dispatch(CallInfoActions.callInfoRequest(payload)),
    requestProfile: () => dispatch(ProfileAction.profileRequest()),
    updateProfile: (payload) => dispatch(ProfileAction.profileSubmit(payload)),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(isAuthenticated(TranslatorScreen))
