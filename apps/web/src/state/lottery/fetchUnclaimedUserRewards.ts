import BigNumber from 'bignumber.js'
import { LotteryStatus, LotteryTicket, LotteryTicketClaimData } from 'config/constants/types'
import { LotteryUserGraphEntity, LotteryRoundGraphEntity } from 'state/types'
import SSLotteryABI from 'config/abi/SSLottery'
import { BIG_ZERO } from '@sweepstakes/utils/bigNumber'
import { type Address, PublicClient } from 'viem'
import { fetchUserTicketsForMultipleRounds } from './getUserTicketsData'
import { MAX_LOTTERIES_REQUEST_SIZE } from './getLotteriesData'

interface RoundDataAndUserTickets {
  roundId: string
  userTickets: LotteryTicket[]
  finalNumber: string[]
}

const fetchRewardsForTickets = async (
  lotteryAddress: Address,
  client: PublicClient,
  tickets: LotteryTicket[],
): Promise<{ tickets: LotteryTicket[]; total: BigNumber }> => {
  try {
    const rewards = await Promise.all(
      tickets.map((ticket) =>
        client.readContract({
          abi: SSLotteryABI,
          address: lotteryAddress,
          functionName: 'viewRewardsForTicketId',
          args: [BigInt(ticket.roundId), BigInt(ticket.id)],
        }),
      ),
    )

    const total = rewards.reduce((accum: BigNumber, reward: bigint) => {
      return accum.plus(new BigNumber(reward.toString()))
    }, BIG_ZERO)

    return { tickets, total }
  } catch (error) {
    console.error(error)
    return { tickets: null, total: null }
  }
}

const getRewardBracketByNumber = (ticketNumber: string[], finalNumber: string[]): number => {
  const numBrackets = finalNumber.length
  // The number at index 6 in all tickets is 1 and will always match, so finish at index 5
  let index = 0
  for (; index < numBrackets; ) {
    const ticketDigit = ticketNumber[index]
    const finalDigit = finalNumber[index]
    if (ticketDigit !== finalDigit) break
    ++index
  }
  return index
}

export const getWinningTickets = async (
  client: PublicClient,
  lotteryAddress: Address,
  roundDataAndUserTickets: RoundDataAndUserTickets,
): Promise<LotteryTicketClaimData> => {
  const { roundId, userTickets, finalNumber } = roundDataAndUserTickets

  const ticketsWithRewardBrackets = userTickets.map((ticket) => {
    return {
      roundId,
      id: ticket.id,
      number: ticket.number,
      status: ticket.status,
      rewardBracket: getRewardBracketByNumber(ticket.number, finalNumber),
    }
  })

  // A rewardBracket of -1 means no matches. 0 and above means there has been a match
  const allWinningTickets = ticketsWithRewardBrackets.filter((ticket) => {
    return ticket.rewardBracket > 0
  })

  // If ticket.status is true, the ticket has already been claimed
  const unclaimedTickets = ticketsWithRewardBrackets.filter((ticket) => {
    return !ticket.status
  })

  if (unclaimedTickets.length > 0) {
    const { tickets, total } = await fetchRewardsForTickets(lotteryAddress, client, unclaimedTickets)
    return { ticketsWithUnclaimedRewards: tickets, allWinningTickets, total, roundId }
  }

  if (allWinningTickets.length > 0) {
    return { ticketsWithUnclaimedRewards: null, allWinningTickets, total: null, roundId }
  }

  return null
}

const getWinningNumbersForRound = (targetRoundId: string, lotteriesData: LotteryRoundGraphEntity[]) => {
  const targetRound = lotteriesData.find((pastLottery) => pastLottery.id === targetRoundId)
  return targetRound?.finalNumber
}

const fetchUnclaimedUserRewards = async (
  lotteryAddress: Address,
  client: PublicClient,
  account: string,
  userLotteryData: LotteryUserGraphEntity,
  lotteriesData: LotteryRoundGraphEntity[],
  currentLotteryId: string,
): Promise<LotteryTicketClaimData[]> => {
  const { rounds } = userLotteryData

  // If there is no user round history - return an empty array
  if (rounds.length === 0) {
    return []
  }

  // If the web3 provider account doesn't equal the userLotteryData account, return an empty array - this is effectively a loading state as the user switches accounts
  if (userLotteryData.account.toLowerCase() !== account.toLowerCase()) {
    return []
  }

  const idsToCheck = []
  const roundsToCheck = []
  const lastCheckableRoundId = parseInt(currentLotteryId, 10) - MAX_LOTTERIES_REQUEST_SIZE
  for (const round of rounds) {
    if (+round.lotteryId < lastCheckableRoundId) {
      continue
    }
    if (round.status.toLowerCase() !== LotteryStatus.CLAIMABLE) {
      continue
    }
    if (round.claimed) {
      continue
    }
    idsToCheck.push(round.lotteryId)
    roundsToCheck.push(round)
  }
  if (roundsToCheck.length === 0) {
    // All rounds claimed, return empty array
    return []
  }

  const userTicketData = await fetchUserTicketsForMultipleRounds(client, lotteryAddress, idsToCheck, account)

  const winningTicketsForPastRoundPromises = Array<Promise<LotteryTicketClaimData>>()
  for (const roundData of userTicketData) {
    if (typeof roundData === 'undefined') {
      continue
    }
    if (typeof roundData.userTickets === 'undefined') {
      continue
    }
    if (roundData.userTickets.length === 0) {
      continue
    }
    const roundDataAndWinningTickets = {
      ...roundData,
      finalNumber: getWinningNumbersForRound(roundData.roundId, lotteriesData),
    }
    const winningTicketsForPastRoundPromise = getWinningTickets(client, lotteryAddress, roundDataAndWinningTickets)
    winningTicketsForPastRoundPromises.push(winningTicketsForPastRoundPromise)
  }
  const winningTicketsForPastRounds = await Promise.all(winningTicketsForPastRoundPromises)

  const roundsWithUnclaimedWinningTickets = Array<LotteryTicketClaimData>()
  for (const winningTicketData of winningTicketsForPastRounds) {
    if (winningTicketData === null) {
      continue
    }
    if (winningTicketData.ticketsWithUnclaimedRewards) {
      roundsWithUnclaimedWinningTickets.push(winningTicketData)
    }
  }

  return roundsWithUnclaimedWinningTickets
}

export default fetchUnclaimedUserRewards
