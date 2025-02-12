import { WETH9, ERC20Token } from '@sweepstakes/sdk'
import { ChainId } from '@sweepstakes/chains'
import { USDC, KLAY } from './common'

export const baseTestnetTokens = {
  weth: WETH9[ChainId.BASE_TESTNET],
  usdc: USDC[ChainId.BASE_TESTNET],
  cake: KLAY[ChainId.BASE_TESTNET],
  mockA: new ERC20Token(ChainId.BASE_TESTNET, '0x15571d4a7D08e16108b97cf7c80Ffd5C3fcb9657', 18, 'A', 'Mock A'),
}
