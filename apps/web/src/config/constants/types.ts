import { Currency, CurrencyAmount, Percent, Price, Token, Trade, TradeType } from '@sweepstakes/sdk'
import { ChainId } from '@sweepstakes/chains'
import { LegacyTradeWithStableSwap as TradeWithStableSwap } from '@sweepstakes/smart-router/legacy-router'
import BigNumber from 'bignumber.js'
import { Address } from 'wagmi'
// a list of tokens by chain
export type ChainMap<T> = {
  readonly [chainId in ChainId]: T
}

export type ChainTokenList = ChainMap<Token[]>

export type TranslatableText =
  | string
  | {
      key: string
      data?: {
        [key: string]: string | number
      }
    }
export interface Addresses {
  97?: Address
  56: Address
  [chainId: number]: Address
}

export enum PoolIds {
  poolBasic = 'poolBasic',
  poolUnlimited = 'poolUnlimited',
}

export enum PoolCategory {
  'COMMUNITY' = 'Community',
  'CORE' = 'Core',
  'BINANCE' = 'Binance', // Pools using native BNB behave differently than pools using a token
  'AUTO' = 'Auto',
}

export type Images = {
  lg: string
  md: string
  sm: string
  ipfs?: string
}

export type TeamImages = {
  alt: string
} & Images

export type Team = {
  id: number
  name: string
  description: string
  isJoinable?: boolean
  users: number
  points: number
  images: TeamImages
  background: string
  textColor: string
}

export type CampaignType = 'teambattle' | 'participation'

export type Campaign = {
  id: string
  type: CampaignType
  title?: TranslatableText
  description?: TranslatableText
  badge?: string
}

export type PageMeta = {
  title: string
  description?: string
  image?: string
}

export enum LotteryStatus {
  PENDING = 'pending',
  OPEN = 'open',
  CLOSE = 'close',
  CLAIMABLE = 'claimable',
}

export interface LotteryTicket {
  id: string
  number: string
  status: boolean
  rewardBracket?: number
  roundId?: string
  reward?: string
}

export interface LotteryTicketClaimData {
  ticketsWithUnclaimedRewards: LotteryTicket[]
  allWinningTickets: LotteryTicket[]
  total: BigNumber
  roundId: string
}

export const FetchStatus = {
  Idle: 'idle',
  Fetching: 'loading',
  Fetched: 'success',
  Failed: 'error',
} as const

export type TFetchStatus = (typeof FetchStatus)[keyof typeof FetchStatus]

export const isStableSwap = (trade: ITrade): trade is StableTrade => {
  return (
    Boolean((trade as StableTrade)?.maximumAmountIn) &&
    !(trade as Trade<Currency, Currency, TradeType> | TradeWithStableSwap<Currency, Currency, TradeType>)?.route
  )
}

export type ITrade =
  | Trade<Currency, Currency, TradeType>
  | StableTrade
  | TradeWithStableSwap<Currency, Currency, TradeType>
  | undefined

export type V2TradeAndStableSwap = Trade<Currency, Currency, TradeType> | StableTrade | undefined

export interface StableTrade {
  tradeType: TradeType
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
  executionPrice: Price<Currency, Currency>
  priceImpact: null
  maximumAmountIn: (slippaged: Percent) => CurrencyAmount<Currency>
  minimumAmountOut: (slippaged: Percent) => CurrencyAmount<Currency>
}

export enum Bound {
  LOWER = 'LOWER',
  UPPER = 'UPPER',
}
