import React, { Component} from 'react';
import { View } from 'react-native';
import AddEntry from './components/AddEntry'
import Slider from './components/Slider'
import Stepper from './components/Stepper'
import DateHeader from './components/DateHeader'
import { getMetricMetaInfo } from './utils/helpers'

export default class App extends Component {
  state = {
    run: 0,
    bike: 0,
    sleep: 0,
    swin: 0,
    eat : 0
  }
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
      let count = state[metric] + getMetricMetaInfo(metric).step

      return {
        ...state,
        [metric]: count < 0 ? 0 : count
      }
    })
  }
  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value
    }))
  }
  render() {
    const metaInfo = getMetricMetaInfo()
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
                <Slider
                  value={value}
                  onChange={() => this.slide(key, value)}
                  {...rest}
                />
              ) : (
                <Stepper
                  value={value}
                  onIncrement={() => this.increment(key)}
                  onDecrement={() => this.decrement(key)}
                  {...rest}
                />
              )}
            </View>
          )
        })}
      </View>
    );
  }
}
