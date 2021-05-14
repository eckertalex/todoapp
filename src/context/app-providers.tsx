import React from 'react'
import {ChakraProvider, theme} from '@chakra-ui/react'
import {HelmetProvider} from 'react-helmet-async'
import {BrowserRouter as Router} from 'react-router-dom'
import {AuthProvider} from 'context/auth-context/auth-context'
import {QueryClientProvider} from 'context/query-client'

function AppProviders({children}: React.PropsWithChildren<{}>) {
  return (
    <ChakraProvider theme={theme}>
      <HelmetProvider>
        <QueryClientProvider>
          <Router>
            <AuthProvider>{children}</AuthProvider>
          </Router>
        </QueryClientProvider>
      </HelmetProvider>
    </ChakraProvider>
  )
}

export {AppProviders}
