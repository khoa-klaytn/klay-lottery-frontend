import { getPoolContractBySousId } from '@pancakeswap/pools'

import { Abi, Address } from 'viem'
import { erc20ABI, usePublicClient, useWalletClient } from 'wagmi'

import { useActiveChainId } from 'hooks/useActiveChainId'

import addresses from 'config/constants/contracts'
import { useMemo } from 'react'
import { getMulticallAddress, getZapAddress } from 'utils/addressHelpers'
import {
  getBunnyFactoryContract,
  getCakeFlexibleSideVaultV2Contract,
  getCakeVaultV2Contract,
  getChainlinkOracleContract,
  getContract,
  getKlayLotteryContract,
  getNftMarketContract,
  getNftSaleContract,
  getNonBscVaultContract,
  getPointCenterIfoContract,
  getProfileContract,
  getSidContract,
  getStableSwapNativeHelperContract,
  getTradingCompetitionContractEaster,
  getTradingCompetitionContractFanToken,
  getTradingCompetitionContractMoD,
  getTradingCompetitionContractMobox,
  getTradingRewardContract,
  getUnsContract,
  getAffiliateProgramContract,
  getV3AirdropContract,
  getTradingRewardTopTradesContract,
  getVCakeContract,
  getRevenueSharingPoolContract,
  getAnniversaryAchievementContract,
} from 'utils/contractHelpers'

import { WNATIVE, pancakePairV2ABI } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { KLAY } from '@pancakeswap/tokens'
import { nonfungiblePositionManagerABI } from '@pancakeswap/v3-sdk'
import { multicallABI } from 'config/abi/Multicall'
import { erc20Bytes32ABI } from 'config/abi/erc20_bytes32'
import { zapABI } from 'config/abi/zap'
import { VaultKey } from 'state/types'

import { erc721CollectionABI } from 'config/abi/erc721collection'
import { infoStableSwapABI } from 'config/abi/infoStableSwap'
import { wethABI } from 'config/abi/weth'
import useLotteryAddress from 'views/Lottery/hooks/useLotteryAddress'
/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useERC20 = (address: Address) => {
  return useContract(address, erc20ABI)
}

export const useCake = () => {
  const { chainId } = useActiveChainId()

  return useContract((chainId && KLAY[chainId]?.address) ?? KLAY[ChainId.BSC].address, erc20ABI)
}

export const useBunnyFactory = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getBunnyFactoryContract(signer ?? undefined), [signer])
}

export const useProfileContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getProfileContract(signer ?? undefined), [signer])
}

export const useKlayLotteryContract = () => {
  const address = useLotteryAddress()
  const { data: signer } = useWalletClient()
  return useMemo(() => getKlayLotteryContract(address, signer ?? undefined), [address, signer])
}

export const useSousChef = (id) => {
  const { data: signer } = useWalletClient()
  const { chainId } = useActiveChainId()
  const publicClient = usePublicClient({ chainId })
  return useMemo(
    () =>
      getPoolContractBySousId({
        sousId: id,
        signer,
        chainId,
        publicClient,
      }),
    [id, signer, chainId, publicClient],
  )
}

export const usePointCenterIfoContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getPointCenterIfoContract(signer ?? undefined), [signer])
}

export const useTradingCompetitionContractEaster = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getTradingCompetitionContractEaster(signer ?? undefined), [signer])
}

export const useTradingCompetitionContractFanToken = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getTradingCompetitionContractFanToken(signer ?? undefined), [signer])
}

export const useTradingCompetitionContractMobox = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getTradingCompetitionContractMobox(signer ?? undefined), [signer])
}

export const useTradingCompetitionContractMoD = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getTradingCompetitionContractMoD(signer ?? undefined), [signer])
}

export const useVaultPoolContract = <T extends VaultKey>(
  vaultKey: T,
):
  | (T extends VaultKey.CakeVault
      ? ReturnType<typeof getCakeVaultV2Contract>
      : ReturnType<typeof getCakeFlexibleSideVaultV2Contract>)
  | null => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => {
    if (vaultKey === VaultKey.CakeVault) {
      return getCakeVaultV2Contract(signer ?? undefined, chainId)
    }
    if (vaultKey === VaultKey.CakeFlexibleSideVault) {
      return getCakeFlexibleSideVaultV2Contract(signer ?? undefined, chainId)
    }
    return null
  }, [signer, vaultKey, chainId]) as any
}

export const useCakeVaultContract = () => {
  const { data: signer } = useWalletClient()
  const { chainId } = useActiveChainId()
  return useMemo(() => getCakeVaultV2Contract(signer ?? undefined, chainId), [signer, chainId])
}

export const useChainlinkOracleContract = (address) => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getChainlinkOracleContract(address, signer ?? undefined), [signer, address])
}

export const useNftSaleContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getNftSaleContract(signer ?? undefined), [signer])
}

export const useNftMarketContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getNftMarketContract(signer ?? undefined), [signer])
}

export const useErc721CollectionContract = (collectionAddress: Address) => {
  return useContract(collectionAddress, erc721CollectionABI)
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

export function useBytes32TokenContract(tokenAddress?: Address) {
  return useContract(tokenAddress, erc20Bytes32ABI)
}

export function usePairContract(pairAddress?: Address) {
  return useContract(pairAddress, pancakePairV2ABI)
}

export function useMulticallContract() {
  const { chainId } = useActiveChainId()
  return useContract(getMulticallAddress(chainId), multicallABI)
}

export function useZapContract() {
  const { chainId } = useActiveChainId()
  return useContract(getZapAddress(chainId), zapABI)
}

export const useNonBscVault = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getNonBscVaultContract(signer ?? undefined, chainId), [signer, chainId])
}

export const useSIDContract = (address, chainId) => {
  return useMemo(() => getSidContract(address, chainId), [address, chainId])
}

export const useUNSContract = (address, chainId, provider) => {
  return useMemo(() => getUnsContract(address, chainId, provider), [chainId, address, provider])
}

export const useStableSwapNativeHelperContract = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getStableSwapNativeHelperContract(signer ?? undefined, chainId), [signer, chainId])
}

export function useV3NFTPositionManagerContract() {
  return useContract(addresses.nftPositionManager, nonfungiblePositionManagerABI)
}

export const useTradingRewardContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getTradingRewardContract(signer ?? undefined, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useV3AirdropContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getV3AirdropContract(signer ?? undefined), [signer])
}

export const useInfoStableSwapContract = (infoAddress?: Address) => {
  return useContract(infoAddress, infoStableSwapABI)
}

export const useAffiliateProgramContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => getAffiliateProgramContract(signer ?? undefined, chainId_ ?? chainId),
    [signer, chainId_, chainId],
  )
}

export const useTradingRewardTopTraderContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => getTradingRewardTopTradesContract(signer ?? undefined, chainId_ ?? chainId),
    [signer, chainId_, chainId],
  )
}

export const useVCakeContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getVCakeContract(signer ?? undefined, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useRevenueSharingPoolContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => getRevenueSharingPoolContract(signer ?? undefined, chainId_ ?? chainId),
    [signer, chainId_, chainId],
  )
}

export const useAnniversaryAchievementContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => getAnniversaryAchievementContract(signer ?? undefined, chainId_ ?? chainId),
    [signer, chainId_, chainId],
  )
}
