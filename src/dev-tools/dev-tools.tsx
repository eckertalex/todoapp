import ReactDOM from 'react-dom'
import React from 'react'
import {
  ChakraProvider,
  Box,
  Tooltip,
  Button,
  Icon,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Grid,
  FormControl,
  Checkbox,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  Select,
  Input,
  Text,
  VStack,
  UnorderedList,
  HStack,
  ListItem,
  IconButton,
  DarkMode,
  theme,
} from '@chakra-ui/react'
import {Wrench as WrenchIcon, Plus as PlusIcon, Trash2 as TrashIcon} from 'lucide-react'
import * as reactQuery from 'react-query'
// pulling the development thing directly because I'm not worried about
// bundle size since this won't be loaded in prod unless the query string/localStorage key is set
// @ts-expect-error
import {ReactQueryDevtoolsPanel} from 'react-query/es/devtools'

let latestQueryClient: reactQuery.QueryClient | null = null
let rerender = () => {}
;(window as any).__devtools = {
  setQueryClient(client: reactQuery.QueryClient) {
    latestQueryClient = client
    setTimeout(() => rerender())
  },
}

function useLatestQueryClient() {
  rerender = React.useReducer(() => ({}), {})[1]
  return latestQueryClient
}

function install() {
  // add some things to window to make it easier to debug
  ;(window as any).reactQuery = reactQuery

  function DevTools() {
    const queryClient = useLatestQueryClient()
    const [rootRef, hovering] = useHover<HTMLDivElement>()
    const [persist, setPersist] = useLocalStorageState('__todoapp_devtools_persist__', false)
    const show = persist || hovering
    const [tabIndex, setTabIndex] = useLocalStorageState('__todoapp_devtools_tab_index__', 0)
    const togglePersist = () => {
      setPersist((v) => !v)
    }

    React.useEffect(() => {
      const appRoot = document.getElementById('root')
      if (hovering || persist) {
        appRoot?.setAttribute('style', 'margin-bottom: 50vh')
      } else {
        appRoot?.style.removeProperty('margin-bottom')
      }
    }, [persist, hovering])

    return (
      <ChakraProvider theme={theme}>
        <DarkMode>
          <Box position="fixed" bottom={-4} left={0} right={0}>
            <Box
              ref={rootRef}
              background="blue.900"
              opacity={show ? '1' : '0'}
              boxSizing="content-box"
              height={show ? '50vh' : 16}
              width="full"
              transition="all 0.3s"
              overflow="scroll"
            >
              <Tooltip label="Toggle Persist DevTools">
                <Button
                  display="flex"
                  position="absolute"
                  color="white"
                  colorScheme="blue"
                  backgroundColor="blue.900"
                  _hover={{}}
                  _active={{}}
                  _focus={{}}
                  alignItems="center"
                  fontSize="1.2rem"
                  border="none"
                  paddingX={2}
                  paddingY={4}
                  marginTop={-10}
                  marginLeft={5}
                  overflow="hidden"
                  roundedBottom="none"
                  _before={{
                    content: '""',
                    position: 'absolute',
                    height: 1,
                    width: 'full',
                    left: 0,
                    top: 0,
                    background: persist ? 'yellow.300' : 'transparent',
                  }}
                  onClick={togglePersist}
                  leftIcon={<Icon as={WrenchIcon} color={persist ? 'white' : 'gray.300'} />}
                >
                  Bookshelf DevTools
                </Button>
              </Tooltip>
              {show ? (
                <Tabs index={tabIndex} onChange={(i) => setTabIndex(i)} color="white">
                  <TabList borderBottomColor="whiteAlpha.300">
                    <Tab>Controls</Tab>
                    <Tab>Request Failures</Tab>
                    <Tab>React Query</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <ControlsPanel />
                    </TabPanel>
                    <TabPanel>
                      <RequestFailUI />
                    </TabPanel>
                    <TabPanel>
                      {queryClient ? (
                        <reactQuery.QueryClientProvider client={queryClient}>
                          <ReactQueryDevtoolsPanel />
                        </reactQuery.QueryClientProvider>
                      ) : (
                        'No query client initialized.'
                      )}
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              ) : null}
            </Box>
          </Box>
        </DarkMode>
      </ChakraProvider>
    )
  }

  // add dev tools UI to the page
  const devToolsRoot = document.createElement('div')
  document.body.appendChild(devToolsRoot)
  ReactDOM.render(<DevTools />, devToolsRoot)
}

function ControlsPanel() {
  return (
    <Grid
      gridTemplateColumns="1fr"
      gridTemplateRows="repeat(auto-fill, minmax(40px, 40px) )"
      gridGap={2}
      marginRight={6}
    >
      <EnableDevTools />
      <FailureRate />
      <RequestMinTime />
      <RequestVarTime />
      <ClearLocalStorage />
    </Grid>
  )
}

function EnableDevTools() {
  const [enableDevTools, setEnableDevTools] = useLocalStorageState('dev-tools', process.env.NODE_ENV === 'development')

  return (
    <FormControl id="enableDevTools" display="flex" alignItems="center" width="full">
      <Checkbox
        isChecked={enableDevTools}
        colorScheme="yellow"
        onChange={(event) => {
          setEnableDevTools(event.target.checked)
        }}
      >
        Enable DevTools by default
      </Checkbox>
    </FormControl>
  )
}

function FailureRate() {
  const [failureRate, setFailureRate] = useLocalStorageState('__todoapp_failure_rate__', 0)

  return (
    <FormControl display="flex" alignItems="center" justifyContent="space-between" width="full" id="failureRate">
      <FormLabel>Request Failure Percentage:</FormLabel>
      <NumberInput
        borderColor="whiteAlpha.300"
        width={64}
        value={failureRate * 100}
        type="number"
        step={10}
        min={0}
        max={100}
        onChange={(_, value) => {
          setFailureRate(value / 100)
        }}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper borderColor="whiteAlpha.300" />
        </NumberInputStepper>
      </NumberInput>
    </FormControl>
  )
}

function RequestMinTime() {
  const [minTime, setMinTime] = useLocalStorageState('__todoapp_min_request_time__', 400)

  return (
    <FormControl display="flex" alignItems="center" justifyContent="space-between" width="full" htmlFor="minTime">
      <FormLabel>Request min time (ms):</FormLabel>
      <NumberInput
        borderColor="whiteAlpha.300"
        width={64}
        value={minTime}
        type="number"
        step={100}
        min={0}
        max={1000 * 60}
        onChange={(_, value) => {
          setMinTime(value)
        }}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper borderColor="whiteAlpha.300" />
        </NumberInputStepper>
      </NumberInput>
    </FormControl>
  )
}

function RequestVarTime() {
  const [varTime, setVarTime] = useLocalStorageState('__todoapp_variable_request_time__', 400)

  return (
    <FormControl display="flex" alignItems="center" justifyContent="space-between" width="full" htmlFor="varTime">
      <FormLabel>Request variable time (ms):</FormLabel>
      <NumberInput
        borderColor="whiteAlpha.300"
        width={64}
        value={varTime}
        type="number"
        step={100}
        min={0}
        max={1000 * 60}
        onChange={(_, value) => {
          setVarTime(value)
        }}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper borderColor="whiteAlpha.300" />
        </NumberInputStepper>
      </NumberInput>
    </FormControl>
  )
}

function ClearLocalStorage() {
  function clear() {
    window.localStorage.clear()
    window.location.assign(window.location.toString())
  }
  return <Button onClick={clear}>Purge Database</Button>
}

function RequestFailUI() {
  const [requestMethod, setRequestMethod] = React.useState('')
  const [urlMatch, setUrlMatch] = React.useState('')
  const [failConfig, setFailConfig] = useLocalStorageState<{requestMethod: string; urlMatch: string}[]>(
    '__todoapp_request_fail_config__',
    []
  )

  function handleRemoveClick(index: number) {
    setFailConfig((c) => [...c.slice(0, index), ...c.slice(index + 1)])
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFailConfig((c) => [...c, {requestMethod, urlMatch}])
    setRequestMethod('')
    setUrlMatch('')
  }

  return (
    <Flex width="full">
      <form onSubmit={handleSubmit}>
        <VStack width={80} spacing={4}>
          <FormControl id="requestMethod" display="flex" alignItems="center" justifyContent="space-between">
            <FormLabel>Method:</FormLabel>
            <Select
              isRequired
              value={requestMethod}
              onChange={(event) => setRequestMethod(event.target.value)}
              width={32}
              borderColor="whiteAlpha.300"
            >
              <option value="">Select</option>
              <option value="ALL">ALL</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </Select>
          </FormControl>
          <FormControl id="urlMatch">
            <FormLabel>URL Match:</FormLabel>
            <Input
              isRequired
              value={urlMatch}
              onChange={(event) => setUrlMatch(event.target.value)}
              autoComplete="off"
              placeholder="/api/list-items/:listItemId"
              borderColor="whiteAlpha.300"
              _placeholder={{
                color: 'whiteAlpha.300',
              }}
            />
          </FormControl>
          <Button type="submit" width={24} leftIcon={<Icon as={PlusIcon} />} alignSelf="flex-end">
            Add
          </Button>
        </VStack>
      </form>
      <UnorderedList listStyleType="none" width="full" spacing={1}>
        {failConfig.map(({requestMethod, urlMatch}, index) => (
          <ListItem
            key={index}
            display="flex"
            justifyContent="space-between"
            backgroundColor="blue.800"
            rounded="md"
            padding={2}
          >
            <HStack>
              <Text as="strong" minWidth={16}>
                {requestMethod}:
              </Text>
              <Text>{urlMatch}</Text>
            </HStack>
            <IconButton
              variant="ghost"
              icon={<Icon as={TrashIcon} size="xs" />}
              aria-label="Delete"
              colorScheme="red"
              size="xs"
              onClick={() => handleRemoveClick(index)}
            />
          </ListItem>
        ))}
      </UnorderedList>
    </Flex>
  )
}

function useLocalStorageState<DataType>(key: string, defaultValue: DataType) {
  const [state, setState] = React.useState<DataType>(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      return JSON.parse(valueInLocalStorage)
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  React.useDebugValue(`${key}: ${JSON.stringify(state)}`)

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
  }, [key])

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState] as const
}

function useHover<RefType extends HTMLDivElement>() {
  const [hovering, setHovering] = React.useState(false)
  const ref = React.useRef<RefType>(null)
  const timerRef = React.useRef<number>()

  React.useEffect(() => {
    function handleMouseOver() {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = window.setTimeout(() => {
        setHovering(true)
      }, 0)
    }

    function handleMouseOut() {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = window.setTimeout(() => {
        setHovering(false)
      }, 0)
    }

    const node = ref.current
    if (node) {
      node.addEventListener('mouseover', handleMouseOver)
      node.addEventListener('mouseout', handleMouseOut)
    }

    return () => {
      if (node) {
        node.removeEventListener('mouseover', handleMouseOver)
        node.removeEventListener('mouseout', handleMouseOut)
      }
    }
  }, [])

  return [ref, hovering] as const
}

export {install}
