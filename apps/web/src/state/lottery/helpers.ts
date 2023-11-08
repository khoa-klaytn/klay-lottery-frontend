import { LotteryStatus, LotteryTicket } from 'config/constants/types'
import { ssLotteryABI } from 'config/abi/ssLottery'
import { LotteryResponse } from 'state/types'
import { bigIntToSerializedBigNumber } from '@sweepstakes/utils/bigNumber'
import { NUM_ROUNDS_TO_FETCH_FROM_NODES } from 'config/constants/lottery'
import { type Address, ContractFunctionResult, PublicClient } from 'viem'
import { parseRetrievedNumber } from 'views/Lottery/helpers'

const processViewLotterySuccessResponse = (
  response: ContractFunctionResult<typeof ssLotteryABI, 'viewLottery'>,
  lotteryId: string,
): LotteryResponse => {
  const {
    status,
    startTime,
    endTime,
    ticketPrice,
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
      abi: ssLotteryABI,
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
        abi: ssLotteryABI,
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
  return client.readContract({
    abi: ssLotteryABI,
    address: lotteryAddress,
    functionName: 'currentLotteryId',
  })
}

export const fetchCurrentLotteryIdAndMaxBuy = async (client: PublicClient, lotteryAddress: `0x${string}`) => {
  try {
    const [currentLotteryId, maxNumberTicketsPerBuyOrClaim] = await Promise.all(
      (['currentLotteryId', 'maxNumberTicketsPerBuyOrClaim'] as const).map((method) =>
        client.readContract({
          abi: ssLotteryABI,
          address: lotteryAddress,
          functionName: method,
        }),
      ),
    )

    return {
      currentLotteryId: typeof currentLotteryId === 'bigint' ? currentLotteryId.toString() : null,
      maxNumberTicketsPerBuyOrClaim: maxNumberTicketsPerBuyOrClaim ? maxNumberTicketsPerBuyOrClaim.toString() : null,
    }
  } catch (error) {
    return {
      currentLotteryId: null,
      maxNumberTicketsPerBuyOrClaim: null,
    }
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

export const hasRoundBeenClaimed = (tickets: LotteryTicket[]): boolean => {
  const claimedTickets = tickets.filter((ticket) => ticket.status)
  return claimedTickets.length > 0
}
