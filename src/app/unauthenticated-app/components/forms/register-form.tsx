import React from 'react'
import {FormControl, FormLabel, Input, Icon, VStack, Stack} from '@chakra-ui/react'
import {useAsync} from 'utils/hooks'
import {useAuth} from 'context/auth-context/auth-context'
import {PasswordField} from 'components/password-field/password-field'
import {UserPlus as UserPlusIcon, XOctagon as XOctagonIcon, CheckCircle as CheckCircleIcon} from 'lucide-react'
import {LoadingButton} from 'components/loading-button/loading-button'
import {ModalBody, ModalFooter} from 'components/modal/modal'

function RegisterForm() {
  const {register} = useAuth()
  const {status, error, run} = useAsync()
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const state =
    status === 'pending' ? 'loading' : status === 'resolved' ? 'success' : status === 'rejected' ? 'error' : 'idle'

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    run(
      register({
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
            text="Register"
            textLoading="Registering..."
            textError={error?.message}
            colorScheme="blue"
            colorSchemeError="red"
            colorSchemeSuccess="green"
            ariaText="Register to TodoApp"
            ariaLoadingAlert="Registering"
            ariaSuccessAlert="Successfully registered"
            ariaErrorAlert={`Error registering: ${error?.message}`}
            icon={<Icon as={UserPlusIcon} />}
            iconError={<Icon as={XOctagonIcon} />}
            iconSuccess={<Icon as={CheckCircleIcon} />}
            type="submit"
          />
        </ModalFooter>
      </Stack>
    </form>
  )
}

export {RegisterForm}
