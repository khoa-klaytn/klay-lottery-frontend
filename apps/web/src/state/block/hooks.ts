import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
// eslint-disable-next-line camelcase
import useSWR, { useSWRConfig, unstable_serialize } from 'swr'
import useSWRImmutable from 'swr/immutable'
import { useBlockNumber } from 'wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { viemClients } from 'utils/viem'

export const usePollBlockNumber = () => {
  const { cache, mutate } = useSWRConfig()
  const { chainId } = useActiveChainId()
  const { data: blockNumber } = useBlockNumber({
    chainId,
    onBlock: (data) => {
      mutate(['blockNumber', chainId], Number(data))
    },
    onSuccess: (data) => {
      if (!cache.get(unstable_serialize(['initialBlockNumber', chainId]))?.data) {
        mutate(['initialBlockNumber', chainId], Number(data))
      }
      if (!cache.get(unstable_serialize(['initialBlockTimestamp', chainId]))?.data) {
        const fetchInitialBlockTimestamp = async () => {
          const provider = viemClients[chainId as keyof typeof viemClients]
          if (provider) {
            const block = await provider.getBlock({ blockNumber: data })
            mutate(['initialBlockTimestamp', chainId], Number(block.timestamp))
          }
        }
        fetchInitialBlockTimestamp()
      }
    },
  })

  useSWR(
    chainId && ['blockNumberFetcher', chainId],
    async () => {
      mutate(['blockNumber', chainId], Number(blockNumber))
    },
    {
      revalidateOnMount: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  useSWR(
    chainId && [FAST_INTERVAL, 'blockNumber', chainId],
    async () => {
      return Number(blockNumber)
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  useSWR(
    chainId && [SLOW_INTERVAL, 'blockNumber', chainId],
    async () => {
      return Number(blockNumber)
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )
}

export const useCurrentBlock = (): number => {
  const { chainId } = useActiveChainId()
  const { data: currentBlock = 0 } = useSWRImmutable(['blockNumber', chainId])
  return Number(currentBlock)
}

export const useInitialBlock = (): number => {
  const { chainId } = useActiveChainId()
  const { data: initialBlock = 0 } = useSWRImmutable(['initialBlockNumber', chainId])
  return Number(initialBlock)
}

export const useInitialBlockTimestamp = (): number => {
  const { chainId } = useActiveChainId()
  const { data: initialBlockTimestamp = 0 } = useSWRImmutable(['initialBlockTimestamp', chainId])
  return Number(initialBlockTimestamp)
}
