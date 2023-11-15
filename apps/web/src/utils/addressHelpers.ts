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

export const getMulticallAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.multiCall, chainId)
}
export const getSSLotteryAddress = (chainId: number) => {
  return getAddressFromMap(addresses.ssLottery, chainId)
}
export const getSweepStakesProfileAddress = () => {
  return getAddressFromMap(addresses.pancakeProfile)
}
export const getCakeVaultAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.cakeVault, chainId)
}

export const getV3AirdropAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.v3Airdrop, chainId)
}
