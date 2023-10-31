import { Token } from '@sweepstakes/sdk'
import { ChainId } from '@sweepstakes/chains'

// a list of tokens by chain
export type ChainMap<T> = {
  readonly [chainId in ChainId]: T
}

export type ChainTokenList = ChainMap<Token[]>
