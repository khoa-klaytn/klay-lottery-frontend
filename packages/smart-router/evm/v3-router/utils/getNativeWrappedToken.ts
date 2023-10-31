import { Token, WNATIVE } from '@sweepstakes/sdk'
import { ChainId } from '@sweepstakes/chains'

export function getNativeWrappedToken(chainId: ChainId): Token | null {
  return WNATIVE[chainId] ?? null
}
