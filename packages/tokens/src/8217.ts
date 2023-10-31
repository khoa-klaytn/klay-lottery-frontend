import { WETH9 } from '@sweepstakes/sdk'
import { ChainId } from '@sweepstakes/chains'

import { BUSD, USDC, USDT } from './common'

export const klaytnTokens = {
  weth: WETH9[ChainId.KLAYTN],
  usdc: USDC[ChainId.KLAYTN],
  usdt: USDT[ChainId.KLAYTN],
  busd: BUSD[ChainId.KLAYTN],
}
