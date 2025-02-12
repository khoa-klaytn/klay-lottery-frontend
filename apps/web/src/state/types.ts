import { parseEther } from 'viem'
import { SerializedPoolWithInfo } from '@sweepstakes/pools'
import { Address } from 'wagmi'
import BigNumber from 'bignumber.js'
import { LotteryStatus, LotteryTicket } from 'config/constants/types'

export enum GAS_PRICE {
  default = '3',
  fast = '4',
  instant = '5',
  testnet = '10',
}

export const GAS_PRICE_GWEI = {
  rpcDefault: 'rpcDefault',
  default: parseEther(GAS_PRICE.default, 'gwei').toString(),
  fast: parseEther(GAS_PRICE.fast, 'gwei').toString(),
  instant: parseEther(GAS_PRICE.instant, 'gwei').toString(),
  testnet: parseEther(GAS_PRICE.testnet, 'gwei').toString(),
}

export interface BigNumberToJson {
  type: 'BigNumber'
  hex: string
}

export type SerializedBigNumber = string

export type SerializedPool = SerializedPoolWithInfo & {
  numberSecondsForUserLimit?: number
}

export interface Profile {
  userId: number
  points: number
  collectionAddress: Address
  tokenId: number
  isActive: boolean
  username: string
  hasRegistered: boolean
}

// Slices states
export interface SerializedVaultFees {
  performanceFee: number
  withdrawalFee: number
  withdrawalFeePeriod: number
}

export interface DeserializedVaultFees extends SerializedVaultFees {
  performanceFeeAsDecimal: number
}

export interface SerializedVaultUser {
  isLoading: boolean
  userShares: SerializedBigNumber
  cakeAtLastUserAction: SerializedBigNumber
  lastDepositedTime: string
  lastUserActionTime: string
}

export interface SerializedLockedVaultUser extends SerializedVaultUser {
  lockStartTime: string
  lockEndTime: string
  userBoostedShare: SerializedBigNumber
  locked: boolean
  lockedAmount: SerializedBigNumber
  currentPerformanceFee: SerializedBigNumber
  currentOverdueFee: SerializedBigNumber
}

export interface DeserializedVaultUser {
  isLoading: boolean
  userShares: BigNumber
  cakeAtLastUserAction: BigNumber
  lastDepositedTime: string
  lastUserActionTime: string
  lockedAmount: BigNumber
  balance: {
    cakeAsNumberBalance: number
    cakeAsBigNumber: BigNumber
    cakeAsDisplayBalance: string
  }
}

export interface DeserializedLockedVaultUser extends DeserializedVaultUser {
  lastDepositedTime: string
  lastUserActionTime: string
  lockStartTime: string
  lockEndTime: string
  burnStartTime: string
  userBoostedShare: BigNumber
  locked: boolean
  lockedAmount: BigNumber
  currentPerformanceFee: BigNumber
  currentOverdueFee: BigNumber
}

export interface PoolsState {
  data: SerializedPool[]
}

// Lottery

export interface LotteryRoundUserTickets {
  isLoading?: boolean
  tickets?: LotteryTicket[]
}

interface LotteryRoundGenerics {
  isLoading?: boolean
  lotteryId: string
  status: LotteryStatus
  startTime: string
  endTime: string
  winnersPortion: string
  burnPortion: string
  firstTicketId: string
  finalNumber: string[]
}

export interface LotteryRound extends LotteryRoundGenerics {
  userTickets?: LotteryRoundUserTickets
  ticketPrice: BigNumber
  remainingFree: BigNumber
  discountDivisor: BigNumber
  amountCollected: BigNumber
  rewardPerUserPerBracket: string[]
  countWinnersPerBracket: string[]
  rewardPortions: string[]
}

export interface LotteryResponse extends LotteryRoundGenerics {
  ticketPrice: SerializedBigNumber
  remainingFree: SerializedBigNumber
  discountDivisor: SerializedBigNumber
  amountCollected: SerializedBigNumber
  rewardPerUserPerBracket: SerializedBigNumber[]
  countWinnersPerBracket: SerializedBigNumber[]
  rewardPortions: SerializedBigNumber[]
}

export interface LotteryState {
  currentLotteryId: string
  maxNumberTicketsPerBuyOrClaim: string
  isTransitioning: boolean
  currentRound: LotteryResponse & { userTickets?: LotteryRoundUserTickets }
  lotteriesData?: LotteryRoundGraphEntity[]
  userLotteryData?: LotteryUserGraphEntity
}

export interface LotteryRoundGraphEntity {
  id: string
  totalUsers: string
  totalTickets: string
  winningTickets: string
  status: LotteryStatus
  finalNumber: string[]
  startTime: string
  endTime: string
  ticketPrice: SerializedBigNumber
}

export interface LotteryUserGraphEntity {
  account: string
  totalTickets: string
  rounds: UserRound[]
}

export interface UserRound {
  lotteryId: string
  status: LotteryStatus
  endTime: string
  claimedTickets: string
  totalTickets: string
  claimed: boolean
  tickets?: LotteryTicket[]
}

// Global state

export interface State {
  pools: PoolsState
  lottery: LotteryState
}
