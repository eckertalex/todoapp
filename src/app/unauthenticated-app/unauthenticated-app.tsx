import {Button, Heading, VStack, HStack, Icon} from '@chakra-ui/react'
import {ShieldCheck as ShieldCheckIcon, LogIn as LogInIcon, UserPlus as UserPlusIcon} from 'lucide-react'
import {Modal, ModalContents, ModalOpenButton} from 'components/modal/modal'
import {LoginForm} from 'app/unauthenticated-app/components/forms/login-form'
import {RegisterForm} from 'app/unauthenticated-app/components/forms/register-form'

function UnauthenticatedApp() {
  return (
    <VStack alignItems="center" justifyContent="center" width="full" height="100vh">
      <Icon as={ShieldCheckIcon} width={20} height={20} />
      <Heading size="2xl" variant="h1">
        TodoApp
      </Heading>
      <HStack>
        <Modal>
          <ModalOpenButton>
            <Button colorScheme="blue" leftIcon={<Icon as={LogInIcon} />} w={32}>
              Login
            </Button>
          </ModalOpenButton>
          <ModalContents aria-label="Login form" title="Login" isCentered>
            <LoginForm />
          </ModalContents>
        </Modal>
        <Modal>
          <ModalOpenButton>
            <Button colorScheme="blue" variant="outline" leftIcon={<Icon as={UserPlusIcon} />} w={32}>
              Register
            </Button>
          </ModalOpenButton>
          <ModalContents aria-label="Register form" title="Register" isCentered>
            <RegisterForm />
          </ModalContents>
        </Modal>
      </HStack>
    </VStack>
  )
}

export default UnauthenticatedApp
