// pretend this is firebase, netlify, or auth0's code.
// you shouldn't have to implement something like this in your own app

export type UserRequest = {
  username: string
  password: string
}

export type UserResponse = {
  user: {
    username: string
    password: string
    token: string
  }
}

const localStorageKey = '__auth_provider_token__'

async function getToken() {
  // if we were a real auth provider, this is where we would make a request
  // to retrieve the user's token. (It's a bit more complicated than that...
  // but you're probably not an auth provider so you don't need to worry about it).
  return window.localStorage.getItem(localStorageKey)
}

function handleUserResponse({user}: UserResponse) {
  window.localStorage.setItem(localStorageKey, user.token)
  return user
}

function login(user: UserRequest) {
  return client<UserRequest, UserResponse>('login', user).then(handleUserResponse)
}

function register(user: UserRequest) {
  return client<UserRequest, UserResponse>('register', user).then(handleUserResponse)
}

async function logout() {
  window.localStorage.removeItem(localStorageKey)
}

// an auth provider wouldn't use your client, they'd have their own
// so that's why we're not just re-using the client
const authURL = process.env.REACT_APP_AUTH_URL

async function client<RequestBody, ResponseBody>(endpoint: string, data: RequestBody) {
  const config = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'},
  }

  return window.fetch(`${authURL}/${endpoint}`, config).then(async (response) => {
    const data: ResponseBody = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

export {getToken, login, register, logout, localStorageKey}