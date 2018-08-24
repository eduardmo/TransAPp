import React, { PropTypes } from 'react'
import { View, Text, LayoutAnimation } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import NavItems from './NavItems'
import styles from './Styles/CustomNavBarStyle'
import SearchBar from '../Components/SearchBar'
import SearchActions from '../Redux/SearchRedux'

import {
  selectShowSearch
} from '../Selectors/MainSelectors'

import {
  selectSearchTerm
} from '../Selectors/SearchSelectors'

import { Metrics } from '../Themes'

class CustomNavBar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showSearchBar: false
    }
  }

  showSearchBar = () => {
    this.setState({showSearchBar: true})
  }

  cancelSearch = () => {
    this.setState({showSearchBar: false})
    this.props.cancelSearch()
  }

  onSearch = (searchTerm) => {
    this.props.performSearch(searchTerm)
  }

  renderMiddle () {
    const { title } = this.props

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    if (this.state.showSearchBar) {
      return <SearchBar onSearch={this.props.performSearch} searchTerm={this.props.searchTerm} onCancel={this.cancelSearch} />
    } else {
      return (
        <Text style={styles.title}> { title } </Text>
      )
    }
  }

  renderRightButtons () {
    if (this.state.showSearchBar) {
      return <View style={{width: Metrics.icons.medium}} />
    } else {
      return (
        <View style={styles.rightButtons}>
          {NavItems.searchButton(this.showSearchBar)}
        </View>
      )
    }
  }

  renderLeftButtons () {
    if (this.state.showSearchBar) {
      return null
    } else {
      return (
        <View style={styles.leftButtons}>
          {NavItems.hamburgerButton()}
        </View>
      )
    }
  }

  render () {
    const { showSearch } = this.props

    let state = this.props.navigationState
    let selected = state.children[state.index]

    while (selected.hasOwnProperty('children')) {
      state = selected
      selected = selected.children[selected.index]
    }

    const containerStyle = [
      styles.container,
      this.props.navigationBarStyle,
      state.navigationBarStyle,
      selected.navigationBarStyle
    ]

    return (
      <View style={containerStyle}>
        {this.renderLeftButtons()}
        {this.renderMiddle()}
        {showSearch ? this.renderRightButtons() : <View style={styles.rightButtons} />}
      </View>
    )
  }
}

CustomNavBar.propTypes = {
  navigationState: PropTypes.object,
  navigationBarStyle: View.propTypes.style
}

const mapStateToProps = createStructuredSelector({
  searchTerm: selectSearchTerm(),
  showSearch: selectShowSearch()
})

const mapDispatchToProps = (dispatch) => {
  return {
    performSearch: (searchTerm) => dispatch(SearchActions.search(searchTerm)),
    cancelSearch: () => dispatch(SearchActions.cancelSearch())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomNavBar)
