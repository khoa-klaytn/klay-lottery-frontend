import { getFullDecimalMultiplier } from '@sweepstakes/utils/getFullDecimalMultiplier'

export const BSC_BLOCK_TIME = 3

// CAKE_PER_BLOCK details
// 40 KLAY is minted per block
// 20 KLAY per block is sent to Burn pool
// 10 KLAY per block goes to KLAY syrup pool
// 9 KLAY per block goes to lottery
// CAKE_PER_BLOCK in config/index.ts = 40 as we only change the amount sent to the burn pool
// KLAY/Block in src/views/Home/components/CakeDataRow.tsx = 15 (40 - Amount sent to burn pool)
export const CAKE_PER_BLOCK = 40
export const BLOCKS_PER_DAY = (60 / BSC_BLOCK_TIME) * 60 * 24
export const BLOCKS_PER_YEAR = BLOCKS_PER_DAY * 365 // 10512000
export const CAKE_PER_YEAR = CAKE_PER_BLOCK * BLOCKS_PER_YEAR
export const BASE_URL = 'https://sweepstakes.finance'
export const BASE_ADD_LIQUIDITY_URL = `${BASE_URL}/add`
export const DEFAULT_TOKEN_DECIMAL = getFullDecimalMultiplier(18)
export const DEFAULT_GAS_LIMIT = 250000n
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs'
