import ReactDOM from 'react-dom'
import React from 'react'

import App from 'components/App'

import 'react-datepicker/dist/react-datepicker.css'
import 'less/global.less'

ReactDOM.render(<App />, document.querySelector('#root'))


if (module.hot) {
    module.hot.accept();
  }