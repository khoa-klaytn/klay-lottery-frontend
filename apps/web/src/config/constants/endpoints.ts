import { ChainId } from '@sweepstakes/chains'

export const GRAPH_API_PROFILE = 'https://api.thegraph.com/subgraphs/name/sweepstakes/profile'

export const GRAPH_API_LOTTERY = 'http://localhost:8000/subgraphs/name/klay-lottery/graph'
export const SNAPSHOT_BASE_URL = process.env.NEXT_PUBLIC_SNAPSHOT_BASE_URL
export const API_PROFILE = 'https://profile.sweepstakes.com'
export const API_NFT = 'https://nft.sweepstakes.com/api/v1'
export const SNAPSHOT_API = `${SNAPSHOT_BASE_URL}/graphql`
export const SNAPSHOT_HUB_API = `${SNAPSHOT_BASE_URL}/api/message`
export const ONRAMP_API_BASE_URL = 'https://pcs-on-ramp-api.com'
export const TRANSAK_API_BASE_URL = 'https://api-stg.transak.com/api/v1'
export const MOONPAY_BASE_URL = 'https://api.moonpay.com'

export const INFO_CLIENT = 'https://proxy-worker-api.sweepstakes.com/bsc-exchange'
export const V3_BSC_INFO_CLIENT = `https://open-platform.nodereal.io/${
  process.env.NEXT_PUBLIC_NODE_REAL_API_INFO || process.env.NEXT_PUBLIC_NODE_REAL_API_ETH
}/sweepstakes-v3/graphql`

export const INFO_CLIENT_ETH = 'https://api.thegraph.com/subgraphs/name/sweepstakes/exhange-eth'
export const BLOCKS_CLIENT = 'https://api.thegraph.com/subgraphs/name/sweepstakes/blocks'
export const BLOCKS_CLIENT_ETH = 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'
export const BLOCKS_CLIENT_POLYGON_ZKEVM =
  'https://api.studio.thegraph.com/query/45376/polygon-zkevm-block/version/latest'
export const BLOCKS_CLIENT_ZKSYNC = 'https://api.studio.thegraph.com/query/45376/blocks-zksync/version/latest'
export const BLOCKS_CLIENT_LINEA = 'https://graph-query.linea.build/subgraphs/name/kybernetwork/linea-blocks'
export const BLOCKS_CLIENT_BASE = 'https://api.studio.thegraph.com/query/48211/base-blocks/version/latest'
export const STABLESWAP_SUBGRAPH_CLIENT = 'https://api.thegraph.com/subgraphs/name/sweepstakes/exchange-stableswap'
export const GRAPH_API_NFTMARKET = 'https://api.thegraph.com/subgraphs/name/sweepstakes/nft-market'
export const GRAPH_HEALTH = 'https://api.thegraph.com/index-node/graphql'

export const TC_MOBOX_SUBGRAPH = 'https://api.thegraph.com/subgraphs/name/sweepstakes/trading-competition-v3'
export const TC_MOD_SUBGRAPH = 'https://api.thegraph.com/subgraphs/name/sweepstakes/trading-competition-v4'

export const BIT_QUERY = 'https://graphql.bitquery.io'

export const ACCESS_RISK_API = 'https://red.alert.sweepstakes.com/red-api'

export const CELER_API = 'https://api.celerscan.com/scan'

export const INFO_CLIENT_WITH_CHAIN = {
  [ChainId.BSC]: INFO_CLIENT,
  [ChainId.ETHEREUM]: INFO_CLIENT_ETH,
  [ChainId.POLYGON_ZKEVM]: 'https://api.studio.thegraph.com/query/45376/exchange-v2-polygon-zkevm/version/latest',
  [ChainId.ZKSYNC_TESTNET]: 'https://api.studio.thegraph.com/query/45376/exchange-v2-zksync-testnet/version/latest',
  [ChainId.ZKSYNC]: ' https://api.studio.thegraph.com/query/45376/exchange-v2-zksync/version/latest',
  [ChainId.LINEA_TESTNET]: 'https://thegraph.goerli.zkevm.consensys.net/subgraphs/name/sweepstakes/exhange-eth/',
  [ChainId.ARBITRUM_ONE]: 'https://api.studio.thegraph.com/query/45376/exchange-v2-arbitrum/version/latest',
  [ChainId.LINEA]: 'https://graph-query.linea.build/subgraphs/name/sweepstakes/exhange-v2',
  [ChainId.BASE]: 'https://api.studio.thegraph.com/query/45376/exchange-v2-base/version/latest',
  [ChainId.OPBNB]: 'https://opbnb-mainnet-graph.nodereal.io/subgraphs/name/sweepstakes/exchange-v2',
}

export const BLOCKS_CLIENT_WITH_CHAIN = {
  [ChainId.BSC]: BLOCKS_CLIENT,
  [ChainId.ETHEREUM]: BLOCKS_CLIENT_ETH,
  [ChainId.POLYGON_ZKEVM]: BLOCKS_CLIENT_POLYGON_ZKEVM,
  [ChainId.ZKSYNC]: BLOCKS_CLIENT_ZKSYNC,
  [ChainId.ARBITRUM_ONE]: 'https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-one-blocks',
  [ChainId.LINEA]: BLOCKS_CLIENT_LINEA,
  [ChainId.BASE]: BLOCKS_CLIENT_BASE,
  [ChainId.OPBNB]: 'https://opbnb-mainnet-graph.nodereal.io/subgraphs/name/sweepstakes/blocks',
}

export const ASSET_CDN = 'https://assets.sweepstakes.finance'

export const V3_SUBGRAPH_URLS = {
  [ChainId.ETHEREUM]: 'https://api.thegraph.com/subgraphs/name/sweepstakes/exchange-v3-eth',
  [ChainId.GOERLI]: 'https://api.thegraph.com/subgraphs/name/sweepstakes/exchange-v3-goerli',
  [ChainId.BSC]: `https://api.thegraph.com/subgraphs/name/sweepstakes/exchange-v3-bsc`,
  [ChainId.BSC_TESTNET]: 'https://api.thegraph.com/subgraphs/name/sweepstakes/exchange-v3-chapel',
  [ChainId.ARBITRUM_ONE]: 'https://api.thegraph.com/subgraphs/name/sweepstakes/exchange-v3-arb',
  [ChainId.ARBITRUM_GOERLI]: 'https://api.thegraph.com/subgraphs/name/chef-jojo/exhange-v3-arb-goerli',
  [ChainId.POLYGON_ZKEVM]: 'https://api.studio.thegraph.com/query/45376/exchange-v3-polygon-zkevm/v0.0.0',
  [ChainId.POLYGON_ZKEVM_TESTNET]: null,
  [ChainId.ZKSYNC]: 'https://api.studio.thegraph.com/query/45376/exchange-v3-zksync/version/latest',
  [ChainId.ZKSYNC_TESTNET]: 'https://api.studio.thegraph.com/query/45376/exchange-v3-zksync-testnet/version/latest',
  [ChainId.LINEA]: 'https://graph-query.linea.build/subgraphs/name/sweepstakes/exchange-v3-linea',
  [ChainId.LINEA_TESTNET]:
    'https://thegraph.goerli.zkevm.consensys.net/subgraphs/name/sweepstakes/exchange-v3-linea-goerli',
  [ChainId.BASE]: 'https://api.studio.thegraph.com/query/45376/exchange-v3-base/version/latest',
  [ChainId.BASE_TESTNET]: 'https://api.studio.thegraph.com/query/45376/exchange-v3-base-testnet/version/latest',
  [ChainId.OPBNB]: 'https://opbnb-mainnet-graph.nodereal.io/subgraphs/name/sweepstakes/exchange-v3',
  [ChainId.OPBNB_TESTNET]: null,
  [ChainId.SCROLL_SEPOLIA]: 'https://api.studio.thegraph.com/query/45376/exchange-v3-scroll-sepolia/version/latest',
} as Record<ChainId, string | null>

export const TRADING_REWARD_API = 'https://pancake-trading-fee-rebate-api.sweepstakes.com/api/v1'

export const QUOTING_API = `${process.env.NEXT_PUBLIC_QUOTING_API}/v0/quote`

export const MERCURYO_WIDGET_ID = process.env.NEXT_PUBLIC_MERCURYO_WIDGET_ID || '64d1f9f9-85ee-4558-8168-1dc0e7057ce6'

export const MOONPAY_API_KEY = process.env.NEXT_PUBLIC_MOONPAY_LIVE_KEY || 'pk_test_1Ibe44lMglFVL8COOYO7SEKnIBrzrp54'

export const TRANSAK_API_KEY = process.env.NEXT_PUBLIC_TRANSAK_LIVE_KEY || 'bf960e79-6d98-4fd0-823d-8409d290c346'
// no need for extra public env
export const MERCURYO_WIDGET_URL =
  process.env.NODE_ENV === 'development'
    ? 'https://sandbox-widget.mrcr.io/embed.2.0.js'
    : 'https://widget.mercuryo.io/embed.2.0.js'
