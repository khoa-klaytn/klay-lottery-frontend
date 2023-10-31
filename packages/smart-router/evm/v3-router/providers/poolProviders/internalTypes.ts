import { Currency } from '@sweepstakes/sdk'
import { FeeAmount } from '@sweepstakes/v3-sdk'
import type { Address } from 'viem'

// Information used to identify a pool
export interface PoolMeta {
  currencyA: Currency
  currencyB: Currency
  address: Address
}

export interface V3PoolMeta extends PoolMeta {
  fee: FeeAmount
}
