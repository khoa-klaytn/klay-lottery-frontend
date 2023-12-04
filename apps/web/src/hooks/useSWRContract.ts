/* eslint-disable no-param-reassign */
import { FetchStatus, TFetchStatus } from 'config/constants/types'
import { KeyedMutator, Middleware } from 'swr'
import { BlockingData } from 'swr/_internal'

declare module 'swr' {
  interface SWRResponse<Data = any, Error = any, Config = any> {
    data: BlockingData<Data, Config> extends true ? Data : Data | undefined
    error: Error | undefined
    mutate: KeyedMutator<Data>
    isValidating: boolean
    isLoading: BlockingData<Data, Config> extends true ? false : boolean
    // Add global fetchStatus to SWRResponse
    status: TFetchStatus
  }
}

export const fetchStatusMiddleware: Middleware = (useSWRNext) => {
  return (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config)
    return Object.defineProperty(swr, 'status', {
      get() {
        let status: TFetchStatus = FetchStatus.Idle
        const isDataUndefined = typeof swr.data === 'undefined'

        if (!swr.isValidating && !swr.error && isDataUndefined) {
          status = FetchStatus.Idle
        } else if (swr.isValidating && !swr.error && isDataUndefined) {
          status = FetchStatus.Fetching
        } else if (!isDataUndefined) {
          status = FetchStatus.Fetched
        } else if (swr.error && isDataUndefined) {
          status = FetchStatus.Failed
        }
        return status
      },
    })
  }
}

export const immutableMiddleware: Middleware = (useSWRNext) => (key, fetcher, config) => {
  config.revalidateOnFocus = false
  config.revalidateIfStale = false
  config.revalidateOnReconnect = false
  return useSWRNext(key, fetcher, config)
}
