import {setupServer} from 'msw/node'
import {handlers} from 'test/server/server-handlers'

const server = setupServer(...handlers)

export * from 'msw'
export {server}
