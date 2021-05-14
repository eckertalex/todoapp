import React from 'react'

function useSafeDispatch<Action>(dispatch: React.Dispatch<Action>) {
  const mounted = React.useRef(false)

  React.useLayoutEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  return React.useCallback(
    (...args: Parameters<React.Dispatch<Action>>) => (mounted.current ? dispatch(...args) : void 0),
    [dispatch]
  )
}

type AsyncState<DataType> =
  | {
      status: 'idle' | 'pending'
      data: null
      error: null
    }
  | {
      status: 'resolved'
      data: DataType
      error: null
    }
  | {
      status: 'rejected'
      data: null
      error: Error
    }

type AsyncAction<DataType> =
  | {type: 'reset'}
  | {type: 'pending'}
  | {type: 'resolved'; data: DataType}
  | {type: 'rejected'; error: Error}

function useAsync<DataType>(initialState?: AsyncState<DataType>) {
  const initialStateRef = React.useRef<AsyncState<DataType>>({
    status: 'idle',
    data: null,
    error: null,
    ...initialState,
  })

  const [{status, data, error}, unsafeDispatch] = React.useReducer(
    (state: AsyncState<DataType>, action: AsyncAction<DataType>) => {
      switch (action.type) {
        case 'reset': {
          return initialStateRef.current
        }
        case 'pending': {
          return {status: 'pending' as const, data: null, error: null}
        }
        case 'resolved': {
          return {status: 'resolved' as const, data: action.data, error: null}
        }
        case 'rejected': {
          return {status: 'rejected' as const, data: null, error: action.error}
        }
        default: {
          throw new Error(`Unhandled action: ${JSON.stringify(action)}`)
        }
      }
    },
    initialStateRef.current
  )

  const dispatch = useSafeDispatch<AsyncAction<DataType>>(unsafeDispatch)

  const setData = React.useCallback((data: DataType) => dispatch({type: 'resolved', data}), [dispatch])
  const setError = React.useCallback((error: Error) => dispatch({type: 'rejected', error}), [dispatch])
  const reset = React.useCallback(() => dispatch({type: 'reset'}), [dispatch])

  const run = React.useCallback(
    (promise: Promise<DataType>) => {
      if (!promise || !promise.then) {
        throw new Error(
          `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`
        )
      }
      dispatch({type: 'pending'})
      promise.then(
        (data: DataType) => {
          setData(data)
        },
        (error: Error) => {
          setError(error)
        }
      )
    },
    [dispatch, setData, setError]
  )

  return {
    // using the same names that react-query uses for convenience
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  }
}

export {useAsync}
