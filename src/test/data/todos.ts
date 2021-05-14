import {nanoid} from 'nanoid'
import data from 'test/data/todos-data.json'

type Todo = {
  id: string
  text: string
  completed: boolean
}

let todosData = data.map((d) => ({
  id: nanoid(),
  ...d,
}))

let todos: Todo[] = [...todosData]

async function create({text}: {text: string}) {
  const todo = {id: nanoid(), completed: false, text}
  todos = [...todos, todo]
  return todo
}

async function getAll() {
  return todos
}

async function get(todoId: string) {
  return todos.find((todo) => todo.id === todoId)
}

async function update(newTodo: Todo) {
  return todos.map((todo) => {
    return todo.id === newTodo.id ? newTodo : todo
  })
}

async function remove(todoId: string) {
  return todos.filter((todo) => todo.id !== todoId)
}

async function reset() {
  todos = [...todosData]
}

export {create, getAll, get, update, remove, reset}
