import { ERC20Token, WETH9 } from '@sweepstakes/sdk'
import { ChainId } from '@sweepstakes/chains'
import { USDC, USDT, KLAY } from './common'

export const lineaTokens = {
  weth: WETH9[ChainId.LINEA],
  usdc: USDC[ChainId.LINEA],
  wbtc: new ERC20Token(ChainId.LINEA, '0x3aAB2285ddcDdaD8edf438C1bAB47e1a9D05a9b4', 8, 'WBTC', 'Wrapped BTC'),
  usdt: USDT[ChainId.LINEA],
  dai: new ERC20Token(ChainId.LINEA, '0x4AF15ec2A0BD43Db75dd04E62FAA3B8EF36b00d5', 18, 'DAI', 'Dai Stablecoin'),
  cake: KLAY[ChainId.LINEA],
}
