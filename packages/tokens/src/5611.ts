import { WETH9, WBNB } from '@sweepstakes/sdk'
import { ChainId } from '@sweepstakes/chains'
import { USDT, USDC } from './common'

export const opBnbTestnetTokens = {
  wbnb: WBNB[ChainId.OPBNB_TESTNET],
  weth: WETH9[ChainId.OPBNB_TESTNET],
  usdc: USDC[ChainId.OPBNB_TESTNET],
  usdt: USDT[ChainId.OPBNB_TESTNET],
}
