import React, { Component} from 'react'

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform
} from 'react-native'

import DSSlider from './DSSlider'
import DSStepper from './DSStepper'
import DateHeader from './DateHeader'
import TextButton from './TextButton'

import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers'
import { white, purple } from '../utils/colors'
import { Ionicons } from '@expo/vector-icons'

import { submitEntry, removeEntry } from '../utils/api'

import { connect } from 'react-redux'
import * as actions from '../actions'
import { bindActionCreators } from 'redux'

import { NavigationActions } from 'react-navigation'

const initialState = {
  run: 0,
  bike: 0,
  sleep: 0,
  swim: 0,
  eat : 0
}

const styles = StyleSheet.create({
  container: {
    flex: '1',
    padding: 20,
    background: white
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 48,
    marginRight: 48
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 2,
    height: 45,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30
  }
})

const SubmitButton = ({onPress}) => (
  <TouchableOpacity
    onPress={onPress}
    style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn }>
    <Text style={styles.submitBtnText}>SUBMIT</Text>
  </TouchableOpacity>
)

class AddEntry extends Component {
  state = initialState

  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric)

    this.setState((state) => {
      let count = state[metric] + step

      return {
        ...state,
        [metric]: count > max ? max : count
      }
    })
  }
  decrement = (metric) => {
    this.setState((state) => {
      let count = state[metric] - getMetricMetaInfo(metric).step

      return {
        ...state,
        [metric]: count < 0 ? 0 : count
      }
    })
  }
  slide = (metric, value) => {
    this.setState({ [metric]: value })
  }
  submit = () => {
    const key = timeToString()
    const entry = this.state

    this.props.addEntry({ [key]: entry })

    this.setState(initialState)
    this.toHome()
    submitEntry({ key, entry })
  }
  reset = () => {
    const key = timeToString()
    this.props.addEntry({ [key]: getDailyReminderValue() })
    removeEntry(key)
  }
  toHome = () => {
    this.props.navigation.dispatch(NavigationActions.back({
      key: 'AddEntry'
    }))
  }
  render() {
    const metaInfo = getMetricMetaInfo()

    if(this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy'}
            size={100}
          />
          <Text>You already logged activity for today</Text>
          <TextButton
            style={{padding: 10}}
            onPress={this.reset}
          >
            Reset
          </TextButton>
        </View>
      )
    }

    return (
      <ScrollView style={styles.container}>
        <DateHeader
          date={(new Date()).toLocaleDateString()}
        />
        {Object.keys(metaInfo).map((key) => {
          const { getIcon, type, ...rest } = metaInfo[key]
          const value = this.state[key]
          return (
            <View key={key} style={styles.row}>
              {getIcon()}
              {type === 'slider' ? (
                <DSSlider
                  value={value}
                  onChange={(value) => this.slide(key, value)}
                  {...rest}
                />
              ) : (
                <DSStepper
                  value={value}
                  onIncrement={() => this.increment(key)}
                  onDecrement={() => this.decrement(key)}
                  {...rest}
                />
              )}
            </View>
          )
        })}
        <SubmitButton onPress={this.submit} />
      </ScrollView>
    );
  }
}

export default connect(
  (state) => {
    const key = timeToString()
    return {
      alreadyLogged: state[key] && typeof state[key].today === 'undefined'
    }
  },
  (dispatch) => bindActionCreators(actions, dispatch)
)(AddEntry)
