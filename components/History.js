import React, { Component } from 'react'
import { View, Text, Platform, TouchableOpacity, StyleSheet } from 'react-native'
import { white } from '../utils/colors'
import DateHeader from './DateHeader'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../actions'
import MetricCard from './MetricCard'
import UdaciFitnessCalendar from 'udacifitness-calendar'
import { AppLoading } from 'expo'

const styles = StyleSheet.create({
  item: {
    backgroundColor: white,
    borderRadius: Platform.OS === 'ios' ? 16 : 2,
    padding: 20,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 17,
    justifyContent: 'center',
    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0, 0, 0, .24)',
    shadowOffset: {
      width: 0,
      height: 3
    }
  },
  noDataText: {
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 20
  }
})

class History extends Component {
  state = {
    ready: false
  }
  componentDidMount() {
    this.props.retrieveCalendarResults()
      .then(() => this.setState({ready: true}))
  }
  renderItem = ({today, ...metrics}, formattedDate, key) => (
    <View style={styles.item}>
      {today
        ? (
          <View>
            <DateHeader date={formattedDate} />
            <Text style={styles.noDataText}>
              {today}
            </Text>
          </View>
        )
        : (
          <TouchableOpacity onPress={() => this.props.navigation.navigate(
            'EntryDetail',
            { entryId: key }
          )}>
            <MetricCard metrics={metrics} date={formattedDate} />
          </TouchableOpacity>
        )
      }
    </View>
  )
  renderEmptyDate(formattedDate) {
      return (
        <View style={styles.item}>
          <DateHeader date={formattedDate} />
          <Text style={styles.noDataText}>
            You didnt log any data on this day
          </Text>
        </View>
      )
  }
  render() {
    let { entries } = this.props
    let { ready } = this.state

    if(ready === false) {
      return <AppLoading />
    }

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
