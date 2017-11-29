import React, { Component} from 'react';
import { View } from 'react-native';
import AddEntry from './components/AddEntry'
import History from './components/History'

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import thunk from 'redux-thunk'

const store = createStore(
  reducer,
  applyMiddleware(thunk)
)

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
          <History />
        </View>
      </Provider>
    )
  }
}

export default App
