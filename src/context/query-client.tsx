import React from 'react'
import {QueryClientProvider as RQClient, QueryClient} from 'react-query'

function useConstant<ReturnType>(fn: () => ReturnType) {
  return React.useState(fn)[0]
}

function QueryClientProvider({children}: {children: React.ReactNode}) {
  const queryClient = useConstant<QueryClient>(() => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry(failureCount: number, error: any) {
            if (error.status === 404) return false
            else if (failureCount < 2) return true
            else return false
          },
        },
        mutations: {
          onError: (_err, _variables, recover) => (typeof recover === 'function' ? recover() : null),
        },
      },
    })

    ;(window as any).__devtools?.setQueryClient?.(queryClient)

    return queryClient
  })

  return <RQClient client={queryClient}>{children}</RQClient>
}

export {QueryClientProvider}
