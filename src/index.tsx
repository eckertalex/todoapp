import {ColorModeScript} from '@chakra-ui/react'
import * as React from 'react'
import ReactDOM from 'react-dom'
import {App} from 'app/app'
import {AppProviders} from 'context/app-providers'
import {loadDevTools} from 'dev-tools/load'

// Initialize server
import 'test/server'

loadDevTools(() => {
  ReactDOM.render(
    <React.StrictMode>
      <AppProviders>
        <ColorModeScript />
        <App />
      </AppProviders>
    </React.StrictMode>,
    document.getElementById('root')
  )
})
