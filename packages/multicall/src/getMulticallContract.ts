import { ChainId } from '@sweepstakes/chains'
import { GetContractReturnType, PublicClient, getContract } from 'viem'

import { MULTICALL_ADDRESS } from './constants/contracts'
import { iMulticallABI } from './abis/IMulticall'

type Params = {
  chainId: ChainId
  client?: PublicClient
}

export function getMulticallContract({
  chainId,
  client,
}: Params): GetContractReturnType<typeof iMulticallABI, PublicClient> {
  const address = MULTICALL_ADDRESS[chainId]
  if (!address) {
    throw new Error(`SweepStakesMulticall not supported on chain ${chainId}`)
  }

  return getContract({ abi: iMulticallABI, address, publicClient: client })
}
