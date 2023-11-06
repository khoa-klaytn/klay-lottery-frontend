import { KLAY } from '@sweepstakes/tokens'

// Addresses
import {
  getBunnyFactoryAddress,
  getCakeFlexibleSideVaultAddress,
  getCakeVaultAddress,
  getNonBscVaultAddress,
  getSweepStakesProfileAddress,
  getPointCenterIfoAddress,
  getStableSwapNativeHelperAddress,
  getTradingRewardAddress,
  getV3AirdropAddress,
  getTradingRewardTopTradesAddress,
  getVCakeAddress,
  getRevenueSharingPoolAddress,
  getAnniversaryAchievementAddress,
} from 'utils/addressHelpers'

// ABI
import { nonBscVaultABI } from 'config/abi/nonBscVault'
import { pointCenterIfoABI } from 'config/abi/pointCenterIfo'
import { stableSwapNativeHelperABI } from 'config/abi/stableSwapNativeHelper'

import { cakeFlexibleSideVaultV2ABI, cakeVaultV2ABI } from '@sweepstakes/pools'
import { ChainId } from '@sweepstakes/chains'
import { sidABI } from 'config/abi/SID'
import { SIDResolverABI } from 'config/abi/SIDResolver'
import { bunnyFactoryABI } from 'config/abi/bunnyFactory'
import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'
import { klayLotteryABI } from 'config/abi/klayLottery'
import { lpTokenABI } from 'config/abi/lpTokenAbi'
import { pancakeProfileABI } from 'config/abi/pancakeProfile'
import { tradingRewardABI } from 'config/abi/tradingReward'
import { v3AirdropABI } from 'config/abi/v3Airdrop'
import { vCakeABI } from 'config/abi/vCake'
import { anniversaryAchievementABI } from 'config/abi/anniversaryAchievement'
import { revenueSharingPoolABI } from 'config/abi/revenueSharingPool'
import { viemClients } from 'utils/viem'
import { Abi, PublicClient, WalletClient, getContract as viemGetContract } from 'viem'
import { Address, erc20ABI, erc721ABI } from 'wagmi'

export const getContract = <TAbi extends Abi | unknown[], TWalletClient extends WalletClient>({
  abi,
  address,
  chainId = ChainId.BSC,
  publicClient,
  signer,
}: {
  abi: TAbi
  address: Address
  chainId?: ChainId
  signer?: TWalletClient
  publicClient?: PublicClient
}) => {
  const c = viemGetContract({
    abi,
    address,
    publicClient: publicClient ?? viemClients[chainId],
    walletClient: signer,
  })
  return {
    ...c,
    account: signer?.account,
    chain: signer?.chain,
  }
}

export const getBep20Contract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: erc20ABI, address, signer })
}

export const getErc721Contract = (address: Address, walletClient?: WalletClient) => {
  return getContract({
    abi: erc721ABI,
    address,
    signer: walletClient,
  })
}
export const getLpContract = (address: Address, chainId?: number, signer?: WalletClient) => {
  return getContract({ abi: lpTokenABI, address, signer, chainId })
}

export const getPointCenterIfoContract = (signer?: WalletClient) => {
  return getContract({ abi: pointCenterIfoABI, address: getPointCenterIfoAddress(), signer })
}
export const getCakeContract = (chainId?: number) => {
  return getContract({
    abi: erc20ABI,
    address: chainId ? KLAY[chainId]?.address : KLAY[ChainId.BSC].address,
    chainId,
  })
}

export const getProfileContract = (signer?: WalletClient) => {
  return getContract({ abi: pancakeProfileABI, address: getSweepStakesProfileAddress(), signer })
}

export const getBunnyFactoryContract = (signer?: WalletClient) => {
  return getContract({ abi: bunnyFactoryABI, address: getBunnyFactoryAddress(), signer })
}
export const getKlayLotteryContract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: klayLotteryABI, address, signer })
}

export const getCakeVaultV2Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: cakeVaultV2ABI, address: getCakeVaultAddress(chainId), signer, chainId })
}

export const getCakeFlexibleSideVaultV2Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: cakeFlexibleSideVaultV2ABI,
    address: getCakeFlexibleSideVaultAddress(chainId),
    signer,
    chainId,
  })
}

export const getChainlinkOracleContract = (address: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: chainlinkOracleABI, address, signer, chainId })
}

export const getNonBscVaultContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: nonBscVaultABI, address: getNonBscVaultAddress(chainId), chainId, signer })
}

export const getSidContract = (address: Address, chainId: number) => {
  return getContract({ abi: sidABI, address, chainId })
}

export const getUnsContract = (address: Address, chainId?: ChainId, publicClient?: PublicClient) => {
  return getContract({
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'addr',
            type: 'address',
          },
        ],
        name: 'reverseNameOf',
        outputs: [
          {
            internalType: 'string',
            name: 'reverseUri',
            type: 'string',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ] as const,
    chainId,
    address,
    publicClient,
  })
}

export const getSidResolverContract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: SIDResolverABI, address, signer })
}

export const getStableSwapNativeHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: stableSwapNativeHelperABI,
    address: getStableSwapNativeHelperAddress(chainId),
    chainId,
    signer,
  })
}

export const getTradingRewardContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: tradingRewardABI,
    address: getTradingRewardAddress(chainId),
    signer,
    chainId,
  })
}

export const getV3AirdropContract = (walletClient?: WalletClient) => {
  return getContract({
    abi: v3AirdropABI,
    address: getV3AirdropAddress(),
    signer: walletClient,
  })
}

export const getTradingRewardTopTradesContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: tradingRewardABI,
    address: getTradingRewardTopTradesAddress(chainId),
    signer,
    chainId,
  })
}

export const getVCakeContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: vCakeABI,
    address: getVCakeAddress(chainId),
    signer,
    chainId,
  })
}

export const getRevenueSharingPoolContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: revenueSharingPoolABI,
    address: getRevenueSharingPoolAddress(chainId),
    signer,
    chainId,
  })
}

export const getAnniversaryAchievementContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: anniversaryAchievementABI,
    address: getAnniversaryAchievementAddress(chainId),
  })
}
