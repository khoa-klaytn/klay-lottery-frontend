import { ChainId } from '@sweepstakes/chains'
import addresses from 'config/constants/contracts'
import type { Address } from 'viem'

export interface Addresses {
  [chainId: number]: Address
}

export const getAddressFromMap = (address: Addresses, chainId?: number): Address => {
  return address[chainId]
    ? address[chainId]
    : process.env.NODE_ENV === 'development'
    ? address[ChainId.KLAYTN_TESTNET]
    : address[ChainId.KLAYTN]
}

export const getAddressFromMapNoFallback = (address: Addresses, chainId?: number): Address | null => {
  return address[chainId]
}

export const getAccessControlAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.accessControl, chainId)
}

export const getMulticallAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.multiCall, chainId)
}
export const getSSLotteryAddress = (chainId: number) => {
  return getAddressFromMap(addresses.ssLottery, chainId)
}
export const getSweepStakesProfileAddress = () => {
  return getAddressFromMap(addresses.pancakeProfile)
}
export const getPointCenterIfoAddress = () => {
  return getAddressFromMap(addresses.pointCenterIfo)
}
export const getCakeVaultAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.cakeVault, chainId)
}

export const getCakeFlexibleSideVaultAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.cakeFlexibleSideVault, chainId)
}

export const getZapAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.zap, chainId)
}

export const getNonBscVaultAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.nonBscVault, chainId)
}

export const getStableSwapNativeHelperAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.stableSwapNativeHelper, chainId)
}

export const getTradingRewardAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.tradingReward, chainId)
}

export const getV3AirdropAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.v3Airdrop, chainId)
}

export const getTradingRewardTopTradesAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.tradingRewardTopTrades, chainId)
}

export const getVCakeAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.vCake, chainId)
}

export const getRevenueSharingPoolAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.revenueSharingPool, chainId)
}

export const getAnniversaryAchievementAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.anniversaryAchievement, chainId)
}
