// Addresses
import { getCakeVaultAddress, getSweepStakesProfileAddress, getV3AirdropAddress } from 'utils/addressHelpers'

import { cakeVaultV2ABI } from '@sweepstakes/pools'
import { ChainId } from '@sweepstakes/chains'
import { sidABI } from 'config/abi/SID'
import { SIDResolverABI } from 'config/abi/SIDResolver'
import { ssLotteryABI } from 'config/abi/ssLottery'
import { pancakeProfileABI } from 'config/abi/pancakeProfile'
import { v3AirdropABI } from 'config/abi/v3Airdrop'
import { viemClients } from 'utils/viem'
import { Abi, PublicClient, WalletClient, getContract as viemGetContract } from 'viem'
import { Address } from 'wagmi'

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

export const getProfileContract = (signer?: WalletClient) => {
  return getContract({ abi: pancakeProfileABI, address: getSweepStakesProfileAddress(), signer })
}

export const getSSLotteryContract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: ssLotteryABI, address, signer })
}

export const getCakeVaultV2Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: cakeVaultV2ABI, address: getCakeVaultAddress(chainId), signer, chainId })
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

export const getV3AirdropContract = (walletClient?: WalletClient) => {
  return getContract({
    abi: v3AirdropABI,
    address: getV3AirdropAddress(),
    signer: walletClient,
  })
}
