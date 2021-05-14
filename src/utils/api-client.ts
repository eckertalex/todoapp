import * as auth from 'context/auth-context/auth-provider'

const apiURL = process.env.REACT_APP_API_URL

export type ClientRequest<RequestBody> = Omit<RequestInit, 'body'> & {
  data?: RequestBody
  token?: string
}

async function client<RequestBody, ResponseBody>(
  endpoint: string,
  {data, token, headers: customHeaders, ...customConfig}: ClientRequest<RequestBody> = {}
) {
  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers:
      data && token
        ? {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...customHeaders,
          }
        : data
        ? {
            'Content-Type': 'application/json',
            ...customHeaders,
          }
        : token
        ? {
            Authorization: `Bearer ${token}`,
            ...customHeaders,
          }
        : customHeaders,
    ...customConfig,
  }

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async (response) => {
    if (response.status === 401) {
      await auth.logout()
      // refresh the page for them
      window.location.assign(window.location.toString())
      return Promise.reject({message: 'Please re-authenticate.'})
    }
    const data: ResponseBody = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

export {client}
