import React from 'react'
import {FormControl, FormLabel, Input, Icon, VStack, Stack} from '@chakra-ui/react'
import {useAsync} from 'utils/hooks'
import {useAuth} from 'context/auth-context/auth-context'
import {PasswordField} from 'components/password-field/password-field'
import {LogIn as LogInIcon, XOctagon as XOctagonIcon, CheckCircle as CheckCircleIcon} from 'lucide-react'
import {LoadingButton} from 'components/loading-button/loading-button'
import {ModalBody, ModalFooter} from 'components/modal/modal'

function LoginForm() {
  const {login} = useAuth()
  const {status, error, run} = useAsync()
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const state =
    status === 'pending' ? 'loading' : status === 'resolved' ? 'success' : status === 'rejected' ? 'error' : 'idle'

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    run(
      login({
        username,
        password,
      })
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing="6">
        <ModalBody>
          <VStack spacing="2.5">
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input
                required
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value)
                }}
              />
            </FormControl>
            <PasswordField
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
              }}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <LoadingButton
            state={state}
            text="Login"
            textLoading="Logging in..."
            textError={error?.message}
            colorScheme="blue"
            colorSchemeError="red"
            colorSchemeSuccess="green"
            ariaText="Login to TodoApp"
            ariaLoadingAlert="Logging in"
            ariaSuccessAlert="Successfully logged in"
            ariaErrorAlert={`Error logging in: ${error?.message}`}
            icon={<Icon as={LogInIcon} />}
            iconError={<Icon as={XOctagonIcon} />}
            iconSuccess={<Icon as={CheckCircleIcon} />}
            type="submit"
          />
        </ModalFooter>
      </Stack>
    </form>
  )
}

export {LoginForm}
