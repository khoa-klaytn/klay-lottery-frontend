import { Currency, Token, WNATIVE } from '@sweepstakes/sdk'
import { ChainId } from '@sweepstakes/chains'

export { unwrappedToken } from '@sweepstakes/tokens'

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  return chainId && currency?.isNative ? WNATIVE[chainId] : currency?.isToken ? currency : undefined
}
