import { ChainId } from '@sweepstakes/chains'
import { useMemo } from 'react'
import { createPortal } from 'react-dom'

import { useActiveChainId } from 'hooks/useActiveChainId'
import { GRAPH_API_LOTTERY } from 'config/constants/endpoints'

import { SubgraphHealthIndicator, SubgraphHealthIndicatorProps } from './SubgraphHealthIndicator'

interface FactoryParams {
  getSubgraphName: (chainId: ChainId) => string
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export function subgraphHealthIndicatorFactory({ getSubgraphName }: FactoryParams) {
  return function Indicator(props: PartialBy<SubgraphHealthIndicatorProps, 'subgraphName'>) {
    const { chainId } = useActiveChainId()
    const subgraphName = useMemo(() => getSubgraphName(chainId), [chainId])

    return createPortal(<SubgraphHealthIndicator subgraphName={subgraphName} {...props} />, document.body)
  }
}

export const LotterySubgraphHealthIndicator = subgraphHealthIndicatorFactory({
  getSubgraphName: () => GRAPH_API_LOTTERY.replace('https://api.thegraph.com/subgraphs/name/', ''),
})
