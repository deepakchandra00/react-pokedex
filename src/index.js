import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from './App'
import store from './store'
import './index.css'

const makeStore = store()
ReactDOM.render(
  <Provider store={makeStore}>
    <App />
  </Provider>,
  document.getElementById('root')
)
