import useSWRImmutable from 'swr/immutable'
import { usePublicClient } from 'wagmi'
import { ifoV3ABI } from '../config/abi/ifoV3'
import { ifosConfig } from '../config/constants'
import { Ifo } from '../config/constants/types'

const activeIfo = ifosConfig.find((ifo) => ifo.isActive)

export const useActiveIfoWithBlocks = (): Ifo & { startBlock: number; endBlock: number } => {
  const publicClient = usePublicClient()
  const { data: currentIfoBlocks = { startBlock: 0, endBlock: 0 } } = useSWRImmutable(
    activeIfo ? ['ifo', 'currentIfo'] : null,
    async () => {
      const [startBlockResponse, endBlockResponse] = await publicClient.multicall({
        contracts: [
          {
            address: activeIfo.address,
            abi: ifoV3ABI,
            functionName: 'startBlock',
          },
          {
            address: activeIfo.address,
            abi: ifoV3ABI,
            functionName: 'endBlock',
          },
        ],
      })

      return {
        startBlock: startBlockResponse.status === 'success' ? Number(startBlockResponse.result) : 0,
        endBlock: endBlockResponse.status === 'success' ? Number(endBlockResponse.result) : 0,
      }
    },
  )

  return activeIfo ? { ...activeIfo, ...currentIfoBlocks } : null
}
