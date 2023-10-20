import { ChainId } from '@pancakeswap/chains'
// import {
//   arbitrum,
//   polygonZkEvm,
//   zkSync,
//   zkSyncTestnet,
//   polygonZkEvmTestnet,
//   arbitrumGoerli,
//   baseGoerli,
//   scrollSepolia,
//   base,
// } from 'wagmi/chains'
// import { getNodeRealUrlV2 } from 'utils/nodeReal'
import { /* opbnbTestnet, linea, opbnb, */ klaytn, klaytnTestnet } from './chains'

// const POLYGON_ZKEVM_NODES = [
//   'https://f2562de09abc5efbd21eefa083ff5326.zkevm-rpc.com/',
//   ...polygonZkEvm.rpcUrls.public.http,
// ]

// const ARBITRUM_NODES = [
//   ...arbitrum.rpcUrls.public.http,
//   process.env.NEXT_PUBLIC_QUICK_NODE_ARB_PRODUCTION || '',
//   getNodeRealUrlV2(ChainId.ARBITRUM_ONE, process.env.NEXT_PUBLIC_NODE_REAL_API_ETH) || '',
// ]

export const SERVER_NODES = {
  [ChainId.KLAYTN]: klaytn.rpcUrls.public.http,
  [ChainId.KLAYTN_TESTNET]: klaytnTestnet.rpcUrls.public.http,
  // [ChainId.BSC]: [
  //   process.env.NEXT_PUBLIC_NODE_PRODUCTION || '',
  //   'https://bsc-dataseed1.defibit.io',
  //   'https://bsc-dataseed1.binance.org',
  // ].filter(Boolean),
  // [ChainId.BSC_TESTNET]: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
  // [ChainId.ETHEREUM]: [
  //   getNodeRealUrlV2(ChainId.ETHEREUM, process.env.SERVER_NODE_REAL_API_ETH) || '',
  //   'https://eth.llamarpc.com',
  //   'https://cloudflare-eth.com',
  // ],
  // [ChainId.GOERLI]: [
  //   getNodeRealUrlV2(ChainId.GOERLI, process.env.SERVER_NODE_REAL_API_GOERLI) || '',
  //   'https://eth-goerli.public.blastapi.io',
  // ].filter(Boolean),
  // [ChainId.ARBITRUM_ONE]: ARBITRUM_NODES,
  // [ChainId.ARBITRUM_GOERLI]: arbitrumGoerli.rpcUrls.public.http,
  // [ChainId.POLYGON_ZKEVM]: POLYGON_ZKEVM_NODES,
  // [ChainId.POLYGON_ZKEVM_TESTNET]: [
  //   'https://polygon-zkevm-testnet.rpc.thirdweb.com',
  //   ...polygonZkEvmTestnet.rpcUrls.public.http,
  // ],
  // [ChainId.ZKSYNC]: zkSync.rpcUrls.public.http,
  // [ChainId.ZKSYNC_TESTNET]: zkSyncTestnet.rpcUrls.public.http,
  // [ChainId.LINEA]: linea.rpcUrls.public.http,
  // [ChainId.LINEA_TESTNET]: [
  //   'https://rpc.goerli.linea.build',
  //   'https://linea-testnet.rpc.thirdweb.com',
  //   'https://consensys-zkevm-goerli-prealpha.infura.io/v3/93e8a17747e34ec0ac9a554c1b403965',
  // ],
  // [ChainId.OPBNB_TESTNET]: opbnbTestnet.rpcUrls.public.http,
  // [ChainId.OPBNB]: opbnb.rpcUrls.public.http,
  // [ChainId.BASE]: [
  //   'https://base.publicnode.com',
  //   // process.env.NEXT_PUBLIC_NODE_REAL_BASE_PRODUCTION,
  //   ...base.rpcUrls.public.http,
  // ],
  // [ChainId.BASE_TESTNET]: baseGoerli.rpcUrls.public.http,
  // [ChainId.SCROLL_SEPOLIA]: scrollSepolia.rpcUrls.public.http,
} as any as Record<ChainId, readonly string[]>

export const PUBLIC_NODES = {
  [ChainId.KLAYTN]: klaytn.rpcUrls.public.http,
  [ChainId.KLAYTN_TESTNET]: klaytnTestnet.rpcUrls.public.http,
  // [ChainId.BSC]: [
  //   process.env.NEXT_PUBLIC_NODE_PRODUCTION || '',
  //   getNodeRealUrlV2(ChainId.BSC, process.env.NEXT_PUBLIC_NODE_REAL_API_ETH) || '',
  //   'https://bsc-dataseed1.defibit.io',
  //   'https://bsc-dataseed1.binance.org',
  // ].filter(Boolean),
  // [ChainId.BSC_TESTNET]: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
  // [ChainId.ETHEREUM]: [
  //   getNodeRealUrlV2(ChainId.ETHEREUM, process.env.NEXT_PUBLIC_NODE_REAL_API_ETH) || '',
  //   'https://eth.llamarpc.com',
  //   'https://cloudflare-eth.com',
  // ].filter(Boolean),
  // [ChainId.GOERLI]: [
  //   getNodeRealUrlV2(ChainId.GOERLI, process.env.NEXT_PUBLIC_NODE_REAL_API_GOERLI) || '',
  //   'https://eth-goerli.public.blastapi.io',
  // ].filter(Boolean),
  // [ChainId.ARBITRUM_ONE]: ARBITRUM_NODES,
  // [ChainId.ARBITRUM_GOERLI]: arbitrumGoerli.rpcUrls.public.http,
  // [ChainId.POLYGON_ZKEVM]: [
  //   ...POLYGON_ZKEVM_NODES,
  //   getNodeRealUrlV2(ChainId.POLYGON_ZKEVM, process.env.NEXT_PUBLIC_NODE_REAL_API_ETH) || '',
  // ],
  // [ChainId.POLYGON_ZKEVM_TESTNET]: [
  //   ...polygonZkEvmTestnet.rpcUrls.public.http,
  //   'https://polygon-zkevm-testnet.rpc.thirdweb.com',
  // ],
  // [ChainId.ZKSYNC]: zkSync.rpcUrls.public.http,
  // [ChainId.ZKSYNC_TESTNET]: zkSyncTestnet.rpcUrls.public.http,
  // [ChainId.LINEA]: linea.rpcUrls.public.http,
  // [ChainId.LINEA_TESTNET]: [
  //   'https://rpc.goerli.linea.build',
  //   'https://linea-testnet.rpc.thirdweb.com',
  //   'https://consensys-zkevm-goerli-prealpha.infura.io/v3/93e8a17747e34ec0ac9a554c1b403965',
  // ],
  // [ChainId.OPBNB_TESTNET]: opbnbTestnet.rpcUrls.public.http,
  // [ChainId.OPBNB]: opbnb.rpcUrls.public.http,
  // [ChainId.BASE]: [
  //   'https://base.publicnode.com',
  //   // process.env.NEXT_PUBLIC_NODE_REAL_BASE_PRODUCTION,
  //   ...base.rpcUrls.public.http,
  // ],
  // [ChainId.BASE_TESTNET]: baseGoerli.rpcUrls.public.http,
  // [ChainId.SCROLL_SEPOLIA]: scrollSepolia.rpcUrls.public.http,
} as any as Record<ChainId, readonly string[]>
