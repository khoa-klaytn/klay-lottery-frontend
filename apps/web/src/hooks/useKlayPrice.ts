import { ChainId } from '@sweepstakes/chains'
import { BIG_ZERO } from '@sweepstakes/utils/bigNumber'
import BigNumber from 'bignumber.js'
// import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'
// import contracts from 'config/constants/contracts'
// import { publicClient } from 'utils/wagmi'
// import { formatUnits } from 'viem'
import { FAST_INTERVAL } from 'config/constants'
import { useQuery } from '@tanstack/react-query'
import { useActiveChainId } from './useActiveChainId'

// for migration to bignumber.js to avoid breaking changes
export const useKlayPrice = () => {
  const { chainId } = useActiveChainId()
  const { data } = useQuery<BigNumber, Error>({
    queryKey: [`${chainId}Price`],
    queryFn: async () => new BigNumber(await getKlayPriceFromOracle(chainId)),
    staleTime: FAST_INTERVAL,
    refetchInterval: FAST_INTERVAL,
  })
  return data ?? BIG_ZERO
}

export const getKlayPriceFromOracle = async (chainId: ChainId) => {
  chainId.toString()
  // TODO: use the oracle contract to get the price
  // const data = await publicClient({ chainId }).readContract({
  //   abi: chainlinkOracleABI,
  //   address: contracts.oraklKlayUsd[chainId],
  //   functionName: 'latestAnswer',
  // })
  // return formatUnits(data, 8)
  const klay = await (
    await fetch('https://api.coingecko.com/api/v3/simple/price?ids=klay-token&vs_currencies=usd')
  ).json()
  return klay['klay-token'].usd as string
}
