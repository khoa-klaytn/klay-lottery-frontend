import { ChainId } from '@sweepstakes/chains'
import type { Address } from 'viem'

export default {
  SSLottery: {
    [ChainId.KLAYTN_TESTNET]: '0x26304A540aEd8a6c035F8bC8F9C142511AdE5224',
    [ChainId.KLAYTN]: '0x', // TODO: deploy to mainnet
  },
  multiCall: {
    [ChainId.ETHEREUM]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.GOERLI]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.BSC]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.BSC_TESTNET]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.ZKSYNC_TESTNET]: '0xF9cda624FBC7e059355ce98a31693d299FACd963',
    [ChainId.ZKSYNC]: '0xF9cda624FBC7e059355ce98a31693d299FACd963',
    [ChainId.ARBITRUM_ONE]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.ARBITRUM_GOERLI]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.POLYGON_ZKEVM]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.POLYGON_ZKEVM_TESTNET]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.OPBNB]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.OPBNB_TESTNET]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.BASE_TESTNET]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.SCROLL_SEPOLIA]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  oraklKlayUsd: {
    [ChainId.KLAYTN]: '0x33D6ee12D4ADE244100F09b280e159659fe0ACE0',
    [ChainId.KLAYTN_TESTNET]: '0x26304A540aEd8a6c035F8bC8F9C142511AdE5224',
  },
} as const satisfies Record<string, Record<number, Address>>
