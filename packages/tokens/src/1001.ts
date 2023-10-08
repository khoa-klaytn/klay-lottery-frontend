import { WETH9 } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'

import { USDC } from './common'

export const klaytnTestnetTokens = {
  weth: WETH9[ChainId.KLAYTN_TESTNET],
  usdc: USDC[ChainId.KLAYTN_TESTNET],
}
