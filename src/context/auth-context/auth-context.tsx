import React from 'react'
import {useQueryClient} from 'react-query'
import {Flex, Spinner} from '@chakra-ui/react'
import * as auth from 'context/auth-context/auth-provider'
import {client} from 'utils/api-client'
import {useAsync} from 'utils/hooks'
import {FullPageErrorFallback} from 'components/full-page-error-fallback/full-page-error-fallback'
// import {setQueryDataForBook} from 'utils/books'

export type User = {
  username: string
  password: string
}

type UserWithToken = User & {
  token: string
}

type AuthProviderValue = {
  user: UserWithToken | null
  login: (user: User) => Promise<void>
  logout: () => void
  register: (user: User) => Promise<void>
}

async function bootstrapAppData() {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client<{token: string}, {user: UserWithToken}>('me', {token})
    user = data.user
  }
  return user
}

const AuthContext = React.createContext<AuthProviderValue | undefined>(undefined)
AuthContext.displayName = 'AuthContext'

function AuthProvider({children}: {children: React.ReactNode}) {
  const {
    data: user,
    status,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync<UserWithToken | null>()
  const queryClient = useQueryClient()

  React.useEffect(() => {
    const appDataPromise = bootstrapAppData()
    run(appDataPromise)
  }, [run])

  const login = React.useCallback((form: User) => auth.login(form).then((user) => setData(user)), [setData])
  const register = React.useCallback((form: User) => auth.register(form).then((user) => setData(user)), [setData])
  const logout = React.useCallback(() => {
    auth.logout()
    queryClient.clear()
    setData(null)
  }, [queryClient, setData])

  const value = React.useMemo<AuthProviderValue>(() => {
    return {user, login, logout, register}
  }, [login, logout, register, user])

  if (isLoading || isIdle) {
    return (
      <Flex height="100vh" justifyContent="center" alignItems="center">
        <Spinner label="Loading application..." size="xl" />
      </Flex>
    )
  }

  if (isError && error) {
    return <FullPageErrorFallback error={error} />
  }

  if (isSuccess) {
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  }

  throw new Error(`Unhandled status: ${status}`)
}

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context
}

function useClient() {
  const {user} = useAuth()
  const token = user?.token
  return React.useCallback((endpoint, config) => client(endpoint, {...config, token}), [token])
}

export {AuthProvider, useAuth, useClient}
