import { getPoolsConfig, SUPPORTED_CHAIN_IDS } from '@sweepstakes/pools'
import { describe, it } from 'vitest'

describe.concurrent(
  'Config pools',
  () => {
    for (const chainId of SUPPORTED_CHAIN_IDS) {
      const pools = getPoolsConfig(chainId)

      it.each(pools.map((pool) => pool.sousId))('Pool #%d has an unique sousId', (sousId) => {
        const duplicates = pools.filter((p) => sousId === p.sousId)
        expect(duplicates).toHaveLength(1)
      })
      it.each(pools.map((pool) => [pool.sousId, pool.contractAddress]))(
        'Pool #%d has an unique contract address',
        (_, contractAddress) => {
          const duplicates = pools.filter((p) => contractAddress === p.contractAddress)
          expect(duplicates).toHaveLength(1)
        },
      )
    }
  },
  { timeout: 60_000 },
)
