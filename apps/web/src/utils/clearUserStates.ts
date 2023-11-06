import { configureScope } from '@sentry/nextjs'
import { Dispatch } from '@reduxjs/toolkit'
import { resetUserState } from 'state/global/actions'
import { LS_ORDERS } from './localStorageOrders'
import getLocalStorageItemKeys from './getLocalStorageItemKeys'

export const clearUserStates = (
  dispatch: Dispatch<any>,
  {
    chainId,
    newChainId,
  }: {
    chainId?: number
    newChainId?: number
  },
) => {
  dispatch(resetUserState({ chainId, newChainId }))
  configureScope((scope) => scope.setUser(null))
  const lsOrderKeys = getLocalStorageItemKeys(LS_ORDERS)
  lsOrderKeys.forEach((lsOrderKey) => window?.localStorage?.removeItem(lsOrderKey))
}
