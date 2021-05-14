import {Link as RRLink} from 'react-router-dom'
import {Link, Center} from '@chakra-ui/react'

function NotFoundScreen() {
  return (
    <Center height="100vh">
      Sorry... nothing here.
      <Link as={RRLink} marginLeft={2} to="/">
        Go home
      </Link>
    </Center>
  )
}

export {NotFoundScreen}
