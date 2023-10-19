import { ChainId } from '@pancakeswap/chains'

export const SUPPORT_ONLY_KLAYTN = [ChainId.KLAYTN, ChainId.KLAYTN_TESTNET]
export const SUPPORT_BUY_CRYPTO = [
  ChainId.BSC,
  ChainId.ETHEREUM,
  ChainId.ARBITRUM_ONE,
  ChainId.ZKSYNC, // NO PROVIDER SUPPORT ZK_SYNC_ERA
  ChainId.POLYGON_ZKEVM,
  ChainId.LINEA,
  ChainId.BASE,
]
