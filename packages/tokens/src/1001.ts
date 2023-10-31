import { WETH9 } from '@sweepstakes/sdk'
import { ChainId } from '@sweepstakes/chains'

import { USDC } from './common'

export const klaytnTestnetTokens = {
  weth: WETH9[ChainId.KLAYTN_TESTNET],
  usdc: USDC[ChainId.KLAYTN_TESTNET],
}
