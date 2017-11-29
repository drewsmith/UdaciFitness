import React, { Component } from 'react'
import { View, Text } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../actions'

import UdaciFitnessCalendar from 'udacifitness-calendar'

class History extends Component {
  componentDidMount() {
    this.props.retrieveCalendarResults()
  }
  renderItem = ({today, ...metrics}, formattedDate, key) => (
    <View>
      {today
        ? <Text>{JSON.stringify(today)}</Text>
        : <Text>{JSON.stringify(metrics)}</Text>}
    </View>
  )
  renderEmptyDate(formattedDate) {
      return (
        <View>
          <Text>No Data for this day</Text>
        </View>
      )
  }
  render() {
    let { entries } = this.props
    return (
      <UdaciFitnessCalendar
        items={entries}
        renderItem={this.renderItem}
        renderEmptyDate={this.renderEmptyDate}
      />
    )
  }
}

export default connect(
  (entries) => ({
    entries: entries
  }),
  (dispatch) => bindActionCreators(actions, dispatch)
)(History)
