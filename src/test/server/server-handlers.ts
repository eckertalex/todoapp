import {DefaultRequestBody, RequestParams, rest, RestRequest} from 'msw'
import {match} from 'node-match-path'
// import * as todosDB from 'test/data/todos'
import * as usersDB from 'test/data/users'

let sleep = () => {}
if (process.env.CI) {
  sleep = () => Promise.resolve()
} else if (process.env.NODE_ENV === 'test') {
  sleep = () => Promise.resolve()
} else {
  sleep = (
    t = Math.random() * ls('__todoapp_variable_request_time__', 400) + ls('__todoapp_min_request_time__', 400)
  ) => new Promise((resolve) => setTimeout(resolve, t))
}

function ls(key: string, defaultVal: number) {
  const lsVal = window.localStorage.getItem(key)
  let val
  if (lsVal) {
    val = Number(lsVal)
  }
  return val && Number.isFinite(val) ? val : defaultVal
}

const apiUrl = process.env.REACT_APP_API_URL
const authUrl = process.env.REACT_APP_AUTH_URL

const handlers = [
  rest.post<{username: string; password: string}>(`${authUrl}/login`, async (req, res, ctx) => {
    const {username, password} = req.body
    const user = await usersDB.authenticate({username, password})
    return res(ctx.json({user}))
  }),

  rest.post<{username: string; password: string}>(`${authUrl}/register`, async (req, res, ctx) => {
    const {username, password} = req.body
    const userFields = {username, password}
    await usersDB.create(userFields)
    let user
    try {
      user = await usersDB.authenticate(userFields)
    } catch (error) {
      return res(ctx.status(400), ctx.json({status: 400, message: error.message}))
    }
    return res(ctx.json({user}))
  }),

  rest.get(`${apiUrl}/me`, async (req, res, ctx) => {
    const user = await getUser(req)
    const token = getToken(req)
    return res(ctx.json({user: {...user, token}}))
  }),

  // rest.get(`${apiUrl}/todos`, async (_, res, ctx) => {
  //   const todos = todosDB.getAll()
  //   res(ctx.json(todos))
  // }),

  // rest.post<{text: string}>(`${apiUrl}/todos`, async (req, res, ctx) => {
  //   if (!req.body || !req.body.text) {
  //     res(ctx.status(400), ctx.json({errorMessage: 'Invalid todo format'}))
  //   }

  //   todosDB.create({
  //     text: req.body.text,
  //   })
  //   res(ctx.status(204))
  // }),

  // rest.put<{text: string; completed: boolean}, any, {todoId: string}>(
  //   `${apiUrl}/todos/:todoId`,
  //   async (req, res, ctx) => {
  //     const {todoId} = req.params
  //     if (!todosDB.get(todoId)) {
  //       res(ctx.status(404), ctx.json({errorMessage: 'todoId not found'}))
  //     }

  //     todosDB.update({
  //       id: todoId,
  //       text: req.body.text,
  //       completed: req.body.completed,
  //     })
  //     res(ctx.status(204))
  //   }
  // ),

  // rest.delete<any, any, {todoId: string}>(`${apiUrl}/todos/:todoId`, async (req, res, ctx) => {
  //   const {todoId} = req.params
  //   if (!todosDB.get(todoId)) {
  //     res(ctx.status(404), ctx.json({errorMessage: 'todoId not found'}))
  //     return
  //   }

  //   todosDB.remove(todoId)
  //   res(ctx.status(204))
  // }),
].map((handler) => {
  // @ts-expect-error
  const originalResolver = handler.resolver
  // @ts-expect-error
  handler.resolver = async function resolver(req, res, ctx) {
    try {
      if (shouldFail(req)) {
        throw new Error('Request failure (for testing purposes).')
      }
      const result = await originalResolver(req, res, ctx)
      return result
    } catch (error) {
      const status = error.status || 500
      return res(ctx.status(status), ctx.json({status, message: error.message || 'Unknown Error'}))
    } finally {
      await sleep()
    }
  }
  return handler
})

function shouldFail(req: any) {
  if (JSON.stringify(req.body)?.includes('FAIL')) return true
  if (req.url.searchParams.toString()?.includes('FAIL')) return true
  if (process.env.NODE_ENV === 'test') return false
  const failureRate = Number(window.localStorage.getItem('__todoapp_failure_rate__') || 0)
  if (Math.random() < failureRate) return true
  if (requestMatchesFailConfig(req)) return true

  return false
}

function requestMatchesFailConfig(req: any) {
  function configMatches({requestMethod, urlMatch}: {requestMethod: string; urlMatch: string}) {
    return (requestMethod === 'ALL' || req.method === requestMethod) && match(urlMatch, req.url.pathname).matches
  }
  try {
    const failConfig: {requestMethod: string; urlMatch: string}[] = JSON.parse(
      window.localStorage.getItem('__todoapp_request_fail_config__') || '[]'
    )
    if (failConfig.some(configMatches)) return true
  } catch (error) {
    window.localStorage.removeItem('__todoapp_request_fail_config__')
  }
  return false
}

function getToken(req: RestRequest<DefaultRequestBody, RequestParams>) {
  return req.headers.get('Authorization')?.replace('Bearer ', '')
}

async function getUser(req: RestRequest<DefaultRequestBody, RequestParams>) {
  const token = getToken(req)
  if (!token) {
    const error = new Error('A token must be provided')
    ;(error as any).status = 401
    throw error
  }
  let userId
  try {
    userId = atob(token)
  } catch (e) {
    const error = new Error('Invalid token. Please login again.')
    ;(error as any).status = 401
    throw error
  }
  const user = await usersDB.read(userId)
  return user
}

export {handlers}
