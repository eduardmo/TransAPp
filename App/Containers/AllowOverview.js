/**
 * this HOC component is to have extra layer of protection that we will not allow
 * user that their profile is not completed yet.
 */

import React from 'react'
import _ from 'lodash'
import I18n from 'react-native-i18n'
import Modal from 'react-native-modalbox'

import {
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { createStructuredSelector } from 'reselect'

import Styles from './Styles/AuthStyle'
import {
  selectFetching
} from '../Selectors/LoginSelectors'

/**
 * this will check if profile is completed
 * @param {*} WrapperComponent
 */
export default function isProfileUpdated (WrapperComponent) {
  class ProfileUpdated extends React.Component {
    propertyCompleted = ['first_name', 'last_name', 'email', 'contact', 'street', 'street_no', 'postcode', 'city', 'state', 'country']

    translatorProperty = ['languages']

    requesting = false

    constructor () {
      super()

      this.state = {
        open: false
      }

      this.modalClose = this.modalClose.bind(this)
    }

    componentDidMount () {
      this.requesting = true
    }

    truthness (currentUser) {
      const { role, user } = currentUser
      const checkArray = role.id === 5 ? this.propertyCompleted : this.propertyCompleted.concat(this.translatorProperty)

      return checkArray.map((key) =>
        user.hasOwnProperty(key) ? !!user[key] : true
      ).includes(false)
    }

    modalClose () {
      setTimeout(() => NavigationActions.tabProfile(), 1000)
    }

    componentWillReceiveProps (nextProps) {
      const { fetching, currentUser } = nextProps

      if (this.requesting && !fetching && !_.isEmpty(currentUser)) {
        this.setState({ open: this.truthness(currentUser) })
      }
    }

    render () {
      const { open } = this.state
      const { isLogin, currentUser } = this.props

      return (
        <View style={Styles.wrapper}>
          <WrapperComponent
            {...this.props}
            isLogin={isLogin}
            currentUser={currentUser}
          />
          <Modal
            isOpen={open}
            swipeToClose
            backButtonClose
            onClosed={this.modalClose}
            style={Styles.successModal}
            position={'center'}
            backdrop
          >
            <View style={Styles.modalHeaderSection} >
              <Text style={Styles.modalHeaderText} >
                {I18n.t('profileUpdateNeedHeader')}
              </Text>
            </View>
            <Text style={Styles.modalText} >
              {I18n.t('profileUpdateNeedContent')}
            </Text>
          </Modal>

        </View>
      )
    }
  }

  const mapStateToProps = createStructuredSelector({
    fetching: selectFetching()
  })

  return connect(mapStateToProps)(ProfileUpdated)
}
