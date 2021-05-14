import {Box, Flex} from '@chakra-ui/react'
import {ErrorBoundary} from 'react-error-boundary'
import {Routes, Route} from 'react-router-dom'
import {FullPageErrorFallback} from 'components/full-page-error-fallback/full-page-error-fallback'
import {Sidebar} from 'app/authenticated-app/components/sidebar'
import {NotFoundScreen} from 'screens/not-found'
import {SettingsScreen} from 'screens/settings'
import {TodosScreen} from 'screens/todos'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<TodosScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  )
}

function AuthenticatedApp() {
  return (
    <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
      <Flex>
        <Sidebar />
        <Box marginY={4} width="full">
          <AppRoutes />
        </Box>
      </Flex>
    </ErrorBoundary>
  )
}

export default AuthenticatedApp
