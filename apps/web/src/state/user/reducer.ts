import { createReducer } from '@reduxjs/toolkit'
import { SerializedWrappedToken } from '@sweepstakes/token-lists'
import omitBy from 'lodash/omitBy'
import { DEFAULT_DEADLINE_FROM_NOW } from '../../config/constants'
import { updateVersion } from '../global/actions'
import {
  addSerializedPair,
  addSerializedToken,
  addWatchlistPool,
  addWatchlistToken,
  FarmStakedOnly,
  removeSerializedPair,
  removeSerializedToken,
  SerializedPair,
  updateGasPrice,
  updateUserDeadline,
  updateUserFarmStakedOnly,
  updateUserFarmsViewMode,
  updateUserPoolStakedOnly,
  updateUserPoolsViewMode,
  ViewMode,
  updateUserUsernameVisibility,
  setIsExchangeChartDisplayed,
  setSubgraphHealthIndicatorDisplayed,
  updateUserLimitOrderAcceptedWarning,
} from './actions'
import { GAS_PRICE_GWEI } from '../types'

const currentTimestamp = () => Date.now()

export interface UserState {
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number

  // deadline set by user in minutes, used in all txns
  userDeadline: number

  tokens: {
    [chainId: number]: {
      [address: string]: SerializedWrappedToken
    }
  }

  pairs: {
    [chainId: number]: {
      // keyed by token0Address:token1Address
      [key: string]: SerializedPair
    }
  }
  isExchangeChartDisplayed: boolean
  isSubgraphHealthIndicatorDisplayed: boolean
  userFarmStakedOnly: FarmStakedOnly
  userPoolStakedOnly: boolean
  userPoolsViewMode: ViewMode
  userFarmsViewMode: ViewMode
  userLimitOrderAcceptedWarning: boolean
  userUsernameVisibility: boolean
  gasPrice: string
  watchlistTokens: string[]
  watchlistPools: string[]
  hideTimestampPhishingWarningBanner: number
}

function pairKey(token0Address: string, token1Address: string) {
  return `${token0Address};${token1Address}`
}

export const initialState: UserState = {
  userDeadline: DEFAULT_DEADLINE_FROM_NOW,
  tokens: {},
  pairs: {},
  isExchangeChartDisplayed: true,
  isSubgraphHealthIndicatorDisplayed: false,
  userFarmStakedOnly: FarmStakedOnly.ON_FINISHED,
  userPoolStakedOnly: false,
  userPoolsViewMode: ViewMode.TABLE,
  userFarmsViewMode: ViewMode.TABLE,
  userLimitOrderAcceptedWarning: false,
  userUsernameVisibility: false,
  gasPrice: GAS_PRICE_GWEI.rpcDefault,
  watchlistTokens: [],
  watchlistPools: [],
  hideTimestampPhishingWarningBanner: null,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateVersion, (state) => {
      // slippage is'nt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard

      // deadline isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (typeof state.userDeadline !== 'number') {
        state.userDeadline = DEFAULT_DEADLINE_FROM_NOW
      }

      state.lastUpdateVersionTimestamp = currentTimestamp()
    })
    .addCase(updateUserDeadline, (state, action) => {
      state.userDeadline = action.payload.userDeadline
    })
    .addCase(addSerializedToken, (state, { payload: { serializedToken } }) => {
      if (!state.tokens) {
        state.tokens = {}
      }
      state.tokens[serializedToken.chainId] = state.tokens[serializedToken.chainId] || {}
      state.tokens[serializedToken.chainId][serializedToken.address] = serializedToken
    })
    .addCase(removeSerializedToken, (state, { payload: { address, chainId } }) => {
      if (!state.tokens) {
        state.tokens = {}
      }
      if (state.tokens[chainId]) {
        state.tokens[chainId] = omitBy(state.tokens[chainId], (value, key) => key === address)
      } else {
        state.tokens[chainId] = {}
      }
    })
    .addCase(addSerializedPair, (state, { payload: { serializedPair } }) => {
      if (
        serializedPair.token0.chainId === serializedPair.token1.chainId &&
        serializedPair.token0.address !== serializedPair.token1.address
      ) {
        const { chainId } = serializedPair.token0
        state.pairs[chainId] = state.pairs[chainId] || {}
        state.pairs[chainId][pairKey(serializedPair.token0.address, serializedPair.token1.address)] = serializedPair
      }
    })
    .addCase(removeSerializedPair, (state, { payload: { chainId, tokenAAddress, tokenBAddress } }) => {
      if (state.pairs[chainId]) {
        const tokenAToB = pairKey(tokenAAddress, tokenBAddress)
        const tokenBToA = pairKey(tokenBAddress, tokenAAddress)
        // just delete both keys if either exists
        state.pairs[chainId] = omitBy(state.pairs[chainId], (value, key) => key === tokenAToB || key === tokenBToA)
      }
    })
    .addCase(updateUserFarmStakedOnly, (state, { payload: { userFarmStakedOnly } }) => {
      state.userFarmStakedOnly = userFarmStakedOnly
    })
    .addCase(updateUserPoolStakedOnly, (state, { payload: { userPoolStakedOnly } }) => {
      state.userPoolStakedOnly = userPoolStakedOnly
    })
    .addCase(updateUserPoolsViewMode, (state, { payload: { userPoolsViewMode } }) => {
      state.userPoolsViewMode = userPoolsViewMode
    })
    .addCase(updateUserFarmsViewMode, (state, { payload: { userFarmsViewMode } }) => {
      state.userFarmsViewMode = userFarmsViewMode
    })
    .addCase(updateUserLimitOrderAcceptedWarning, (state, { payload: { userAcceptedRisk } }) => {
      state.userLimitOrderAcceptedWarning = userAcceptedRisk
    })
    .addCase(updateUserUsernameVisibility, (state, { payload: { userUsernameVisibility } }) => {
      state.userUsernameVisibility = userUsernameVisibility
    })
    .addCase(updateGasPrice, (state, action) => {
      state.gasPrice = action.payload.gasPrice
    })
    .addCase(addWatchlistToken, (state, { payload: { address } }) => {
      // state.watchlistTokens can be undefined for pre-loaded localstorage user state
      const tokenWatchlist = state.watchlistTokens ?? []
      if (!tokenWatchlist.includes(address)) {
        state.watchlistTokens = [...tokenWatchlist, address]
      } else {
        // Remove token from watchlist
        const newTokens = state.watchlistTokens.filter((x) => x !== address)
        state.watchlistTokens = newTokens
      }
    })
    .addCase(addWatchlistPool, (state, { payload: { address } }) => {
      // state.watchlistPools can be undefined for pre-loaded localstorage user state
      const poolsWatchlist = state.watchlistPools ?? []
      if (!poolsWatchlist.includes(address)) {
        state.watchlistPools = [...poolsWatchlist, address]
      } else {
        // Remove pool from watchlist
        const newPools = state.watchlistPools.filter((x) => x !== address)
        state.watchlistPools = newPools
      }
    })
    .addCase(setIsExchangeChartDisplayed, (state, { payload }) => {
      state.isExchangeChartDisplayed = payload
    })
    .addCase(setSubgraphHealthIndicatorDisplayed, (state, { payload }) => {
      state.isSubgraphHealthIndicatorDisplayed = payload
    }),
)
