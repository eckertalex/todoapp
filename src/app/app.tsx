import React from 'react'
import {Helmet} from 'react-helmet-async'
import {Flex, Spinner} from '@chakra-ui/react'
import {useAuth} from 'context/auth-context/auth-context'

const AuthenicatedApp = React.lazy(() => import(/* webpackPrefetch: true */ 'app/authenticated-app/authenticated-app'))
const UnauthenticatedApp = React.lazy(() => import('app/unauthenticated-app/unauthenticated-app'))

function App() {
  const {user} = useAuth()

  return (
    <React.Suspense
      fallback={
        <Flex height="100vh" justifyContent="center" alignItems="center">
          <Spinner label="Loading application..." size="xl" />
        </Flex>
      }
    >
      <Helmet titleTemplate="%s - Todo App" defaultTitle="Todo App">
        <meta name="description" content="Todo App written in React with Chakra-UI, react-router, and react-query" />
      </Helmet>
      {user ? <AuthenicatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  )
}

export {App}
