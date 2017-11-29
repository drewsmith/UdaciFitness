import React, { Component } from 'react'
import { View, Text } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../actions'

class History extends Component {
  componentDidMount() {
    this.props.retrieveCalendarResults()
  }
  render() {
    return (
      <View>
        <Text>{JSON.stringify(this.props)}</Text>
      </View>
    )
  }
}

export default connect(
  (state) => ({
    entries: state.entries
  }),
  (dispatch) => bindActionCreators(actions, dispatch)
)(History)
