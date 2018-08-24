import React from 'react'
import _ from 'lodash'

import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import isAuthenticated from './Auth'
import isProfileUpdated from './AllowOverview'

import {
  selectCurrentUser
} from '../Selectors/LoginSelectors'

import MainAction from '../Redux/MainRedux'
import ClientScreen from './ClientScreen'
import TranslatorScreen from './TranslatorScreen'

export class MainScreen extends React.Component {
  constructor () {
    super()

    this.state = {
      viewToRender: null
    }
  }

  componentWillReceiveProps (nextProps) {
    const { currentUser, showSearch } = nextProps

    if (!_.isEmpty(currentUser)) {
      const { role } = currentUser
      const viewToRender = role.id === 4 ? <TranslatorScreen {...nextProps} /> : <ClientScreen {...nextProps} />

      this.setState({
        viewToRender
      })

      // we will not show the
      showSearch((role.id !== 4))
    }
  }

  render () {
    const { viewToRender } = this.state
    return viewToRender
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser()
})

const mapDispatchToProps = (dispatch) => {
  return {
    showSearch: (payload) => dispatch(MainAction.show(payload)),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(isAuthenticated(isProfileUpdated(MainScreen)))
