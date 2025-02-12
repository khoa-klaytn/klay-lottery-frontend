import { ChainId } from '@sweepstakes/chains'
import memoize from 'lodash/memoize'
import {
  klaytn as klaytn_,
  // bsc as bsc_,
  // bscTestnet,
  // goerli,
  // mainnet,
  // zkSync,
  // zkSyncTestnet,
  // polygonZkEvmTestnet,
  // polygonZkEvm,
  // lineaTestnet,
  // arbitrum,
  // arbitrumGoerli,
  // base,
  // baseGoerli,
  // scrollSepolia as scrollSepolia_,
  Chain,
} from 'wagmi/chains'

export const CHAIN_QUERY_NAME = {
  [ChainId.KLAYTN]: 'klaytn',
  [ChainId.KLAYTN_TESTNET]: 'klaytnTestnet',
  // [ChainId.ETHEREUM]: 'eth',
  // [ChainId.GOERLI]: 'goerli',
  // [ChainId.BSC]: 'bsc',
  // [ChainId.BSC_TESTNET]: 'bscTestnet',
  // [ChainId.ARBITRUM_ONE]: 'arb',
  // [ChainId.ARBITRUM_GOERLI]: 'arbGoerli',
  // [ChainId.POLYGON_ZKEVM]: 'polygonZkEVM',
  // [ChainId.POLYGON_ZKEVM_TESTNET]: 'polygonZkEVMTestnet',
  // [ChainId.ZKSYNC]: 'zkSync',
  // [ChainId.ZKSYNC_TESTNET]: 'zkSyncTestnet',
  // [ChainId.LINEA]: 'linea',
  // [ChainId.LINEA_TESTNET]: 'lineaTestnet',
  // [ChainId.OPBNB]: 'opBNB',
  // [ChainId.OPBNB_TESTNET]: 'opBnbTestnet',
  // [ChainId.BASE]: 'base',
  // [ChainId.BASE_TESTNET]: 'baseTestnet',
  // [ChainId.SCROLL_SEPOLIA]: 'scrollSepolia',
} as const as Record<ChainId, string>

const CHAIN_QUERY_NAME_TO_ID = Object.entries(CHAIN_QUERY_NAME).reduce((acc, [chainId, chainName]) => {
  return {
    [chainName.toLowerCase()]: chainId as unknown as ChainId,
    ...acc,
  }
}, {} as Record<string, ChainId>)

export const getChainId = memoize((chainName: string) => {
  if (!chainName) return undefined
  return CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] ? +CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] : undefined
})

export const klaytn = {
  ...klaytn_,
  nativeCurrency: {
    ...klaytn_.nativeCurrency,
    name: 'KLAY',
  },
  rpcUrls: {
    ...klaytn_.rpcUrls,
    public: {
      ...klaytn_.rpcUrls.public,
      http: ['https://public-en-cypress.klaytn.net'],
    },
    default: {
      ...klaytn_.rpcUrls.default,
      http: ['https://public-en-cypress.klaytn.net'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Klaytnscope',
      url: 'https://scope.klaytn.com',
    },
  },
} as const satisfies Chain

export const klaytnTestnet = {
  id: ChainId.KLAYTN_TESTNET,
  name: 'Klaytn Testnet',
  network: 'klaytn-testnet',
  nativeCurrency: {
    ...klaytn.nativeCurrency,
    symbol: 'tKLAY',
  },
  rpcUrls: {
    default: {
      http: ['https://public-en-baobab.klaytn.net'],
    },
    public: {
      http: ['https://public-en-baobab.klaytn.net'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Klaytnscope',
      url: 'https://baobab.scope.klaytn.com',
    },
  },
  testnet: true,
} as const satisfies Chain

// const bsc = {
//   ...bsc_,
//   rpcUrls: {
//     ...bsc_.rpcUrls,
//     public: {
//       ...bsc_.rpcUrls.public,
//       http: ['https://bsc-dataseed.binance.org/'],
//     },
//     default: {
//       ...bsc_.rpcUrls.default,
//       http: ['https://bsc-dataseed.binance.org/'],
//     },
//   },
// } satisfies Chain

// const scrollSepolia = {
//   ...scrollSepolia_,
// } as const satisfies Chain

// export const opbnbTestnet = {
//   id: ChainId.OPBNB_TESTNET,
//   name: 'opBNB Testnet',
//   network: 'opbnb-testnet',
//   nativeCurrency: bscTestnet.nativeCurrency,
//   rpcUrls: {
//     default: {
//       http: ['https://opbnb-testnet-rpc.bnbchain.org'],
//     },
//     public: {
//       http: ['https://opbnb-testnet-rpc.bnbchain.org'],
//     },
//   },
//   blockExplorers: {
//     default: {
//       name: 'opBNBScan',
//       url: 'https://testnet.opbnbscan.com',
//     },
//   },
//   testnet: true,
// } as const satisfies Chain

// export const opbnb = {
//   id: ChainId.OPBNB,
//   name: 'opBNB Mainnet',
//   network: 'opbnb',
//   nativeCurrency: bsc_.nativeCurrency,
//   rpcUrls: {
//     default: {
//       http: ['https://opbnb-mainnet-rpc.bnbchain.org'],
//     },
//     public: {
//       http: ['https://opbnb-mainnet-rpc.bnbchain.org'],
//     },
//   },
//   blockExplorers: {
//     default: {
//       name: 'opBNBScan',
//       url: 'https://opbnbscan.com',
//     },
//   },
// } as const satisfies Chain

// export const linea = {
//   id: ChainId.LINEA,
//   name: 'Linea Mainnet',
//   network: 'linea-mainnet',
//   nativeCurrency: { name: 'Linea Ether', symbol: 'ETH', decimals: 18 },
//   rpcUrls: {
//     infura: {
//       http: ['https://linea-mainnet.infura.io/v3'],
//       webSocket: ['wss://linea-mainnet.infura.io/ws/v3'],
//     },
//     default: {
//       http: ['https://rpc.linea.build'],
//       webSocket: ['wss://rpc.linea.build'],
//     },
//     public: {
//       http: ['https://rpc.linea.build'],
//       webSocket: ['wss://rpc.linea.build'],
//     },
//   },
//   blockExplorers: {
//     default: {
//       name: 'Etherscan',
//       url: 'https://lineascan.build',
//     },
//     etherscan: {
//       name: 'Etherscan',
//       url: 'https://lineascan.build',
//     },
//     blockscout: {
//       name: 'Blockscout',
//       url: 'https://explorer.linea.build',
//     },
//   },
//   testnet: false,
// } as const satisfies Chain

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS: ChainId[] = [
  // ChainId.ARBITRUM_ONE,
  // ChainId.ARBITRUM_GOERLI,
  // ChainId.POLYGON_ZKEVM,
  // ChainId.POLYGON_ZKEVM_TESTNET,
  // ChainId.ZKSYNC,
  // ChainId.ZKSYNC_TESTNET,
  // ChainId.LINEA_TESTNET,
  // ChainId.LINEA,
  // ChainId.BASE,
  // ChainId.BASE_TESTNET,
  // ChainId.OPBNB,
  // ChainId.OPBNB_TESTNET,
]

export const CHAINS = [
  klaytn,
  klaytnTestnet,
  // bsc,
  // mainnet,
  // bscTestnet,
  // goerli,
  // polygonZkEvm,
  // polygonZkEvmTestnet,
  // zkSync,
  // zkSyncTestnet,
  // arbitrum,
  // arbitrumGoerli,
  // linea,
  // lineaTestnet,
  // arbitrumGoerli,
  // arbitrum,
  // base,
  // baseGoerli,
  // opbnb,
  // opbnbTestnet,
  // scrollSepolia,
] as Chain[]

export const SHORT_SYMBOL = {
  [ChainId.KLAYTN]: 'KLAY',
  [ChainId.KLAYTN_TESTNET]: 'tKLAY',
  // [ChainId.ETHEREUM]: 'ETH',
  // [ChainId.BSC]: 'BNB',
  // [ChainId.BSC_TESTNET]: 'tBNB',
  // [ChainId.GOERLI]: 'GOR',
  // [ChainId.ARBITRUM_ONE]: 'ARB',
  // [ChainId.ARBITRUM_GOERLI]: 'tARB',
  // [ChainId.POLYGON_ZKEVM]: 'Polygon zkEVM',
  // [ChainId.POLYGON_ZKEVM_TESTNET]: 'tZkEVM',
  // [ChainId.ZKSYNC]: 'zkSync',
  // [ChainId.ZKSYNC_TESTNET]: 'tZkSync',
  // [ChainId.LINEA]: 'Linea',
  // [ChainId.LINEA_TESTNET]: 'tLinea',
  // [ChainId.OPBNB]: 'opBNB',
  // [ChainId.OPBNB_TESTNET]: 'tOpBNB',
  // [ChainId.BASE]: 'Base',
  // [ChainId.BASE_TESTNET]: 'tBase',
  // [ChainId.SCROLL_SEPOLIA]: 'tScroll',
} as const as Record<ChainId, string>
