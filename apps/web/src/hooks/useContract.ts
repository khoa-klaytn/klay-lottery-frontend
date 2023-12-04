import { Abi, Address } from 'viem'
import { erc20ABI, useWalletClient } from 'wagmi'

import { useActiveChainId } from 'hooks/useActiveChainId'

import { useMemo } from 'react'
import { getMulticallAddress } from 'utils/addressHelpers'
import {
  getContract,
  getSSLotteryContract,
  getSidContract,
  getUnsContract,
  getV3AirdropContract,
} from 'utils/contractHelpers'

import { WNATIVE } from '@sweepstakes/sdk'
import { multicallABI } from 'config/abi/Multicall'

import { wethABI } from 'config/abi/weth'
import useLotteryAddress from 'views/Lottery/hooks/useLotteryAddress'
/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useERC20 = (address: Address) => {
  return useContract(address, erc20ABI)
}

export const useSSLotteryContract = () => {
  const address = useLotteryAddress()
  const { data: signer } = useWalletClient()
  return useMemo(() => getSSLotteryContract(address, signer ?? undefined), [address, signer])
}

// Code below migrated from Exchange useContract.ts

// returns null on errors
export function useContract<TAbi extends Abi>(
  addressOrAddressMap?: Address | { [chainId: number]: Address },
  abi?: TAbi,
) {
  const { chainId } = useActiveChainId()
  const { data: walletClient } = useWalletClient()

  return useMemo(() => {
    if (!addressOrAddressMap || !abi || !chainId) return null
    let address: Address | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract({
        abi,
        address,
        chainId,
        signer: walletClient ?? undefined,
      })
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, abi, chainId, walletClient])
}

export function useTokenContract(tokenAddress?: Address) {
  return useContract(tokenAddress, erc20ABI)
}

export function useWNativeContract() {
  const { chainId } = useActiveChainId()
  return useContract(chainId ? WNATIVE[chainId]?.address : undefined, wethABI)
}

export function useMulticallContract() {
  const { chainId } = useActiveChainId()
  return useContract(getMulticallAddress(chainId), multicallABI)
}

export const useSIDContract = (address, chainId) => {
  return useMemo(() => getSidContract(address, chainId), [address, chainId])
}

export const useUNSContract = (address, chainId, provider) => {
  return useMemo(() => getUnsContract(address, chainId, provider), [chainId, address, provider])
}

export const useV3AirdropContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getV3AirdropContract(signer ?? undefined), [signer])
}
