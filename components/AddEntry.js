import React, { Component} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DSSlider from './DSSlider'
import DSStepper from './DSStepper'
import DateHeader from './DateHeader'
import TextButton from './TextButton'
import { getMetricMetaInfo, timeToString } from '../utils/helpers'
import { Ionicons } from '@expo/vector-icons'
import { submitEntry, removeEntry } from '../utils/api'

const initialState = {
  run: 0,
  bike: 0,
  sleep: 0,
  swim: 0,
  eat : 0
}

const SubmitButton = ({onPress}) => (
  <TouchableOpacity onPress={onPress}>
    <Text>SUBMIT</Text>
  </TouchableOpacity>
)

export default class AddEntry extends Component {
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

    this.setState(initialState)

    submitEntry({ key, entry })
  }
  reset = () => {
    const key = timeToString()

    removeEntry(key)
  }
  render() {
    const metaInfo = getMetricMetaInfo()

    if(this.props.alreadyLogged) {
      return (
        <View>
          <Ionicons name='ios-happy-outline' size={100} />
          <Text>You already logged activity for today</Text>
          <TextButton onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      )
    }

    return (
      <View>
        <DateHeader
          date={(new Date()).toLocaleDateString()}
        />
        {Object.keys(metaInfo).map((key) => {
          const { getIcon, type, ...rest } = metaInfo[key]
          const value = this.state[key]
          return (
            <View key={key}>
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
      </View>
    );
  }
}
