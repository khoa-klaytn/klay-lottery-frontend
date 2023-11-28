/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LotteryTicket, LotteryStatus } from 'config/constants/types'
import { LotteryState, LotteryRoundGraphEntity, LotteryUserGraphEntity, LotteryResponse } from 'state/types'
import { Address, PublicClient } from 'viem'
import { fetchLottery, fetchCurrentLotteryId, fetchMaxBuy } from './helpers'
import getLotteriesData from './getLotteriesData'
import getUserLotteryData, { getGraphLotteryUser } from './getUserLotteryData'
import { resetUserState } from '../global/actions'

const initialState: LotteryState = {
  currentLotteryId: null,
  isTransitioning: false,
  maxNumberTicketsPerBuyOrClaim: null,
  currentRound: {
    isLoading: true,
    lotteryId: null,
    status: LotteryStatus.PENDING,
    startTime: '',
    endTime: '',
    ticketPrice: '',
    discountDivisor: '',
    winnersPortion: '',
    burnPortion: '',
    firstTicketId: '',
    amountCollected: '',
    finalNumber: null,
    rewardPerUserPerBracket: [],
    countWinnersPerBracket: [],
    rewardPortions: [],
    userTickets: {
      isLoading: true,
      tickets: [],
    },
  },
  lotteriesData: null,
  userLotteryData: { account: '', totalTickets: '', rounds: [] },
}

export const fetchCurrentLottery = createAsyncThunk<
  LotteryResponse,
  { publicClient: PublicClient; lotteryAddress: Address; currentLotteryId: string }
>('lottery/fetchCurrentLottery', async ({ publicClient, lotteryAddress, currentLotteryId }) => {
  const lotteryInfo = await fetchLottery(publicClient, lotteryAddress, currentLotteryId)
  return lotteryInfo
})

export const fetchCurrentLotteryIdThunk = createAsyncThunk<
  string,
  { publicClient: PublicClient; lotteryAddress: Address }
>('lottery/fetchCurrentLotteryId', async ({ publicClient, lotteryAddress }) => {
  const currentId = await fetchCurrentLotteryId(publicClient, lotteryAddress)
  return currentId.toString()
})

export const fetchMaxBuyThunk = createAsyncThunk<string, { publicClient: PublicClient; lotteryAddress: Address }>(
  'lottery/fetchMaxBuy',
  async ({ publicClient, lotteryAddress }) => {
    const maxNumberTicketsPerBuyOrClaim = await fetchMaxBuy(publicClient, lotteryAddress)
    return maxNumberTicketsPerBuyOrClaim.toString()
  },
)

export const fetchUserTicketsAndLotteries = createAsyncThunk<
  { userTickets: LotteryTicket[]; userLotteries: LotteryUserGraphEntity },
  { publicClient: PublicClient; lotteryAddress: Address; account: string; currentLotteryId: string }
>('lottery/fetchUserTicketsAndLotteries', async ({ publicClient, lotteryAddress, account, currentLotteryId }) => {
  const userLotteriesRes = await getUserLotteryData(publicClient, lotteryAddress, account, currentLotteryId)
  const userParticipationInCurrentRound = userLotteriesRes.rounds?.find((round) => round.lotteryId === currentLotteryId)
  const userTickets = userParticipationInCurrentRound?.tickets

  // User has not bought tickets for the current lottery, or there has been an error
  if (!userTickets || userTickets.length === 0) {
    return { userTickets: [], userLotteries: userLotteriesRes }
  }

  return { userTickets, userLotteries: userLotteriesRes }
})

export const fetchPublicLotteries = createAsyncThunk<
  LotteryRoundGraphEntity[],
  { publicClient: PublicClient; lotteryAddress: Address; currentLotteryId: string }
>('lottery/fetchPublicLotteries', async ({ publicClient, lotteryAddress, currentLotteryId }) => {
  const lotteries = await getLotteriesData(publicClient, lotteryAddress, currentLotteryId)
  return lotteries
})

export const fetchUserLotteries = createAsyncThunk<
  LotteryUserGraphEntity,
  { publicClient: PublicClient; lotteryAddress: Address; account: string; currentLotteryId: string }
>('lottery/fetchUserLotteries', async ({ publicClient, lotteryAddress, account, currentLotteryId }) => {
  const userLotteries = await getUserLotteryData(publicClient, lotteryAddress, account, currentLotteryId)
  return userLotteries
})

export const fetchAdditionalUserLotteries = createAsyncThunk<
  LotteryUserGraphEntity,
  { account: string; skip?: number }
>('lottery/fetchAdditionalUserLotteries', async ({ account, skip }) => {
  const additionalUserLotteries = await getGraphLotteryUser(account, undefined, skip)
  return additionalUserLotteries
})

export const setLotteryIsTransitioning = createAsyncThunk<{ isTransitioning: boolean }, { isTransitioning: boolean }>(
  `lottery/setIsTransitioning`,
  async ({ isTransitioning }) => {
    return { isTransitioning }
  },
)

export const LotterySlice = createSlice({
  name: 'Lottery',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(resetUserState, (state) => {
      state.userLotteryData = { ...initialState.userLotteryData }
      state.currentRound = { ...state.currentRound, userTickets: { ...initialState.currentRound.userTickets } }
    })
    builder.addCase(fetchCurrentLottery.fulfilled, (state, action: PayloadAction<LotteryResponse>) => {
      state.currentRound = { ...state.currentRound, ...action.payload }
    })
    builder.addCase(fetchCurrentLotteryIdThunk.fulfilled, (state, action: PayloadAction<string>) => {
      state.currentLotteryId = action.payload
    })
    builder.addCase(fetchMaxBuyThunk.fulfilled, (state, action: PayloadAction<string>) => {
      state.maxNumberTicketsPerBuyOrClaim = action.payload
    })
    builder.addCase(
      fetchUserTicketsAndLotteries.fulfilled,
      (state, action: PayloadAction<{ userTickets: LotteryTicket[]; userLotteries: LotteryUserGraphEntity }>) => {
        state.currentRound = {
          ...state.currentRound,
          userTickets: { isLoading: false, tickets: action.payload.userTickets },
        }
        state.userLotteryData = action.payload.userLotteries
      },
    )
    builder.addCase(fetchPublicLotteries.fulfilled, (state, action: PayloadAction<LotteryRoundGraphEntity[]>) => {
      state.lotteriesData = action.payload
    })
    builder.addCase(fetchUserLotteries.fulfilled, (state, action: PayloadAction<LotteryUserGraphEntity>) => {
      state.userLotteryData = action.payload
    })
    builder.addCase(fetchAdditionalUserLotteries.fulfilled, (state, action: PayloadAction<LotteryUserGraphEntity>) => {
      const mergedRounds = [...state.userLotteryData.rounds, ...action.payload.rounds]
      state.userLotteryData = { ...state.userLotteryData, rounds: mergedRounds }
    })
    builder.addCase(
      setLotteryIsTransitioning.fulfilled,
      (state, action: PayloadAction<{ isTransitioning: boolean }>) => {
        state.isTransitioning = action.payload.isTransitioning
      },
    )
  },
})

export default LotterySlice.reducer
