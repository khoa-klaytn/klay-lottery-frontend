import { WETH9, ERC20Token } from '@sweepstakes/sdk'
import { ChainId } from '@sweepstakes/chains'
import { USDC, KLAY } from './common'

export const lineaTestnetTokens = {
  weth: WETH9[ChainId.LINEA_TESTNET],
  usdc: USDC[ChainId.LINEA_TESTNET],
  cake: KLAY[ChainId.LINEA_TESTNET],
  mockA: new ERC20Token(ChainId.BASE_TESTNET, '0x6cc56b20bf8C4FfD58050D15AbA2978A745CC691', 18, 'A', 'Mock A'),
}
