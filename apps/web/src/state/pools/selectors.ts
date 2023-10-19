import { createSelector } from '@reduxjs/toolkit'
import { State, VaultKey } from '../types'
import { transformPool, transformVault } from './helpers'
import { initialPoolVaultState } from './index'
import { getVaultPosition, VaultPosition } from '../../utils/cakePool'

const selectPoolsData = (state: State) => state.pools.data
const selectPoolData = (sousId) => (state: State) => state.pools.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.pools.userDataLoaded
const selectVault = (key: VaultKey) => (state: State) => key ? state.pools[key] : initialPoolVaultState

export const makePoolWithUserDataLoadingSelector = (sousId) =>
  createSelector([selectPoolData(sousId), selectUserDataLoaded], (pool, userDataLoaded) => {
    return { pool: transformPool(pool), userDataLoaded }
  })

export const poolsWithUserDataLoadingSelector = createSelector(
  [selectPoolsData, selectUserDataLoaded],
  (pools, userDataLoaded) => {
    return { pools: pools.map(transformPool), userDataLoaded }
  },
)

export const makeVaultPoolByKey = (key) => createSelector([selectVault(key)], (vault) => transformVault(key, vault))

export const poolsWithVaultSelector = createSelector(
  [
    poolsWithUserDataLoadingSelector,
    makeVaultPoolByKey(VaultKey.CakeVault),
    makeVaultPoolByKey(VaultKey.CakeFlexibleSideVault),
  ],
  (poolsWithUserDataLoading, deserializedLockedCakeVault, deserializedFlexibleSideCakeVault) => {
    const { pools, userDataLoaded } = poolsWithUserDataLoading
    const cakePool = pools.find((pool) => !pool.isFinished && pool.sousId === 0)
    const withoutCakePool = pools.filter((pool) => pool.sousId !== 0)

    const cakeAutoVault = cakePool && {
      ...cakePool,
      ...deserializedLockedCakeVault,
      vaultKey: VaultKey.CakeVault,
      userData: { ...cakePool.userData, ...deserializedLockedCakeVault.userData },
    }

    const lockedVaultPosition = getVaultPosition(deserializedLockedCakeVault.userData)
    const hasFlexibleSideSharesStaked = deserializedFlexibleSideCakeVault.userData.userShares.gt(0)

    const cakeAutoFlexibleSideVault =
      cakePool && (lockedVaultPosition > VaultPosition.Flexible || hasFlexibleSideSharesStaked)
        ? [
            {
              ...cakePool,
              ...deserializedFlexibleSideCakeVault,
              vaultKey: VaultKey.CakeFlexibleSideVault,
              userData: { ...cakePool.userData, ...deserializedFlexibleSideCakeVault.userData },
            },
          ]
        : []

    const allPools = [...cakeAutoFlexibleSideVault, ...withoutCakePool]
    if (cakeAutoVault) {
      allPools.unshift(cakeAutoVault)
    }
    return { pools: allPools, userDataLoaded }
  },
)

export const makeVaultPoolWithKeySelector = (vaultKey) =>
  createSelector(poolsWithVaultSelector, ({ pools }) => pools.find((p) => p.vaultKey === vaultKey))
