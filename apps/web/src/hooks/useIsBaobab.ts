import { ChainId } from '@sweepstakes/chains'
import { useMemo } from 'react'
import { useActiveChainId } from './useActiveChainId'

export function useIsBaobab() {
  const { chainId } = useActiveChainId()
  const isBaobab = useMemo(() => chainId === ChainId.KLAYTN_TESTNET, [chainId])
  return isBaobab
}
