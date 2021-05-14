import {Flex, Text} from '@chakra-ui/react'

function FullPageErrorFallback({error}: {error: Error}) {
  return (
    <Flex
      role="alert"
      flexDirection="column"
      color="red.300"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Text>Uh oh... There's a problem. Try refreshing the app.</Text>
      <pre>{error.message}</pre>
    </Flex>
  )
}

export {FullPageErrorFallback}
