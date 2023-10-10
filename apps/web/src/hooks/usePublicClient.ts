import { publicClient } from 'utils/wagmi'
import { useActiveChainId } from './useActiveChainId'

export function usePublicClient() {
  const { chainId } = useActiveChainId()
  const client = publicClient({ chainId })
  return client
}
