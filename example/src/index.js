import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'
import './styles/reset.css'

import App from './components/App'

const render = () => {
  ReactDOM.render(
    <BrowserRouter basename={window.PUBLIC_URL || null}>
      <AppContainer>
        <App/>
      </AppContainer>
    </BrowserRouter>,
    document.getElementById('root')
  )
}

render()

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./components/App', render)
}
