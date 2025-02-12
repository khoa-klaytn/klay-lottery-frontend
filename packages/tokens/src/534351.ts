import { WETH9 } from '@sweepstakes/sdk'
import { ChainId } from '@sweepstakes/chains'
import { USDC } from './common'

export const scrollSepoliaTokens = {
  weth: WETH9[ChainId.SCROLL_SEPOLIA],
  usdc: USDC[ChainId.SCROLL_SEPOLIA],
}
