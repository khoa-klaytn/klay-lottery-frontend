import { LotteryStatus, LotteryTicket } from 'config/constants/types'
import SSLotteryABI from 'config/abi/SSLottery'
import { LotteryResponse } from 'state/types'
import { bigIntToSerializedBigNumber } from '@sweepstakes/utils/bigNumber'
import { NUM_ROUNDS_TO_FETCH_FROM_NODES } from 'config/constants/lottery'
import { type Address, ContractFunctionResult, PublicClient } from 'viem'
import { parseRetrievedNumber } from 'views/Lottery/helpers'

const processViewLotterySuccessResponse = (
  response: ContractFunctionResult<typeof SSLotteryABI, 'viewLottery'>,
  lotteryId: string,
): LotteryResponse => {
  const {
    status,
    startTime,
    endTime,
    ticketPrice,
    remainingFree,
    discountDivisor,
    winnersPortion,
    burnPortion,
    firstTicketId,
    amountCollected,
    finalNumber,
    rewardPerUserPerBracket,
    countWinnersPerBracket,
    rewardPortions,
  } = response

  const statusKey = Object.keys(LotteryStatus)[status]
  const serializedRewardPerUserPerBracket = rewardPerUserPerBracket.map((klayInBracket) =>
    bigIntToSerializedBigNumber(klayInBracket),
  )
  const serializedCountWinnersPerBracket = countWinnersPerBracket.map((winnersInBracket) =>
    bigIntToSerializedBigNumber(winnersInBracket),
  )
  const serializedRewardPortions = rewardPortions.map((reward) => bigIntToSerializedBigNumber(BigInt(reward)))
  const serializedFinalNumber = parseRetrievedNumber(finalNumber.toString())

  return {
    isLoading: false,
    lotteryId,
    status: LotteryStatus[statusKey],
    startTime: startTime?.toString(),
    endTime: endTime?.toString(),
    ticketPrice: bigIntToSerializedBigNumber(ticketPrice),
    remainingFree: bigIntToSerializedBigNumber(remainingFree),
    discountDivisor: discountDivisor?.toString(),
    winnersPortion: winnersPortion?.toString(),
    burnPortion: burnPortion?.toString(),
    firstTicketId: firstTicketId?.toString(),
    amountCollected: bigIntToSerializedBigNumber(amountCollected),
    finalNumber: serializedFinalNumber,
    rewardPerUserPerBracket: serializedRewardPerUserPerBracket,
    countWinnersPerBracket: serializedCountWinnersPerBracket,
    rewardPortions: serializedRewardPortions,
  }
}

const processViewLotteryErrorResponse = (lotteryId: string): LotteryResponse => {
  return {
    isLoading: true,
    lotteryId,
    status: LotteryStatus.PENDING,
    startTime: '',
    endTime: '',
    ticketPrice: '',
    remainingFree: '',
    discountDivisor: '',
    winnersPortion: '',
    burnPortion: '',
    firstTicketId: '',
    amountCollected: '',
    finalNumber: null,
    rewardPerUserPerBracket: [],
    countWinnersPerBracket: [],
    rewardPortions: [],
  }
}

export const fetchLottery = async (
  client: PublicClient,
  lotteryAddress: Address,
  lotteryId: string,
): Promise<LotteryResponse> => {
  try {
    const lotteryData = await client.readContract({
      abi: SSLotteryABI,
      functionName: 'viewLottery',
      address: lotteryAddress,
      args: [BigInt(lotteryId)],
    })
    console.log('lotteryData', lotteryData)
    return processViewLotterySuccessResponse(lotteryData, lotteryId)
  } catch (error) {
    return processViewLotteryErrorResponse(lotteryId)
  }
}

export const fetchMultipleLotteries = async (
  client: PublicClient,
  lotteryAddress: `0x${string}`,
  lotteryIds: string[],
): Promise<LotteryResponse[]> => {
  const calls = lotteryIds.map(
    (id) =>
      ({
        abi: SSLotteryABI,
        functionName: 'viewLottery',
        address: lotteryAddress,
        args: [BigInt(id)],
      } as const),
  )
  try {
    const res = await Promise.all(calls.map((call) => client.readContract(call)))
    const processedResponses = res.map((result, index) => processViewLotterySuccessResponse(result, lotteryIds[index]))
    return processedResponses
  } catch (error) {
    console.error(error)
    return calls.map((call, index) => processViewLotteryErrorResponse(lotteryIds[index]))
  }
}

export const fetchCurrentLotteryId = async (client: PublicClient, lotteryAddress: `0x${string}`): Promise<bigint> => {
  try {
    const currentLotteryId = await client.readContract({
      abi: SSLotteryABI,
      address: lotteryAddress,
      functionName: 'currentLotteryId',
    })
    return currentLotteryId
  } catch (error) {
    console.error(error)
    return null
  }
}

export const fetchMaxBuy = async (client: PublicClient, lotteryAddress: `0x${string}`): Promise<bigint> => {
  try {
    const maxNumberTicketsPerBuyOrClaim = await client.readContract({
      abi: SSLotteryABI,
      address: lotteryAddress,
      functionName: 'maxNumberTicketsPerBuyOrClaim',
    })
    return maxNumberTicketsPerBuyOrClaim
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getRoundIdsArray = (currentLotteryId: string): string[] => {
  const currentIdAsInt = parseInt(currentLotteryId, 10)
  const roundIds = []
  for (let i = 0; i < NUM_ROUNDS_TO_FETCH_FROM_NODES; i++) {
    if (currentIdAsInt - i > 0) {
      roundIds.push(currentIdAsInt - i)
    }
  }
  return roundIds.map((roundId) => roundId?.toString())
}

export function calculateRoundClaimedAndClaimedTickets(tickets: LotteryTicket[]) {
  let claimedTickets = 0
  let claimed = true
  for (const ticket of tickets) {
    if (ticket.status) {
      claimedTickets += 1
    } else if (claimed) {
      claimed = false
    }
  }
  return { claimed, claimedTickets: claimedTickets.toString() }
}
