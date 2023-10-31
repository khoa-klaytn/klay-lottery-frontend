import { Token } from '@sweepstakes/sdk'
import { ChainId } from '@sweepstakes/chains'
import {
  ethereumTokens,
  bscTokens,
  bscTestnetTokens,
  goerliTestnetTokens,
  polygonZkEvmTokens,
  polygonZkEvmTestnetTokens,
  zkSyncTestnetTokens,
  zksyncTokens,
  lineaTokens,
  lineaTestnetTokens,
  arbitrumGoerliTokens,
  arbitrumTokens,
  baseTokens,
  baseTestnetTokens,
  opBnbTokens,
  opBnbTestnetTokens,
  scrollSepoliaTokens,
  klaytnTokens,
  klaytnTestnetTokens,
} from '@sweepstakes/tokens'

export const usdGasTokensByChain = {
  [ChainId.KLAYTN]: [klaytnTokens.usdc],
  [ChainId.KLAYTN_TESTNET]: [klaytnTestnetTokens.usdc],
  [ChainId.ETHEREUM]: [ethereumTokens.usdt],
  [ChainId.GOERLI]: [goerliTestnetTokens.usdc],
  [ChainId.BSC]: [bscTokens.busd],
  [ChainId.BSC_TESTNET]: [bscTestnetTokens.busd],
  [ChainId.ARBITRUM_ONE]: [arbitrumTokens.usdc],
  [ChainId.ARBITRUM_GOERLI]: [arbitrumGoerliTokens.usdc],
  [ChainId.POLYGON_ZKEVM]: [polygonZkEvmTokens.usdt],
  [ChainId.POLYGON_ZKEVM_TESTNET]: [polygonZkEvmTestnetTokens.usdt],
  [ChainId.ZKSYNC]: [zksyncTokens.usdc],
  [ChainId.ZKSYNC_TESTNET]: [zkSyncTestnetTokens.usdc],
  [ChainId.LINEA]: [lineaTokens.usdc],
  [ChainId.LINEA_TESTNET]: [lineaTestnetTokens.usdc],
  [ChainId.OPBNB]: [opBnbTokens.usdt],
  [ChainId.OPBNB_TESTNET]: [opBnbTestnetTokens.usdc],
  [ChainId.BASE]: [baseTokens.usdc],
  [ChainId.BASE_TESTNET]: [baseTestnetTokens.usdc],
  [ChainId.SCROLL_SEPOLIA]: [scrollSepoliaTokens.usdc],
} satisfies Record<ChainId, Token[]>

export * from './v2'
export * from './v3'
export * from './stableSwap'
