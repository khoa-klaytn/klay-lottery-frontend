import { createAsyncThunk, createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import keyBy from 'lodash/keyBy'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { bscTokens, arbitrumTokens } from '@pancakeswap/tokens'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import {
  fetchPoolsTimeLimits,
  fetchPoolsTotalStaking,
  fetchPoolsProfileRequirement,
  fetchPoolsStakingLimits,
  fetchPoolsAllowance,
  fetchUserBalances,
  fetchUserPendingRewards,
  fetchUserStakeBalances,
  fetchPublicVaultData,
  fetchPublicFlexibleSideVaultData,
  fetchVaultUser,
  fetchVaultFees,
  fetchFlexibleSideVaultUser,
  getCakeVaultAddress,
  getCakeFlexibleSideVaultAddress,
  getPoolsConfig,
  isLegacyPool,
  getPoolAprByTokenPerSecond,
  getPoolAprByTokenPerBlock,
} from '@pancakeswap/pools'
import { ChainId } from '@pancakeswap/chains'

import {
  PoolsState,
  SerializedPool,
  SerializedVaultFees,
  SerializedCakeVault,
  SerializedLockedVaultUser,
  SerializedVaultUser,
  SerializedLockedCakeVault,
} from 'state/types'
import { Address, erc20ABI } from 'wagmi'
import { isAddress } from 'utils'
import { publicClient } from 'utils/wagmi'
import { getViemClients } from 'utils/viem'
import { fetchTokenUSDValue } from 'utils/llamaPrice'
import { getCakePriceFromOracle } from 'hooks/useCakePrice'
import { fetchTokenAplPrice } from 'utils/fetchTokenAplPrice'

import { resetUserState } from '../global/actions'

export const initialPoolVaultState = Object.freeze({
  totalShares: null,
  totalLockedAmount: null,
  pricePerFullShare: null,
  totalCakeInVault: null,
  fees: {
    performanceFee: null,
    withdrawalFee: null,
    withdrawalFeePeriod: null,
  },
  userData: {
    isLoading: true,
    userShares: null,
    cakeAtLastUserAction: null,
    lastDepositedTime: null,
    lastUserActionTime: null,
    credit: null,
    locked: null,
    lockStartTime: null,
    lockEndTime: null,
    userBoostedShare: null,
    lockedAmount: null,
    currentOverdueFee: null,
    currentPerformanceFee: null,
  },
  creditStartBlock: null,
})

export const initialIfoState = Object.freeze({
  credit: null,
  ceiling: null,
})

const initialState: PoolsState = {
  data: [],
  userDataLoaded: false,
  cakeVault: initialPoolVaultState,
  cakeFlexibleSideVault: initialPoolVaultState,
}

export const fetchCakePoolPublicDataAsync = () => async (dispatch) => {
  const cakePrice = parseFloat(await getCakePriceFromOracle())

  const stakingTokenPrice = cakePrice
  const earningTokenPrice = cakePrice

  dispatch(
    setPoolPublicData({
      sousId: 0,
      data: {
        stakingTokenPrice,
        earningTokenPrice,
      },
    }),
  )
}

export const fetchCakePoolUserDataAsync =
  ({ account, chainId }: { account: string; chainId: ChainId }) =>
  async (dispatch) => {
    const client = publicClient({ chainId: ChainId.BSC })
    const [allowance, stakingTokenBalance] = await client.multicall({
      contracts: [
        {
          abi: erc20ABI,
          address: bscTokens.cake.address,
          functionName: 'allowance',
          args: [account as Address, getCakeVaultAddress(chainId)],
        },
        {
          abi: erc20ABI,
          address: bscTokens.cake.address,
          functionName: 'balanceOf',
          args: [account as Address],
        },
      ],
      allowFailure: false,
    })

    dispatch(
      setPoolUserData({
        sousId: 0,
        data: {
          allowance: new BigNumber(allowance.toString()).toJSON(),
          stakingTokenBalance: new BigNumber(stakingTokenBalance.toString()).toJSON(),
        },
      }),
    )
  }

export const fetchPoolsPublicDataAsync = (chainId: number) => async (dispatch) => {
  try {
    const [block, timeLimits] = await Promise.all([
      getViemClients({ chainId })?.getBlock({ blockTag: 'latest' }),
      fetchPoolsTimeLimits(chainId, getViemClients),
    ])
    const timeLimitsSousIdMap = keyBy(timeLimits, 'sousId')
    const poolsConfig = getPoolsConfig(chainId) || []

    const [totalStakings, profileRequirements] = await Promise.all([
      fetchPoolsTotalStaking(chainId, getViemClients),
      fetchPoolsProfileRequirement(chainId, getViemClients),
    ])

    const totalStakingsSousIdMap = keyBy(totalStakings, 'sousId')

    const liveData: any[] = []

    for (const pool of poolsConfig) {
      const timeLimit = timeLimitsSousIdMap[pool.sousId]
      const totalStaking = totalStakingsSousIdMap[pool.sousId]
      const isPoolEndBlockExceeded =
        block.timestamp > 0 && timeLimit ? block.timestamp > Number(timeLimit.endTimestamp) : false
      const isPoolFinished = pool.isFinished || isPoolEndBlockExceeded

      const stakingTokenAddress = isAddress(pool.stakingToken.address)
      let stakingTokenPrice = 0
      if (stakingTokenAddress && !isPoolFinished) {
        // TODO: Remove this when fetchTokenUSDValue can get APL USD Price
        if (
          pool.stakingToken.chainId === ChainId.ARBITRUM_ONE &&
          pool.stakingToken.address === arbitrumTokens.alp.address
        ) {
          // eslint-disable-next-line no-await-in-loop
          stakingTokenPrice = await fetchTokenAplPrice()
        } else {
          // eslint-disable-next-line no-await-in-loop
          const result = await fetchTokenUSDValue(chainId, [stakingTokenAddress])
          stakingTokenPrice = +result.get(stakingTokenAddress) || 0
        }
      }

      const earningTokenAddress = isAddress(pool.earningToken.address)
      let earningTokenPrice = 0
      if (earningTokenAddress && !isPoolFinished) {
        // eslint-disable-next-line no-await-in-loop
        const result = await fetchTokenUSDValue(chainId, [earningTokenAddress])
        earningTokenPrice = +result.get(earningTokenAddress) || 0
      }
      const totalStaked = getBalanceNumber(new BigNumber(totalStaking.totalStaked), pool.stakingToken.decimals)
      const apr = !isPoolFinished
        ? isLegacyPool(pool)
          ? getPoolAprByTokenPerBlock(stakingTokenPrice, earningTokenPrice, totalStaked, parseFloat(pool.tokenPerBlock))
          : getPoolAprByTokenPerSecond(
              stakingTokenPrice,
              earningTokenPrice,
              totalStaked,
              parseFloat(pool.tokenPerSecond),
            )
        : 0

      const profileRequirement = profileRequirements[pool.sousId] ? profileRequirements[pool.sousId] : undefined

      liveData.push({
        ...timeLimit,
        ...totalStaking,
        profileRequirement,
        stakingTokenPrice,
        earningTokenPrice,
        apr,
        isFinished: isPoolFinished,
      })
    }

    dispatch(setPoolsPublicData(liveData || []))
  } catch (error) {
    console.error('[Pools Action] error when getting public data', error)
  }
}

export const fetchPoolsStakingLimitsAsync = (chainId: ChainId) => async (dispatch, getState) => {
  const poolsWithStakingLimit = getState()
    .pools.data.filter(({ stakingLimit }) => stakingLimit !== null && stakingLimit !== undefined)
    .map((pool) => pool.sousId)

  try {
    const stakingLimits = await fetchPoolsStakingLimits({ poolsWithStakingLimit, chainId, provider: getViemClients })

    const poolsConfig = getPoolsConfig(chainId)
    const stakingLimitData = poolsConfig?.map((pool) => {
      if (poolsWithStakingLimit.includes(pool.sousId)) {
        return { sousId: pool.sousId }
      }
      const { stakingLimit, numberSecondsForUserLimit } = stakingLimits[pool.sousId] || {
        stakingLimit: BIG_ZERO,
        numberSecondsForUserLimit: 0,
      }
      return {
        sousId: pool.sousId,
        stakingLimit: stakingLimit.toJSON(),
        numberSecondsForUserLimit,
      }
    })
    if (stakingLimitData) {
      dispatch(setPoolsPublicData(stakingLimitData))
    }
  } catch (error) {
    console.error('[Pools Action] error when getting staking limits', error)
  }
}

export const fetchPoolsUserDataAsync = createAsyncThunk<
  { sousId: number; allowance: any; stakingTokenBalance: any; stakedBalance: any; pendingReward: any }[],
  {
    account: string
    chainId: ChainId
  }
>('pool/fetchPoolsUserData', async ({ account, chainId }, { rejectWithValue }) => {
  try {
    const [allowances, stakingTokenBalances, stakedBalances, pendingRewards] = await Promise.all([
      fetchPoolsAllowance({ account, chainId, provider: getViemClients }),
      fetchUserBalances({ account, chainId, provider: getViemClients }),
      fetchUserStakeBalances({ account, chainId, provider: getViemClients }),
      fetchUserPendingRewards({ account, chainId, provider: getViemClients }),
    ])

    const poolsConfig = getPoolsConfig(chainId)
    const userData = poolsConfig?.map((pool) => ({
      sousId: pool.sousId,
      allowance: allowances[pool.sousId],
      stakingTokenBalance: stakingTokenBalances[pool.sousId],
      stakedBalance: stakedBalances[pool.sousId],
      pendingReward: pendingRewards[pool.sousId],
    }))
    return userData
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const updateUserAllowance = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; account: string; chainId: ChainId }
>('pool/updateUserAllowance', async ({ sousId, account, chainId }) => {
  const allowances = await fetchPoolsAllowance({ account, chainId, provider: getViemClients })
  return { sousId, field: 'allowance', value: allowances[sousId] }
})

export const updateUserBalance = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; account: string; chainId: ChainId }
>('pool/updateUserBalance', async ({ sousId, account, chainId }) => {
  const tokenBalances = await fetchUserBalances({ account, chainId, provider: getViemClients })
  return { sousId, field: 'stakingTokenBalance', value: tokenBalances[sousId] }
})

export const updateUserStakedBalance = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; account: string; chainId: ChainId }
>('pool/updateUserStakedBalance', async ({ sousId, account, chainId }) => {
  const stakedBalances = await fetchUserStakeBalances({ account, chainId, provider: getViemClients })
  return { sousId, field: 'stakedBalance', value: stakedBalances[sousId] }
})

export const updateUserPendingReward = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; account: string; chainId: ChainId }
>('pool/updateUserPendingReward', async ({ sousId, account, chainId }) => {
  const pendingRewards = await fetchUserPendingRewards({ chainId, account, provider: getViemClients })
  return { sousId, field: 'pendingReward', value: pendingRewards[sousId] }
})

export const fetchCakeVaultPublicData = createAsyncThunk<SerializedLockedCakeVault, ChainId>(
  'cakeVault/fetchPublicData',
  async (chainId) => {
    const publicVaultInfo = await fetchPublicVaultData({ chainId, provider: getViemClients })
    return publicVaultInfo
  },
)

export const fetchCakeFlexibleSideVaultPublicData = createAsyncThunk<SerializedCakeVault, ChainId>(
  'cakeFlexibleSideVault/fetchPublicData',
  async (chainId) => {
    const publicVaultInfo = await fetchPublicFlexibleSideVaultData({ chainId, provider: getViemClients })
    return publicVaultInfo
  },
)

export const fetchCakeVaultFees = createAsyncThunk<SerializedVaultFees, ChainId>(
  'cakeVault/fetchFees',
  async (chainId) => {
    const vaultFees = await fetchVaultFees({
      chainId,
      provider: getViemClients,
      cakeVaultAddress: getCakeVaultAddress(chainId),
    })
    return vaultFees
  },
)

export const fetchCakeFlexibleSideVaultFees = createAsyncThunk<SerializedVaultFees, ChainId>(
  'cakeFlexibleSideVault/fetchFees',
  async (chainId) => {
    const vaultFees = await fetchVaultFees({
      chainId,
      provider: getViemClients,
      cakeVaultAddress: getCakeFlexibleSideVaultAddress(chainId),
    })
    return vaultFees
  },
)

export const fetchCakeVaultUserData = createAsyncThunk<
  SerializedLockedVaultUser,
  { account: Address; chainId: ChainId }
>('cakeVault/fetchUser', async ({ account, chainId }) => {
  const userData = await fetchVaultUser({ account, chainId, provider: getViemClients })
  return userData
})

export const fetchCakeFlexibleSideVaultUserData = createAsyncThunk<
  SerializedVaultUser,
  { account: Address; chainId: ChainId }
>('cakeFlexibleSideVault/fetchUser', async ({ account, chainId }) => {
  const userData = await fetchFlexibleSideVaultUser({ chainId, account, provider: getViemClients })
  return userData
})

export const PoolsSlice = createSlice({
  name: 'Pools',
  initialState,
  reducers: {
    setInitialPoolConfig: (state, action) => {
      const { chainId } = action.payload
      const poolsConfig = getPoolsConfig(chainId) || []
      state.data = [...poolsConfig]
      state.userDataLoaded = false
      state.cakeVault = initialPoolVaultState
      state.cakeFlexibleSideVault = initialPoolVaultState
    },
    setPoolPublicData: (state, action) => {
      const { sousId } = action.payload
      const poolIndex = state.data.findIndex((pool) => pool.sousId === sousId)
      state.data[poolIndex] = {
        ...state.data[poolIndex],
        ...action.payload.data,
      }
    },
    setPoolUserData: (state, action) => {
      const { sousId } = action.payload
      state.data = state.data.map((pool) => {
        if (pool.sousId === sousId) {
          return { ...pool, userDataLoaded: true, userData: action.payload.data }
        }
        return pool
      })
    },
    setPoolsPublicData: (state, action) => {
      const livePoolsData: SerializedPool[] = action.payload
      const livePoolsSousIdMap = keyBy(livePoolsData, 'sousId')
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsSousIdMap[pool.sousId]
        return { ...pool, ...livePoolData }
      })
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetUserState, (state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state.data = state.data.map(({ userData, ...pool }) => {
        return { ...pool }
      })
      state.userDataLoaded = false
      state.cakeVault = { ...state.cakeVault, userData: initialPoolVaultState.userData }
      state.cakeFlexibleSideVault = { ...state.cakeFlexibleSideVault, userData: initialPoolVaultState.userData }
    })
    builder.addCase(
      fetchPoolsUserDataAsync.fulfilled,
      (
        state,
        action: PayloadAction<
          { sousId: number; allowance: any; stakingTokenBalance: any; stakedBalance: any; pendingReward: any }[]
        >,
      ) => {
        const userData = action.payload
        const userDataSousIdMap = keyBy(userData, 'sousId')
        state.data = state.data.map((pool) => ({
          ...pool,
          userDataLoaded: true,
          userData: userDataSousIdMap[pool.sousId],
        }))
        state.userDataLoaded = true
      },
    )
    builder.addCase(fetchPoolsUserDataAsync.rejected, (state, action) => {
      console.error('[Pools Action] Error fetching pool user data', action.payload)
    })
    // Vault public data that updates frequently
    builder.addCase(fetchCakeVaultPublicData.fulfilled, (state, action: PayloadAction<SerializedLockedCakeVault>) => {
      state.cakeVault = { ...state.cakeVault, ...action.payload }
    })
    builder.addCase(
      fetchCakeFlexibleSideVaultPublicData.fulfilled,
      (state, action: PayloadAction<SerializedCakeVault>) => {
        state.cakeFlexibleSideVault = { ...state.cakeFlexibleSideVault, ...action.payload }
      },
    )
    // Vault fees
    builder.addCase(fetchCakeVaultFees.fulfilled, (state, action: PayloadAction<SerializedVaultFees>) => {
      const fees = action.payload
      state.cakeVault = { ...state.cakeVault, fees }
    })
    builder.addCase(fetchCakeFlexibleSideVaultFees.fulfilled, (state, action: PayloadAction<SerializedVaultFees>) => {
      const fees = action.payload
      state.cakeFlexibleSideVault = { ...state.cakeFlexibleSideVault, fees }
    })
    // Vault user data
    builder.addCase(fetchCakeVaultUserData.fulfilled, (state, action: PayloadAction<SerializedLockedVaultUser>) => {
      const userData = action.payload
      state.cakeVault = { ...state.cakeVault, userData }
    })
    builder.addCase(
      fetchCakeFlexibleSideVaultUserData.fulfilled,
      (state, action: PayloadAction<SerializedVaultUser>) => {
        const userData = action.payload
        state.cakeFlexibleSideVault = { ...state.cakeFlexibleSideVault, userData }
      },
    )
    builder.addMatcher(
      isAnyOf(
        updateUserAllowance.fulfilled,
        updateUserBalance.fulfilled,
        updateUserStakedBalance.fulfilled,
        updateUserPendingReward.fulfilled,
      ),
      (state, action: PayloadAction<{ sousId: number; field: string; value: any }>) => {
        const { field, value, sousId } = action.payload
        const index = state.data.findIndex((p) => p.sousId === sousId)

        if (index >= 0) {
          state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
        }
      },
    )
  },
})

// Actions
export const { setPoolsPublicData, setPoolPublicData, setPoolUserData, setInitialPoolConfig } = PoolsSlice.actions

export default PoolsSlice.reducer
