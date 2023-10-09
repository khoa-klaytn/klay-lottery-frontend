import { LotteryStatus, LotteryTicket } from 'config/constants/types'
import { klayLotteryABI } from 'config/abi/klayLottery'
import { getKlayLotteryAddress } from 'utils/addressHelpers'
import { LotteryResponse } from 'state/types'
import { getKlayLotteryContract } from 'utils/contractHelpers'
import { bigIntToSerializedBigNumber } from '@pancakeswap/utils/bigNumber'
import { NUM_ROUNDS_TO_FETCH_FROM_NODES } from 'config/constants/lottery'
import { publicClient } from 'utils/wagmi'
import { ChainId } from '@pancakeswap/chains'
import { ContractFunctionResult } from 'viem'

const lotteryContract = getKlayLotteryContract()

const processViewLotterySuccessResponse = (
  response: ContractFunctionResult<typeof klayLotteryABI, 'viewLottery'>,
  lotteryId: string,
): LotteryResponse => {
  const {
    status,
    startTime,
    endTime,
    priceTicket,
    discountDivisor,
    winnersPortion,
    burnPortion,
    firstTicketId,
    amountCollected,
    finalNumber,
    rewardPerUserPerBracket,
    countWinnersPerBracket,
    rewardsBreakdown,
  } = response

  const statusKey = Object.keys(LotteryStatus)[status]
  const serializedRewardPerUserPerBracket = rewardPerUserPerBracket.map((klayInBracket) =>
    bigIntToSerializedBigNumber(klayInBracket),
  )
  const serializedCountWinnersPerBracket = countWinnersPerBracket.map((winnersInBracket) =>
    bigIntToSerializedBigNumber(winnersInBracket),
  )
  const serializedRewardsBreakdown = rewardsBreakdown.map((reward) => bigIntToSerializedBigNumber(reward))

  return {
    isLoading: false,
    lotteryId,
    status: LotteryStatus[statusKey],
    startTime: startTime?.toString(),
    endTime: endTime?.toString(),
    priceTicket: bigIntToSerializedBigNumber(priceTicket),
    discountDivisor: discountDivisor?.toString(),
    winnersPortion: winnersPortion?.toString(),
    burnPortion: burnPortion?.toString(),
    firstTicketId: firstTicketId?.toString(),
    amountCollected: bigIntToSerializedBigNumber(amountCollected),
    finalNumber,
    rewardPerUserPerBracket: serializedRewardPerUserPerBracket,
    countWinnersPerBracket: serializedCountWinnersPerBracket,
    rewardsBreakdown: serializedRewardsBreakdown,
  }
}

const processViewLotteryErrorResponse = (lotteryId: string): LotteryResponse => {
  return {
    isLoading: true,
    lotteryId,
    status: LotteryStatus.PENDING,
    startTime: '',
    endTime: '',
    priceTicket: '',
    discountDivisor: '',
    winnersPortion: '',
    burnPortion: '',
    firstTicketId: '',
    amountCollected: '',
    finalNumber: null,
    rewardPerUserPerBracket: [],
    countWinnersPerBracket: [],
    rewardsBreakdown: [],
  }
}

export const fetchLottery = async (lotteryId: string): Promise<LotteryResponse> => {
  try {
    const lotteryData = await lotteryContract.read.viewLottery([BigInt(lotteryId)])
    return processViewLotterySuccessResponse(lotteryData, lotteryId)
  } catch (error) {
    return processViewLotteryErrorResponse(lotteryId)
  }
}

export const fetchMultipleLotteries = async (lotteryIds: string[]): Promise<LotteryResponse[]> => {
  const calls = lotteryIds.map(
    (id) =>
      ({
        abi: klayLotteryABI,
        functionName: 'viewLottery',
        address: getKlayLotteryAddress(),
        args: [BigInt(id)],
      } as const),
  )
  try {
    const client = publicClient({ chainId: ChainId.KLAYTN })
    const res = await Promise.all(calls.map((call) => client.readContract(call)))
    const processedResponses = res.map((result, index) => processViewLotterySuccessResponse(result, lotteryIds[index]))
    return processedResponses
  } catch (error) {
    console.error(error)
    return calls.map((call, index) => processViewLotteryErrorResponse(lotteryIds[index]))
  }
}

export const fetchCurrentLotteryId = async (): Promise<bigint> => {
  return lotteryContract.read.currentLotteryId()
}

export const fetchCurrentLotteryIdAndMaxBuy = async () => {
  try {
    const address = getKlayLotteryAddress()
    const client = publicClient({ chainId: ChainId.KLAYTN })
    const [currentLotteryId, maxNumberTicketsPerBuyOrClaim] = await Promise.all(
      (['currentLotteryId', 'maxNumberTicketsPerBuyOrClaim'] as const).map((method) =>
        client.readContract({
          abi: klayLotteryABI,
          address,
          functionName: method,
        }),
      ),
    )

    return {
      currentLotteryId: currentLotteryId ? currentLotteryId.toString() : null,
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
