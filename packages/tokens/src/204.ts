import { ChainId } from '@sweepstakes/chains'
import { WBNB } from '@sweepstakes/sdk'

import { USDT } from './common'

export const opBnbTokens = {
  wbnb: WBNB[ChainId.OPBNB],
  usdt: USDT[ChainId.OPBNB],
}
