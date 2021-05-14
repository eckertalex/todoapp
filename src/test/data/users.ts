type User = {
  id: string
  username: string
  password?: string
  passwordHash: string
}

const usersKey = '__todoapp_users__'
let users: Record<string, User> = {}
const persist = () => window.localStorage.setItem(usersKey, JSON.stringify(users))
const load = () => Object.assign(users, JSON.parse(window.localStorage.getItem(usersKey) ?? ''))

// initialize
try {
  load()
} catch (error) {
  persist()
  // ignore json parse error
}

;(window as any).__todoapp = (window as any).__todoapp || {}
;(window as any).__todoapp.purgeUsers = () => {
  Object.keys(users).forEach((key) => {
    delete users[key]
  })
  persist()
}

function validateUserForm({username, password}: Omit<User, 'id' | 'passwordHash'>) {
  if (!username) {
    const error = new Error('A username is required')
    ;(error as any).status = 400
    throw error
  }
  if (!password) {
    const error = new Error('A password is required')
    ;(error as any).status = 400
    throw error
  }
}

async function authenticate({username, password}: {username: string; password: string}) {
  validateUserForm({username, password})
  const id = hash(username)
  const user = users[id] || {}
  if (user.passwordHash === hash(password ?? '')) {
    return {...sanitizeUser(user), token: btoa(user.id)}
  }
  const error = new Error('Invalid username or password')
  ;(error as any).status = 400
  throw error
}

async function create({username, password}: {username: string; password: string}) {
  validateUserForm({username, password})
  const id = hash(username)
  const passwordHash = hash(password ?? '')
  if (users[id]) {
    const error = new Error(`Cannot create a new user with the username "${username}"`)
    ;(error as any).status = 400
    throw error
  }
  users[id] = {id, username, passwordHash}
  persist()
  return read(id)
}

async function read(id: string) {
  validateUser(id)
  return sanitizeUser(users[id])
}

function sanitizeUser(user: User) {
  const {passwordHash, ...rest} = user
  return rest
}

async function update(id: string, updates: User) {
  validateUser(id)
  Object.assign(users[id], updates)
  persist()
  return read(id)
}

// this would be called `delete` except that's a reserved word in JS :-(
async function remove(id: string) {
  validateUser(id)
  delete users[id]
  persist()
}

function validateUser(id: string) {
  load()
  if (!users[id]) {
    const error = new Error(`No user with the id "${id}"`)
    ;(error as any).status = 404
    throw error
  }
}

function hash(str: string) {
  var hash = 5381,
    i = str.length

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }
  return String(hash >>> 0)
}

async function reset() {
  users = {}
  persist()
}

export {authenticate, create, read, update, remove, reset}
